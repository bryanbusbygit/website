# Homepage text export for rewriting

Source: `index.html`

Purpose: This document contains all human-facing copy from the homepage, in page order, with enough structural and visual metadata for another agent to rewrite the prose. The annotations are not website copy.

## Instructions for the rewriting agent

- Rewrite the prose for clarity, flow, voice, and concision, but preserve the factual meaning.
- Do not invent credentials, results, publication status, dates, affiliations, or technical claims.
- Preserve every link destination and keep suitable linked words or phrases in the revised copy.
- Keep the three research projects distinct and in their current order.
- Preserve mathematical notation such as *n* and 2 to the power *n*, as well as diacritics in people's names (Alexander Díaz, Omar Colón, and Rafael Solís).
- Text marked `[MUTED]` is visually de-emphasized. Text marked `[LABEL]` functions as compact metadata rather than body prose.
- Figure alt text should remain descriptive and functional. It may be edited for accessibility, but it is not ordinary visible body copy.
- Return the complete replacement copy using the same section/project structure and annotation style so it can be mapped back into `index.html`.

## Page-level metadata

- Browser title: Bryan Busby
- Meta description: Academic homepage for Bryan Busby.
- Author metadata: Bryan Busby
- Language: English
- Page type: Minimal academic homepage

## Global presentation and behavior

- The page is left-aligned, not centered. Its primary text column is approximately 760 px wide on desktop.
- The page title and sections can occupy a larger outer region, but paragraphs and project content remain in the narrower reading column.
- The background is white in light mode and black in dark mode. Text and all figures are monochrome.
- Body copy and headings use a literary serif face. Small project-material labels use a sans-serif face.
- There is a dark vignette around the viewport edges. It strengthens slightly as the reader scrolls.
- There is no visible primary navigation, header bar, portrait, footer, copyright line, social-media block, or theme-control button.
- There is generous vertical space after the final content.
- On narrow screens, content stays left-aligned, side padding shrinks, and figures become fluid-width.
- Accessibility-only skip link at the beginning of the page: "Skip to content" (target: `#content`). It becomes visible when focused.

---

## Page title

[H1; large; left-aligned]

Bryan Busby

---

## Section 1: About

[H2; left-aligned]

About

[BODY PARAGRAPH]

Graph theory and combinatorics, mostly. Pure mathematics where the useful parts have been carefully removed. Here are my [LINK: CV -> `assets/Bryan_Busby_CV.pdf`] and [LINK: email -> `mailto:bryan.busby@upr.edu`]. If the email link fails, try [LINK: here -> `email.html`].

[LAYOUT NOTE: This is one continuous paragraph. The joke about pure mathematics is part of the public-facing copy. There is no portrait or figure in this section.]

---

## Section 2: Research

[H2; left-aligned]

Research

[LAYOUT NOTE: There is no introductory paragraph under this heading. Three vertically stacked projects follow.]

### Project 1

[H3]

Arithmetical Structures on Graphs

[BODY PARAGRAPH]

Replacing one edge of a cycle by parallel edges changes the classical enumeration. This project recovers its structure through smoothing, an exact reduction to strongly smooth cores, and a Euclidean-type construction from coprime boundary values. [MUTED: Advised by [LINK: Alexander Díaz -> `https://sites.google.com/site/diazlopezalexander/home`] and [LINK: Joel Louwsma -> `https://www.joellouwsma.com`].]

[SEPARATE LINK PARAGRAPH]

[LINK: Read more. -> `arithmetical-structures.html`]

[PROJECT MATERIAL 1; indented metadata row]

[LABEL: Draft manuscript.] [LINK: Arithmetical Structures on Cycles with a Multi-Edge -> `VPR3.pdf`]

[ACCESSIBLE LINK LABEL: Open PDF for Arithmetical Structures on Cycles with a Multi-Edge]

[PROJECT MATERIAL 2; indented metadata row]

[LABEL: Poster.] [LINK: MAA MathFest, Sacramento, CA, August 2025. -> `assets/posters/2025_arithmetical_structures_poster.pdf`]

[ACCESSIBLE LINK LABEL: Open poster PDF for arithmetical structures on cycles with a multi-edge]

[FIGURE AFTER THE PROJECT TEXT AND MATERIAL LINKS; indented slightly to the right; displayed inside a wide frame]

- Source: `assets/fig-arith-merge.svg`
- Alt text: Merged tilde-cycle obtained by identifying two endpoints in the construction.
- Loading: lazy
- Appearance: monochrome; contained rather than cropped

