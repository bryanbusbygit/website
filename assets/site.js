      document.body.classList.add('js-enabled');

      const allLinks = document.querySelectorAll('.nav-link');
      const sections = document.querySelectorAll('.content-section');
      const contentWrapper = document.getElementById('content-wrapper');
      const themeToggle = document.getElementById('theme-toggle');
      const footerSquares = document.querySelectorAll('.status-square');
      const lastUpdatedLabel = document.getElementById('last-updated-label');
      const glyphField = document.getElementById('glyph-field');
      const supportsInert = 'inert' in HTMLElement.prototype;
      const spacingDebugEnabled = new URLSearchParams(window.location.search).has('spacing-debug');
      const compactDateViewport = window.matchMedia('(max-width: 560px)');
      const sectionOrder = Array.from(sections)
        .map((section) => section.getAttribute('data-section'))
        .filter(Boolean);
      const findSectionByName = (target) => {
        if (!target) {
          return null;
        }
        return Array.from(sections).find(
          (section) => section.getAttribute('data-section') === target,
        ) || null;
      };
      const updateStatusSquares = (target) => {
        if (!footerSquares.length) {
          return;
        }
        const sectionIndex = sectionOrder.indexOf(target);
        footerSquares.forEach((square, index) => {
          const isActive = index === sectionIndex;
          square.classList.toggle('status-square-active', isActive);
          if (isActive) {
            square.setAttribute('aria-current', 'page');
          } else {
            square.removeAttribute('aria-current');
          }
        });
      };

      const parseLastModifiedDate = (rawValue) => {
        if (typeof rawValue !== 'string' || !rawValue.trim()) {
          return null;
        }
        const normalizedValue = rawValue.trim().replace(/\s*([\/.\-])\s*/g, '$1');
        const parsed = new Date(normalizedValue);
        if (!Number.isNaN(parsed.getTime())) {
          return parsed;
        }
        const match = normalizedValue.match(/(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/);
        if (!match) {
          return null;
        }
        const month = Number.parseInt(match[1], 10);
        const day = Number.parseInt(match[2], 10);
        const year = Number.parseInt(match[3], 10);
        if (!month || !day || !year) {
          return null;
        }
        const normalizedYear = year < 100 ? (2000 + year) : year;
        const fallback = new Date(normalizedYear, month - 1, day);
        return Number.isNaN(fallback.getTime()) ? null : fallback;
      };

      const formatCompactLastUpdatedDate = (value) => {
        if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
          return '';
        }
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        const year = String(value.getFullYear());
        return `${month}-${day}-${year}`;
      };

      const formatDisplayLastUpdatedDate = (value) => {
        const compact = formatCompactLastUpdatedDate(value);
        if (!compact) {
          return '';
        }
        const [month, day, year] = compact.split('-');
        const spreadDigits = (segment) => segment.split('').join(' ');
        return `${spreadDigits(month)} - ${spreadDigits(day)} - ${spreadDigits(year)}`;
      };

      const buildLastUpdatedMarkup = (compactDate, displayDate) => {
        if (!compactDate || !displayDate) {
          return displayDate;
        }
        const [month, day] = compactDate.split('-');
        const isCompact = displayDate === compactDate;
        const monthDisplay = isCompact ? month : month.split('').join(' ');
        const dayDisplay = isCompact ? day : day.split('').join(' ');
        const separator = isCompact ? '-' : ' - ';
        return displayDate
          .replace(monthDisplay, `<span class="date-segment-month">${monthDisplay}</span>`)
          .replace(
            `${separator}${dayDisplay}`,
            `<span class="date-separator">${separator}</span><span class="date-segment-day">${dayDisplay}</span>`
          );
      };

      const setLastUpdatedLabel = () => {
        if (!lastUpdatedLabel) {
          return;
        }
        const explicitDate = document.body ? document.body.getAttribute('data-last-updated') : '';
        const lastUpdatedDate =
          parseLastModifiedDate(explicitDate) ||
          parseLastModifiedDate(document.lastModified) ||
          new Date();
        const compactDate = formatCompactLastUpdatedDate(lastUpdatedDate);
        const displayDate = compactDateViewport.matches
          ? compactDate
          : formatDisplayLastUpdatedDate(lastUpdatedDate);
        lastUpdatedLabel.innerHTML = buildLastUpdatedMarkup(compactDate, displayDate);
        if (compactDate) {
          lastUpdatedLabel.setAttribute('aria-label', `last updated ${compactDate}`);
        }
      };

      const setTheme = (mode) => {
        const nextMode = mode === 'dark' ? 'dark' : 'light';
        const isDark = nextMode === 'dark';

        document.documentElement.classList.toggle('theme-dark', isDark);
        document.body.classList.toggle('theme-dark', isDark);
        if (themeToggle) {
          themeToggle.setAttribute('aria-pressed', String(isDark));
          themeToggle.setAttribute('aria-label', isDark ? 'switch to light theme' : 'switch to dark theme');
        }
      };

      setTheme('light');
      setLastUpdatedLabel();
      if (typeof compactDateViewport.addEventListener === 'function') {
        compactDateViewport.addEventListener('change', setLastUpdatedLabel);
      } else if (typeof compactDateViewport.addListener === 'function') {
        compactDateViewport.addListener(setLastUpdatedLabel);
      }
      if (spacingDebugEnabled) {
        document.body.classList.add('spacing-debug');
      }

      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          const next = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
          setTheme(next);
        });
      }

      const getSectionHeight = (section) => {
        if (!section) {
          return 0;
        }
        return Math.ceil(section.getBoundingClientRect().height);
      };

      const setWrapperHeight = () => {
        const active = document.querySelector('.content-section.active');
        if (!contentWrapper || !active) {
          return;
        }
        contentWrapper.style.height = `${getSectionHeight(active)}px`;
      };

      let activeSectionObserver = null;
      const scheduleWrapperHeight = () => {
        if (!contentWrapper) {
          return;
        }
        window.requestAnimationFrame(() => {
          setWrapperHeight();
        });
      };
      const observeActiveSection = (section) => {
        if (!contentWrapper || typeof ResizeObserver === 'undefined') {
          return;
        }
        if (activeSectionObserver) {
          activeSectionObserver.disconnect();
        }
        if (!section) {
          return;
        }
        activeSectionObserver = new ResizeObserver(() => {
          scheduleWrapperHeight();
        });
        activeSectionObserver.observe(section);
      };

      const SPACING_RUBRIC = Object.freeze({
        gridUnit: 4,
        tolerance: 1.25,
        allowedGaps: Object.freeze([4, 8, 12, 20, 32]),
        minOuterGap: 8,
        densityMin: 0.32,
        densityMax: 0.97,
      });

      const PACK_GROUP_SELECTORS = Object.freeze([
        '.container',
        '.content-section.active',
        '.manuscript-copy',
        '.landing-layout',
        '.gallery-grid',
        '.other-layout',
      ]);

      const parseNumber = (value, fallback) => {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : fallback;
      };

      const nearestGapDistance = (value, set) => {
        let closest = Number.POSITIVE_INFINITY;
        set.forEach((entry) => {
          const distance = Math.abs(value - entry);
          if (distance < closest) {
            closest = distance;
          }
        });
        return closest;
      };

      const isGridAligned = (value, unit, tolerance) => {
        const snapped = Math.round(value / unit) * unit;
        return Math.abs(value - snapped) <= tolerance;
      };

      const isVisiblePackItem = (element) => {
        if (!element || element.hidden) {
          return false;
        }
        const styles = window.getComputedStyle(element);
        if (
          styles.display === 'none' ||
          styles.visibility === 'hidden' ||
          styles.position === 'absolute' ||
          styles.position === 'fixed'
        ) {
          return false;
        }
        const rect = element.getBoundingClientRect();
        return rect.width > 1 && rect.height > 1;
      };

      const uniqueElements = (elements) => {
        const seen = new Set();
        return elements.filter((element) => {
          if (!element || seen.has(element)) {
            return false;
          }
          seen.add(element);
          return true;
        });
      };

      const resolvePackGroups = () => {
        const groups = PACK_GROUP_SELECTORS.flatMap((selector) => Array.from(document.querySelectorAll(selector)));
        return uniqueElements(groups).filter((group) => {
          const rect = group.getBoundingClientRect();
          return rect.width > 1 && rect.height > 1;
        });
      };

      const describeElement = (element) => {
        if (!element) {
          return 'unknown';
        }
        const tag = element.tagName.toLowerCase();
        const id = element.id ? `#${element.id}` : '';
        const className = typeof element.className === 'string' ? element.className.trim() : '';
        const classBits = className ? className.split(/\s+/).slice(0, 2).map((item) => `.${item}`).join('') : '';
        return `${tag}${id}${classBits}`;
      };

      const getRubricFromCss = () => {
        const rootStyles = window.getComputedStyle(document.documentElement);
        const gridUnit = parseNumber(rootStyles.getPropertyValue('--pack-grid'), SPACING_RUBRIC.gridUnit);
        const tolerance = parseNumber(rootStyles.getPropertyValue('--pack-snap-tolerance'), SPACING_RUBRIC.tolerance);
        const densityMin = parseNumber(rootStyles.getPropertyValue('--pack-density-min'), SPACING_RUBRIC.densityMin);
        const densityMax = parseNumber(rootStyles.getPropertyValue('--pack-density-max'), SPACING_RUBRIC.densityMax);
        const minOuterGap = parseNumber(rootStyles.getPropertyValue('--space-sm'), SPACING_RUBRIC.minOuterGap);
        const allowedGaps = [
          parseNumber(rootStyles.getPropertyValue('--space-xs'), 4),
          parseNumber(rootStyles.getPropertyValue('--space-sm'), 8),
          parseNumber(rootStyles.getPropertyValue('--space-md'), 12),
          parseNumber(rootStyles.getPropertyValue('--space-lg'), 20),
          parseNumber(rootStyles.getPropertyValue('--space-xl'), 32),
        ];
        return {
          gridUnit,
          tolerance,
          minOuterGap,
          densityMin,
          densityMax,
          allowedGaps,
        };
      };

      const clearRuntimePackMarkers = () => {
        document.querySelectorAll('[data-pack-group-runtime]').forEach((element) => {
          element.removeAttribute('data-pack-group-runtime');
        });
        document.querySelectorAll('[data-pack-item-runtime]').forEach((element) => {
          element.removeAttribute('data-pack-item-runtime');
        });
      };

      const getPackItems = (group) => Array.from(group.children).filter((child) => isVisiblePackItem(child));

      const auditPackGroup = (group, rubric) => {
        const groupRect = group.getBoundingClientRect();
        const items = getPackItems(group);
        if (!items.length) {
          return null;
        }

        group.setAttribute('data-pack-group-runtime', '');
        const rects = items.map((item) => {
          item.setAttribute('data-pack-item-runtime', '');
          return { item, rect: item.getBoundingClientRect() };
        });
        rects.sort((left, right) => (left.rect.top - right.rect.top) || (left.rect.left - right.rect.left));

        const issues = [];
        const gaps = [];
        let overlappingPairs = 0;
        let area = 0;

        rects.forEach(({ rect }) => {
          area += rect.width * rect.height;
          const relativeLeft = rect.left - groupRect.left;
          const relativeTop = rect.top - groupRect.top;
          if (!isGridAligned(relativeLeft, rubric.gridUnit, rubric.tolerance)) {
            issues.push('misaligned-left');
          }
          if (!isGridAligned(relativeTop, rubric.gridUnit, rubric.tolerance)) {
            issues.push('misaligned-top');
          }
        });

        for (let index = 1; index < rects.length; index += 1) {
          const previous = rects[index - 1].rect;
          const current = rects[index].rect;
          if (current.top < previous.bottom - rubric.tolerance) {
            continue;
          }
          const gap = current.top - previous.bottom;
          gaps.push(gap);
          if (nearestGapDistance(gap, rubric.allowedGaps) > rubric.tolerance) {
            issues.push('irregular-gap');
          }
        }

        for (let first = 0; first < rects.length; first += 1) {
          for (let second = first + 1; second < rects.length; second += 1) {
            const rectA = rects[first].rect;
            const rectB = rects[second].rect;
            const overlapWidth = Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left);
            const overlapHeight = Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top);
            if (overlapWidth > rubric.tolerance && overlapHeight > rubric.tolerance) {
              overlappingPairs += 1;
            }
          }
        }
        if (overlappingPairs > 0) {
          issues.push('overlap');
        }

        const firstRect = rects[0].rect;
        const lastRect = rects[rects.length - 1].rect;
        const topInset = firstRect.top - groupRect.top;
        const bottomInset = groupRect.bottom - lastRect.bottom;
        const minOuterGap = rubric.minOuterGap;
        if (topInset < minOuterGap - rubric.tolerance || bottomInset < minOuterGap - rubric.tolerance) {
          issues.push('tight-edge-gap');
        }
        if (!isGridAligned(topInset, rubric.gridUnit, rubric.tolerance)) {
          issues.push('misaligned-edge-top');
        }
        if (!isGridAligned(bottomInset, rubric.gridUnit, rubric.tolerance)) {
          issues.push('misaligned-edge-bottom');
        }

        const density = area / (groupRect.width * groupRect.height);
        if (density < rubric.densityMin || density > rubric.densityMax) {
          issues.push('density-outside-band');
        }

        const uniqueIssues = Array.from(new Set(issues));
        const score = Math.max(0, 100 - uniqueIssues.length * 14 - overlappingPairs * 12);
        const averageGap = gaps.length
          ? gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length
          : null;
        return {
          group: describeElement(group),
          itemCount: rects.length,
          averageGap,
          density,
          score,
          passed: uniqueIssues.length === 0,
          issues: uniqueIssues,
        };
      };

      const runSpacingAudit = ({ log = false } = {}) => {
        const rubric = getRubricFromCss();
        clearRuntimePackMarkers();
        const groups = resolvePackGroups();
        const reports = groups
          .map((group) => auditPackGroup(group, rubric))
          .filter(Boolean);

        const failing = reports.filter((report) => !report.passed);
        const meanScore = reports.length
          ? reports.reduce((sum, report) => sum + report.score, 0) / reports.length
          : 100;

        const summary = {
          passed: failing.length === 0,
          meanScore,
          groupsChecked: reports.length,
          failingGroups: failing.length,
          rubric,
          reports,
        };

        if (log) {
          const label = summary.passed ? 'PASS' : 'REVIEW';
          console.groupCollapsed(`[Spacing Audit] ${label} · ${meanScore.toFixed(1)} / 100`);
          console.table(
            reports.map((report) => ({
              group: report.group,
              score: report.score,
              items: report.itemCount,
              avgGap: report.averageGap === null ? 'n/a' : report.averageGap.toFixed(2),
              density: report.density.toFixed(3),
              issues: report.issues.length ? report.issues.join(', ') : 'none',
            })),
          );
          if (failing.length) {
            console.warn('Spacing groups needing correction:', failing.map((report) => report.group));
          }
          console.groupEnd();
        }

        return summary;
      };

      window.runSpacingAudit = runSpacingAudit;
      let spacingAuditRaf = 0;
      const scheduleSpacingAudit = ({ log = false } = {}) => {
        if (!spacingDebugEnabled) {
          return;
        }
        if (spacingAuditRaf) {
          return;
        }
        spacingAuditRaf = window.requestAnimationFrame(() => {
          spacingAuditRaf = 0;
          runSpacingAudit({ log });
        });
      };

      const STAGGER_SELECTOR =
        'h2, h3, p, ul, ol, .choice-card, .pub, .contact-list, .button, ' +
        '.resource-link, .other-layout > *, .grid-two > *, .gallery-grid > *';

      const prepareStagger = (section) => {
        if (!section) {
          return;
        }
        const items = section.querySelectorAll(STAGGER_SELECTOR);
        const isLanding = section.getAttribute('data-section') === 'landing';
        items.forEach((item, index) => {
          item.classList.add('stagger-item');
          let delay = Math.min(index * 24, 120);
          if (isLanding) {
            const inChoice = item.classList.contains('choice-card') || item.closest('.choice-card');
            delay = inChoice ? 60 : 0;
          }
          item.style.setProperty('--stagger-delay', `${delay}ms`);
        });
      };

      const updateSectionHistory = (target, mode = 'replace') => {
        if (
          mode === 'none' ||
          !window.history ||
          (typeof window.history.replaceState !== 'function' && typeof window.history.pushState !== 'function')
        ) {
          return;
        }

        const baseUrl = `${window.location.pathname}${window.location.search}`;
        const targetUrl = target === 'landing' ? baseUrl : `#${target}`;
        const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (currentUrl === targetUrl) {
          return;
        }

        const historyMethod = mode === 'push' ? window.history.pushState : window.history.replaceState;
        if (typeof historyMethod === 'function') {
          historyMethod.call(window.history, null, '', targetUrl);
        }
      };

      const setActiveSection = (target, options = {}) => {
        const { instant = false, history = 'replace' } = options;
        const next = findSectionByName(target);
        const previous = document.querySelector('.content-section.active');
        const isSameSection = next === previous;
        const startHeight = contentWrapper
          ? previous
            ? getSectionHeight(previous)
            : Math.ceil(contentWrapper.getBoundingClientRect().height)
          : 0;

        if (!next) {
          return;
        }

        if (document.body) {
          document.body.setAttribute('data-active-section', target);
        }
        updateStatusSquares(target);
        updateSectionHistory(target, history);

        sections.forEach((section) => {
          const isActiveSection = section === next;
          const keepVisibleForFade = !instant && !isSameSection && section === previous;
          section.classList.toggle('active', isActiveSection);
          section.hidden = !(isActiveSection || keepVisibleForFade);
          section.setAttribute('aria-hidden', String(!isActiveSection));
          if (supportsInert) {
            section.inert = !isActiveSection;
          }
        });
        observeActiveSection(next);

        if (!contentWrapper) {
          if (previous && previous !== next) {
            previous.hidden = true;
          }
          scheduleSpacingAudit({ log: spacingDebugEnabled });
          return;
        }

        const endHeight = getSectionHeight(next);

        if (instant || isSameSection) {
          contentWrapper.style.height = `${endHeight}px`;
          if (previous && previous !== next) {
            previous.hidden = true;
          }
          scheduleSpacingAudit({ log: spacingDebugEnabled });
          return;
        }

        contentWrapper.style.height = `${startHeight}px`;

        requestAnimationFrame(() => {
          contentWrapper.style.height = `${endHeight}px`;
        });

        let cleanedUp = false;
        const cleanup = () => {
          if (cleanedUp) {
            return;
          }
          cleanedUp = true;
          contentWrapper.style.height = `${endHeight}px`;
          if (previous && previous !== next) {
            previous.hidden = true;
          }
          scheduleSpacingAudit({ log: spacingDebugEnabled });
          contentWrapper.removeEventListener('transitionend', onTransitionEnd);
        };
        const onTransitionEnd = (event) => {
          if (event.propertyName !== 'height') {
            return;
          }
          cleanup();
        };
        contentWrapper.addEventListener('transitionend', onTransitionEnd);
        window.setTimeout(cleanup, 220);
      };

      const getActiveSectionName = () => {
        const fromBody = document.body ? document.body.getAttribute('data-active-section') : '';
        return sectionsToTarget(fromBody) || 'landing';
      };

      const getRelativeSection = (step) => {
        if (!step || !sectionOrder.length) {
          return null;
        }
        const currentIndex = sectionOrder.indexOf(getActiveSectionName());
        if (currentIndex === -1) {
          return null;
        }
        const nextIndex = currentIndex + step;
        if (nextIndex < 0 || nextIndex >= sectionOrder.length) {
          return null;
        }
        return sectionOrder[nextIndex];
      };

      const isInteractiveSwipeStart = (target) => {
        if (!(target instanceof Element)) {
          return false;
        }
        return Boolean(target.closest(
          'a, button, input, textarea, select, label, summary, video, iframe, [role="button"]',
        ));
      };

      const swipeState = {
        active: false,
        pointerId: null,
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
        axis: null,
        startedAt: 0,
      };

      const resetSwipeState = () => {
        swipeState.active = false;
        swipeState.pointerId = null;
        swipeState.startX = 0;
        swipeState.startY = 0;
        swipeState.lastX = 0;
        swipeState.lastY = 0;
        swipeState.axis = null;
        swipeState.startedAt = 0;
      };

      const findTrackedTouch = (touchList) => {
        for (let index = 0; index < touchList.length; index += 1) {
          const touch = touchList[index];
          if (touch.identifier === swipeState.pointerId) {
            return touch;
          }
        }
        return null;
      };

      const SWIPE_AXIS_LOCK_DISTANCE = 16;
      const SWIPE_MIN_DISTANCE = 72;
      const SWIPE_MAX_OFF_AXIS = 56;
      const SWIPE_MAX_DURATION = 700;

      const handleSwipeStart = (event) => {
        if (event.touches.length !== 1 || isInteractiveSwipeStart(event.target)) {
          resetSwipeState();
          return;
        }
        const [touch] = event.touches;
        swipeState.active = true;
        swipeState.pointerId = touch.identifier;
        swipeState.startX = touch.clientX;
        swipeState.startY = touch.clientY;
        swipeState.lastX = touch.clientX;
        swipeState.lastY = touch.clientY;
        swipeState.axis = null;
        swipeState.startedAt = event.timeStamp;
      };

      const handleSwipeMove = (event) => {
        if (!swipeState.active) {
          return;
        }
        const touch = findTrackedTouch(event.touches);
        if (!touch) {
          resetSwipeState();
          return;
        }

        swipeState.lastX = touch.clientX;
        swipeState.lastY = touch.clientY;
        const deltaX = touch.clientX - swipeState.startX;
        const deltaY = touch.clientY - swipeState.startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (!swipeState.axis && (absX >= SWIPE_AXIS_LOCK_DISTANCE || absY >= SWIPE_AXIS_LOCK_DISTANCE)) {
          swipeState.axis = absX > absY ? 'x' : 'y';
        }

        if (swipeState.axis === 'x' && event.cancelable) {
          event.preventDefault();
        }
      };

      const handleSwipeEnd = (event) => {
        if (!swipeState.active) {
          return;
        }
        const touch = findTrackedTouch(event.changedTouches);
        if (!touch) {
          resetSwipeState();
          return;
        }

        const deltaX = touch.clientX - swipeState.startX;
        const deltaY = touch.clientY - swipeState.startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const elapsed = event.timeStamp - swipeState.startedAt;

        if (
          swipeState.axis === 'x' &&
          elapsed <= SWIPE_MAX_DURATION &&
          absX >= SWIPE_MIN_DISTANCE &&
          absY <= SWIPE_MAX_OFF_AXIS
        ) {
          const target = deltaX < 0 ? getRelativeSection(1) : getRelativeSection(-1);
          if (target) {
            setActiveSection(target, { history: 'push' });
          }
        }

        resetSwipeState();
      };

      const handleSwipeCancel = () => {
        resetSwipeState();
      };

      sections.forEach((section) => prepareStagger(section));
      const hashTarget = window.location.hash.replace('#', '');
      const initialTarget = sectionsToTarget(hashTarget) || 'landing';
      const resetInitialScrollToTop = hashTarget === 'landing';
      setActiveSection(initialTarget, { instant: true, history: 'replace' });
      setWrapperHeight();
      if (resetInitialScrollToTop) {
        window.requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
      }
      scheduleSpacingAudit({ log: spacingDebugEnabled });

      window.addEventListener('load', () => {
        setWrapperHeight();
        if (resetInitialScrollToTop) {
          window.scrollTo(0, 0);
        }
        scheduleSpacingAudit({ log: spacingDebugEnabled });
      });
      window.addEventListener('hashchange', () => {
        const target = sectionsToTarget(window.location.hash.replace('#', '')) || 'landing';
        setActiveSection(target, { instant: true, history: 'none' });
        setWrapperHeight();
      });

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const lowPowerViewport = window.matchMedia('(max-width: 900px)');
      let asciiFrameId = 0;
      let asciiLastTick = 0;
      let asciiTime = 0;
      let resizeRaf = 0;
      let asciiGlyphProfiles = [];
      let glyphInstances = [];
      let glyphSoftenRaf = 0;

      const TAU = Math.PI * 2;
      const ASCII_SUBCELLS = 6;
      const ASCII_SUBCELL_WEIGHTS = [1.16, 1.06, 1.24, 1.12, 1.08, 1.02];
      const SAMPLE_CIRCLES = Object.freeze([
        { x: 0.27, y: 0.21, r: 0.2 },
        { x: 0.73, y: 0.17, r: 0.2 },
        { x: 0.28, y: 0.5, r: 0.2 },
        { x: 0.72, y: 0.46, r: 0.2 },
        { x: 0.31, y: 0.79, r: 0.2 },
        { x: 0.69, y: 0.75, r: 0.2 },
      ]);
      const ASCII_CHARS = Array.from({ length: 95 }, (_, index) => String.fromCharCode(index + 32));
      const LIGHT_VECTOR = Object.freeze({ x: -0.34, y: 0.58, z: 0.74 });
      const CUBE_EDGES = Object.freeze([
        { axis: 'x', a: -1, b: -1 },
        { axis: 'x', a: -1, b: 1 },
        { axis: 'x', a: 1, b: -1 },
        { axis: 'x', a: 1, b: 1 },
        { axis: 'y', a: -1, b: -1 },
        { axis: 'y', a: -1, b: 1 },
        { axis: 'y', a: 1, b: -1 },
        { axis: 'y', a: 1, b: 1 },
        { axis: 'z', a: -1, b: -1 },
        { axis: 'z', a: -1, b: 1 },
        { axis: 'z', a: 1, b: -1 },
        { axis: 'z', a: 1, b: 1 },
      ]);
      const PLUS_ARMS = Object.freeze([
        { axis: 'x' },
        { axis: 'y' },
        { axis: 'z' },
      ]);

      const clamp01 = (value) => Math.max(0, Math.min(1, value));

      const createRenderBuffers = (cols, rows) => ({
        cols,
        rows,
        subDepth: new Float32Array(cols * rows * ASCII_SUBCELLS),
        subLuma: new Float32Array(cols * rows * ASCII_SUBCELLS),
        cellDepth: new Float32Array(cols * rows),
      });

      const clearRenderBuffers = (buffers) => {
        buffers.subDepth.fill(Number.NEGATIVE_INFINITY);
        buffers.subLuma.fill(0);
        buffers.cellDepth.fill(Number.NEGATIVE_INFINITY);
      };

      const sampleCircle = (pixels, width, height, circle) => {
        const cx = circle.x * width;
        const cy = circle.y * height;
        const radius = circle.r * Math.min(width, height);
        const radiusSquared = radius * radius;
        const minX = Math.max(0, Math.floor(cx - radius));
        const maxX = Math.min(width - 1, Math.ceil(cx + radius));
        const minY = Math.max(0, Math.floor(cy - radius));
        const maxY = Math.min(height - 1, Math.ceil(cy + radius));
        let sum = 0;
        let count = 0;

        for (let y = minY; y <= maxY; y += 1) {
          for (let x = minX; x <= maxX; x += 1) {
            const dx = (x + 0.5) - cx;
            const dy = (y + 0.5) - cy;
            if ((dx * dx) + (dy * dy) > radiusSquared) {
              continue;
            }
            const red = pixels[(y * width + x) * 4] / 255;
            sum += red;
            count += 1;
          }
        }

        return count ? (sum / count) : 0;
      };

      const buildAsciiGlyphProfiles = () => {
        if (asciiGlyphProfiles.length) {
          return;
        }

        const fallback = ASCII_CHARS.map((char, index) => {
          const density = index / Math.max(1, ASCII_CHARS.length - 1);
          const vector = new Float32Array(ASCII_SUBCELLS);
          vector.fill(density);
          return {
            char,
            vector,
            density,
          };
        });

        const canvas = document.createElement('canvas');
        canvas.width = 72;
        canvas.height = 96;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          asciiGlyphProfiles = fallback;
          return;
        }

        const maxima = new Float32Array(ASCII_SUBCELLS);
        const rawProfiles = [];
        const fontFamily = window.getComputedStyle(document.body).fontFamily || 'monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `700 64px ${fontFamily}`;

        for (let i = 0; i < ASCII_CHARS.length; i += 1) {
          const char = ASCII_CHARS[i];
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#fff';
          ctx.fillText(char, canvas.width * 0.5, canvas.height * 0.51);
          const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          const vector = new Float32Array(ASCII_SUBCELLS);
          let density = 0;
          for (let sampleIndex = 0; sampleIndex < ASCII_SUBCELLS; sampleIndex += 1) {
            const value = sampleCircle(pixels, canvas.width, canvas.height, SAMPLE_CIRCLES[sampleIndex]);
            vector[sampleIndex] = value;
            maxima[sampleIndex] = Math.max(maxima[sampleIndex], value);
            density += value;
          }
          rawProfiles.push({
            char,
            vector,
            density: density / ASCII_SUBCELLS,
          });
        }

        asciiGlyphProfiles = rawProfiles.map((profile) => {
          const vector = new Float32Array(ASCII_SUBCELLS);
          let density = 0;
          for (let i = 0; i < ASCII_SUBCELLS; i += 1) {
            const divisor = maxima[i] || 1;
            const value = profile.vector[i] / divisor;
            vector[i] = value;
            density += value;
          }
          return {
            char: profile.char,
            vector,
            density: density / ASCII_SUBCELLS,
          };
        });

        if (!asciiGlyphProfiles.length) {
          asciiGlyphProfiles = fallback;
        }
      };

      const findBestGlyph = (samples) => {
        if (!asciiGlyphProfiles.length) {
          return ' ';
        }

        const maxSample = Math.max(samples[0], samples[1], samples[2], samples[3], samples[4], samples[5]);
        if (maxSample < 0.03) {
          return ' ';
        }

        const contrasted = new Float32Array(ASCII_SUBCELLS);
        const exponent = 1.42;
        for (let i = 0; i < ASCII_SUBCELLS; i += 1) {
          const normalized = maxSample > 0.0001 ? (samples[i] / maxSample) : 0;
          contrasted[i] = Math.pow(clamp01(normalized), exponent) * maxSample;
        }

        const mean = (
          contrasted[0] +
          contrasted[1] +
          contrasted[2] +
          contrasted[3] +
          contrasted[4] +
          contrasted[5]
        ) / ASCII_SUBCELLS;
        let bestGlyph = ' ';
        let bestScore = Number.POSITIVE_INFINITY;

        for (let i = 0; i < asciiGlyphProfiles.length; i += 1) {
          const profile = asciiGlyphProfiles[i];
          const vector = profile.vector;
          const d0 = contrasted[0] - vector[0];
          const d1 = contrasted[1] - vector[1];
          const d2 = contrasted[2] - vector[2];
          const d3 = contrasted[3] - vector[3];
          const d4 = contrasted[4] - vector[4];
          const d5 = contrasted[5] - vector[5];
          let score =
            (d0 * d0 * ASCII_SUBCELL_WEIGHTS[0]) +
            (d1 * d1 * ASCII_SUBCELL_WEIGHTS[1]) +
            (d2 * d2 * ASCII_SUBCELL_WEIGHTS[2]) +
            (d3 * d3 * ASCII_SUBCELL_WEIGHTS[3]) +
            (d4 * d4 * ASCII_SUBCELL_WEIGHTS[4]) +
            (d5 * d5 * ASCII_SUBCELL_WEIGHTS[5]);
          const densityDelta = mean - profile.density;
          score += densityDelta * densityDelta * 0.82;

          if (score < bestScore) {
            bestScore = score;
            bestGlyph = profile.char;
          }
        }

        return bestGlyph;
      };

      const writeSample = (buffers, screenX, screenY, depthValue, brightness) => {
        if (screenX < 0 || screenX >= buffers.cols || screenY < 0 || screenY >= buffers.rows) {
          return;
        }

        const cellX = Math.floor(screenX);
        const cellY = Math.floor(screenY);
        const cellIndex = (cellY * buffers.cols) + cellX;
        const localX = screenX - cellX;
        const localY = screenY - cellY;
        const subX = localX < 0.5 ? 0 : 1;
        const subY = localY < 0.333334 ? 0 : (localY < 0.666667 ? 1 : 2);
        const subIndex = (cellIndex * ASCII_SUBCELLS) + (subY * 2) + subX;
        if (depthValue <= buffers.subDepth[subIndex]) {
          return;
        }

        buffers.subDepth[subIndex] = depthValue;
        buffers.subLuma[subIndex] = brightness;
        if (depthValue > buffers.cellDepth[cellIndex]) {
          buffers.cellDepth[cellIndex] = depthValue;
        }
      };

      const rotatePoint = (x, y, z, yaw, pitch, roll) => {
        const cy = Math.cos(yaw);
        const sy = Math.sin(yaw);
        const cx = Math.cos(pitch);
        const sx = Math.sin(pitch);
        const cz = Math.cos(roll);
        const sz = Math.sin(roll);
        const x1 = (x * cy) + (z * sy);
        const z1 = (-x * sy) + (z * cy);
        const y1 = y;
        const y2 = (y1 * cx) - (z1 * sx);
        const z2 = (y1 * sx) + (z1 * cx);
        return [
          (x1 * cz) - (y2 * sz),
          (x1 * sz) + (y2 * cz),
          z2,
        ];
      };

      const getSurfaceSample = (shape, uNorm, vNorm, time, options) => {
        const u = uNorm * TAU;
        const v = vNorm * TAU;
        const cosU = Math.cos(u);
        const sinU = Math.sin(u);
        const cosV = Math.cos(v);
        const sinV = Math.sin(v);

        if (shape === 'plus') {
          const armLength = options.armLength || 1.82;
          const armRadius = options.armRadius || 0.11;
          const armCount = PLUS_ARMS.length;
          const armPosition = uNorm * armCount;
          const armIndex = Math.min(armCount - 1, Math.floor(armPosition));
          const armProgress = armPosition - armIndex;
          const arm = PLUS_ARMS[armIndex];
          const t = (armProgress * 2) - 1;
          const ringA = Math.cos(v) * armRadius;
          const ringB = Math.sin(v) * armRadius;
          const half = armLength * 0.5;
          let x = 0;
          let y = 0;
          let z = 0;
          let nx = 0;
          let ny = 0;
          let nz = 0;

          if (arm.axis === 'x') {
            x = t * half;
            y = ringA;
            z = ringB;
            nx = 0;
            ny = ringA;
            nz = ringB;
          } else if (arm.axis === 'y') {
            x = ringA;
            y = t * half;
            z = ringB;
            nx = ringA;
            ny = 0;
            nz = ringB;
          } else {
            x = ringA;
            y = ringB;
            z = t * half;
            nx = ringA;
            ny = ringB;
            nz = 0;
          }

          const normalLength = Math.hypot(nx, ny, nz) || 1;
          return {
            x,
            y,
            z,
            nx: nx / normalLength,
            ny: ny / normalLength,
            nz: nz / normalLength,
            accent: Math.sin((u * 2.8) + (time * 0.58)) * 0.008,
          };
        }

        if (shape === 'cube') {
          const edgeLength = options.edgeLength || 1.38;
          const edgeRadius = options.edgeRadius || 0.072;
          const edgeCount = CUBE_EDGES.length;
          const edgePosition = uNorm * edgeCount;
          const edgeIndex = Math.min(edgeCount - 1, Math.floor(edgePosition));
          const edgeProgress = edgePosition - edgeIndex;
          const edge = CUBE_EDGES[edgeIndex];
          const t = (edgeProgress * 2) - 1;
          const ringA = Math.cos(v) * edgeRadius;
          const ringB = Math.sin(v) * edgeRadius;
          const half = edgeLength * 0.5;
          let x = 0;
          let y = 0;
          let z = 0;
          let nx = 0;
          let ny = 0;
          let nz = 0;

          if (edge.axis === 'x') {
            x = t * half;
            y = (edge.a * half) + ringA;
            z = (edge.b * half) + ringB;
            nx = 0;
            ny = ringA;
            nz = ringB;
          } else if (edge.axis === 'y') {
            x = (edge.a * half) + ringA;
            y = t * half;
            z = (edge.b * half) + ringB;
            nx = ringA;
            ny = 0;
            nz = ringB;
          } else {
            x = (edge.a * half) + ringA;
            y = (edge.b * half) + ringB;
            z = t * half;
            nx = ringA;
            ny = ringB;
            nz = 0;
          }

          const normalLength = Math.hypot(nx, ny, nz) || 1;
          return {
            x,
            y,
            z,
            nx: nx / normalLength,
            ny: ny / normalLength,
            nz: nz / normalLength,
            accent: Math.sin((u * 2.6) + (time * 0.62)) * 0.008,
          };
        }

        if (shape === 'sphere') {
          const theta = uNorm * TAU;
          const phi = vNorm * Math.PI;
          const radius = options.radius || 1.28;
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);
          const x = radius * sinPhi * Math.cos(theta);
          const y = radius * cosPhi;
          const z = radius * sinPhi * Math.sin(theta);
          return {
            x,
            y,
            z,
            nx: x / radius,
            ny: y / radius,
            nz: z / radius,
            accent: Math.sin((u * 2.4) + (time * 0.6)) * 0.012,
          };
        }

        if (shape === 'mug') {
          if (uNorm < 0.6) {
            const bodyU = uNorm / 0.6;
            const angle = v;
            const radius = 0.72;
            const y = (bodyU - 0.5) * 1.56;
            return {
              x: radius * Math.cos(angle),
              y,
              z: radius * Math.sin(angle),
              nx: Math.cos(angle),
              ny: 0,
              nz: Math.sin(angle),
              accent: Math.sin((angle * 3) + (time * 0.3)) * 0.01,
            };
          }
          if (uNorm < 0.74) {
            const rimU = (uNorm - 0.6) / 0.14;
            const angle = v;
            const radius = 0.44 + (rimU * 0.3);
            return {
              x: radius * Math.cos(angle),
              y: 0.82,
              z: radius * Math.sin(angle),
              nx: 0,
              ny: 1,
              nz: 0,
              accent: 0.008,
            };
          }
          if (uNorm < 0.86) {
            const baseU = (uNorm - 0.74) / 0.12;
            const angle = v;
            const radius = baseU * 0.72;
            return {
              x: radius * Math.cos(angle),
              y: -0.82,
              z: radius * Math.sin(angle),
              nx: 0,
              ny: -1,
              nz: 0,
              accent: 0.004,
            };
          }

          const handleU = (uNorm - 0.86) / 0.14;
          const a = -2.15 + (handleU * 4.3);
          const b = v;
          const major = 0.56;
          const minor = 0.13;
          const ring = major + (minor * Math.cos(b));
          const x = 1.03 + (minor * Math.sin(b) * 0.56);
          const y = ring * Math.cos(a);
          const z = ring * Math.sin(a);
          return {
            x,
            y,
            z,
            nx: Math.sin(b),
            ny: Math.cos(a) * Math.cos(b),
            nz: Math.sin(a) * Math.cos(b),
            accent: Math.sin((a * 2) + (time * 0.4)) * 0.01,
          };
        }

        if (shape === 'tectonic') {
          const theta = uNorm * TAU;
          const phi = vNorm * Math.PI;
          const directionX = Math.sin(phi) * Math.cos(theta);
          const directionY = Math.cos(phi);
          const directionZ = Math.sin(phi) * Math.sin(theta);
          const radius = options.radius || 1.3;
          const denom = Math.abs(directionX) + Math.abs(directionY) + Math.abs(directionZ) + 1e-6;
          const scale = radius / denom;
          const x = directionX * scale;
          const y = directionY * scale;
          const z = directionZ * scale;
          const nx = Math.sign(x) || 0;
          const ny = Math.sign(y) || 0;
          const nz = Math.sign(z) || 0;
          const normalLength = Math.hypot(nx, ny, nz) || 1;
          const edgeSignal = Math.min(
            Math.abs(Math.abs(x) - Math.abs(y)),
            Math.abs(Math.abs(y) - Math.abs(z)),
            Math.abs(Math.abs(z) - Math.abs(x)),
          );
          return {
            x,
            y,
            z,
            nx: nx / normalLength,
            ny: ny / normalLength,
            nz: nz / normalLength,
            accent: (0.03 - Math.min(0.03, edgeSignal)) * 0.5 + (Math.sin((u * 2.2) + (time * 0.5)) * 0.006),
          };
        }

        const major = options.majorRadius || 1.32;
        const minor = options.minorRadius || 0.54;
        const band = major + (minor * cosV);
        return {
          x: band * cosU,
          y: minor * sinV,
          z: band * sinU,
          nx: cosU * cosV,
          ny: sinV,
          nz: sinU * cosV,
          accent: Math.sin((u * 2.8) + (v * 2.2) + (time * 0.8)) * 0.014,
        };
      };

      const renderSurface = (buffers, options = {}) => {
        clearRenderBuffers(buffers);
        const halfCols = buffers.cols * 0.5;
        const halfRows = buffers.rows * 0.5;
        const time = options.time || 0;
        const shape = options.shape || 'torus';
        const yaw = options.yaw || 0;
        const pitch = options.pitch || 0;
        const roll = options.roll || 0;
        const cameraDistance = options.cameraDistance || 4.8;
        const projectionX = options.projectionX || 1.7;
        const projectionY = options.projectionY || 1.26;
        const uSteps = Math.max(12, options.uSteps || 64);
        const vSteps = Math.max(8, options.vSteps || 40);
        const ambient = options.ambient || 0.08;

        for (let ui = 0; ui < uSteps; ui += 1) {
          const uNorm = ui / uSteps;
          for (let vi = 0; vi < vSteps; vi += 1) {
            const vNorm = vi / vSteps;
            const sample = getSurfaceSample(shape, uNorm, vNorm, time, options);
            const point = rotatePoint(sample.x, sample.y, sample.z, yaw, pitch, roll);
            const normal = rotatePoint(sample.nx, sample.ny, sample.nz, yaw, pitch, roll);
            const normalLength = Math.hypot(normal[0], normal[1], normal[2]) || 1;
            const nfx = normal[0] / normalLength;
            const nfy = normal[1] / normalLength;
            const nfz = normal[2] / normalLength;
            const cullLimit = (shape === 'cube' || shape === 'plus')
              ? 1.1
              : (shape === 'mug' ? 0.5 : (shape === 'tectonic' ? 0.36 : 0.28));
            if (nfz > cullLimit) {
              continue;
            }

            const cameraZ = point[2] + cameraDistance;
            if (cameraZ <= 0.18) {
              continue;
            }
            const invZ = 1 / cameraZ;
            const depthValue = invZ + ((ui + vi) * 1e-8);
            const screenX = halfCols + (point[0] * invZ * projectionX * halfCols);
            const screenY = halfRows - (point[1] * invZ * projectionY * halfRows);
            const diffuse = Math.max(0, (nfx * LIGHT_VECTOR.x) + (nfy * LIGHT_VECTOR.y) + (nfz * LIGHT_VECTOR.z));
            const rim = Math.pow(1 - Math.abs(nfz), 1.2);
            const brightness = clamp01(ambient + (diffuse * 0.72) + (rim * 0.22) + sample.accent);
            writeSample(buffers, screenX, screenY, depthValue, brightness);
          }
        }

        const lines = new Array(buffers.rows);
        for (let y = 0; y < buffers.rows; y += 1) {
          const row = new Array(buffers.cols);
          for (let x = 0; x < buffers.cols; x += 1) {
            const index = (y * buffers.cols) + x;
            if (buffers.cellDepth[index] === Number.NEGATIVE_INFINITY) {
              row[x] = ' ';
              continue;
            }
            const offset = index * ASCII_SUBCELLS;
            row[x] = findBestGlyph([
              clamp01(buffers.subLuma[offset]),
              clamp01(buffers.subLuma[offset + 1]),
              clamp01(buffers.subLuma[offset + 2]),
              clamp01(buffers.subLuma[offset + 3]),
              clamp01(buffers.subLuma[offset + 4]),
              clamp01(buffers.subLuma[offset + 5]),
            ]);
          }
          lines[y] = row.join('');
        }
        return lines.join('\n');
      };

      const clearBackgroundGlyphs = () => {
        if (glyphSoftenRaf) {
          window.cancelAnimationFrame(glyphSoftenRaf);
          glyphSoftenRaf = 0;
        }
        glyphInstances = [];
        if (glyphField) {
          if (typeof glyphField.replaceChildren === 'function') {
            glyphField.replaceChildren();
          } else {
            glyphField.textContent = '';
          }
        }
      };

      const GLYPH_TEXT_TARGET_SELECTOR =
        'header h1, .content-section.active h2, .content-section.active h3, ' +
        '.content-section.active p, .content-section.active li, ' +
        '.content-section.active .small, .last-updated-label';
      const GLYPH_TEXT_PROXIMITY_DISTANCE = 240;
      const GLYPH_TEXT_OPACITY_REDUCTION = 0.62;
      const GLYPH_TEXT_MIN_OPACITY = 0.18;

      const rectDistance = (first, second) => {
        const dx = first.right < second.left
          ? (second.left - first.right)
          : (second.right < first.left ? (first.left - second.right) : 0);
        const dy = first.bottom < second.top
          ? (second.top - first.bottom)
          : (second.bottom < first.top ? (first.top - second.bottom) : 0);
        return Math.hypot(dx, dy);
      };

      const collectVisibleTextRects = () => {
        const nodes = Array.from(document.querySelectorAll(GLYPH_TEXT_TARGET_SELECTOR));
        const rects = [];
        nodes.forEach((node) => {
          const styles = window.getComputedStyle(node);
          if (styles.display === 'none' || styles.visibility === 'hidden') {
            return;
          }
          const rect = node.getBoundingClientRect();
          if (rect.width <= 2 || rect.height <= 2) {
            return;
          }
          rects.push(rect);
        });
        return rects;
      };

      const blendChannel = (base, target, weight) => (
        Math.round(base + ((target - base) * weight))
      );

      const applyGlyphTextSoftening = () => {
        if (!glyphInstances.length) {
          return;
        }

        const textRects = collectVisibleTextRects();
        const darkTheme = document.body.classList.contains('theme-dark');
        const baseColor = darkTheme ? [236, 236, 236] : [0, 0, 0];
        const softenedColor = darkTheme ? [168, 168, 168] : [146, 146, 146];

        glyphInstances.forEach((glyph) => {
          const baseOpacity = glyph.baseOpacity;
          if (!textRects.length) {
            glyph.node.style.opacity = baseOpacity.toFixed(3);
            glyph.node.style.color = '';
            return;
          }

          const glyphRect = glyph.node.getBoundingClientRect();
          let nearestDistance = Number.POSITIVE_INFINITY;
          for (let index = 0; index < textRects.length; index += 1) {
            const distance = rectDistance(glyphRect, textRects[index]);
            if (distance < nearestDistance) {
              nearestDistance = distance;
            }
            if (!nearestDistance) {
              break;
            }
          }

          const proximity = clamp01(1 - (nearestDistance / GLYPH_TEXT_PROXIMITY_DISTANCE));
          const soften = proximity * proximity;
          const adjustedOpacity = Math.max(
            GLYPH_TEXT_MIN_OPACITY,
            baseOpacity * (1 - (soften * GLYPH_TEXT_OPACITY_REDUCTION)),
          );
          const red = blendChannel(baseColor[0], softenedColor[0], soften);
          const green = blendChannel(baseColor[1], softenedColor[1], soften);
          const blue = blendChannel(baseColor[2], softenedColor[2], soften);

          glyph.node.style.opacity = adjustedOpacity.toFixed(3);
          glyph.node.style.color = `rgb(${red} ${green} ${blue})`;
        });
      };

      const scheduleGlyphTextSoftening = () => {
        if (!glyphField || glyphSoftenRaf) {
          return;
        }
        glyphSoftenRaf = window.requestAnimationFrame(() => {
          glyphSoftenRaf = 0;
          applyGlyphTextSoftening();
        });
      };

      const getBackgroundGlyphLayout = () => {
        const viewportWidth = Math.max(320, window.innerWidth || document.documentElement.clientWidth || 320);
        const compact = viewportWidth <= 900;
        if (compact) {
          return [
            {
              shape: 'torus',
              x: 0.9,
              y: 0.74,
              cols: 36,
              rows: 20,
              fontSize: 9.4,
              opacity: 0.57,
              yaw: -0.46,
              pitch: 0.42,
              roll: 0.16,
              yawSpeed: 0.26,
              rollSpeed: 0.14,
              wobbleSpeed: 0.66,
              pitchRange: 0.16,
            },
            {
              shape: 'cube',
              x: 0.11,
              y: 0.84,
              cols: 34,
              rows: 24,
              fontSize: 9.4,
              opacity: 0.54,
              yaw: 0.64,
              pitch: 0.38,
              roll: 0.12,
              yawSpeed: -0.22,
              rollSpeed: 0.18,
              wobbleSpeed: 0.58,
              pitchRange: 0.06,
            },
            {
              shape: 'plus',
              x: 0.9,
              y: 0.93,
              cols: 26,
              rows: 18,
              fontSize: 7.8,
              opacity: 0.51,
              yaw: 0.22,
              pitch: 0.42,
              roll: -0.14,
              yawSpeed: 0.19,
              rollSpeed: -0.16,
              wobbleSpeed: 0.52,
              pitchRange: 0.08,
            },
          ];
        }

        return [
          {
            shape: 'torus',
            x: 0.92,
            y: 0.72,
            cols: 42,
            rows: 26,
            fontSize: 10.6,
            opacity: 0.59,
            yaw: -0.5,
            pitch: 0.48,
            roll: 0.22,
            yawSpeed: 0.24,
            rollSpeed: 0.12,
            wobbleSpeed: 0.64,
            pitchRange: 0.16,
          },
          {
            shape: 'cube',
            x: 0.08,
            y: 0.84,
            cols: 44,
            rows: 30,
            fontSize: 10.8,
            opacity: 0.55,
            yaw: 0.58,
            pitch: 0.42,
            roll: 0.1,
            yawSpeed: -0.2,
            rollSpeed: 0.16,
            wobbleSpeed: 0.54,
            pitchRange: 0.06,
          },
          {
            shape: 'plus',
            x: 0.91,
            y: 0.93,
            cols: 30,
            rows: 20,
            fontSize: 8.6,
            opacity: 0.52,
            yaw: 0.18,
            pitch: 0.46,
            roll: -0.12,
            yawSpeed: 0.18,
            rollSpeed: -0.15,
            wobbleSpeed: 0.5,
            pitchRange: 0.08,
          },
        ];
      };

      const createBackgroundGlyphs = () => {
        if (!glyphField) {
          return;
        }
        clearBackgroundGlyphs();
        const placements = getBackgroundGlyphLayout();
        placements.forEach((placement, index) => {
          const node = document.createElement('div');
          node.className = 'glyph-node';
          node.style.left = `${(placement.x * 100).toFixed(2)}%`;
          node.style.top = `${(placement.y * 100).toFixed(2)}%`;
          node.style.setProperty('--glyph-font-size', `${placement.fontSize.toFixed(2)}px`);
          node.style.setProperty('--glyph-opacity', `${placement.opacity.toFixed(3)}`);
          node.style.opacity = placement.opacity.toFixed(3);
          const pre = document.createElement('pre');
          pre.setAttribute('aria-hidden', 'true');
          node.append(pre);
          glyphField.append(node);
          glyphInstances.push({
            shape: placement.shape,
            pre,
            node,
            baseOpacity: placement.opacity,
            phase: index * 1.2,
            yaw: placement.yaw,
            pitch: placement.pitch,
            roll: placement.roll,
            yawSpeed: placement.yawSpeed,
            rollSpeed: placement.rollSpeed,
            wobbleSpeed: placement.wobbleSpeed,
            pitchRange: placement.pitchRange,
            buffers: createRenderBuffers(placement.cols, placement.rows),
            majorRadius: placement.shape === 'torus' ? 1.34 : 0,
            minorRadius: placement.shape === 'torus' ? 0.58 : 0,
            radius: 0,
            edgeLength: placement.shape === 'cube' ? 1.78 : 0,
            edgeRadius: placement.shape === 'cube' ? 0.088 : 0,
            armLength: placement.shape === 'plus' ? 1.84 : 0,
            armRadius: placement.shape === 'plus' ? 0.114 : 0,
            cameraDistance: placement.shape === 'cube' ? 4.3 : (placement.shape === 'plus' ? 4.65 : 4.9),
            projectionX: placement.shape === 'cube' ? 1.84 : (placement.shape === 'plus' ? 1.68 : 1.86),
            projectionY: placement.shape === 'cube' ? 1.34 : (placement.shape === 'plus' ? 1.2 : 1.32),
            uSteps: placement.shape === 'cube'
              ? Math.max(190, placement.cols * 6)
              : (placement.shape === 'plus' ? Math.max(168, placement.cols * 5) : placement.cols + 30),
            vSteps: placement.shape === 'cube'
              ? Math.max(26, placement.rows)
              : (placement.shape === 'plus' ? Math.max(24, placement.rows) : placement.rows + 20),
          });
        });
        applyGlyphTextSoftening();
      };

      const renderBackgroundGlyphs = () => {
        if (!glyphInstances.length) {
          return;
        }
        glyphInstances.forEach((glyph) => {
          const phaseTime = asciiTime + glyph.phase;
          glyph.pre.textContent = renderSurface(glyph.buffers, {
            shape: glyph.shape,
            time: phaseTime,
            yaw: glyph.yaw + (asciiTime * glyph.yawSpeed),
            pitch: glyph.pitch + (Math.sin(phaseTime * glyph.wobbleSpeed) * glyph.pitchRange),
            roll: glyph.roll + (asciiTime * glyph.rollSpeed),
            majorRadius: glyph.majorRadius,
            minorRadius: glyph.minorRadius,
            radius: glyph.radius,
            edgeLength: glyph.edgeLength,
            edgeRadius: glyph.edgeRadius,
            armLength: glyph.armLength,
            armRadius: glyph.armRadius,
            cameraDistance: glyph.cameraDistance,
            projectionX: glyph.projectionX,
            projectionY: glyph.projectionY,
            uSteps: glyph.uSteps,
            vSteps: glyph.vSteps,
            ambient: 0.08,
          });
        });
      };

      const shouldAnimateAscii = () => (
        !reducedMotion.matches &&
        !document.hidden &&
        !lowPowerViewport.matches
      );

      const stopAscii = () => {
        if (!asciiFrameId) {
          return;
        }
        window.cancelAnimationFrame(asciiFrameId);
        asciiFrameId = 0;
      };

      const renderAsciiScene = () => {
        renderBackgroundGlyphs();
        applyGlyphTextSoftening();
      };

      const animateAscii = (timestamp) => {
        if (!glyphInstances.length || !shouldAnimateAscii()) {
          stopAscii();
          return;
        }
        if (!asciiLastTick) {
          asciiLastTick = timestamp;
        }
        const elapsed = timestamp - asciiLastTick;
        const frameInterval = lowPowerViewport.matches ? (1000 / 12) : (1000 / 24);
        if (elapsed >= frameInterval) {
          const dt = Math.min(elapsed / 1000, 0.08);
          asciiLastTick = timestamp - (elapsed % frameInterval);
          asciiTime += dt;
          renderAsciiScene();
        }
        asciiFrameId = window.requestAnimationFrame(animateAscii);
      };

      const startAscii = () => {
        if (!glyphInstances.length || asciiFrameId || !shouldAnimateAscii()) {
          return;
        }
        asciiLastTick = 0;
        asciiFrameId = window.requestAnimationFrame(animateAscii);
      };

      const refreshAscii = () => {
        if (!glyphField) {
          return;
        }
        buildAsciiGlyphProfiles();
        if (glyphField && !glyphInstances.length) {
          createBackgroundGlyphs();
        }
        renderAsciiScene();
      };

      const handleViewportResize = () => {
        if (resizeRaf) {
          return;
        }
        resizeRaf = window.requestAnimationFrame(() => {
          resizeRaf = 0;
          setWrapperHeight();
          setLastUpdatedLabel();
          createBackgroundGlyphs();
          refreshAscii();
          scheduleSpacingAudit();
          if (shouldAnimateAscii()) {
            startAscii();
          } else {
            stopAscii();
          }
        });
      };
      window.addEventListener('resize', handleViewportResize);
      window.addEventListener('scroll', scheduleGlyphTextSoftening, { passive: true });
      window.addEventListener('hashchange', scheduleGlyphTextSoftening);
      if (themeToggle) {
        themeToggle.addEventListener('click', scheduleGlyphTextSoftening);
      }

      if (glyphField) {
        refreshAscii();
        if (shouldAnimateAscii()) {
          startAscii();
        }

        const onAnimationPolicyChange = () => {
          stopAscii();
          renderAsciiScene();
          if (shouldAnimateAscii()) {
            startAscii();
          }
        };

        if (typeof reducedMotion.addEventListener === 'function') {
          reducedMotion.addEventListener('change', onAnimationPolicyChange);
        } else if (typeof reducedMotion.addListener === 'function') {
          reducedMotion.addListener(onAnimationPolicyChange);
        }

        if (typeof lowPowerViewport.addEventListener === 'function') {
          lowPowerViewport.addEventListener('change', onAnimationPolicyChange);
        } else if (typeof lowPowerViewport.addListener === 'function') {
          lowPowerViewport.addListener(onAnimationPolicyChange);
        }

        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            stopAscii();
            return;
          }
          if (shouldAnimateAscii()) {
            startAscii();
          }
        });
      }

      const blurAfterPointerClick = (event) => {
        if (event.detail <= 0) {
          return;
        }
        const target = event.currentTarget;
        if (target instanceof HTMLElement) {
          target.blur();
        }
      };

      allLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const target = link.getAttribute('data-section');
          if (target) {
            setActiveSection(target, { history: 'push' });
            blurAfterPointerClick(event);
          }
        });
      });

      if (contentWrapper) {
        contentWrapper.addEventListener('touchstart', handleSwipeStart, { passive: true });
        contentWrapper.addEventListener('touchmove', handleSwipeMove, { passive: false });
        contentWrapper.addEventListener('touchend', handleSwipeEnd, { passive: true });
        contentWrapper.addEventListener('touchcancel', handleSwipeCancel, { passive: true });
      }

      function sectionsToTarget(target) {
        if (!target) {
          return null;
        }
        const normalized = target.trim().toLowerCase();
        return findSectionByName(normalized) ? normalized : null;
      }
