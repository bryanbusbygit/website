# Boolean-System Visualizer Demo Plan

## Implementation status — September 16, 2026

Local implementation and exports are complete. The recovered app has a tested
core, corrected dependency direction, and deterministic `/demo` presentation.
GIF, WebM, MP4, and poster assets are in `assets/demos/`, and the Boolean page
embeds the demonstration as Figure 3 with user-initiated playback. The acyclic
illustration is now Figure 4. Desktop/mobile, theme, motion-preference, and
playback checks passed. No publication or commit was performed.

Exact commands, verification results, and production-file locations are saved
in `/Users/bryanbusby/Documents/Projects/Software/web_fds/DEMO_PRODUCTION.md`.
The lossless master and original-source backup are outside the website
repository in `Documents/Projects/Software/web_fds-demo-production/`.

The original planning text follows for reference. Its request for additional
context was resolved by reading the locally saved handoff and prior session
after Bryan clarified that the context was stored locally.

## Purpose

Create a polished, high-quality looping animation from Bryan's finite dynamical systems visualizer and place it in the Boolean Monomial Dynamics “Read more” page. The animation should explain a mathematical idea, not merely show software controls. It should make the progression

\[
\text{coordinate rules}
\longrightarrow
\text{dependency graph}
\longrightarrow
\text{state-space orbit}
\longrightarrow
\text{transient length}
\]

immediately legible.

Before beginning implementation, read the additional large-context material Bryan will provide. Treat that material as authoritative when it changes the example, terminology, storyboard, or visual emphasis proposed below.

## Projects already located

### Primary visualizer

`/Users/bryanbusby/Documents/Projects/Software/web_fds`

This is the app that most closely matches the requested demonstration.

- Title: **Finite Dynamical Systems Visualizer**
- Entry point: `app.py`
- Core logic: `deep_fds_core.py`
- Interface: `templates/index.html`
- Original README: `README.rtf`
- Features already present:
  - rule entry;
  - modulus selection;
  - phase-space generation;
  - dependency-graph generation;
  - Graphviz layout selection;
  - pan and zoom;
  - computation of the longest transient length.

The app is not a Git repository. Its existing `venv` contains only `pip`; Flask and the Python `graphviz` package are missing. The Graphviz command-line program is installed at `/opt/homebrew/bin/dot`.

### Secondary graph tool

`/Users/bryanbusby/Documents/Projects/Research/DigraphWalks/digraph-gui`

This is a newer Tauri/React directed-graph editor with walk animation and primitive-exponent analysis. It may provide useful interaction or visual-design ideas, but it does not directly model a finite dynamical system or its phase space. Do not substitute it for `web_fds` unless Bryan's additional context explicitly calls for that.

## Current website state

Website repository:

`/Users/bryanbusby/Documents/Projects/Web/website`

The last published commit is `b25b527`. There are currently unpublished local edits that change the Boolean dependency convention to the standard influence direction

\[
j\to i \quad\Longleftrightarrow\quad x_j\text{ occurs in }f_i.
\]

These edits affect:

- `boolean-dynamics.html`;
- `figures.html`;
- `index-text-export.md`;
- `assets/figures/dependency-digraph.svg`.

Preserve them. The old `web_fds` implementation currently emits dependency edges in the reverse direction (`left-hand side -> variable`). Correct the visualizer to emit `variable -> updated coordinate` before recording anything.

## Mathematical example

Unless Bryan's additional context specifies another system, use the four-variable Boolean monomial map already developed on the website:

\[
f(x_1,x_2,x_3,x_4)=(x_2,\,x_1x_3,\,x_4,\,x_2).
\]

Rules for the visualizer:

```text
x1 = x2
x2 = x1 * x3
x3 = x4
x4 = x2
```

Use modulus `2`.

The dependency edges, using influence direction, are

```text
2 -> 1
1 -> 2
3 -> 2
4 -> 3
2 -> 4
```

The maximum transient is `6`. A longest orbit segment is

```text
1110 -> 1101 -> 1011 -> 0110 -> 1001 -> 0010 -> 0000.
```

Verify these values in code before capture. Do not rely only on the prose above.

## Product decision: retain a master and export multiple formats

A GIF is required, but GIF is not the best delivery format for high frame rate, color fidelity, or file size. Produce all of the following from one lossless master:

1. a lossless or visually lossless master recording;
2. an optimized animated GIF;
3. a WebM version for the website;
4. an MP4 fallback;
5. a static poster image for reduced-motion users.

Use the WebM/MP4 as the primary website media if Bryan approves. Keep the GIF as a real deliverable and fallback. If Bryan insists on literal GIF-only delivery, preserve the master so it can be re-exported without repeating the screen recording.