### Project 2

[H3]

Boolean Monomial Dynamical Systems

[BODY PARAGRAPH]

A Boolean system on *n* variables can have 2^*n* states. This work replaces that state space with an *n*-vertex dependency graph and uses acyclic reductions, directed walks, and Frobenius arithmetic to control the time before periodic behavior begins. [MUTED: Advised by [LINK: Omar Colón -> `https://pegasus.uprm.edu/ocolon/`].]

[SEPARATE LINK PARAGRAPH]

[LINK: Read more. -> `boolean-dynamics.html`]

[PROJECT MATERIAL 1; indented metadata row]

[LABEL: Manuscript.] Transient Length Bounds for Boolean Monomial Systems [MUTED, SEMIBOLD STATUS: (in preparation)]

[PROJECT MATERIAL 2; indented metadata row]

[LABEL: Poster.] [LINK: SIDIM, UPR Ponce, May 2024. -> `assets/posters/2024_discrete_dynamical_systems_poster.pdf`]

[ACCESSIBLE LINK LABEL: Open poster PDF for transient length bounds for Boolean monomial systems]

[FIGURE AFTER THE PROJECT TEXT AND MATERIAL LINKS; indented slightly to the right; displayed inside a wide frame]

- Source: `assets/fig-boolean.svg`
- Alt text: State-transition digraph of the Boolean monomial system.
- Loading: lazy
- Appearance: monochrome; contained rather than cropped

### Project 3

[H3]

5G RF Propagation Measurements

[BODY PARAGRAPH]

This project examines 5G propagation in microwave and millimeter-wave bands using software-defined-radio measurements. The work includes GNU Radio instrumentation, Vivaldi antenna design, and channel measurements of attenuation and directional effects. [MUTED: Advised by [LINK: Rafael Solís -> `https://inec.uprm.edu/rafaelr/`].]

[PROJECT MATERIAL 1; indented metadata row]

[LABEL: Presentation.] [LINK: UPR Mayaguez, 2023. RF propagation measurements and antenna design for 5G-related bands. -> `assets/posters/CarsePoster2023.pdf`]

[ACCESSIBLE LINK LABEL: Open PDF presentation for 5G RF propagation]

[FIGURE AFTER THE PROJECT TEXT AND MATERIAL LINK; indented slightly to the right; displayed inside a wide frame]

- Source: `assets/fig-rf-digraph.svg`
- Alt text: Monochrome diagram of simulated H-plane and E-plane gain patterns with multiple noisy traces.
- Loading: lazy
- Appearance: monochrome; natural aspect ratio; contained rather than cropped

---

## End of visible page content

