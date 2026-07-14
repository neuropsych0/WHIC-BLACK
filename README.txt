========================================================================
WHIC CORTICAL EXPLORER - ACADEMIC PORTAL DOCUMENTATION
========================================================================

Author: Bahar Sert
Audience: Research Staff, Lab Members, Graduate Instructors

This directory contains the source files for the "What's Happening in the Cortex" (WHIC) Cortical Explorer, a graduate-level interactive web portal for learning cortical organization across scales.

DIRECTORY STRUCTURE:
--------------------
- index.html          : Main HTML5 structure, navigation menus, and section wrappers.
- style.css           : Styling tokens, layout structures, visual rules for dark observatory theme.
- script.js           : Core routing logic, simulation code, and scientific databases.
- assets/             : Graphic resources.
  - whic_logo.svg     : Typography and vector cortical logo.
  - favicon.svg       : Tab icon cropped from logo mark.
  - models/           : Directory for GLB 3D models (e.g. real_anatomical_brain.glb).
- README.txt          : This instruction file.

========================================================================
1. HOW TO RUN
========================================================================
This is a static site with no node dependencies or compilation steps.
1. Open this project directory in VS Code.
2. If you do not have it, install the "Live Server" extension by Ritwick Dey.
3. Open "index.html".
4. Click the "Go Live" button in the status bar at the bottom-right of VS Code, or right-click "index.html" and select "Open with Live Server".
5. The site will launch in your default web browser (typically at http://127.0.5.1:5500/index.html).

========================================================================
2. EDITING SCIENTIFIC DATA
========================================================================
All scientific text, questions, connectivity probabilities, and biophysical properties are stored in editable JavaScript data structures located at the very top of `script.js`.

The following 12 key variables reside in `script.js` (lines 5-460 approximately):

1. `microPopulations` : Descriptions, neuron count, cell types, Izhikevich parameters, and anatomical profiles for the 6 canonical populations.
2. `microInputs`      : Parameters and descriptions for the 3 incoming thalamic/feedback drives.
3. `microConnections` : Synaptic weights, probabilities, receptors, plasticity rules, and notes for the 19 pathways in the SVG diagram.
4. `layerData`        : Anatomy, cells, and roles for the 6 neocortex layers (L1 to L6/White Matter).
5. `cellTypes`        : Morphological and biophysical data for cortical cells (Pyramidal, PV+, SST+, etc.).
6. `cortexRegions`    : Functional details, inputs/outputs, and hierarchies for the 6 brain map regions.
7. `predictionScenarios`: Signals (bottom-up, feedback, error) for the predictive coding simulation.
8. `zoomSteps`        : Scale metrics, titles, and explanations for the multiscale tour.
9. `quizQuestions`    : Array of 13 academic multiple choice questions.
10. `blogAuthors`     : Sample research staff profiles for the Q&A section.
11. `samplePosts`     : Seed articles for the blog.
12. `puzzleSteps`     : Steps and correct texts for the signal flow puzzle.

========================================================================
3. EDITING QUIZ QUESTIONS
========================================================================
To add or modify quiz questions, open `script.js` and locate the `quizQuestions` array. Add a new object following this format:

{
  question: "14. Your Question Title Goes Here...",
  options: [
    "Option A description",
    "Option B description",
    "Option C description",
    "Option D description"
  ],
  answer: 2, // 0-indexed index of correct option (2 = Option C)
  explanation: "Rigorous scientific explanation using HTML tag notation if needed."
}

The quiz engine automatically updates the progress indicators, score counters, and evaluation metrics.

========================================================================
4. HOW TO REPLACE IMAGES & LOGO
========================================================================
- Logo: The header, footer, and favicon use vector SVG resources in the `assets/` directory. To replace the logo, overwrite the SVG file at `assets/whic_logo.svg` preserving the dimensions. The header logo is rendered small, while the footer renders it larger.
- Favicon: Overwrite `assets/favicon.svg` with your custom vector mark.
- Layout Images: All diagrams (e.g. the Canonical Microcircuit and Cortex Map) are built using inline SVGs inside `index.html` to enable crisp scaling, CSS-based active coloring, and precise hover highlights.

========================================================================
5. HOW TO REPLACE 3D MODELS
========================================================================
The multiscale tour (Scale 1: Brain) and the Cortex Map make references to the following 3D models:
- `assets/models/real_anatomical_brain.glb`
- `assets/models/cortex_regions_brain.glb`
- `assets/models/cortex_patch.glb`
- `assets/models/layer_slab.glb`
- `assets/models/canonical_microcircuit.glb`
- `assets/models/cortical_column.glb`
- `assets/models/neuron_morphology.glb`
- `assets/models/synapse_ultrastructure.glb`

By default, the site references these assets. If they are not present, the page automatically switches to high-quality HTML5 canvas animation fallbacks, ensuring functional stability. To display real 3D models, place the corresponding GLTF/GLB files in the `assets/models/` directory matching the names above. The `<model-viewer>` library will automatically load and initialize them with camera controls and auto-rotation.