## Visualizer preparation

Work on a copy or a dedicated branch before changing `web_fds`, because it is not version-controlled. First create a recoverable backup or initialize a local Git repository without publishing it.

### Restore the runtime

Create a fresh environment rather than trusting the incomplete existing `venv`:

```sh
cd /Users/bryanbusby/Documents/Projects/Software/web_fds
python3 -m venv .venv-demo
source .venv-demo/bin/activate
python -m pip install Flask graphviz
python app.py
```

Confirm that `/opt/homebrew/bin/dot` is available and that both generated SVGs render. Record the dependency versions in a new `requirements.txt` so the app remains recoverable.

### Correctness work required before recording

- Change dependency edges in `deep_fds_core.py` from `updated coordinate -> referenced variable` to `referenced variable -> updated coordinate`.
- Add tests for the displayed four-variable example.
- Verify the complete transition map over all `16` states.
- Verify that the longest transient is `6`.
- Verify the highlighted orbit state by state.
- Ensure repeated monomial factors are interpreted correctly over the Boolean domain.
- Do not expose Python `eval` to untrusted web input if the app is ever deployed. For a local capture, it may remain temporarily, but document the limitation.

## Presentation polish

The capture should visually belong to the website rather than look like an unstyled development tool.

- Match the site's Newsreader/Manrope typography and restrained monochrome palette.
- Use one accent color for the active state, active edge, and transient badge.
- Remove unnecessary form chrome and heavy shadows during demo mode.
- Use consistent circular graph vertices and readable labels.
- Keep the background flat and stable; gradients and noisy textures compress poorly in GIFs.
- Add a `Load example` control that fills the four rules and modulus deterministically.
- Add a `Run demonstration` control for a repeatable capture.
- Show the system as formatted mathematics or a clean rule list.
- Display `Maximum transient: 6` prominently but without covering either graph.
- Keep the phase space and dependency graph large enough to read at the final embedded width.
- Ensure all UI movement is deterministic. Disable physics or animation randomness during capture.

### Demonstration-specific feature

Add a transient-path playback control to `web_fds` if Bryan's added context confirms that the orbit should be the focus. The playback should:

- highlight the current state in the phase graph;
- retain a subtler highlight on states and edges already traversed;
- show the step count from `0` through `6`;
- pause briefly at `0000`;
- reset without a visible jump.

Graphviz SVG elements can be associated with states through their `<title>` elements, but explicit `data-state` and `data-transition` attributes are more robust. Prefer deterministic identifiers over DOM-position selectors.

## Storyboard

Target a loop of approximately `12–16 seconds`. Do not spend several seconds simulating manual typing.

### Suggested sequence

1. **Opening, 0.0–1.5 s**
   - Show the polished visualizer with the four rules already loaded or loaded with one deliberate click.
   - Keep the system name and modulus visible.

2. **Dependency structure, 1.5–4.5 s**
   - Reveal the dependency graph.
   - Briefly emphasize the influence arrows associated with each coordinate rule.
   - The animation must use `variable -> updated coordinate` direction.

3. **State-space transition, 4.5–6.0 s**
   - Move attention to the phase space.
   - Display `16 states` and `Maximum transient: 6`.

4. **Longest transient, 6.0–12.5 s**
   - Traverse
     `1110 -> 1101 -> 1011 -> 0110 -> 1001 -> 0010 -> 0000`.
   - Advance at roughly `0.7–0.9 seconds` per state.
   - Highlight the current edge as well as the current state.

5. **Payoff and loop, 12.5–15.0 s**
   - Hold on `0000` and `Maximum transient: 6`.
   - Return to the opening state through a short, clean reset or crossfade.

Avoid decorative cursor circling, repeated zooming, frantic panning, or tooltip flicker. Every movement should explain either dependence, state transition, or transient length.

## Capture method

Prefer a scripted browser capture over manual screen recording. Playwright is suitable because it can enforce viewport size, timing, input, mouse movement, and animation state.

### Master settings

- Viewport: `1440 × 900` or `1600 × 1000`.
- Device scale factor: `2` when practical.
- Frame rate: `30 fps` master.
- Duration: no more than `16 seconds` unless the added context requires it.
- Capture either lossless PNG frames or a high-quality lossless/intermediate video.
- Hide browser chrome, notifications, scrollbars, debug controls, and the mouse cursor unless a click is narratively necessary.
- Wait for fonts and Graphviz SVGs before starting frame capture.

Record the whole sequence using a deterministic demo state or scripted control API. Do not depend on approximate `sleep` calls when the UI can signal that a step has completed.

## GIF export

Try `gifski` first for the final GIF. A practical target is:

- width: `1100–1200 px`;
- frame rate: `20–24 fps`;
- looping: infinite;
- target size: ideally below `12 MB`, and preferably below `8 MB`;
- quality: `90–95` before reducing dimensions or frame rate.

If `gifski` is unavailable, use a two-pass FFmpeg palette workflow:

```sh
ffmpeg -i master.mov \
  -vf "fps=20,scale=1200:-1:flags=lanczos,palettegen=stats_mode=diff" \
  palette.png

ffmpeg -i master.mov -i palette.png \
  -lavfi "fps=20,scale=1200:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=sierra2_4a:diff_mode=rectangle" \
  -loop 0 boolean-system-visualizer.gif
```

If the GIF is too large, reduce duration first, then width, then frame rate. Do not immediately destroy line and label clarity with aggressive color reduction.

Also export WebM and MP4 at the master frame rate. Compare all versions at the actual website display width, not only at full resolution.

## Website integration

Intended page:

`/Users/bryanbusby/Documents/Projects/Web/website/boolean-dynamics.html`

Preferred location: in **Iterates and directed walks**, after the paragraph that derives

\[
(f^2)_2(\mathbf x)=x_2x_4
\]

and before the fully general walk statement. At that point, the demonstration reinforces the example rather than interrupting the definition of the system.

Suggested tracked assets:

```text
assets/demos/boolean-system-visualizer.webm
assets/demos/boolean-system-visualizer.mp4
assets/demos/boolean-system-visualizer.gif
assets/demos/boolean-system-visualizer-poster.webp
```

Do not commit raw frame sequences or the lossless master to the website repository. Store them outside the repository or under an ignored production directory.

### Caption and numbering

Treat the demonstration as a numbered figure to preserve the site's established caption system.

- New animation: `Figure 3.`
- Existing acyclic-subgraph figure: renumber from `Figure 3.` to `Figure 4.`
- Update `index-text-export.md` to match.
- Keep the visible caption prefix in the form `Figure #.` rather than a descriptive label.

Suggested caption text:

> Figure 3. Dependency graph, phase space, and a longest transient for the displayed four-variable Boolean monomial system.

Revise this caption if the additional context changes the animation's content.

### Markup and accessibility

If video delivery is approved, use autoplay only with `muted`, `loop`, and `playsinline`. Include the GIF or poster as fallback. Supply meaningful alternative text and a nearby prose description of the demonstrated sequence.

Respect `prefers-reduced-motion`:

- show the static poster instead of autoplaying motion; or
- pause the video and expose controls.

The media must not be the sole source of mathematical information. The existing text and equations should remain sufficient without it.

The website applies filters to some figures in dark mode. Give the demo media a dedicated class and test it in both themes. Do not allow a global inversion filter to corrupt its accent colors.

## Verification checklist

### Mathematical

- [ ] Dependency arrows use `variable -> updated coordinate`.
- [ ] The graph edges match all four coordinate rules.
- [ ] The phase space contains exactly `16` states.
- [ ] The displayed orbit is correct at every step.
- [ ] The maximum transient is `6`.
- [ ] Captions and prose use the same convention as the animation.

### Visual

- [ ] Labels remain readable at the embedded width.
- [ ] No clipping occurs at desktop or mobile widths.
- [ ] The loop does not visibly jump.
- [ ] Mouse movement is sparse and intentional.
- [ ] Dark and light themes both look deliberate.
- [ ] Reduced-motion behavior works.

### Technical

- [ ] A reproducible dependency file exists for `web_fds`.
- [ ] Capture and export commands are documented.
- [ ] GIF, WebM, MP4, and poster assets load locally.
- [ ] Local website links and assets resolve.
- [ ] Inline scripts parse.
- [ ] SVG and HTML changes pass existing validation checks.
- [ ] Final tracked binary sizes are reasonable.
- [ ] `git diff --check` passes.

### Review and publication

- [ ] Show Bryan the animation at actual page size before publishing.
- [ ] Confirm the example and pacing against the additional context.
- [ ] Commit only approved media and website changes.
- [ ] Publish only after explicit approval.
- [ ] Verify the live GitHub Pages deployment and the reduced-motion fallback.

## Deliverables for the next agent

1. A restored and reproducible `web_fds` development environment.
2. A corrected influence-direction dependency graph in the visualizer.
3. A deterministic demo mode or scripted capture sequence.
4. The lossless master stored outside the website repository.
5. Optimized GIF, WebM, MP4, and poster assets.
6. Updated Boolean research-page markup, numbering, caption, styles, and text export.
7. A short production note containing exact capture and export commands.
8. Before/after screenshots and measured asset sizes.
9. A verified live deployment after Bryan approves publication.