[STRUCTURE NOTE: The page ends after the third project's figure. There is no closing biography, contact callout, footer, or navigation repeated at the bottom.]

---

# Read-more page 1: Arithmetical Structures on Graphs

Source: `arithmetical-structures.html`

## Page metadata and presentation

- Browser title: Arithmetical Structures on Graphs — Bryan Busby
- Meta description: An introduction to arithmetical structures on cycles with a multi-edge.
- Author metadata: Bryan Busby
- Layout: left-aligned single column, approximately 760 px wide, with a 2rem desktop left inset. The column is not centered.
- Typography and color follow the homepage: serif body text, sans-serif labels, monochrome figures, light/dark themes.
- Equations are centered and rendered with MathJax; they can scroll horizontally on small screens.
- Result statements appear in lightly shaded boxes with a dark vertical rule at the left.
- Figure captions and compact uppercase labels are muted.
- The page's H1 exists for accessibility but is visually hidden; the large introductory paragraph is the visible opening statement.
- Accessibility-only skip link: "Skip to content" (target: `#main-content`).

[TOP BACK LINK]

[LINK: Back to research -> `index.html#works`]

## Accessible page title

[H1; visually hidden]

Arithmetical Structures on Graphs

## Opening statement

[LEDE; larger than body text]

Replacing one edge of a cycle by \(k\) parallel edges changes the associated enumeration problem. The resulting structure is analyzed by reducing each labeling to a smooth core, identifying the number-theoretic constraints at the multi-edge, and reconstructing the full family.

[CENTERED LEAD FIGURE; compact width, approximately 19rem]

- Source: `assets/figures/busby-multiedge-fig-1.png`
- Alt text: A cycle on five labeled vertices in which the edge between v 1 and v 2 is doubled.
- Caption label: Figure 1
- Caption: The multigraph \(\widetilde{C}_{5,2}\): a \(5\)-cycle whose edge \(v_1v_2\) has multiplicity \(2\). Redrawn from Figure 1 of the [LINK: accompanying manuscript -> `VPR3.pdf`].

## The question

[H2]

The question

[BODY PARAGRAPH]

An arithmetical structure assigns a positive integer \(r(v)\) to every vertex. At each vertex, its label must divide the sum of the neighboring labels, with parallel edges counted repeatedly:

[CENTERED DISPLAY EQUATION]

\[
d(v)r(v)=\sum_{u\sim v}m(v,u)r(u).
\]

[BODY PARAGRAPH]

The \(d\)-label is the resulting quotient, and the \(r\)-labels have no common factor. In matrix form this is \((\operatorname{diag}\mathbf d-A_G)\mathbf r=0\). Lorenzini introduced these structures through intersection matrices arising from degenerating algebraic curves. [LINK: [1] -> `https://doi.org/10.1007/BF01455069`]

[BODY PARAGRAPH]

Ordinary cycles have a clean answer: \(\binom{2n-1}{n-1}\) structures on \(n\) vertices. [LINK: [2] -> `https://arxiv.org/abs/1701.06377`] For \(\widetilde C_{n,k}\), the cycle with one \(k\)-fold edge, only two local equations change—but those equations couple \(r_1\), \(r_2\), and \(k\) through divisibility. The usual cycle count no longer applies. Earlier work on doubled-edge paths showed the same phenomenon in an open chain. [LINK: [3] -> `https://arxiv.org/abs/1903.01398`]

[CENTERED SOURCE FIGURE AFTER THE PARAGRAPHS]

- Source: `assets/figures/glass-wagner-fig-1.png`
- Alt text: Two paths, each with one doubled edge: P 3,2 and P 1,5.
- Caption label: Figure 2
- Caption: The doubled-edge paths denoted \(\mathcal{P}_{3,2}\) and \(\mathcal{P}_{1,5}\) in the source, from Figure 1 of [LINK: Glass and Wagner -> `https://math.colgate.edu/~integers/u68/u68.pdf`]. Cropped and shown in monochrome; reproduced under [LINK: CC BY 4.0 -> `https://creativecommons.org/licenses/by/4.0/`].

## Deriving a count from the local equations

[H2]

Deriving a count from the local equations

[NUMBERED RESEARCH PATH; four vertically stacked steps]

1. **Smooth the cycle.** Whenever an ordinary degree-two vertex has \(d=1\), remove it and join its neighbors. Reversing this subdivision recovers the original structure. This strips away inessential length while preserving the arithmetic.

2. **Reduce to cores.** Repeating the smoothing step leaves a smooth core. Ballot numbers record where subdivisions can be reinserted, so counting every structure reduces to counting these much smaller cores.

3. **Read the multi-edge boundary.** The exceptional equations force \(r_1\), \(r_2\), and \(k\) to be pairwise coprime. A common divisor would propagate around the entire cycle, contradicting the primitive labeling.

4. **Run the construction backward.** Starting with pairwise-coprime boundary values, a modified Euclidean algorithm generates two decreasing arms. Their last terms are \(1\), so the arms join and close into a valid multi-edge cycle.

## Results

[H2]

Results

[SHADED RESULT BOX 1]

[UPPERCASE MUTED LABEL: Construction theorem — manuscript in preparation]

Positive integers \(r_1,r_2,k\) can serve as the boundary values of a multi-edge arithmetical structure exactly when they are pairwise coprime. The condition is both necessary and sufficient, and the proof supplies an algorithm that constructs the graph.

[SHADED RESULT BOX 2]

[UPPERCASE MUTED LABEL: Enumeration theorem — manuscript in preparation]

For fixed \(n\) and \(k\), the total number of structures is an exact weighted sum over the strongly smooth cores on at most \(n\) vertices. The weights are ballot numbers and powers of two, recording how subdivisions and weakly smooth structures are recovered from those cores. The full formula appears in the [LINK: accompanying manuscript -> `VPR3.pdf`].

[CENTERED SOURCE FIGURE AFTER THE RESULT BOXES]

- Source: `assets/figures/busby-multiedge-fig-2.png`
- Alt text: Two pairs of labeled arithmetical structures on four-vertex multi-edge cycles.
- Visible key beneath image: \(\mathbf d\), \(\mathbf r\), \(\mathbf d\), \(\mathbf r\)
- Caption label: Figure 3
- Caption: Each adjacent pair shows one arithmetical structure: the left graph gives the vertex values of \(\mathbf d\), and the right graph gives the corresponding values of \(\mathbf r\). The first pair is on \(\widetilde{C}_{4,3}\); the second is on \(\widetilde{C}_{4,4}\). Redrawn from the [LINK: accompanying manuscript -> `VPR3.pdf`].

[BODY PARAGRAPH AFTER FIGURE]

The reduction separates two parts of the count: subdivision choices at ordinary vertices and coprimality conditions at the multi-edge. For additional background, see this [LINK: video introduction to arithmetical structures -> `https://youtu.be/nbCeFqcfTws`].

## References

[H2]

References

[NUMBERED REFERENCES; smaller text]

1. D. J. Lorenzini, “Arithmetical graphs,” *Mathematische Annalen* 285 (1989), 481–501. [LINK: Paper -> `https://link.springer.com/article/10.1007/BF01455069`] · [LINK: DOI -> `https://doi.org/10.1007/BF01455069`]

2. B. Braun et al., “Counting arithmetical structures on paths and cycles,” *Discrete Mathematics* 341 (2018), 2949–2963. [LINK: Paper -> `https://arxiv.org/abs/1701.06377`] · [LINK: DOI -> `https://doi.org/10.1016/j.disc.2018.07.002`]

3. D. Glass and J. Wagner, “Arithmetical structures on paths with a doubled edge,” *Integers* 20 (2020), A68. [LINK: Paper -> `https://math.colgate.edu/~integers/u68/u68.pdf`] · [LINK: arXiv -> `https://arxiv.org/abs/1903.01398`]

4. C. Keyes and T. Reiter, “Bounding the number of arithmetical structures on graphs,” *Discrete Mathematics* 344 (2021), 112494. [LINK: Paper -> `https://arxiv.org/abs/2007.15100`] · [LINK: DOI -> `https://doi.org/10.1016/j.disc.2021.112494`]

[BOTTOM CROSS-PAGE NAVIGATION; separated from the article by a horizontal rule]

[LINK: Boolean Monomial Dynamics -> `boolean-dynamics.html`]

---

# Read-more page 2: Boolean Monomial Dynamics

Source: `boolean-dynamics.html`

## Page metadata and presentation

- Browser title: Boolean Monomial Dynamics — Bryan Busby
- Meta description: An introduction to transient lengths in Boolean monomial dynamical systems.
- Author metadata: Bryan Busby
- Layout and typography: same research-page template as the preceding page—left-aligned 760 px column, monochrome figures, serif body copy, sans-serif labels, light/dark themes.
- Equations are centered and rendered with MathJax; they can scroll horizontally on small screens.
- The result statements appear in lightly shaded boxes with a dark vertical rule at the left.
- The page's H1 exists for accessibility but is visually hidden; the lede is the visible opening statement.
- Accessibility-only skip link: "Skip to content" (target: `#main-content`).

[TOP BACK LINK]

[LINK: Back to research -> `index.html#works`]

## Accessible page title

[H1; visually hidden]

Boolean Monomial Dynamics

## Opening statement

[LEDE; larger than body text]

Attractors describe where a finite Boolean system ends up, but not how long it takes to get there. This work addresses that question by replacing an exponentially large state space with a dependency graph, then translating iteration into the arithmetic of directed-walk lengths.

[CENTERED LEAD FIGURE; approximately 32rem wide]

- Source: `assets/figures/rafimanzelat-2025-fig-1.png`
- Alt text: Top-down state-transition graph of a four-variable Boolean network, with transient states flowing downward into three fixed points and one two-state cycle.
- Caption label: Figure 1
- Caption: A top-down state-transition graph with three fixed-point attractors and one \(2\)-cycle, shown in monochrome from Figure 1 of [LINK: Rafimanzelat -> `https://www.nature.com/articles/s41598-025-97684-y`]. This is a general Boolean-network example, not the state-transition digraph of the monomial system below. Licensed under [LINK: CC BY-NC-ND 4.0 -> `https://creativecommons.org/licenses/by-nc-nd/4.0/`]. [LINK: [1] -> `https://doi.org/10.1038/s41598-025-97684-y`]

## The question before the attractor

[H2]

The question before the attractor

[BODY PARAGRAPH]

Boolean networks grew from models in which genes are treated as binary on–off variables and recurrent states represent stable modes of behavior. [LINK: [3] -> `https://doi.org/10.1016/0022-5193(69)90015-0`] That viewpoint naturally emphasizes attractors. The transient—the orbit before an attractor is reached—answers a different question: how long can the initial condition or a perturbation remain visible?

[BODY PARAGRAPH]

A system on \(n\) Boolean variables has \(2^n\) states, whereas its dependency graph has only \(n\) vertices. The objective is to derive transient bounds from this smaller graph.

## Compressing the system into a graph

[H2]

Compressing the system into a graph

[BODY PARAGRAPH]

A state is a binary string \(\mathbf x=(x_1,\ldots,x_n)\). At each step, every coordinate is replaced by the product—equivalently, the logical AND—of a chosen set of current coordinates:

[CENTERED DISPLAY EQUATION]

\[
f_i(\mathbf x)=\prod_{j\in N_i}x_j.
\]

[BODY PARAGRAPH]

The empty product is \(1\). The state-transition digraph has one vertex for each binary string and one arrow \(\mathbf x\to f(\mathbf x)\) from every state.

[BODY PARAGRAPH]

The system also specifies a zero–one matrix \(A_f\): its \(ij\)-entry is \(1\) precisely when \(x_j\) occurs in \(f_i\). The dependency graph \(D_f\) has an edge \(j\to i\) in this case, so each arrow follows the influence of a variable on an updated coordinate. The matrix, the graph, and the coordinate rules therefore encode exactly the same dependency relationships.

[BODY PARAGRAPH]

Colón-Reyes, Laubenbacher, and Pareigis used this smaller graph to recognize systems whose periodic orbits are all fixed points. [LINK: [2] -> `https://arxiv.org/abs/math/0403166`] The present work takes the graph correspondence in a new direction: instead of asking only what the eventual cycles look like, it uses the correspondence to study the time spent before those cycles.

[SHORT BODY PARAGRAPH]

For example, consider

[CENTERED DISPLAY EQUATION]

\[
f(x_1,x_2,x_3,x_4)=(x_2,\,x_1x_3,\,x_4,\,x_2).
\]

[CENTERED DEPENDENCY FIGURE; approximately 22rem wide]

- Source: `assets/figures/busby-dynamics-fig-1.png`
- Alt text: Dependency graph of the Boolean monomial system f equals x 2, x 1 x 3, x 4, x 2.
- Caption label: Figure 2
- Caption: The dependency graph \(D_f\) for the displayed system, with each vertex labeled by its index. Adapted from Figure 1 of the [LINK: 2024 poster -> `assets/posters/2024_discrete_dynamical_systems_poster.pdf`].

## The bridge: iteration becomes walking

[VISUALIZER DEMONSTRATION — placed after the concrete second-iterate calculation in boolean-dynamics.html]

- Poster: `assets/demos/boolean-system-visualizer-poster.webp`.
- GIF: `assets/demos/boolean-system-visualizer.gif`.
- Caption: Figure 3. Dependency graph, phase space, and a longest transient for the displayed four-variable Boolean monomial system. The highlighted orbit reaches 0000 from 1110 after six updates; 0000 then maps to itself.
- Delivery: static poster on the page with a linked GIF, including for reduced-motion visitors.

[H2]

The bridge: iteration becomes walking

[BODY PARAGRAPH]

Starting from \(\mathbf x\), repeatedly applying \(f\) produces its orbit. Its transient length \(\tau_f(\mathbf x)\) is the number of steps before that orbit first reaches its eventual cycle. The longest transient in the system is

[CENTERED DISPLAY EQUATION]

\[
\tau_{\max}(f)=\max_{\mathbf x}\tau_f(\mathbf x).
\]

[BODY PARAGRAPH]

The variable \(x_j\) occurs in the \(i\)th coordinate of \(f^m\) precisely when \(D_f\) contains a directed walk of length \(m\) from \(j\) to \(i\). The same correspondence holds for monomial systems over arbitrary finite fields. [LINK: [4] -> `https://www.complex-systems.com/abstracts/v16_i04_a04/`]

## Organizing all possible walks

[H2]

Organizing all possible walks

[BODY PARAGRAPH]

Inside a strongly connected component, remove just enough edges to leave a maximal acyclic subdigraph \(H\). What remains in \(H\) records the one-way part of a walk. What was removed records the cycles that a walk may repeat.

[CENTERED SOURCE FIGURE]

- Source: `assets/figures/acyclic-reduction.svg`
- Alt text: An original directed graph followed by a right arrow and the same graph with selected edges removed, leaving an acyclic directed graph.
- Caption label: Figure 4
- Caption: Original digraph (left) → the same graph after selected edges are removed (right), leaving a maximal acyclic subdigraph. Redrawn from Figure 3 of the [LINK: 2024 poster -> `assets/posters/2024_discrete_dynamical_systems_poster.pdf`].

[SHADED RESULT BOX]

[UPPERCASE MUTED LABEL: Walk-length result — current work]

If the directed cycles have lengths \(c_1,\ldots,c_s\), then every relevant walk length has the form

[CENTERED DISPLAY EQUATION INSIDE RESULT BOX]

\[
|P|+q_1c_1+\cdots+q_sc_s,
\qquad q_1,\ldots,q_s\in\{0,1,2,\ldots\},
\]

where \(P\) is a path in \(H\). The path supplies a bounded offset; the cycles supply every repeatable contribution.

[BODY PARAGRAPH]

This is the useful normal form. It separates graph geometry from arithmetic: \(H\) controls the offsets, while the cycle lengths generate an additive semigroup. When their greatest common divisor is \(1\), the Frobenius number marks the last integer that cannot be assembled from those cycle lengths. [LINK: [5] -> `https://doi.org/10.1016/j.jnt.2016.05.027`]

## The payoff for transients

[H2]

The payoff for transients

[BODY PARAGRAPH]

The normal form identifies the two quantities that govern the delay: the diameter of the dependency graph, which limits the acyclic part, and the Frobenius number, which limits the gaps between attainable cyclic lengths. This yields lower and upper controls on the maximum transient without enumerating the full state space.

[SHADED RESULT BOX]

[UPPERCASE MUTED LABEL: Worked case]

For the example whose dependency graph is formed from cycles of lengths \(2\), \(3\), and \(5\), the diameter is \(7\) and the Frobenius number is \(1\). The method narrows the maximum transient to

[CENTERED DISPLAY EQUATION INSIDE RESULT BOX]

\[
9\leq \tau_{\max}(f)\leq15.
\]

[BODY PARAGRAPH]

A closed formula for arbitrary Boolean monomial systems remains open. The present bounds use paths, cycles, and walk lengths in the \(n\)-vertex dependency graph.

## References

[H2]

References

[NUMBERED REFERENCES; smaller text]

1. M. R. Rafimanzelat, “Global stabilization of Boolean networks with applications to biomolecular network control,” *Scientific Reports* 15 (2025), 15201. [LINK: Paper -> `https://www.nature.com/articles/s41598-025-97684-y`] · [LINK: DOI -> `https://doi.org/10.1038/s41598-025-97684-y`]

2. O. Colón-Reyes, R. Laubenbacher, and B. Pareigis, “Boolean monomial dynamical systems,” *Annals of Combinatorics* 8 (2004), 425–439. [LINK: Paper -> `https://arxiv.org/abs/math/0403166`] · [LINK: DOI -> `https://doi.org/10.1007/s00026-004-0230-6`]

3. S. A. Kauffman, “Metabolic stability and epigenesis in randomly constructed genetic nets,” *Journal of Theoretical Biology* 22 (1969), 437–467. [LINK: Paper -> `https://www.sciencedirect.com/science/article/pii/0022519369900150`] · [LINK: DOI -> `https://doi.org/10.1016/0022-5193(69)90015-0`]

4. O. Colón-Reyes, A. S. Jarrah, R. Laubenbacher, and B. Sturmfels, “Monomial dynamical systems over finite fields,” *Complex Systems* 16 (2006), 333–342. [LINK: Paper -> `https://www.complex-systems.com/abstracts/v16_i04_a04/`] · [LINK: DOI -> `https://doi.org/10.25088/ComplexSystems.16.4.333`]

5. A. Tripathi, “Formulae for the Frobenius number in three variables,” *Journal of Number Theory* 170 (2017), 368–389. [LINK: Paper -> `https://www.sciencedirect.com/science/article/pii/S0022314X16301743`] · [LINK: DOI -> `https://doi.org/10.1016/j.jnt.2016.05.027`]

[BOTTOM CROSS-PAGE NAVIGATION; separated from the article by a horizontal rule]

[LINK: Arithmetical Structures on Graphs -> `arithmetical-structures.html`]

---

## End of exported website copy

[SCOPE NOTE: This export now covers the homepage and both pages reached through its “Read more.” links. It does not transcribe the linked PDF manuscripts, posters, CV, external papers, or the separate email fallback page.]
