/* ==========================================================================
   WHIC CORTICAL EXPLORER - CORE JAVASCRIPT
   ========================================================================== */

/* ==========================================================================
   1. EDITABLE SCIENTIFIC DATA OBJECTS (At the top of script.js)
   ========================================================================== */

const microPopulations = {
  L13_exc: {
    name: "Layer II/III Excitatory Pyramidal Neurons",
    layer: "Supragranular (L1-L3)",
    cellType: "Pyramidal",
    neuronCount: 50,
    model: "Izhikevich regular spiking (a=0.02, b=0.2, c=-65, d=8)",
    anatomy: "L2/3 Pyramidal cells with apical dendrites extending to L1 and basal dendrites in L2/3. Axons project locally and to higher cortical areas.",
    circuitRole: "Serves as the primary source of cortico-cortical forward projections. Integrates local lateral inputs and top-down feedback terminating in L1.",
    computationalRole: "Performs feature integration, prediction-error routing, and lateral competitive inhibition via SST/PV recruitment.",
    assumptions: "Represented as a homogeneous population with uniform threshold potentials and passive somatic parameters.",
    caveats: "Subpopulations exist (e.g., L2 vs L3 cells show different projection patterns; some L3 cells are highly specialized for motor vs sensory inputs).",
    keyPoints: [
      "Targeted by L4 feedforward input and top-down feedback.",
      "Projects to L5/6 excitatory neurons and local inhibitory populations.",
      "Subject to strong feedback inhibition from SST+ and PV+ interneurons."
    ]
  },
  L13_inh: {
    name: "Layer II/III Inhibitory Interneurons",
    layer: "Supragranular (L1-L3)",
    cellType: "SST+ / PV+ / VIP+ interneurons",
    neuronCount: 50,
    model: "Izhikevich fast spiking (a=0.1, b=0.2, c=-65, d=2)",
    anatomy: "Diverse morphology including basket cells (PV+) targeting soma, and Martinotti cells (SST+) targeting L1 apical dendrites.",
    circuitRole: "Provides local feedback and feedforward inhibition to L2/3 pyramidal cells, regulating supragranular excitability.",
    computationalRole: "Enforces E/I balance, performs gain modulation, and mediates top-down feedback disinhibition via VIP-to-SST pathways.",
    assumptions: "Represented as a lumped inhibitory pool with fast-spiking dynamics to simplify local microcircuit interactions.",
    caveats: "Ignores the distinct morphological and functional roles of PV+, SST+, and VIP+ interneurons, which have opposing effects on dendritic vs somatic compartments.",
    keyPoints: [
      "Recruits feedback inhibition to stabilize local recurrence.",
      "Undergoes disinhibition during top-down attentional modulation.",
      "Gates vertical flow from granular to supragranular layers."
    ]
  },
  L4_exc: {
    name: "Layer IV Excitatory Granular / Spiny Stellate Cells",
    layer: "Granular (L4)",
    cellType: "Spiny Stellate / Pyramidal",
    neuronCount: 50,
    model: "Izhikevich regular spiking (a=0.02, b=0.2, c=-65, d=8)",
    anatomy: "Small stellate cells with symmetrical dendritic trees confined to L4. Axons project vertically to L2/3.",
    circuitRole: "Receives primary thalamocortical feedforward inputs. Translates sensory signals to laminar streams.",
    computationalRole: "Acts as a high-fidelity amplifier of sensory drives, performing initial feature extraction and signal gating.",
    assumptions: "Thalamic drive modeled as a Poisson process arriving directly at somatic receptors.",
    caveats: "Primary motor cortex (M1) lacks a distinct L4, illustrating that this population is region-dependent.",
    keyPoints: [
      "Recipient of feedforward thalamic afferents.",
      "Strong projection to L2/3 excitatory neurons (FF flow).",
      "Gated by local fast-spiking PV+ basket cells."
    ]
  },
  L4_inh: {
    name: "Layer IV Inhibitory Interneurons",
    layer: "Granular (L4)",
    cellType: "PV+ Basket Cells",
    neuronCount: 50,
    model: "Izhikevich fast spiking (a=0.1, b=0.2, c=-65, d=2)",
    anatomy: "Multipolar basket cells with dense local axonal arborization targeting somas of nearby L4 excitatory cells.",
    circuitRole: "Generates feedforward inhibition in response to thalamocortical inputs, defining a narrow window for integration.",
    computationalRole: "Acts as a temporal gatekeeper, ensuring high-frequency spikes are resolved with sub-millisecond precision.",
    assumptions: "Exclusively fast-spiking PV+ dynamics; ignores low-threshold spiking (LTS) populations in L4.",
    caveats: "Some L4 interneurons also target supragranular layers, creating interlaminar inhibitory channels.",
    keyPoints: [
      "Activated rapidly by thalamic inputs.",
      "Provides strong feedforward shunt inhibition to L4 excitatory cells.",
      "Crucial for establishing sensory tuning curves and temporal fidelity."
    ]
  },
  L56_exc: {
    name: "Layer V/VI Excitatory Pyramidal Neurons",
    layer: "Infragranular (L5-L6)",
    cellType: "Thick-Tufted Pyramidal / Corticothalamic",
    neuronCount: 50,
    model: "Izhikevich bursting / regular spiking (a=0.02, b=0.2, c=-50, d=2)",
    anatomy: "Large pyramidal cells (especially in L5) with thick apical dendrites reaching L1. Axons project to subcortical motor centers, striatum, and thalamus.",
    circuitRole: "Serves as the primary output hub of the cortical column. Integrates top-down feedback (L1 apical) and local feedforward (basal).",
    computationalRole: "Computes motor commands, generates long-range feedback, and coordinates corticothalamic loops.",
    assumptions: "Lumped L5 and L6 populations into a single node, ignoring separation of subcortical outputs (L5) from thalamic feedback (L6).",
    caveats: "L5 and L6 have distinct biophysics: L5 Pyramidal cells are prone to dendritic calcium spikes and bursting, while L6 cells are highly regular.",
    keyPoints: [
      "Main output layer of the cortical column projecting to subcortical structures.",
      "Integrates signals across all layers via massive vertical dendrites.",
      "Sends recurrent excitatory feedback to L4 interneurons."
    ]
  },
  L56_inh: {
    name: "Layer V/VI Inhibitory Interneurons",
    layer: "Infragranular (L5-L6)",
    cellType: "Basket / Martinotti / Somatostatin+",
    neuronCount: 50,
    model: "Izhikevich fast spiking (a=0.1, b=0.2, c=-65, d=2)",
    anatomy: "Diverse populations of basket and Martinotti interneurons spanning L5 and L6.",
    circuitRole: "Controls output gain of deep layer projection neurons and regulates feedback signals from lower layers.",
    computationalRole: "Stabilizes deep-layer recurrent networks and gates motor outputs and corticothalamic loops.",
    assumptions: "Aggregated inhibitory pool; does not differentiate somatic basket cells from dendritic-targeting Martinotti cells.",
    caveats: "Subject to differential neuromodulation (e.g., acetylcholine targets L5 interneurons differently than L2/3 ones).",
    keyPoints: [
      "Regulates the firing rate of subcortical projection neurons.",
      "Coordinates with infragranular excitatory cells to maintain local E/I balance.",
      "Limits runaway recurrent excitation in output layers."
    ]
  }
};

const microInputs = {
  feedforward_input_L4: {
    name: "Feedforward Sensory Input",
    target: "L4_exc",
    type: "Thalamocortical Afferents",
    backgroundRate: "10 Hz",
    pulseRate: "100 Hz",
    duration: "50 ms",
    description: "Represents incoming sensory signals (e.g., auditory tones, visual stimuli) routed through thalamic relay nuclei (like the LGN or MGB). Arrives primarily on L4 excitatory spiny stellate cells."
  },
  feedback_input_L13: {
    name: "Top-Down Feedback Template",
    target: "L13_exc & L13_inh",
    type: "Cortico-Cortical Feedback",
    backgroundRate: "10 Hz",
    pulseRate: "100 Hz",
    duration: "50 ms",
    description: "Carries top-down contextual expectations, attention, or predictive templates originating from higher-order cortical areas (e.g., frontal eye fields, association areas). Projects into Layer 1, targeting L2/3 pyramidal dendrites."
  },
  feedback_input_L56: {
    name: "Top-Down Feedback Modulation",
    target: "L56_exc & L56_inh",
    type: "Modulatory Feedback",
    backgroundRate: "10 Hz",
    pulseRate: "100 Hz",
    duration: "50 ms",
    description: "Represents contextual/modulatory signals projecting into deep layers. Biased toward recruiting local infragranular inhibition to gate motor or corticothalamic projection commands."
  }
};

const microConnections = [
  // Within-layer E/I (grey)
  { source: "L13_exc", target: "L13_inh", sign: "Exc (+)", class: "grey", probability: 1.0, weight: "25 nS", plasticity: "STDP (active)", mechanism: "AMPA/NMDA receptor mediated depolarisation", meaning: "Recruits local feedback inhibition to prevent run-away supragranular excitation.", assumptions: "High connection probability to ensure fast local feedback.", caveats: "Assumed isotropic local distribution; ignores cell distance.", keyPoints: ["Establishes supragranular E/I balance", "Requires fast AMPA kinetics", "Vulnerable to STDP shifts"] },
  { source: "L13_inh", target: "L13_exc", sign: "Inh (-)", class: "grey", probability: 1.0, weight: "10 nS", plasticity: "Fixed", mechanism: "GABA-A receptor mediated hyperpolarisation", meaning: "Suppresses pyramidal cells to enforce sparse coding and control gain.", assumptions: "Lumped GABAergic feedback; ignores GABA-B slow currents.", caveats: "GABA-B receptors exist and alter long-term temporal dynamics.", keyPoints: ["Limits pyramidal firing rates", "Enforces sparse coding representations", "Shunts somatic membrane potentials"] },
  { source: "L4_exc", target: "L4_inh", sign: "Exc (+)", class: "grey", probability: 1.0, weight: "25 nS", plasticity: "STDP (active)", mechanism: "AMPA/NMDA receptor activation", meaning: "Triggers rapid feedforward inhibition to narrow the temporal integration window of sensory inputs.", assumptions: "Direct local connections.", caveats: "Dendritic targeting variations are simplified.", keyPoints: ["Enables temporal gating", "Limits window of sensory input integration", "Protects granular layer from saturation"] },
  { source: "L4_inh", target: "L4_exc", sign: "Inh (-)", class: "grey", probability: 1.0, weight: "10 nS", plasticity: "Fixed", mechanism: "GABA-A shunting", meaning: "Blocks weak sensory signals; gates only inputs that are sufficiently strong or synchronized.", assumptions: "Fast-spiking PV basket shunting.", caveats: "Ignores spatial arrangement of basket terminals.", keyPoints: ["Implements input thresholding", "Gates thalamocortical inputs", "Underpins feature selectivity tuning"] },
  { source: "L56_exc", target: "L56_inh", sign: "Exc (+)", class: "grey", probability: 1.0, weight: "25 nS", plasticity: "STDP (active)", mechanism: "AMPA/NMDA receptor activation", meaning: "Recruits feedback inhibition to stabilize motor and corticothalamic projection outputs.", assumptions: "Standard local E-to-I projection.", caveats: "Aggregates L5 and L6 micro-circuitry.", keyPoints: ["Prevents output runaway spikes", "Regulates motor command rates", "Stabilizes subcortical projection hubs"] },
  { source: "L56_inh", target: "L56_exc", sign: "Inh (-)", class: "grey", probability: 1.0, weight: "10 nS", plasticity: "Fixed", mechanism: "GABA-A hyperpolarisation", meaning: "Provides output gain control; filters noisy deep-layer signals.", assumptions: "Tuned somatic inhibition.", caveats: "Martinotti cell dendritic inhibition is neglected.", keyPoints: ["Gain controller for deep output", "Dampens irrelevant motor signals", "Coordinates corticothalamic loops"] },

  // Interlaminar excitatory (green)
  { source: "L13_exc", target: "L56_exc", sign: "Exc (+)", class: "green", probability: 0.25, weight: "5 nS", plasticity: "STDP (active)", mechanism: "AMPA/NMDA receptor activation", meaning: "Routes processed supragranular feature representations to deep output layers.", assumptions: "Vertical column alignment.", caveats: "A portion of this projection also targets L5 inhibitory cells.", keyPoints: ["Vertical signal flow motif", "Links representation to output", "Influenced by learning via STDP"] },
  { source: "L4_exc", target: "L56_exc", sign: "Exc (+)", class: "green", probability: 0.25, weight: "5 nS", plasticity: "STDP (active)", mechanism: "AMPA/NMDA receptor activation", meaning: "Direct shortcut route for sensory drives to reach output layers before detailed supragranular processing.", assumptions: "Direct translaminar projection.", caveats: "Weak compared to L4-to-L2/3 projections.", keyPoints: ["Fast sensory-motor bypass", "Drives initial deep layer depolarisation", "Lower probability than L4-to-L1/3"] },
  { source: "L56_exc", target: "L4_inh", sign: "Exc (+)", class: "green", probability: 0.25, weight: "5 nS", plasticity: "STDP (active)", mechanism: "AMPA/NMDA activation", meaning: "Recurrent excitatory feedback to granular inhibitory gating. Coordinates oscillations and suppresses further input.", assumptions: "Feedback gating mechanism.", caveats: "Highly controversial; connectivity varies by area.", keyPoints: ["Mediates gain control loop", "Links output to input gating", "Maintains oscillatory rhythms"] },
  { source: "L56_exc", target: "L4_exc", sign: "Exc (+)", class: "green", probability: 0.0625, weight: "5 nS", plasticity: "STDP (active)", mechanism: "AMPA/NMDA activation", meaning: "Weak excitatory feedback to L4, providing a gain modulator or predictive template.", assumptions: "Sparse feedback projection.", caveats: "Very low probability in primary sensory regions.", keyPoints: ["Provides weak local recurrence", "Modulates incoming sensory gain", "Low synaptic weight"] },

  // NEW feedforward (orange)
  { source: "L4_exc", target: "L13_exc", sign: "Exc (+)", class: "orange", probability: 0.25, weight: "25 nS", plasticity: "STDP (active)", mechanism: "AMPA/NMDA activation", meaning: "The primary feedforward sensory highway, transmitting thalamic signals from L4 to supragranular layers.", assumptions: "High efficacy projection.", caveats: "Exhibits strong short-term depression during high-frequency stimulation.", keyPoints: ["Core feedforward sensory driver", "Primary vertical information link", "Highly susceptible to synaptic plasticity"] },

  // NEW recurrent E->E (red)
  { source: "L13_exc", target: "L13_exc", sign: "Exc (+)", class: "red", probability: 0.1, weight: "5 nS", plasticity: "STDP (active)", mechanism: "AMPA/NMDA activation", meaning: "Enables local recurrent processing, memory retention, and amplification of weak signals.", assumptions: "Sparse recurrence (p=0.1) prevents runaway excitation.", caveats: "Requires strong inhibition to remain stable; susceptible to seizure-like dynamics if unbalanced.", keyPoints: ["Mediates local working memory", "Allows signal amplification", "Requires PV+ stabilization"] },
  { source: "L4_exc", target: "L4_exc", sign: "Exc (+)", class: "red", probability: 0.1, weight: "5 nS", plasticity: "STDP (active)", mechanism: "AMPA/NMDA activation", meaning: "Local amplification of sensory signals in L4.", assumptions: "Very low probability.", caveats: "Most L4 cells are spiny stellate cells with sparse mutual connections.", keyPoints: ["Amplifies weak sensory drives", "Coordinates granular assemblies", "Saturated quickly if gated"] },
  { source: "L56_exc", target: "L56_exc", sign: "Exc (+)", class: "red", probability: 0.1, weight: "5 nS", plasticity: "STDP (active)", mechanism: "AMPA/NMDA activation", meaning: "Recurrent looping within deep layers to generate continuous output and oscillatory rhythms.", assumptions: "L5-to-L5 recurrent connections are thick-tufted pyramidal nodes.", caveats: "Differs between L5 (strong recurrence) and L6 (weak recurrence).", keyPoints: ["Generates intrinsic oscillations", "Sustains command outputs", "Prone to epileptic recruitment if uninhibited"] },

  // Poisson input projections (dashed amber)
  { source: "feedforward_input_L4", target: "L4_exc", sign: "Exc (+)", class: "amber", probability: 0.8, weight: "20 nS (driver)", plasticity: "Fixed", mechanism: "Thalamocortical AMPA projections", meaning: "Primary sensory input driving the cortical column.", assumptions: "High connection probability (p=0.8).", caveats: "Ignores thalamocortical short-term depression.", keyPoints: ["Sensory driver input", "High probability projection", "Unaffected by STDP"] },
  { source: "feedback_input_L13", target: "L13_exc", sign: "Exc (+)", class: "amber", probability: 0.5, weight: "10 nS (modulator)", plasticity: "Fixed", mechanism: "Distal dendritic AMPA activation", meaning: "Top-down predictive inputs modulate supragranular representation.", assumptions: "Terminates on distal dendrites in L1.", caveats: "Modulated heavily by local neuromodulators.", keyPoints: ["Carries predictive templates", "Terminates on apical dendrites", "Exerts soft gain modulation"] },
  { source: "feedback_input_L13", target: "L13_inh", sign: "Exc (+)", class: "amber", probability: 0.7, weight: "12 nS (modulator)", plasticity: "Fixed", mechanism: "AMPA activation on interneurons", meaning: "Feedback template target biased toward local inhibition, allowing prediction errors to be shunted.", assumptions: "Feedback target biased toward inhibition.", caveats: "Requires specific interneuron subtypes (SST/VIP).", keyPoints: ["Enables prediction error shunting", "Biased target projection", "Coordinates local gain control"] },
  { source: "feedback_input_L56", target: "L56_exc", sign: "Exc (+)", class: "amber", probability: 0.4, weight: "10 nS (modulator)", plasticity: "Fixed", mechanism: "Infragranular dendritic activation", meaning: "Modulates infragranular command output.", assumptions: "Cortico-cortical feedback.", caveats: "Interacts with thalamocortical matrix projections.", keyPoints: ["Modulates command commands", "Lower probability projection", "Aids output gating"] },
  { source: "feedback_input_L56", target: "L56_inh", sign: "Exc (+)", class: "amber", probability: 0.8, weight: "15 nS (driver)", plasticity: "Fixed", mechanism: "Direct activation of deep interneurons", meaning: "Feedback heavily drives infragranular inhibition to gate output flow.", assumptions: "Strong inhibitory bias to stabilize output.", caveats: "Can suppress motor command execution.", keyPoints: ["Gates motor/corticothalamic outputs", "Strong inhibitory drive bias", "Stabilizes deep loop outputs"] }
];

const layerData = {
  L1: {
    title: "Layer I: Molecular Layer",
    cellTypes: "Almost devoid of cell bodies. Contains sparse GABAergic interneurons (e.g., Neurogliaform cells, Canopy cells) and Cajal-Retzius cells (in development).",
    inputs: "Receives dense long-range feedback from higher cortical areas, matrix thalamic nuclei (non-specific thalamus), and neuromodulatory projections (noradrenaline, acetylcholine).",
    outputs: "No projection neurons. Houses the apical dendritic tufts of L2/3 and L5 pyramidal cells, allowing inputs to modulate cells in lower layers.",
    computationalRole: "Serves as an integration hub for top-down contextual signals. Neurogliaform cells provide slow, volume-transmitted GABA-B inhibition to gate apical dendrite inputs.",
    caveats: "Often ignored in computational models, yet accounts for ~10% of cortical synaptic volume."
  },
  L23: {
    title: "Layer II/III: External Granular & Pyramidal",
    cellTypes: "Pyramidal neurons (small to medium), PV+ basket cells, SST+ Martinotti cells, and VIP+ interneurons.",
    inputs: "Receives feedforward vertical projections from L4, local horizontal recurrent connections, and top-down inputs terminating in L1 (on apical dendrites).",
    outputs: "Sends long-range feedforward projections to higher cortical regions (cortico-cortical) and lateral connections within the same area.",
    computationalRole: "Performs feature extraction, matches feedback models with feedforward data, and routes prediction errors upward in the processing hierarchy.",
    caveats: "Often treated as a single layer (L2/3), but L2 is more densely packed with smaller cells and receives more localized feedback than L3."
  },
  L4: {
    title: "Layer IV: Internal Granular",
    cellTypes: "Spiny stellate cells (excitatory, lack apical dendrites), star pyramidal cells, and PV+ basket cells (fast-spiking).",
    inputs: "Primary target of core thalamocortical projection fibers carrying high-fidelity sensory inputs (from LGN, MGN, VPM).",
    outputs: "Sends strong, highly targeted vertical projections to Layer II/III (feedforward pathway).",
    computationalRole: "Initial cortical processing node for sensory streams. Fast-spiking PV+ cells establish feedforward shunting inhibition, gating sensory inputs based on timing and synchronization.",
    caveats: "Virtually absent in agranular cortex, such as the primary motor cortex (M1), where primary thalamic drives instead terminate directly on L5 dendrites."
  },
  L5: {
    title: "Layer V: External/Internal Pyramidal",
    cellTypes: "Thick-tufted pyramidal cells (L5b, bursting), slender-tufted pyramidal cells (L5a, regular spiking), and diverse interneurons.",
    inputs: "Receives inputs from L2/3 pyramidal axons, L4, and direct feedback inputs in L1 (via long apical dendrites).",
    outputs: "Projects to subcortical structures (spinal cord, brainstem, superior colliculus, striatum, and non-specific thalamus).",
    computationalRole: "The primary motor output layer. Thick-tufted L5b cells are electrotonically complex, acting as coincidence detectors: simultaneous inputs to somatic (L5) and apical (L1) compartments trigger bursting.",
    caveats: "L5 neurons exhibit extreme morphological and functional diversity; lumped models fail to capture the division between subcortical and cortico-cortical L5 projection channels."
  },
  L6: {
    title: "Layer VI: Multiform Layer",
    cellTypes: "Multiform / spindle-like neurons, corticothalamic projection neurons, and local interneurons.",
    inputs: "Receives inputs from deep layers, local feedback, and thalamocortical collaterals.",
    outputs: "Projects heavily back to specific thalamic relay nuclei (corticothalamic feedback loops), modulating incoming sensory gates.",
    computationalRole: "Controls sensory gain via closed-loop feedback to the thalamus. Integrates vertical columns with horizontal thalamic gates.",
    caveats: "Hardest layer to record from in vivo due to depth and dense packaging."
  },
  WM: {
    title: "White Matter: Myelinated Axon Tracts",
    cellTypes: "Glial cells (oligodendrocytes, astrocytes, microglia) and myelinated axons. Lacks neuronal cell bodies (except sparse interstitial neurons).",
    inputs: "Axons exiting the cortical layers.",
    outputs: "Axons entering distant cortical or subcortical targets.",
    computationalRole: "The macro-connectivity infrastructure. Myelinated fibers speed up long-range signal propagation (up to 50 m/s), enabling rapid hemispheric and inter-areal communication.",
    caveats: "Vulnerable to demyelinating diseases which slow transmission speeds, disrupting the temporal synchronization required for binding and conscious perception."
  }
};

const cellTypes = [
  {
    name: "Pyramidal Neurons",
    id: "pyramidal",
    identity: "Excitatory (+)",
    morphology: "Pyramid-shaped soma, single large apical dendrite pointing toward L1, multiple basal dendrites branching horizontally, and a long axon projecting vertically.",
    distribution: "Highly abundant (~75-80% of all cortical cells). Situated in Layers II, III, V, and VI.",
    projectionRole: "Projection neurons. Axons leave the local column to target other cortical columns, hemispheres, or subcortical nuclei.",
    computationalRole: "Acts as the primary computational processor. Integrates sensory feedforward signals (basal) with contextual top-down predictions (apical). Generates coincidence-detection bursts.",
    caveats: "Assumed to be a single class, but thick-tufted L5b project subcortically while slender-tufted L5a project to other cortical sites."
  },
  {
    name: "Spiny Stellate Cells",
    id: "stellate",
    identity: "Excitatory (+)",
    morphology: "Small, star-like symmetrical dendritic arbors radiating in all directions. Lacks an apical dendrite, restricting input integration to the local layer.",
    distribution: "Confined strictly to the input layer, Layer IV.",
    projectionRole: "Local interneuron. Axons project vertically to target L2/3 pyramidal cells, staying within the cortical column.",
    computationalRole: "Initial sensory amplifier. Receives direct thalamocortical inputs and distributes them to supragranular layers.",
    caveats: "In some species/areas, star pyramidal cells (transition state) are more common than true spiny stellate cells."
  },
  {
    name: "Parvalbumin-Positive (PV+) Basket Cells",
    id: "pv_basket",
    identity: "Inhibitory (-)",
    morphology: "Multipolar soma with local axonal arbors wrapping around the soma and proximal dendrites of nearby pyramidal cells (basket-like).",
    distribution: "Found across layers, heavily concentrated in L4 and L2/3.",
    projectionRole: "Local interneuron (interareal projection does not exist).",
    computationalRole: "Generates fast-spiking, high-frequency, shunting inhibition. Critical for feedforward inhibition, establishing spike timing, and driving gamma oscillations.",
    caveats: "Also includes Chandelier cells which target the axon initial segment (AIS), exerting absolute veto control."
  },
  {
    name: "Somatostatin-Positive (SST+) Martinotti Cells",
    id: "sst_martinotti",
    identity: "Inhibitory (-)",
    morphology: "Ovoid soma. Axon ascends vertically, branching extensively in Layer I, targeting the distal apical dendrites of pyramidal cells.",
    distribution: "Concentrated in L5/6 and L2/3.",
    projectionRole: "Local interneuron, projecting vertically across layers.",
    computationalRole: "Provides feedback inhibition on apical dendrites. Gating mechanism for top-down feedback. Protects pyramidal cells from runaway dendritic calcium spikes.",
    caveats: "Activated slowly compared to PV+ cells; acts as a slow integrator of local network activity rather than a fast gate."
  },
  {
    name: "VIP / Htr3a Interneurons",
    id: "vip_htr3a",
    identity: "Inhibitory (-)",
    morphology: "Bipolar or bitufts, with narrow vertical axonal arbors.",
    distribution: "Mostly concentrated in supragranular layers (L1-3).",
    projectionRole: "Local interneuron.",
    computationalRole: "Disinhibits the column by targeting SST+ and PV+ interneurons. Under top-down attention or neuromodulatory drive, VIP cells fire, silencing SST cells and freeing pyramidal dendrites to integrate inputs.",
    caveats: "Only active during high attentional states; under passive conditions, their baseline firing rate is very low."
  }
];

const cortexRegions = {
  prefrontal: {
    name: "Prefrontal Cortex (PFC)",
    function: "Executive control, working memory, decision-making, planning, and goal-directed behavior.",
    inputs: "Association areas, mediodorsal thalamus, amygdala, hippocampus, dopaminergic midbrain.",
    outputs: "Motor areas, basal ganglia, thalamus, neuromodulatory centers.",
    hierarchy: "Top of the cortical hierarchy. High ratio of feedforward-to-feedback projections.",
    caveats: "Anatomically heterogeneous; boundaries between granular, dysgranular, and agranular PFC are highly debated in primates."
  },
  motor: {
    name: "Motor / Premotor Cortex (M1/PM)",
    function: "Planning, initiating, and executing voluntary movements. Coordinates spinal motor pools.",
    inputs: "Somatosensory cortex, cerebellum, basal ganglia (via VL thalamus), prefrontal cortex.",
    outputs: "Spinal cord (corticospinal tract), striatum, red nucleus, reticular formation, thalamus.",
    hierarchy: "Lower-middle hierarchy. Agranular structure (lacks a distinct Layer IV).",
    caveats: "Primary motor cortex is heavily agranular; computational models of M1 must bypass classical L4 thalamic gating models."
  },
  somatosensory: {
    name: "Somatosensory Cortex (S1)",
    function: "Initial processing of tactile inputs, temperature, nociception (pain), and proprioception.",
    inputs: "VPL/VPM thalamus (receiving signals from peripheral receptors), secondary somatosensory areas.",
    outputs: "Motor cortex, posterior parietal cortex, secondary somatosensory areas.",
    hierarchy: "Low hierarchy (primary sensory cortex). Strong Layer IV receiving thalamic inputs.",
    caveats: "Arranged in somatotopic maps (homunculus); maps reorganize dynamically following peripheral injury."
  },
  auditory: {
    name: "Auditory Cortex (A1)",
    function: "Processing of sound frequency, amplitude, spatial localization, and complex auditory patterns.",
    inputs: "Medial geniculate body (MGB) of the thalamus, contralateral auditory cortex.",
    outputs: "Temporoparietal association areas, inferior colliculus, amygdala, secondary auditory areas.",
    hierarchy: "Low hierarchy. Highly tonotopic organization (arranged by frequency).",
    caveats: "Subcortical structures (inferior colliculus) perform substantial processing before signals ever reach A1."
  },
  association: {
    name: "Posterior Association Areas (Parieto-Occipito-Temporal)",
    function: "Multisensory integration, spatial navigation, language processing (Wernicke's area), and visual attention.",
    inputs: "Primary sensory cortices (visual, auditory, somatosensory), pulvinar thalamus.",
    outputs: "Prefrontal cortex, motor structures, limbic system.",
    hierarchy: "High-middle hierarchy. Blends inputs from multiple sensory modalities into unified spatial frames.",
    caveats: "Boundaries are highly diffuse and vary substantially between individuals."
  },
  visual: {
    name: "Visual Cortex (V1)",
    function: "Primary visual processing: detects orientation, spatial frequency, color, contrast, and basic motion.",
    inputs: "Lateral geniculate nucleus (LGN) of the thalamus.",
    outputs: "V2, V3, MT/V5, V4 (split into dorsal and ventral processing streams).",
    hierarchy: "Lowest visual hierarchy. High concentration of spiny stellate neurons in L4.",
    caveats: "Includes specialized ocular dominance columns and orientation blobs, showing nested micro-organization."
  }
};

const predictionScenarios = {
  expected: {
    title: "Expected Input Scenario",
    subtitle: "Sensory input matches top-down predictions.",
    bottomUp: 0.8,
    feedback: 0.8,
    gating: 0.8,
    error: 0.08,
    description: "In predictive coding, higher cortical areas send a top-down template (e.g., 'expect a click sound'). This matches the incoming sensory drive from the thalamus. Local inhibitory interneurons (feedback-driven) gate the sensory inputs. Since expectation matches reality, the inputs are shunted. Supragranular pyramidal cells report a negligible prediction error, conserving metabolic energy and avoiding unnecessary updates to the global system.",
    computationalNotes: "Active suppression of expected inputs is the core mechanism of sensory attenuation, explaining why you cannot easily tickle yourself."
  },
  unexpected: {
    title: "Unexpected Deviation / Mismatch",
    subtitle: "Sensory input arrives without a matching prediction.",
    bottomUp: 0.9,
    feedback: 0.1,
    gating: 0.2,
    error: 0.85,
    description: "A strong sensory signal arrives (e.g., a sudden loud bang), but there is no top-down prediction. Gating feedback is minimal, leaving the incoming drive un-shunted. Supragranular pyramidal cells are strongly depolarized, generating a massive prediction error signal. This error propagates up the cortical hierarchy to update expectations and recruit global attention.",
    computationalNotes: "Prediction error is defined mathematically as \(E_{pred} = I_{sensory} - I_{prediction}\). Large mismatches drive synaptic plasticity (learning)."
  },
  ambiguous: {
    title: "Ambiguous / Noisy Input",
    subtitle: "Sensory signal is faint or degraded; prediction is high.",
    bottomUp: 0.2,
    feedback: 0.9,
    gating: 0.5,
    error: 0.35,
    description: "The sensory input is weak or noisy (e.g., whispering in a crowded room), but top-down predictions are strong. The system balances feedforward and feedback drives, but the prediction bias dominates. The error signal is moderate, reflecting the effort to align the sensory data with the predictive template.",
    computationalNotes: "Noisy environments shift processing toward top-down templates, occasionally causing hallucinations where expectations overwrite sensory reality."
  }
};

const zoomSteps = [
  {
    name: "Organism-Level Brain",
    metrics: "Scale: 150 mm &bull; Macro Anatomy",
    title: "The Neocortex",
    body: "The human neocortex is a 2-4 mm thick sheet of neural tissue covering the cerebral hemispheres. Folded into gyri and sulci, it houses approximately 16 billion neurons and coordinates sensory perception, motor control, and abstract cognitive reasoning.",
    modelFile: "assets/models/real_anatomical_brain.glb",
    size: "150 mm"
  },
  {
    name: "Cortical Ribbon",
    metrics: "Scale: 10 mm &bull; Tissue Slice",
    title: "Cortical Ribbon",
    body: "Viewing a cross-section of the cortex reveals the gray matter (neuronal soma and dendrites) sitting above the myelinated axon tracts of the white matter. In Nissl staining, the relative density of cell bodies highlights the layered structural organization.",
    modelFile: "assets/models/cortex_patch.glb",
    size: "10 mm"
  },
  {
    name: "Laminar Banding",
    metrics: "Scale: 2 mm &bull; Histology Layers",
    title: "Laminar Banding",
    body: "Zooming into the gray matter reveals the distinct six histological layers (I-VI). Layers are defined by the size, density, and morphology of their resident cell bodies, forming the functional foundation of feedforward (L4) and feedback (L1/5/6) segregation.",
    modelFile: "assets/models/layer_slab.glb",
    size: "2 mm"
  },
  {
    name: "Cortical Column",
    metrics: "Scale: 500 &mu;m &bull; Local Column",
    title: "Cortical Column",
    body: "The cortical column is a vertical cylinder of neurons (~300-500 micrometers in diameter) extending from Layer I to VI. Cells within a column share similar receptive fields and process coordinates collectively (e.g., orientation columns in V1).",
    modelFile: "assets/models/cortical_column.glb",
    size: "500 \u03bcm"
  },
  {
    name: "Canonical Microcircuit",
    metrics: "Scale: 100 &mu;m &bull; Synaptic Wiring",
    title: "Canonical Microcircuit",
    body: "Within a column, neurons are wired into a stereotypical microcircuit. Signals enter Layer 4, propagate to Layers 2/3 for local processing and comparison with predictions, and exit via Layer 5/6 to subcortical sites and thalamic gates.",
    modelFile: "assets/models/canonical_microcircuit.glb",
    size: "100 \u03bcm"
  },
  {
    name: "Pyramidal Neuron",
    metrics: "Scale: 20 &mu;m &bull; Cellular Morphology",
    title: "Pyramidal Neuron",
    body: "The workhorse of the cortex. Apical dendrites integrate inputs from distant layers in Layer 1; basal dendrites receive local inputs. Action potentials are generated at the axon initial segment (AIS) and propagate down the axon to release neurotransmitters.",
    modelFile: "assets/models/neuron_morphology.glb",
    size: "20 \u03bcm"
  },
  {
    name: "Synaptic Junction",
    metrics: "Scale: 1 &mu;m &bull; Ultrastructure",
    title: "Synaptic Junction",
    body: "The site of communication between neurons. Action potentials trigger calcium influx at the pre-synaptic terminal, prompting synaptic vesicles to fuse with the membrane. Neurotransmitters diffuse across the 20 nm cleft to bind post-synaptic receptors (AMPA, NMDA, GABA).",
    modelFile: "assets/models/synapse_ultrastructure.glb",
    size: "1 \u03bcm"
  }
];

const quizQuestions = [
  {
    question: "1. Thalamocortical projection fibers carrying primary sensory feedforward information terminate predominantly in which layer of the neocortex?",
    options: [
      "Layer I (Molecular layer)",
      "Layer II/III (External pyramidal layer)",
      "Layer IV (Internal granular layer)",
      "Layer V (Internal pyramidal layer)"
    ],
    answer: 2,
    explanation: "Primary sensory feedforward signals from core thalamic nuclei (e.g., LGN, MGN) terminate heavily on spiny stellate cells in Layer IV, which then distribute signals vertically within the column."
  },
  {
    question: "2. Which inhibitory interneuron subtype is primarily responsible for generating fast feedforward shunting inhibition on Layer IV excitatory stellate cells?",
    options: [
      "Somatostatin-positive (SST+) Martinotti cells",
      "Parvalbumin-positive (PV+) basket cells",
      "Vasoactive intestinal polypeptide-positive (VIP+) cells",
      "Neurogliaform cells"
    ],
    answer: 1,
    explanation: "PV+ basket cells are fast-spiking and receive direct thalamic inputs. They generate fast-acting somatic shunt inhibition on L4 excitatory cells, gating incoming signals with sub-millisecond precision."
  },
  {
    question: "3. What is the primary functional target and route of the feedforward projection from Layer IV excitatory cells within the canonical microcircuit?",
    options: [
      "They project horizontally to neighboring cortical regions.",
      "They project vertically to Layer II/III excitatory pyramidal cells.",
      "They project subcortically to the spinal cord.",
      "They project back to the thalamocortical relay nuclei."
    ],
    answer: 1,
    explanation: "In the canonical flow, Layer IV spiny stellate cells project primarily to Layer II/III pyramidal cells, routing sensory signals to the supragranular layers for integration."
  },
  {
    question: "4. Layer II/III excitatory pyramidal cells play what primary role in hierarchical cortical systems?",
    options: [
      "They generate subcortical motor command signals.",
      "They send feedback inputs to thalamic relay gates.",
      "They route feedforward output (including prediction errors) to higher-order cortical areas.",
      "They act as the main thalamocortical input recipient."
    ],
    answer: 2,
    explanation: "L2/3 pyramidal cells send feedforward corticocortical connections to higher-order cortical areas. In predictive coding frameworks, they are the primary source of bottom-up prediction error signals."
  },
  {
    question: "5. How does the canonical microcircuit gate inputs via feedback projections from Layer V/VI excitatory cells back to Layer IV?",
    options: [
      "By direct, massive excitatory connections to Layer IV spiny stellate cells.",
      "By selectively exciting Layer IV inhibitory interneurons, which shunts subsequent sensory drives.",
      "By releasing retrograde nitric oxide gas.",
      "By silencing the thalamus via electrical junctions."
    ],
    answer: 1,
    explanation: "Layer V/VI projections back to L4 target local inhibitory interneurons (L4_inh) with high probability, meaning deep layer activation can gate or suppress subsequent sensory inputs entering the column."
  },
  {
    question: "6. In our model parameter matrix, what is the default connection probability for intralaminar recurrent E-to-E connections (e.g., L13_exc -> L13_exc)?",
    options: [
      "10% (p = 0.1)",
      "25% (p = 0.25)",
      "50% (p = 0.5)",
      "100% (p = 1.0)"
    ],
    answer: 0,
    explanation: "Intracortical recurrent E-to-E connections are modeled as sparse, with a default probability of 10% (p = 0.1). This limits runaway positive feedback loops and ensures stability."
  },
  {
    question: "7. Why is top-down cortico-cortical feedback (e.g., feedback_input_L13) described as targeting inhibitory populations more strongly than excitatory ones?",
    options: [
      "To maximize firing rates in supragranular layers.",
      "To recruit local disinhibitory VIP-to-SST pathways.",
      "To gate and suppress expected sensory templates via feedforward inhibition.",
      "To trigger long-term depression (LTD) across all synapses."
    ],
    answer: 2,
    explanation: "Top-down feedback targeting inhibitory cells helps suppress (gate) expected sensory drives. This is the physiological basis of predictive coding, where expected sensory inputs are shunted by local feedback inhibition."
  },
  {
    question: "8. What is a key limitation of the Izhikevich reduced spiking neuron model in reproducing biological cortical dynamics?",
    options: [
      "It cannot fire action potentials.",
      "It relies on heavy partial differential equations, making it too slow to run.",
      "It simplifies complex, multi-compartment dendritic integration (like calcium tuft spikes) into a single point-soma.",
      "It does not support synaptic plasticity modeling."
    ],
    answer: 2,
    explanation: "The Izhikevich model is a single-compartment model. It captures somatic spiking dynamics efficiently but ignores the complex dendritic compartments (like apical Ca2+ spikes) that mediate cortical integration."
  },
  {
    question: "9. In our cortical network simulation, what is the physical meaning of the 'Poisson background rate' (10 Hz)?",
    options: [
      "The frequency of synchronized gamma oscillations across the column.",
      "The rate at which external input units fire random, uncorrelated spikes to keep the network depolarized.",
      "The resonance frequency of NMDA receptors.",
      "The refractory period of fast-spiking interneurons."
    ],
    answer: 1,
    explanation: "Poisson background rates represent the baseline, uncorrelated synaptic input arriving from distant brain regions, keeping the network in a depolarized, responsive state."
  },
  {
    question: "10. What anatomical feature of thick-tufted Layer V pyramidal cells enables them to act as 'coincidence detectors' between feedforward and feedback inputs?",
    options: [
      "Their symmetrical dendritic trees confined to Layer V.",
      "Their lack of axon myelin.",
      "Their massive apical dendrites that span all layers to branch in Layer I.",
      "Their high concentration of GABA receptors on the axon initial segment."
    ],
    answer: 2,
    explanation: "L5 pyramidal cells have long apical dendrites extending to L1. Simultaneous inputs to their soma (from local feedforward sources) and apical tuft (from feedback sources in L1) trigger a dendritic calcium spike, generating high-frequency bursting."
  },
  {
    question: "11. Under the Spike-Timing-Dependent Plasticity (STDP) rule, what happens to synaptic weight if a post-synaptic neuron fires 10 ms *before* a pre-synaptic neuron?",
    options: [
      "The synapse is strengthened (Long-Term Potentiation).",
      "The synapse is weakened (Long-Term Depression).",
      "The synaptic weight remains unchanged.",
      "The synapse is eliminated entirely."
    ],
    answer: 1,
    explanation: "If the post-synaptic cell fires first, the pre-synaptic input was not causal in triggering the spike. This post-before-pre timing (\(\Delta t < 0\)) weakens the synapse via Long-Term Depression (LTD)."
  },
  {
    question: "12. In predictive coding, how is the prediction error (\(E_{pred}\)) computed at the level of supragranular layers?",
    options: [
      "By multiplying bottom-up drive and top-down predictions.",
      "By subtracting top-down predictive templates (mediated by gated inhibition) from bottom-up sensory drives.",
      "By measuring glial metabolic uptake.",
      "By taking the ratio of PV+ to SST+ interneuron firing rates."
    ],
    answer: 1,
    explanation: "Supragranular pyramidal cells compare sensory drives with expectations. When predictive feedback is shunted by local inhibition, the remaining signal is the prediction error: \(E_{pred} = I_{sensory} - I_{prediction}\)."
  },
  {
    question: "13. Why is the 'canonical microcircuit' model considered a structural approximation rather than a universal biological constant?",
    options: [
      "Cortical layers and projection ratios vary significantly across species and specialized regions (like V1 vs M1).",
      "Actual neurons do not use chemical synapses.",
      "Cerebral cortex functions do not require structural connections.",
      "It only applies to invertebrates."
    ],
    answer: 0,
    explanation: "The canonical microcircuit is a conceptual model. In biology, cortical areas vary (M1 lacks L4; visual areas have massive L4 pools; connection probabilities and cell types shift across species and regions)."
  }
];

const blogAuthors = {
  chen: {
    name: "Dr. Marcus Chen",
    title: "Senior Research Fellow, Cortical Biophysics Lab",
    topic: "L5 Pyramidal Coincidence Detection & Compartmental Modeling",
    avatar: "MC"
  },
  sato: {
    name: "Dr. Yuki Sato",
    title: "Associate Professor, Synaptic Physiology Group",
    topic: "STDP Mechanics, Dendritic Spines, and NMDA Dynamics",
    avatar: "YS"
  },
  gomez: {
    name: "Dr. Elena Gomez",
    title: "Director, Cognitive Networks Institute",
    topic: "Hierarchical Predictive Coding & Inter-areal Feedforward Routing",
    avatar: "EG"
  }
};

const samplePosts = [
  {
    id: 1,
    title: "Dendritic Gating and VIP Disinhibition",
    author: "Dr. Marcus Chen",
    authorId: "chen",
    date: "June 20, 2026",
    summary: "Exploring how vasoactive intestinal polypeptide (VIP) interneurons regulate dendritic integration in pyramidal cells by targeting SST+ Martinotti populations.",
    content: "Apical dendrites of pyramidal cells receive feedback inputs in Layer I. Under passive conditions, these inputs are gated by Somatostatin-positive (SST+) Martinotti cells, which target distal dendrites. However, during active attention, cholinergic or top-down inputs excite VIP-positive interneurons in Layer II/III. Since VIP cells target SST+ cells, their activation silences Martinotti cells. This disinhibits the apical dendrites, opening the gate for top-down templates to integrate with bottom-up sensory streams. Compartmental simulations reveal this disinhibitory motif shifts the column from passive sensory filter to active prediction matching.",
    comments: [
      { name: "Sarah Smith, Grad Student", text: "Fascinating work. How does this VIP pathway scale in motor vs sensory cortex?", date: "June 21, 2026" }
    ]
  },
  {
    id: 2,
    title: "Biophysical Limits of STDP in Recurrent Networks",
    author: "Dr. Yuki Sato",
    authorId: "sato",
    date: "June 15, 2026",
    summary: "Analyzing why a p=0.1 recurrence probability requires active STDP to avoid epileptic runaway states in Izhikevich simulations.",
    content: "When simulating 50 Izhikevich neurons per population, a recurrent excitatory probability of p=0.1 provides substantial amplification. Without STDP, static weights of 5 nS can cause runaway positive feedback loops under high-frequency Poisson drives, triggering epileptiform spiking. Introducing a bi-exponential STDP learning window stabilizes the network: high-frequency firing leads to spike-timing mismatches, depressing synapses that fire out-of-order. This activity-dependent plasticity establishes a self-regulating gate, maintaining the E/I ratio within safe physiological boundaries.",
    comments: []
  }
];

const puzzleSteps = [
  { id: "step-1", text: "Thalamocortical projections carry feedforward sensory signals into Layer IV." },
  { id: "step-2", text: "Layer IV excitatory stellate cells receive the feedforward input drive." },
  { id: "step-3", text: "Layer IV PV+ interneurons recruit feedforward shunting inhibition to gate input threshold." },
  { id: "step-4", text: "Layer IV excitatory cells project vertically, driving Layer II/III pyramidal cells." },
  { id: "step-5", text: "Layer II/III cells project to higher areas and send downward projections to Layer V/VI." },
  { id: "step-6", text: "Layer V/VI pyramidal cells integrate vertical streams and generate subcortical motor outputs." },
  { id: "step-7", text: "Deep layers send recurrent feedback to gate Layer IV, and modulate Layer II/III via SST inhibition." }
];

/* ==========================================================================
   2. GLOBAL STATE & ROUTING
   ========================================================================== */

const state = {
  currentView: "home",
  // Module 4: E/I
  excDrive: 50,
  inhRecruitment: 50,
  rasterIntervalId: null,
  // Module 5: Quiz
  quizIndex: 0,
  quizScore: 0,
  quizAnswers: [], // stores user selections
  quizCompleted: false,
  // Module 8: STDP
  stdpDeltaT: 10,
  stdpPairings: 60,
  // Module 9: Prediction
  predScenario: "expected",
  // Module 10: Multiscale
  zoomScale: 0,
  multiscaleAnimId: null,
  // Module 11: Blog
  blogPosts: [],
  blogQuestions: []
};

// Initialize Blog Database in localStorage
function initBlogDb() {
  if (!localStorage.getItem("whic_blog_posts")) {
    localStorage.setItem("whic_blog_posts", JSON.stringify(samplePosts));
  }
  if (!localStorage.getItem("whic_blog_questions")) {
    localStorage.setItem("whic_blog_questions", JSON.stringify([]));
  }
  state.blogPosts = JSON.parse(localStorage.getItem("whic_blog_posts"));
  state.blogQuestions = JSON.parse(localStorage.getItem("whic_blog_questions"));
}

function saveBlogDb() {
  localStorage.setItem("whic_blog_posts", JSON.stringify(state.blogPosts));
  localStorage.setItem("whic_blog_questions", JSON.stringify(state.blogQuestions));
}

// Router Mapping hash to view sections
function router() {
  const hash = window.location.hash || "#/home";
  
  // Close hamburger menu on navigation
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("menuToggle");
  if (nav && toggle) {
    nav.classList.remove("mobile-active");
    toggle.setAttribute("aria-expanded", "false");
  }

  // Parse hash parameters if any
  const parts = hash.split("?");
  const path = parts[0];
  const queryStr = parts[1] || "";
  const queryParams = new URLSearchParams(queryStr);

  // Hide all sections
  document.querySelectorAll(".view-section").forEach(sec => sec.classList.add("hidden"));
  
  // Clean up active loops or canvas animations
  stopRasterAnimation();
  stopMultiscaleAnimation();
  stopPredictionAnimation();

  // Reset dropdown triggers
  document.querySelectorAll(".nav-item.dropdown").forEach(item => item.classList.remove("open"));

  // Select target section based on routing path
  let targetViewId = "homeView";
  
  if (path === "#/microcircuit") {
    targetViewId = "microcircuitView";
    initMicrocircuitModule();
  } else if (path === "#/layers") {
    targetViewId = "layersView";
    initLayersModule();
  } else if (path === "#/puzzle") {
    targetViewId = "puzzleView";
    initPuzzleModule();
  } else if (path === "#/ei-balance") {
    targetViewId = "ei-balanceView";
    initEiModule();
  } else if (path === "#/quiz") {
    targetViewId = "quizView";
    initQuizModule();
  } else if (path === "#/cell-types") {
    targetViewId = "cell-typesView";
    initCellTypesModule();
  } else if (path === "#/map") {
    targetViewId = "mapView";
    initMapModule();
  } else if (path === "#/plasticity") {
    targetViewId = "plasticityView";
    initPlasticityModule();
  } else if (path === "#/prediction") {
    targetViewId = "predictionView";
    initPredictionModule();
  } else if (path === "#/multiscale") {
    targetViewId = "multiscaleView";
    const scaleParam = queryParams.get("scale");
    if (scaleParam !== null) {
      state.zoomScale = parseInt(scaleParam);
    }
    initMultiscaleModule();
  } else if (path.startsWith("#/blog")) {
    targetViewId = "blogView";
    initBlogModule(path);
  } else {
    // Default to Home
    targetViewId = "homeView";
    window.location.hash = "#/home";
  }

  // Show active view
  const activeSec = document.getElementById(targetViewId);
  if (activeSec) {
    activeSec.classList.remove("hidden");
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// Notification Banner Helper
function showNotification(message) {
  const banner = document.getElementById("notificationBanner");
  banner.textContent = message;
  banner.classList.remove("hidden");
  setTimeout(() => {
    banner.classList.add("hidden");
  }, 4000);
}

/* ==========================================================================
   3. DROPDOWNS & HAMBURGER (Header Navigation)
   ========================================================================== */

function setupNavigationListeners() {
  const hamburger = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      const active = nav.classList.toggle("mobile-active");
      hamburger.setAttribute("aria-expanded", active ? "true" : "false");
    });
  }

  // Dropdown buttons click logic
  document.querySelectorAll(".dropdown-trigger").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const parent = btn.parentElement;
      const isOpen = parent.classList.contains("open");
      
      // Close other dropdowns
      document.querySelectorAll(".nav-item.dropdown").forEach(item => item.classList.remove("open"));
      
      if (!isOpen) {
        parent.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      } else {
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener("click", () => {
    document.querySelectorAll(".nav-item.dropdown").forEach(item => {
      item.classList.remove("open");
      const trigger = item.querySelector(".dropdown-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  });
}

/* ==========================================================================
   4. MODULE 1: CANONICAL MICROCIRCUIT
   ========================================================================== */

function initMicrocircuitModule() {
  const diagram = document.getElementById("cmcDiagram");
  const nodes = diagram.querySelectorAll(".svg-node, .svg-input-node");
  const connections = diagram.querySelectorAll(".svg-conn");
  const inspectorTitle = document.getElementById("inspectorTitle");
  const inspectorSubtitle = document.getElementById("inspectorSubtitle");
  const inspectorContent = document.getElementById("inspectorContent");

  // Reset highlight
  function clearHighlights() {
    nodes.forEach(n => n.classList.remove("active", "cmc-dimmed", "cmc-highlighted"));
    connections.forEach(c => c.classList.remove("active", "cmc-dimmed", "cmc-highlighted"));
  }

  // Highlight elements connected to population
  function highlightPopulationNode(nodeId) {
    clearHighlights();
    nodes.forEach(n => {
      if (n.id === nodeId) {
        n.classList.add("cmc-highlighted", "active");
      } else {
        n.classList.add("cmc-dimmed");
      }
    });

    connections.forEach(c => {
      const parts = c.id.replace("conn-", "").split("-");
      const src = parts[0];
      const tgt = parts[1];
      if (src === nodeId || tgt === nodeId) {
        c.classList.add("cmc-highlighted");
      } else {
        c.classList.add("cmc-dimmed");
      }
    });
  }

  // Highlight element of single connection
  function highlightConnectionPath(connId) {
    clearHighlights();
    const cleanId = connId.replace("conn-", "");
    const parts = cleanId.split("-");
    const src = parts[0];
    const tgt = parts[1];

    connections.forEach(c => {
      if (c.id === connId) {
        c.classList.add("cmc-highlighted", "active");
      } else {
        c.classList.add("cmc-dimmed");
      }
    });

    nodes.forEach(n => {
      if (n.id === `node-${src}` || n.id === `node-${tgt}` || n.id === `input-${src}`) {
        n.classList.add("cmc-highlighted");
      } else {
        n.classList.add("cmc-dimmed");
      }
    });
  }

  // Add click handlers for populations
  nodes.forEach(node => {
    node.addEventListener("click", (e) => {
      e.stopPropagation();
      const rawId = node.id;
      const cleanId = rawId.replace("node-", "").replace("input-", "");
      
      const isInput = rawId.startsWith("input-");
      
      if (isInput) {
        const inputData = microInputs[cleanId];
        highlightPopulationNode(rawId);
        inspectorTitle.textContent = inputData.name;
        inspectorSubtitle.textContent = `Input Stream | Target: ${inputData.target}`;
        
        inspectorContent.innerHTML = `
          <div class="flex-col gap-3">
            <p><strong>Afferent Fibers:</strong> ${inputData.type}</p>
            <p><strong>Baseline Drive Rate:</strong> ${inputData.backgroundRate}</p>
            <p><strong>Sensory Pulse Rate:</strong> ${inputData.pulseRate} (during stimulation)</p>
            <p><strong>Stimulus duration:</strong> ${inputData.duration}</p>
            <p><strong>Circuit Description:</strong> ${inputData.description}</p>
          </div>
        `;
      } else {
        const popData = microPopulations[cleanId];
        highlightPopulationNode(rawId);
        inspectorTitle.textContent = popData.name;
        inspectorSubtitle.textContent = `${popData.layer} | ${popData.cellType}`;
        
        inspectorContent.innerHTML = `
          <div class="flex-col gap-3">
            <p><strong>Resident Neurons:</strong> ${popData.neuronCount} units</p>
            <p><strong>Neuron Biophysics:</strong> ${popData.model}</p>
            <p><strong>Anatomical Profile:</strong> ${popData.anatomy}</p>
            <p><strong>Circuit Motif Role:</strong> ${popData.circuitRole}</p>
            <p><strong>Computational Operation:</strong> ${popData.computationalRole}</p>
            <p><strong>Model Simplifications:</strong> ${popData.assumptions}</p>
            <p><strong>Biological Caveats:</strong> ${popData.caveats}</p>
            <div class="mt-4">
              <span class="mono-label text-2xs label-heading">Key Physiological Features</span>
              <ul>
                ${popData.keyPoints.map(p => `<li>${p}</li>`).join("")}
              </ul>
            </div>
          </div>
        `;
      }
    });
  });

  // Click handlers for connections
  connections.forEach(conn => {
    conn.addEventListener("click", (e) => {
      e.stopPropagation();
      highlightConnectionPath(conn.id);
      
      const cleanId = conn.id.replace("conn-", "");
      const parts = cleanId.split("-");
      const src = parts[0];
      const tgt = parts[1];

      // Find connection details
      const details = microConnections.find(c => c.source === src && c.target === tgt);
      if (!details) return;

      const srcName = microPopulations[src]?.name || microInputs[src]?.name || src;
      const tgtName = microPopulations[tgt]?.name || tgt;

      inspectorTitle.textContent = `${details.sign} Synapse Path`;
      inspectorSubtitle.textContent = `Source: ${src} &rarr; Target: ${tgt}`;

      inspectorContent.innerHTML = `
        <div class="flex-col gap-3">
          <p><strong>Projection Channel:</strong> From <em>${srcName}</em> to <em>${tgtName}</em></p>
          <p><strong>Connection Probability:</strong> p = ${details.probability}</p>
          <p><strong>Synaptic Conductance Weight:</strong> ${details.weight}</p>
          <p><strong>Plasticity Rule:</strong> ${details.plasticity}</p>
          <p><strong>Receptor Mechanism:</strong> ${details.mechanism}</p>
          <p><strong>Laminar Gating Function:</strong> ${details.meaning}</p>
          <p><strong>Simulation Parameters:</strong> ${details.assumptions}</p>
          <p><strong>Biological Caveats:</strong> ${details.caveats}</p>
          <div class="mt-4">
            <span class="mono-label text-2xs label-heading">Physiological Profile</span>
            <ul>
              ${details.keyPoints.map(k => `<li>${k}</li>`).join("")}
            </ul>
          </div>
        </div>
      `;
    });
  });

  // Clear focus when clicking background SVG
  diagram.addEventListener("click", (e) => {
    if (e.target.id === "cmcDiagram" || e.target.tagName === "rect") {
      clearHighlights();
      inspectorTitle.textContent = "Select a Population or Connection";
      inspectorSubtitle.textContent = "Click elements in the diagram to inspect their properties.";
      inspectorContent.innerHTML = `
        <div class="placeholder-text">
          <p>Neocortical microcircuits exhibit stereotype patterns of connectivity where specific laminar populations play unique roles in incoming sensory information processing, local feedback, and downstream routing.</p>
          <p>Use the diagram on the left to inspect populations (E/I nodes in layers 1-3, 4, 5-6), input drives (external feedforward/feedback sources), or any of the 19 distinct connections between them.</p>
        </div>
      `;
    }
  });
}

/* ==========================================================================
   5. MODULE 2: CORTICAL LAYERS EXPLORER
   ========================================================================== */

function initLayersModule() {
  const tabs = document.querySelectorAll(".layer-tab-btn");
  const detailTitle = document.getElementById("layerDetailTitle");
  const detailSubtitle = document.getElementById("layerDetailSubtitle");
  const detailContent = document.getElementById("layerDetailContent");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const key = tab.dataset.layer;
      const data = layerData[key];

      detailTitle.textContent = data.title;
      detailSubtitle.textContent = `Laminar Profile Details`;

      detailContent.innerHTML = `
        <div class="flex-col gap-4">
          <div>
            <span class="mono-label text-3xs label-heading">Primary Cell Subtypes</span>
            <p>${data.cellTypes}</p>
          </div>
          <div>
            <span class="mono-label text-3xs label-heading">Afferent Inputs (Incoming)</span>
            <p>${data.inputs}</p>
          </div>
          <div>
            <span class="mono-label text-3xs label-heading">Efferent Outputs (Outgoing)</span>
            <p>${data.outputs}</p>
          </div>
          <div>
            <span class="mono-label text-3xs label-heading">Functional / Computational Motif</span>
            <p>${data.computationalRole}</p>
          </div>
          <div class="caveat-box mt-2">
            <strong>Biological Caveat:</strong> ${data.caveats}
          </div>
        </div>
      `;
    });
  });

  // Trigger click on first tab (L1) as default
  if (tabs.length > 0) {
    tabs[0].click();
  }
}

/* ==========================================================================
   6. MODULE 3: SIGNAL FLOW PUZZLE
   ========================================================================== */

let clickedTileElement = null; // helper for click-to-place fallback

function initPuzzleModule() {
  const scrambledContainer = document.getElementById("scrambledTiles");
  const slots = document.querySelectorAll(".puzzle-slot");
  const checkBtn = document.getElementById("checkPuzzleBtn");
  const resetBtn = document.getElementById("resetPuzzleBtn");
  const explanationCard = document.getElementById("puzzleExplanationCard");
  const explanationTitle = document.getElementById("puzzleExplanationTitle");
  const explanationBody = document.getElementById("puzzleExplanationBody");

  // Clear past states
  explanationCard.classList.add("hidden");
  slots.forEach(s => {
    s.textContent = `Drop Step ${s.parentElement.dataset.slot} Here`;
    s.className = "puzzle-slot";
    s.dataset.tileId = "";
    const fb = s.parentElement.querySelector(".slot-feedback");
    if (fb) fb.innerHTML = "";
  });

  // Prepare shuffled tiles
  const shuffled = [...puzzleSteps].sort(() => Math.random() - 0.5);
  scrambledContainer.innerHTML = "";

  shuffled.forEach(step => {
    const tile = document.createElement("div");
    tile.className = "pathway-tile";
    tile.textContent = step.text;
    tile.id = step.id;
    tile.draggable = true;

    // Drag events
    tile.addEventListener("dragstart", (e) => {
      tile.classList.add("dragging");
      e.dataTransfer.setData("text/plain", tile.id);
    });

    tile.addEventListener("dragend", () => {
      tile.classList.remove("dragging");
    });

    // Click fallback events
    tile.addEventListener("click", () => {
      if (tile.classList.contains("placed")) return;

      // Remove selected highlight from other tiles
      document.querySelectorAll(".pathway-tile").forEach(t => t.style.borderColor = "var(--line-2)");

      clickedTileElement = tile;
      tile.style.borderColor = "var(--accent)";
      showNotification("Tile selected. Click a target slot below to place it.");
    });

    scrambledContainer.appendChild(tile);
  });

  // Slot events
  slots.forEach(slot => {
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      slot.classList.add("drag-over");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("drag-over");
    });

    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("drag-over");
      const tileId = e.dataTransfer.getData("text/plain");
      placeTileInSlot(tileId, slot);
    });

    // Click fallback slot trigger
    slot.addEventListener("click", () => {
      if (clickedTileElement) {
        placeTileInSlot(clickedTileElement.id, slot);
        clickedTileElement.style.borderColor = "var(--line-2)";
        clickedTileElement = null;
      }
    });
  });

  function placeTileInSlot(tileId, slot) {
    const tile = document.getElementById(tileId);
    if (!tile) return;

    // Check if slot has a tile already. If so, free it.
    if (slot.dataset.tileId) {
      const oldTile = document.getElementById(slot.dataset.tileId);
      if (oldTile) oldTile.classList.remove("placed");
    }

    slot.textContent = tile.textContent;
    slot.dataset.tileId = tileId;
    slot.className = "puzzle-slot filled";
    tile.classList.add("placed");
  }

  // Check answers
  checkBtn.onclick = () => {
    let allCorrect = true;
    let missingAny = false;

    slots.forEach((slot, index) => {
      const slotNum = index + 1;
      const tileId = slot.dataset.tileId;
      const fb = slot.parentElement.querySelector(".slot-feedback");

      if (!tileId) {
        missingAny = true;
        fb.innerHTML = "";
        return;
      }

      const stepIndex = puzzleSteps.findIndex(s => s.id === tileId);
      const isCorrect = (stepIndex === index);

      if (isCorrect) {
        slot.className = "puzzle-slot filled correct";
        fb.innerHTML = "<span class='feedback-correct'>&bull;</span>";
      } else {
        slot.className = "puzzle-slot filled incorrect";
        fb.innerHTML = "<span class='feedback-incorrect'>&times;</span>";
        allCorrect = false;
      }
    });

    if (missingAny) {
      showNotification("Please place tiles in all 7 slots before checking.");
      return;
    }

    explanationCard.classList.remove("hidden");
    if (allCorrect) {
      explanationTitle.textContent = "Flow Puzzle Solved Successfully";
      explanationTitle.style.color = "var(--ok)";
      explanationBody.innerHTML = "<strong>Sequence Verified:</strong> Thalamocortical input arrives at Layer IV, triggers local gating via PV+ shunts, projects vertically to supragranular Layer II/III, spreads downward to deep outputs in Layer V/VI, and completes the loop via recurrent infragranular feedback gating. This coordinated sequence maintains temporal fidelity and computes local prediction matches.";
    } else {
      explanationTitle.textContent = "Routing Errors Detected";
      explanationTitle.style.color = "var(--warn)";
      explanationBody.innerHTML = "<strong>Physiological Mismatch:</strong> One or more processing steps are out of chronological sequence. Re-evaluate the pathway: feedforward sensory drives must activate inputs in Layer IV before propagating to upper layers for integration and downwards for subcortical motor outputs.";
    }
  };

  resetBtn.onclick = () => {
    initPuzzleModule();
  };
}

/* ==========================================================================
   7. MODULE 4: EXCITATION VS INHIBITION (Needle + Raster)
   ========================================================================== */

function initEiModule() {
  const excSlider = document.getElementById("excSlider");
  const inhSlider = document.getElementById("inhSlider");
  const excVal = document.getElementById("excVal");
  const inhVal = document.getElementById("inhVal");
  
  const regimeTitle = document.getElementById("regimeTitle");
  const regimeDesc = document.getElementById("regimeDesc");
  const rasterFreq = document.getElementById("rasterFreq");

  // UI change listeners
  excSlider.oninput = () => {
    state.excDrive = parseInt(excSlider.value);
    excVal.textContent = `${state.excDrive}%`;
    updateEiState();
  };

  inhSlider.oninput = () => {
    state.inhRecruitment = parseInt(inhSlider.value);
    inhVal.textContent = `${state.inhRecruitment}%`;
    updateEiState();
  };

  // Setup simulation loop
  startRasterAnimation();
  updateEiState();
}

function updateEiState() {
  const E = state.excDrive;
  const I = state.inhRecruitment;
  const ratio = E - I; // offset

  let regimeName = "Balanced State";
  let regimeText = "E/I ratio matches normal physiological dynamics.";
  let titleColor = "var(--ink)";

  if (Math.abs(ratio) <= 15) {
    regimeName = "Physiological E/I Balance";
    regimeText = "Steady balanced state. Local feedback inhibition matches excitatory drive, maintaining sparse and highly selective spiking.";
    titleColor = "var(--accent)";
  } else if (ratio > 15 && ratio <= 40) {
    regimeName = "Hyperexcitable Regime";
    regimeText = "Excitatory drive overcomes local inhibition. Firing rates increase, tuning curves flatten, and spatial resolution degrades.";
    titleColor = "var(--warn)";
  } else if (ratio > 40) {
    regimeName = "Seizure / Runaway Recurrence";
    regimeText = "Pathological saturation. Unrestrained positive feedback loops drive synchronous, bursting discharge patterns.";
    titleColor = "var(--exc)";
  } else if (ratio < -15 && ratio >= -40) {
    regimeName = "Suppressed / Silenced State";
    regimeText = "Local shunting shunts functional inputs. Tuning curves narrow, but overall signaling capacity is highly depressed.";
    titleColor = "var(--inh)";
  } else if (ratio < -40) {
    regimeName = "Anesthetized / Unstable Silence";
    regimeText = "Deep suppression. The network fails to transmit or process external signals. Functional output drops to zero.";
    titleColor = "var(--ink-faint)";
  }

  regimeTitle.textContent = regimeName;
  regimeTitle.style.color = titleColor;
  regimeDesc.textContent = regimeText;

  drawEiGauge(ratio);
}

// Needle Gauge drawer on Canvas
function drawEiGauge(ratio) {
  const canvas = document.getElementById("eiGaugeCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const cx = canvas.width / 2;
  const cy = canvas.height - 15;
  const r = 90;

  // Draw semi-circle arc backgrounds
  ctx.lineWidth = 10;
  ctx.lineCap = "round";

  // Suppressed arc (Blueish)
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, Math.PI * 1.35);
  ctx.strokeStyle = "rgba(100, 150, 255, 0.2)";
  ctx.stroke();

  // Balanced arc (Teal)
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * 1.35, Math.PI * 1.65);
  ctx.strokeStyle = "rgba(100, 255, 255, 0.4)";
  ctx.stroke();

  // Hyperexcitable arc (Warm Red)
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI * 1.65, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 100, 100, 0.2)";
  ctx.stroke();

  // Draw active arc highlight based on ratio
  // ratio goes from -100 to +100
  // maps to angle from PI (left) to 2*PI (right)
  const normRatio = (ratio + 100) / 200; // 0 to 1
  const targetAngle = Math.PI + normRatio * Math.PI;

  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 8, Math.PI, Math.PI * 2);
  ctx.strokeStyle = "var(--line)";
  ctx.stroke();

  // Draw Needle
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(targetAngle - Math.PI / 2); // default vertical is Math.PI/2 offset

  // needle body
  ctx.beginPath();
  ctx.moveTo(-5, 0);
  ctx.lineTo(0, -r + 5);
  ctx.lineTo(5, 0);
  ctx.closePath();
  ctx.fillStyle = "var(--accent)";
  ctx.fill();

  // center pin
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fillStyle = "var(--ink)";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "var(--bg)";
  ctx.stroke();

  ctx.restore();
}

// Simulated Spike Raster & Firing Rate Histogram Dashboard
let rasterTime = 0;
let lfpData = Array.from({ length: 300 }, () => 0); // rolling LFP buffer

function startRasterAnimation() {
  const canvas = document.getElementById("rasterCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const neuronCount = 40; // Excitatory (30) + Inhibitory (10) for cleaner display
  const lastSpikes = Array.from({ length: neuronCount }, () => 0);
  const scrollingHistory = Array.from({ length: 150 }, () => ({ excCount: 0, inhCount: 0 }));

  function generateTelemetryFrame() {
    const E = state.excDrive;
    const I = state.inhRecruitment;
    const ratio = E - I;
    
    // Average frequency calculation: Base 12Hz, scales with ratio
    let baseFreq = 12;
    if (ratio > 0) baseFreq += (ratio * ratio) / 60;
    if (ratio < 0) baseFreq += ratio * 0.2;
    baseFreq = Math.max(0.1, baseFreq);
    
    rasterFreq.textContent = `Avg Freq: ${Math.round(baseFreq)} Hz`;

    // Probability of spike per tick
    const pSpikeExc = (baseFreq * (E / 50)) / 1000;
    const pSpikeInh = (baseFreq * (I / 50)) / 1000;

    // Tick time increment
    rasterTime++;

    // Calculate spikes for this tick
    let excSpikeCount = 0;
    let inhSpikeCount = 0;
    
    const currentSpikes = [];

    for (let n = 0; n < neuronCount; n++) {
      const isExc = n < 30;
      let p = isExc ? pSpikeExc : pSpikeInh;
      
      // Bursting state check (runaway E)
      if (ratio > 40) {
        const burstPeriod = Math.floor(rasterTime / 30);
        if (burstPeriod % 2 === 0 && Math.random() < 0.25) {
          p = 0.8;
        }
      }
      // Suppressed checks
      if (ratio < -40) {
        p = 0.001;
      }

      const isFiring = Math.random() < p;
      if (isFiring) {
        currentSpikes.push(n);
        if (isExc) excSpikeCount++;
        else inhSpikeCount++;
      }
    }

    // Update scrolling histograms
    scrollingHistory.shift();
    scrollingHistory.push({ excCount: excSpikeCount, inhCount: inhSpikeCount });

    // Update rolling LFP buffer
    // LFP is modeled as a sum of synaptic currents with membrane decay
    const lastLFP = lfpData[lfpData.length - 1];
    let synapticInput = excSpikeCount * 2.0 - inhSpikeCount * 2.5;
    
    // add baseline oscillation + noise
    let baselineOsc = 0;
    if (ratio > 40) {
      // large synchronous slow-waves
      baselineOsc = Math.sin(rasterTime * 0.15) * 15.0;
    } else if (Math.abs(ratio) <= 15) {
      // healthy high-frequency gamma noise
      baselineOsc = Math.sin(rasterTime * 0.4) * 3.0;
    } else if (ratio < -40) {
      // flat line
      baselineOsc = 0;
    } else {
      baselineOsc = Math.sin(rasterTime * 0.25) * 6.0;
    }

    const newLFP = lastLFP * 0.9 + synapticInput + baselineOsc + (Math.random() - 0.5) * 1.5;
    lfpData.shift();
    lfpData.push(newLFP);

    // DRAWING THE DASHBOARD
    ctx.fillStyle = "#08090a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const padLeft = 110; // width of left histogram panel
    const mainWidth = canvas.width - padLeft;

    // Draw Grids in main view
    ctx.strokeStyle = "rgba(38, 41, 46, 0.4)";
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = padLeft; x < canvas.width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal divider between Raster and LFP
    const dividerY = 135;
    ctx.strokeStyle = "var(--line-2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, dividerY);
    ctx.lineTo(canvas.width, dividerY);
    ctx.stroke();

    // 1. LEFT PANEL: Firing Rate Bar Histograms
    ctx.fillStyle = "var(--surface-2)";
    ctx.fillRect(0, 0, padLeft, canvas.height);
    ctx.strokeStyle = "var(--line)";
    ctx.strokeRect(0, 0, padLeft, canvas.height);

    ctx.font = "8px IBM Plex Mono";
    ctx.fillStyle = "var(--ink-faint)";
    ctx.fillText("POPULATION RATE", 10, 18);

    // Excitatory Bar
    const excRate = baseFreq * (E / 50);
    const inhRate = baseFreq * (I / 50);

    const maxRateVal = 60; // scale limit
    const barMaxHeight = 80;

    const excBarH = Math.min(barMaxHeight, (excRate / maxRateVal) * barMaxHeight);
    const inhBarH = Math.min(barMaxHeight, (inhRate / maxRateVal) * barMaxHeight);

    // Draw Exc Bar (Red)
    ctx.fillStyle = "var(--exc-bg)";
    ctx.fillRect(20, 100 - excBarH, 24, excBarH);
    ctx.strokeStyle = "var(--exc)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 100 - excBarH, 24, excBarH);

    // Draw Inh Bar (Blue)
    ctx.fillStyle = "var(--inh-bg)";
    ctx.fillRect(60, 100 - inhBarH, 24, inhBarH);
    ctx.strokeStyle = "var(--inh)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, 100 - inhBarH, 24, inhBarH);

    // Labels
    ctx.fillStyle = "var(--exc)";
    ctx.fillText("EXC", 22, 114);
    ctx.fillText(`${Math.round(excRate)}Hz`, 20, 126);

    ctx.fillStyle = "var(--inh)";
    ctx.fillText("INH", 62, 114);
    ctx.fillText(`${Math.round(inhRate)}Hz`, 60, 126);

    // E/I Ratio indicator
    ctx.fillStyle = "var(--ink-faint)";
    ctx.fillText("RATIO INDEX", 10, 155);
    
    ctx.fillStyle = "var(--surface)";
    ctx.fillRect(10, 165, padLeft - 20, 8);
    
    // Draw sliding index pointer
    const ratioNorm = (ratio + 100) / 200; // 0 to 1
    const pX = 10 + ratioNorm * (padLeft - 20);
    ctx.fillStyle = "var(--accent)";
    ctx.fillRect(pX - 2, 162, 4, 14);

    ctx.font = "7px IBM Plex Mono";
    ctx.fillStyle = "var(--ink-faint)";
    ctx.fillText("SUPR", 10, 190);
    ctx.fillText("BAL", 45, 190);
    ctx.fillText("HYPER", 75, 190);

    // 2. RASTER CHANNEL (Top 60% of right area)
    const rowHeight = 110 / neuronCount;
    // Shift spikes list and draw
    for (let i = 0; i < scrollingHistory.length; i++) {
      const hist = scrollingHistory[i];
      const sliceX = padLeft + (i / scrollingHistory.length) * mainWidth;
      
      // Draw aggregated bar histogram spikes in background of raster for "histogram style"
      if (hist.excCount > 0) {
        ctx.fillStyle = "rgba(255, 100, 100, 0.08)";
        ctx.fillRect(sliceX - 1, 10, 3, 115);
      }
      if (hist.inhCount > 0) {
        ctx.fillStyle = "rgba(100, 150, 255, 0.08)";
        ctx.fillRect(sliceX - 1, 10, 3, 115);
      }
    }

    // Draw individual spiking dots (larger, bright 4px circles)
    // To make it scroll nicely, we draw dots from history
    for (let i = 0; i < scrollingHistory.length; i++) {
      const sliceX = padLeft + (i / scrollingHistory.length) * mainWidth;
      
      // Simulating dot spikes
      if (i === scrollingHistory.length - 1) {
        // Draw current frame spikes
        currentSpikes.forEach(n => {
          const y = 15 + n * rowHeight;
          ctx.beginPath();
          ctx.arc(sliceX, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = n < 30 ? "var(--exc)" : "var(--inh)";
          ctx.fill();
        });
      } else {
        // Draw static random dots matching scrolling densities
        const hist = scrollingHistory[i];
        if (hist.excCount > 0 && Math.random() < 0.25) {
          const n = Math.floor(Math.random() * 30);
          const y = 15 + n * rowHeight;
          ctx.beginPath();
          ctx.arc(sliceX, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 100, 100, 0.6)";
          ctx.fill();
        }
        if (hist.inhCount > 0 && Math.random() < 0.25) {
          const n = 30 + Math.floor(Math.random() * 10);
          const y = 15 + n * rowHeight;
          ctx.beginPath();
          ctx.arc(sliceX, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(100, 150, 255, 0.6)";
          ctx.fill();
        }
      }
    }

    // 3. LFP OSCILLOSCOPE CHANNEL (Bottom 40%)
    ctx.font = "8px IBM Plex Mono";
    ctx.fillStyle = "var(--ink-faint)";
    ctx.fillText("LOCAL FIELD POTENTIAL (LFP)", padLeft + 15, dividerY + 18);

    ctx.strokeStyle = "var(--accent)";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    
    const lfpBaseY = dividerY + 50;
    const lfpScale = 0.8;

    for (let i = 0; i < lfpData.length; i++) {
      const lx = padLeft + (i / lfpData.length) * mainWidth;
      const ly = lfpBaseY - lfpData[i] * lfpScale;
      if (i === 0) ctx.moveTo(lx, ly);
      else ctx.lineTo(lx, ly);
    }
    ctx.stroke();

    // Fill under LFP curve for histogram glow
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(padLeft, canvas.height);
    ctx.closePath();
    ctx.fillStyle = "rgba(100, 255, 255, 0.03)";
    ctx.fill();
  }

  state.rasterIntervalId = setInterval(generateTelemetryFrame, 16);
}

function stopRasterAnimation() {
  if (state.rasterIntervalId) {
    clearInterval(state.rasterIntervalId);
    state.rasterIntervalId = null;
  }
}

/* ==========================================================================
   8. MODULE 5: GRADUATE QUIZ
   ========================================================================== */

function initQuizModule() {
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswers = [];
  state.quizCompleted = false;

  const resultsBox = document.getElementById("quizResultsBox");
  const qBox = document.getElementById("quizQuestionBox");
  const submitBtn = document.getElementById("quizSubmitBtn");
  const nextBtn = document.getElementById("quizNextBtn");
  const resultsBtn = document.getElementById("quizResultsBtn");
  
  resultsBox.classList.add("hidden");
  qBox.classList.remove("hidden");
  submitBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  resultsBtn.classList.add("hidden");

  loadQuizQuestion();
}

function loadQuizQuestion() {
  const q = quizQuestions[state.quizIndex];
  
  // Progress
  const progressText = document.getElementById("quizProgressText");
  const progressFill = document.getElementById("quizProgressFill");
  const scoreText = document.getElementById("quizScoreText");

  progressText.textContent = `Question ${state.quizIndex + 1} of ${quizQuestions.length}`;
  progressFill.style.width = `${((state.quizIndex) / quizQuestions.length) * 100}%`;
  scoreText.textContent = `Score: ${state.quizScore}/${state.quizIndex}`;

  // Title
  document.getElementById("quizQuestionTitle").textContent = q.question;

  // Options
  const list = document.getElementById("quizOptionsList");
  list.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = opt;
    btn.dataset.idx = idx;
    
    btn.onclick = () => {
      // Remove other selections
      list.querySelectorAll(".quiz-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    };

    list.appendChild(btn);
  });

  // Hide feedback
  document.getElementById("quizFeedbackBox").classList.add("hidden");
  
  const submitBtn = document.getElementById("quizSubmitBtn");
  const nextBtn = document.getElementById("quizNextBtn");
  submitBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
}

document.getElementById("quizSubmitBtn").onclick = () => {
  const selectedBtn = document.querySelector(".quiz-option.selected");
  if (!selectedBtn) {
    showNotification("Please select an answer before submitting.");
    return;
  }

  const selectedIdx = parseInt(selectedBtn.dataset.idx);
  const q = quizQuestions[state.quizIndex];
  const isCorrect = (selectedIdx === q.answer);

  state.quizAnswers.push(selectedIdx);

  if (isCorrect) {
    state.quizScore++;
    selectedBtn.className = "quiz-option correct";
  } else {
    selectedBtn.className = "quiz-option incorrect";
    // highlight correct option
    document.querySelectorAll(".quiz-option").forEach(btn => {
      if (parseInt(btn.dataset.idx) === q.answer) {
        btn.classList.add("correct");
      }
    });
  }

  // Show Feedback Box
  const fbBox = document.getElementById("quizFeedbackBox");
  const fbStatus = document.getElementById("quizFeedbackStatus");
  const fbBody = document.getElementById("quizFeedbackBody");

  fbBox.className = `quiz-feedback-box ${isCorrect ? "correct" : "incorrect"}`;
  fbStatus.textContent = isCorrect ? "CORRECT ANSWER" : "INCORRECT ANSWER";
  fbBody.innerHTML = q.explanation;
  fbBox.classList.remove("hidden");

  // Toggle buttons
  const submitBtn = document.getElementById("quizSubmitBtn");
  const nextBtn = document.getElementById("quizNextBtn");
  const resultsBtn = document.getElementById("quizResultsBtn");

  submitBtn.classList.add("hidden");

  if (state.quizIndex + 1 < quizQuestions.length) {
    nextBtn.classList.remove("hidden");
  } else {
    resultsBtn.classList.remove("hidden");
  }
};

document.getElementById("quizNextBtn").onclick = () => {
  state.quizIndex++;
  loadQuizQuestion();
};

document.getElementById("quizResultsBtn").onclick = () => {
  const progressFill = document.getElementById("quizProgressFill");
  progressFill.style.width = "100%";
  
  document.getElementById("quizQuestionBox").classList.add("hidden");
  document.getElementById("quizFeedbackBox").classList.add("hidden");
  document.getElementById("quizResultsBtn").classList.add("hidden");

  const resultsBox = document.getElementById("quizResultsBox");
  const finalScore = document.getElementById("quizFinalScore");
  const finalFeedback = document.getElementById("quizFinalFeedback");

  resultsBox.classList.remove("hidden");
  finalScore.textContent = `${state.quizScore} / ${quizQuestions.length}`;

  const pct = (state.quizScore / quizQuestions.length) * 100;
  if (pct === 100) {
    finalFeedback.textContent = "Perfect score! Outstanding mastery of neocortical biophysics and circuit dynamics.";
  } else if (pct >= 80) {
    finalFeedback.textContent = "Excellent work. You demonstrate a strong graduate-level understanding of cortical organization.";
  } else if (pct >= 60) {
    finalFeedback.textContent = "Good attempt. Re-read the Canonical Microcircuit parameters and retry to improve score.";
  } else {
    finalFeedback.textContent = "Academic review recommended. Re-study the layers and connectivity matrices before retaking.";
  }
};

document.getElementById("quizRestartBtn").onclick = () => {
  initQuizModule();
};

/* ==========================================================================
   9. MODULE 6: CELL TYPES GALLERY
   ========================================================================== */

function initCellTypesModule() {
  const grid = document.getElementById("cellTypesGrid");
  grid.innerHTML = "";

  cellTypes.forEach(cell => {
    const card = document.createElement("div");
    card.className = "cell-card card";

    const isExc = cell.identity.includes("Excitatory");

    card.innerHTML = `
      <div class="cell-model-wrapper">
        <model-viewer
          src="assets/models/${cell.id}.glb"
          alt="3D model of ${cell.name}"
          camera-controls
          auto-rotate
          auto-rotate-delay="0"
          rotation-per-second="30deg"
          interaction-prompt="none"
          shadow-intensity="0"
          environment-image="neutral"
          style="--poster-color:transparent;width:100%;height:100%;background:transparent;"
          class="cell-model-viewer">
          <div slot="progress-bar" class="cell-model-loading">
            <span class="cell-model-spinner"></span>
          </div>
        </model-viewer>
        <div class="cell-model-hint">&#8635; drag to rotate &bull; scroll to zoom</div>
      </div>
      <span class="card-tag ${isExc ? 'tag-exc' : 'tag-inh'}">${cell.identity}</span>
      <h3>${cell.name}</h3>
      <p class="text-xs text-soft mb-4">${cell.morphology}</p>
      
      <div class="flex-col gap-3 text-xs mt-auto">
        <div><strong>Laminar Distribution:</strong> ${cell.distribution}</div>
        <div><strong>Projection Targets:</strong> ${cell.projectionRole}</div>
        <div><strong>Computational Motifs:</strong> ${cell.computationalRole}</div>
        <div class="caveat-box mt-2 text-3xs"><strong>Caveats:</strong> ${cell.caveats}</div>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* ==========================================================================
   10. MODULE 7: CORTEX MAP
   ========================================================================== */

function initMapModule() {
  const mapSvg = document.getElementById("cortexMapSvg");
  const regions = mapSvg.querySelectorAll(".svg-map-region");
  const mapTitle = document.getElementById("mapTitle");
  const mapSubtitle = document.getElementById("mapSubtitle");
  const mapContent = document.getElementById("mapContent");

  regions.forEach(reg => {
    reg.addEventListener("click", (e) => {
      e.stopPropagation();
      
      regions.forEach(r => r.classList.remove("active"));
      reg.classList.add("active");

      const key = reg.id.replace("region-", "");
      const data = cortexRegions[key];

      mapTitle.textContent = data.name;
      mapSubtitle.textContent = `Cortical Topography Profile`;

      mapContent.innerHTML = `
        <div class="flex-col gap-4">
          <div>
            <span class="mono-label text-3xs label-heading">Functional Role</span>
            <p>${data.function}</p>
          </div>
          <div>
            <span class="mono-label text-3xs label-heading">Major Afferents (Inputs)</span>
            <p>${data.inputs}</p>
          </div>
          <div>
            <span class="mono-label text-3xs label-heading">Major Efferents (Outputs)</span>
            <p>${data.outputs}</p>
          </div>
          <div>
            <span class="mono-label text-3xs label-heading">Hierarchical Alignment</span>
            <p>${data.hierarchy}</p>
          </div>
          <div class="caveat-box mt-2 text-2xs">
            <strong>Biological Caveat:</strong> ${data.caveats}
          </div>
        </div>
      `;
    });
  });

  // Clear highlight on map click background
  mapSvg.addEventListener("click", (e) => {
    if (e.target.id === "cortexMapSvg" || e.target.tagName === "line") {
      regions.forEach(r => r.classList.remove("active"));
      mapTitle.textContent = "Select a Cortical Region";
      mapSubtitle.textContent = "Click a region on the lateral hemisphere schematic to view its details.";
      mapContent.innerHTML = `
        <div class="placeholder-text">
          <p>The cerebral cortex is organized into distinct areas supporting sensory, motor, and associative operations.</p>
          <p>Modern neuroscience models these areas not in isolation, but as nodes within a hierarchically ordered global network connected by long-range feedforward and feedback projections.</p>
          <p>Note: the 3D representation can also load anatomical assets \`assets/models/real_anatomical_brain.glb\` or \`assets/models/cortex_regions_brain.glb\` to display anatomical boundaries in 3D (detailed in the <a href="#/multiscale">Multiscale Tour</a>).</p>
        </div>
      `;
    }
  });
}

/* ==========================================================================
   11. MODULE 8: PLASTICITY (STDP Curve)
   ========================================================================== */

function initPlasticityModule() {
  const deltaSlider = document.getElementById("stdpDeltaSlider");
  const pairingsSlider = document.getElementById("stdpPairingsSlider");
  
  const deltaLabel = document.getElementById("stdpDeltaLabel");
  const deltaVal = document.getElementById("stdpDeltaVal");
  const pairingsVal = document.getElementById("stdpPairingsVal");

  deltaSlider.oninput = () => {
    state.stdpDeltaT = parseInt(deltaSlider.value);
    deltaLabel.textContent = `\u0394t = ${state.stdpDeltaT} ms`;
    deltaVal.textContent = `${state.stdpDeltaT} ms`;
    updateStdpPlot();
  };

  pairingsSlider.oninput = () => {
    state.stdpPairings = parseInt(pairingsSlider.value);
    pairingsVal.textContent = `${state.stdpPairings} pairings`;
    updateStdpPlot();
  };

  updateStdpPlot();
}

function updateStdpPlot() {
  const canvas = document.getElementById("stdpCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const w = canvas.width;
  const h = canvas.height;
  const midX = w / 2;
  const midY = h / 2;

  // Draw Grid lines
  ctx.strokeStyle = "rgba(38, 41, 46, 0.4)";
  ctx.lineWidth = 1;
  
  // horizontal axis
  ctx.beginPath();
  ctx.moveTo(10, midY);
  ctx.lineTo(w - 10, midY);
  ctx.stroke();

  // vertical axis
  ctx.beginPath();
  ctx.moveTo(midX, 10);
  ctx.lineTo(midX, h - 10);
  ctx.stroke();

  // Parameters for STDP curve
  const tauPlus = 15;
  const tauMinus = 15;
  const APlus = 0.8;
  const AMinus = 0.7;

  // 1. DRAW BACKGROUND HISTOGRAM (Spike timing pairings distribution)
  // We model the actual trials as a normal distribution centered at state.stdpDeltaT
  const centerDt = state.stdpDeltaT;
  const stdDev = 6.5; // width of distribution
  const maxPairings = state.stdpPairings;

  // Draw vertical histogram bars (100 bins mapped to canvas width)
  const binCount = 60;
  const binWidth = (w - 40) / binCount;
  
  for (let b = 0; b < binCount; b++) {
    // map bin to dt (-50 to +50)
    const dt = -50 + (b / binCount) * 100;
    
    // Gaussian probability density
    const prob = Math.exp(-Math.pow(dt - centerDt, 2) / (2 * Math.pow(stdDev, 2)));
    const binHeight = prob * maxPairings * 0.8; // scale factor
    
    if (binHeight > 1) {
      const bx = 20 + b * binWidth;
      
      // color-code bars based on LTP (dt > 0) vs LTD (dt < 0)
      if (dt > 0) {
        ctx.fillStyle = "rgba(100, 255, 255, 0.15)";
        ctx.strokeStyle = "rgba(100, 255, 255, 0.3)";
        ctx.fillRect(bx, midY - binHeight, binWidth - 1.5, binHeight);
        ctx.lineWidth = 0.5;
        ctx.strokeRect(bx, midY - binHeight, binWidth - 1.5, binHeight);
      } else if (dt < 0) {
        ctx.fillStyle = "rgba(255, 100, 100, 0.15)";
        ctx.strokeStyle = "rgba(255, 100, 100, 0.3)";
        ctx.fillRect(bx, midY, binWidth - 1.5, binHeight);
        ctx.lineWidth = 0.5;
        ctx.strokeRect(bx, midY, binWidth - 1.5, binHeight);
      } else {
        // center zero
        ctx.fillStyle = "var(--input)";
        ctx.fillRect(bx, midY - binHeight/2, binWidth - 1.5, binHeight);
      }
    }
  }

  // 2. DRAW GLOWING STDP CURVES (with filled area glow)
  // LTP Curve
  ctx.beginPath();
  for (let dx = 0; dx < midX - 20; dx++) {
    const dt = (dx / (midX - 20)) * 50;
    const dw = APlus * Math.exp(-dt / tauPlus);
    const x = midX + dx;
    const y = midY - dw * (midY - 20);
    if (dx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  // close path for filled area glow
  ctx.lineTo(w - 20, midY);
  ctx.lineTo(midX, midY);
  ctx.closePath();
  ctx.fillStyle = "rgba(100, 255, 255, 0.05)";
  ctx.fill();

  // Draw LTP stroke
  ctx.beginPath();
  for (let dx = 0; dx < midX - 20; dx++) {
    const dt = (dx / (midX - 20)) * 50;
    const dw = APlus * Math.exp(-dt / tauPlus);
    const x = midX + dx;
    const y = midY - dw * (midY - 20);
    if (dx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "var(--accent)";
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // LTD Curve
  ctx.beginPath();
  for (let dx = 0; dx < midX - 20; dx++) {
    const dt = -(dx / (midX - 20)) * 50;
    const dw = -AMinus * Math.exp(dt / tauMinus);
    const x = midX - dx;
    const y = midY - dw * (midY - 20);
    if (dx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  // close path for filled area glow
  ctx.lineTo(20, midY);
  ctx.lineTo(midX, midY);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 100, 100, 0.05)";
  ctx.fill();

  // Draw LTD stroke
  ctx.beginPath();
  for (let dx = 0; dx < midX - 20; dx++) {
    const dt = -(dx / (midX - 20)) * 50;
    const dw = -AMinus * Math.exp(dt / tauMinus);
    const x = midX - dx;
    const y = midY - dw * (midY - 20);
    if (dx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "var(--exc)";
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // 3. INDICATOR DOT & STATS
  const currentDt = state.stdpDeltaT;
  let currentDw = 0;
  if (currentDt >= 0) {
    currentDw = APlus * Math.exp(-currentDt / tauPlus);
  } else {
    currentDw = -AMinus * Math.exp(currentDt / tauMinus);
  }

  const indicatorX = midX + (currentDt / 50) * (midX - 20);
  const indicatorY = midY - currentDw * (midY - 20);

  // draw vertical indicator line
  ctx.strokeStyle = "var(--accent)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(indicatorX, 10);
  ctx.lineTo(indicatorX, h - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  // draw circle dot
  ctx.fillStyle = "var(--accent)";
  ctx.beginPath();
  ctx.arc(indicatorX, indicatorY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "var(--bg)";
  ctx.stroke();

  // Calculate Synaptic Weight shifts
  const wInitial = 10.0;
  const wMin = 0.0;
  const wMax = 25.0;
  const scaling = 0.22;
  const changeVal = currentDw * state.stdpPairings * scaling;
  const newWeight = Math.max(wMin, Math.min(wMax, wInitial + changeVal));
  const changePct = ((newWeight - wInitial) / wInitial) * 100;

  const wText = document.getElementById("stdpWeightText");
  const wFill = document.getElementById("stdpWeightFill");

  wText.textContent = `${newWeight.toFixed(1)} nS (${changePct >= 0 ? "+" : ""}${changePct.toFixed(0)}% change)`;
  wFill.style.width = `${(newWeight / wMax) * 100}%`;
  wFill.style.backgroundColor = changePct >= 0 ? "var(--accent)" : "var(--warn)";

  // Text labels on Canvas
  ctx.fillStyle = "var(--ink)";
  ctx.font = "bold 9px IBM Plex Mono";
  ctx.fillText("LTP: Pre-before-Post causal pairing", midX + 25, 25);
  ctx.fillText("LTD: Post-before-Pre anti-causal pairing", 20, h - 18);
  
  ctx.fillStyle = "var(--ink-faint)";
  ctx.font = "9px IBM Plex Mono";
  ctx.fillText("-50 ms", 10, midY - 6);
  ctx.fillText("+50 ms", w - 50, midY - 6);
  ctx.fillText("+ \u0394W", midX + 8, 20);
  ctx.fillText("- \u0394W", midX + 8, h - 12);
  
  ctx.fillText("Pairings Density Histogram (Center: \u0394t)", indicatorX - 45 > 20 ? indicatorX - 45 : 20, h - 45);
}

/* ==========================================================================
   12. MODULE 9: PREDICTION / FEEDBACK SCENARIOS
   ========================================================================== */

let predAnimTime = 0;

function initPredictionModule() {
  const scenarioBtns = document.querySelectorAll(".scenario-selector-row button");

  scenarioBtns.forEach(btn => {
    btn.onclick = () => {
      scenarioBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const key = btn.id.replace("scenario-", "");
      state.predScenario = key;
      renderPredictionScenario();
    };
  });

  renderPredictionScenario();
  startPredictionAnimation();
}

function renderPredictionScenario() {
  const data = predictionScenarios[state.predScenario];
  
  // Update static text info immediately
  document.getElementById("predScenarioTitle").textContent = data.title;
  document.getElementById("predScenarioSubtitle").textContent = data.subtitle;
  
  document.getElementById("predScenarioBody").innerHTML = `
    <p>${data.description}</p>
    <div class="mt-4">
      <span class="mono-label text-3xs label-heading">Biophysical Theory</span>
      <p class="text-xs text-soft">${data.computationalNotes}</p>
    </div>
  `;
}

function startPredictionAnimation() {
  stopPredictionAnimation(); // ensure clean state
  
  const barBU = document.getElementById("bar-bottom-up");
  const barPT = document.getElementById("bar-predictive-template");
  const barIG = document.getElementById("bar-inhibitory-gating");
  const barPE = document.getElementById("bar-prediction-error");

  const valBU = document.getElementById("val-bottom-up");
  const valPT = document.getElementById("val-predictive-template");
  const valIG = document.getElementById("val-inhibitory-gating");
  const valPE = document.getElementById("val-prediction-error");

  function animateBars() {
    const data = predictionScenarios[state.predScenario];
    if (!data) return;

    predAnimTime += 0.05;

    // Simulate baseline neural noise (slow sine waves + random spikes)
    const noiseBU = Math.sin(predAnimTime * 1.1) * 0.015 + (Math.random() - 0.5) * 0.01;
    const noisePT = Math.sin(predAnimTime * 0.8 + 1.0) * 0.012 + (Math.random() - 0.5) * 0.008;
    const noiseIG = Math.sin(predAnimTime * 0.9 + 2.0) * 0.018 + (Math.random() - 0.5) * 0.012;
    const noisePE = Math.sin(predAnimTime * 1.5 + 3.0) * 0.02 + (Math.random() - 0.5) * 0.015;

    const finalBU = Math.max(0.01, Math.min(1.0, data.bottomUp + noiseBU));
    const finalPT = Math.max(0.01, Math.min(1.0, data.feedback + noisePT));
    const finalIG = Math.max(0.01, Math.min(1.0, data.gating + noiseIG));
    const finalPE = Math.max(0.01, Math.min(1.0, data.error + noisePE));

    if (barBU) {
      barBU.style.width = `${finalBU * 100}%`;
      valBU.textContent = finalBU.toFixed(2);
    }
    if (barPT) {
      barPT.style.width = `${finalPT * 100}%`;
      valPT.textContent = finalPT.toFixed(2);
    }
    if (barIG) {
      barIG.style.width = `${finalIG * 100}%`;
      valIG.textContent = finalIG.toFixed(2);
    }
    if (barPE) {
      barPE.style.width = `${finalPE * 100}%`;
      valPE.textContent = finalPE.toFixed(2);
    }
  }

  state.predictionIntervalId = setInterval(animateBars, 30);
}

function stopPredictionAnimation() {
  if (state.predictionIntervalId) {
    clearInterval(state.predictionIntervalId);
    state.predictionIntervalId = null;
  }
}

/* ==========================================================================
   13. MODULE 10: BRAIN TO SYNAPSE TOUR
   ========================================================================== */

function initMultiscaleModule() {
  const slider = document.getElementById("zoomSlider");
  const buttons = document.querySelectorAll(".scale-btn");

  slider.value = state.zoomScale;
  
  // Setup button active states
  buttons.forEach(btn => {
    btn.classList.remove("active");
    if (parseInt(btn.dataset.scale) === state.zoomScale) {
      btn.classList.add("active");
    }
    
    btn.onclick = () => {
      state.zoomScale = parseInt(btn.dataset.scale);
      slider.value = state.zoomScale;
      updateMultiscaleView();
    };
  });

  slider.oninput = () => {
    state.zoomScale = parseInt(slider.value);
    buttons.forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`.scale-btn[data-scale="${state.zoomScale}"]`);
    if (activeBtn) activeBtn.classList.add("active");
    updateMultiscaleView();
  };

  updateMultiscaleView();
}

let threeScene, threeCamera, threeRenderer, threeBrainModel, threeControls, threeAnimFrameId;

function initThreeJSBrain() {
  const container = document.getElementById("threejs-container");
  if (!container || threeRenderer) return;

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;

  threeScene = new THREE.Scene();
  
  threeCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  threeCamera.position.set(0, 0, 5);

  threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  threeRenderer.setSize(width, height);
  threeRenderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(threeRenderer.domElement);

  threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
  threeControls.enableDamping = true;
  threeControls.autoRotate = true;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  threeScene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  threeScene.add(directionalLight);

  const loader = new THREE.GLTFLoader();
  loader.load(
    'assets/models/3d-vh-m-allen-brain.glb',
    function (gltf) {
      threeBrainModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(threeBrainModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      const scale = 3.5 / maxDim;
      threeBrainModel.scale.set(scale, scale, scale);
      threeBrainModel.position.sub(center.multiplyScalar(scale));

      threeScene.add(threeBrainModel);
    },
    undefined,
    function (error) {
      console.error("Three.js GLTF Load Error:", error);
      document.getElementById("modelError").classList.remove("hidden");
    }
  );

  window.addEventListener('resize', () => {
    if (state.zoomScale !== 0 || !threeRenderer) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    threeRenderer.setSize(w, h);
    threeCamera.aspect = w / h;
    threeCamera.updateProjectionMatrix();
  });
}

function animateThreeJS() {
  if (state.zoomScale !== 0) return;
  threeAnimFrameId = requestAnimationFrame(animateThreeJS);
  if (threeControls) threeControls.update();
  if (threeRenderer && threeScene && threeCamera) {
    threeRenderer.render(threeScene, threeCamera);
  }
}

function stopThreeJS() {
  if (threeAnimFrameId) {
    cancelAnimationFrame(threeAnimFrameId);
    threeAnimFrameId = null;
  }
}

function updateMultiscaleView() {
  const step = zoomSteps[state.zoomScale];
  
  // Update Info Panel details
  document.getElementById("multiscaleMetrics").innerHTML = `Scale ${state.zoomScale + 1}/${zoomSteps.length} &bull; Size: ${step.size}`;
  document.getElementById("multiscaleTitle").textContent = step.title;
  document.getElementById("multiscaleBody").textContent = step.body;
  document.getElementById("multiscaleModelFile").textContent = step.modelFile;

  // Labels
  document.getElementById("scaleLabelOverlay").innerHTML = step.metrics;

  // Show/Hide model viewer or Canvas
  const modelWrapper = document.getElementById("modelViewerWrapper");
  const canvasWrapper = document.getElementById("canvasAnimationWrapper");
  
  stopMultiscaleAnimation();
  stopThreeJS();

  if (state.zoomScale === 0) {
    // Brain scale: Show Three.js
    canvasWrapper.classList.add("hidden");
    modelWrapper.classList.remove("hidden");
    
    initThreeJSBrain();
    animateThreeJS();
    
    document.getElementById("triggerFallbackBtn").onclick = () => {
      document.getElementById("modelError").classList.add("hidden");
      modelWrapper.classList.add("hidden");
      canvasWrapper.classList.remove("hidden");
      runMultiscaleFallbackCanvas();
    };
  } else {
    // Histology/EM animations: Show Canvas
    modelWrapper.classList.add("hidden");
    canvasWrapper.classList.remove("hidden");
    runMultiscaleCanvasAnimation();
  }
}

// Fallback dynamic brain rendering
function runMultiscaleFallbackCanvas() {
  const canvas = document.getElementById("multiscaleCanvas");
  const ctx = canvas.getContext("2d");
  
  let angle = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Draw stylized schematic brain contours
    ctx.strokeStyle = "var(--accent)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(-20, -10, 60, Math.PI * 0.5, Math.PI * 1.8);
    ctx.arc(40, -10, 50, Math.PI * 1.2, Math.PI * 0.4);
    ctx.arc(10, 30, 60, Math.PI * 1.8, Math.PI * 1);
    ctx.closePath();
    ctx.stroke();

    // inner network grid
    ctx.fillStyle = "rgba(100, 255, 255, 0.1)";
    ctx.fill();

    // Draw nodes representing cortex layers
    ctx.fillStyle = "var(--exc)";
    ctx.beginPath(); ctx.arc(-30, -20, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "var(--inh)";
    ctx.beginPath(); ctx.arc(20, -30, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "var(--accent)";
    ctx.beginPath(); ctx.arc(0, 20, 5, 0, Math.PI*2); ctx.fill();

    ctx.restore();

    // Tech lines text
    ctx.font = "9px IBM Plex Mono";
    ctx.fillStyle = "var(--ink-faint)";
    ctx.fillText("SCHEMATIC FALLBACK RUNNING &bull; MODEL NOT FOUND", 20, 30);

    angle += 0.007;
    state.multiscaleAnimId = requestAnimationFrame(animate);
  }
  
  state.multiscaleAnimId = requestAnimationFrame(animate);
}

// Orchestrator for 6 distinct canvas animations
function runMultiscaleCanvasAnimation() {
  const canvas = document.getElementById("multiscaleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let t = 0;
  
  // Set sizes based on container size
  canvas.width = canvas.parentElement.clientWidth || 600;
  canvas.height = canvas.parentElement.clientHeight || 400;

  // General 3D Projection Helper
  function project3D(x, y, z, cx, cy, angleX, angleY, zoom) {
    // Rotate around Y-axis
    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // Rotate around X-axis
    const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    // Perspective projection
    const distance = 400;
    const scale = distance / (distance + z2);
    return {
      x: cx + x1 * scale * zoom,
      y: cy + y2 * scale * zoom,
      depth: z2
    };
  }

  // Pre-generate 3D coordinates for scale animations to ensure smooth, stable rendering
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  
  // 3D Point generation for Step 1 (Cortex Ribbon)
  const cortexGrid = [];
  for (let u = -4; u <= 4; u++) {
    for (let v = -4; v <= 4; v++) {
      const x = u * 35;
      const z = v * 35;
      // create a slight curved fold
      const y = Math.sin(x/60) * Math.cos(z/60) * 40;
      cortexGrid.push({ x, y, z });
    }
  }

  // 3D Cell Bodies for Step 2 (Layers)
  const layerCells = [];
  const layerBounds = [-160, -110, -50, 10, 70, 130, 180];
  const layerColors = ["#b6b3ab", "var(--exc)", "var(--inh)", "oklch(0.78 0.12 70)", "var(--exc)", "var(--inh)"];
  
  for (let i = 0; i < 200; i++) {
    const lIdx = Math.floor(Math.random() * 6);
    const minH = layerBounds[lIdx];
    const maxH = layerBounds[lIdx + 1];
    
    // Cylindrical distribution
    const r = Math.random() * 90;
    const theta = Math.random() * Math.PI * 2;
    
    layerCells.push({
      x: Math.cos(theta) * r,
      y: minH + Math.random() * (maxH - minH),
      z: Math.sin(theta) * r,
      color: layerColors[lIdx],
      size: Math.random() * 2 + 1.5
    });
  }

  // 3D Column struts and dendritic trees for Step 3 (Column)
  const columnStruts = [];
  for (let a = 0; a < 8; a++) {
    const angle = (a / 8) * Math.PI * 2;
    columnStruts.push({
      x1: Math.cos(angle) * 70, z1: Math.sin(angle) * 70,
      x2: Math.cos(angle) * 70, z2: Math.sin(angle) * 70
    });
  }

  // 3D Pyramidal Cell coordinates for Step 5 (Neuron)
  const neuronFibers = [];
  // apical trunk
  neuronFibers.push({ x1: 0, y1: 20, z1: 0, x2: 0, y2: -110, z2: 0, w: 2.5, c: "var(--exc)" });
  // apical tuft
  neuronFibers.push({ x1: 0, y1: -110, z1: 0, x2: -40, y2: -150, z2: -30, w: 1.2, c: "var(--exc)" });
  neuronFibers.push({ x1: 0, y1: -110, z1: 0, x2: 40, y2: -150, z2: 30, w: 1.2, c: "var(--exc)" });
  neuronFibers.push({ x1: 0, y1: -110, z1: 0, x2: -10, y2: -160, z2: 40, w: 1.2, c: "var(--exc)" });
  neuronFibers.push({ x1: 0, y1: -110, z1: 0, x2: 20, y2: -160, z2: -45, w: 1.2, c: "var(--exc)" });
  // basal arbors
  neuronFibers.push({ x1: -10, y1: 30, z1: -5, x2: -60, y2: 60, z2: -40, w: 1.5, c: "rgba(255,100,100,0.6)" });
  neuronFibers.push({ x1: 10, y1: 30, z1: 5, x2: 60, y2: 60, z2: 40, w: 1.5, c: "rgba(255,100,100,0.6)" });
  neuronFibers.push({ x1: 0, y1: 30, z1: 0, x2: -20, y2: 70, z2: 50, w: 1.5, c: "rgba(255,100,100,0.6)" });
  neuronFibers.push({ x1: 0, y1: 30, z1: 0, x2: 30, y2: 70, z2: -50, w: 1.5, c: "rgba(255,100,100,0.6)" });
  // axon
  neuronFibers.push({ x1: 0, y1: 35, z1: 0, x2: 0, y2: 170, z2: 0, w: 1.8, c: "rgba(255,100,100,0.4)" });

  // 3D Synapse vesicles for Step 6 (Synapse)
  const synapseVesicles = [];
  for (let i = 0; i < 16; i++) {
    synapseVesicles.push({
      x: (Math.random() - 0.5) * 120,
      y: -120 + Math.random() * 60,
      z: (Math.random() - 0.5) * 120,
      r: Math.random() * 4 + 3
    });
  }

  function renderScaleFrame() {
    ctx.fillStyle = "#0c0d0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = state.zoomScale;
    
    // Dynamic Y/X angles based on time tick
    const angleY = t * 0.007;
    const angleX = Math.sin(t * 0.003) * 0.25 + 0.1; // slow pitch oscillation
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (scale === 1) {
      // ====================================================================
      // 2. CORTEX: Rotating 3D wireframe ribbon block (Blue Brain aesthetic)
      // ====================================================================
      ctx.strokeStyle = "rgba(100, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      
      const projectedGrid = cortexGrid.map(pt => project3D(pt.x, pt.y, pt.z, cx, cy, angleX, angleY, 1.1));
      
      // Draw grid meshes
      const meshSize = 9; // 9x9 grid
      for (let u = 0; u < meshSize; u++) {
        for (let v = 0; v < meshSize; v++) {
          const idx = u * meshSize + v;
          
          // Connect along U lines
          if (v < meshSize - 1) {
            ctx.beginPath();
            ctx.moveTo(projectedGrid[idx].x, projectedGrid[idx].y);
            ctx.lineTo(projectedGrid[idx + 1].x, projectedGrid[idx + 1].y);
            ctx.stroke();
          }
          // Connect along V lines
          if (u < meshSize - 1) {
            ctx.beginPath();
            ctx.moveTo(projectedGrid[idx].x, projectedGrid[idx].y);
            ctx.lineTo(projectedGrid[idx + meshSize].x, projectedGrid[idx + meshSize].y);
            ctx.stroke();
          }
        }
      }

      // Draw columns and cells on the 3D grid
      ctx.fillStyle = "var(--accent)";
      for (let i = 0; i < projectedGrid.length; i += 8) {
        const pt = projectedGrid[i];
        
        // draw column cylinder strut vertically
        const ptBottom = project3D(cortexGrid[i].x, cortexGrid[i].y + 120, cortexGrid[i].z, cx, cy, angleX, angleY, 1.1);
        ctx.strokeStyle = "rgba(255,100,100,0.12)";
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(ptBottom.x, ptBottom.y);
        ctx.stroke();

        // draw cell soma nodes along column
        ctx.fillStyle = "rgba(100, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y + 40, 2.5, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 100, 100, 0.8)";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y + 80, 2.5, 0, Math.PI*2);
        ctx.fill();
      }

    } else if (scale === 2) {
      // ====================================================================
      // 3. LAYERS: Stacked semi-transparent 3D Planes & Cell point clouds
      // ====================================================================
      // Sort cell coordinates based on depth for 3D drawing order
      const projectedCells = layerCells.map(c => {
        const proj = project3D(c.x, c.y, c.z, cx, cy, angleX, angleY, 1.0);
        return { ...c, px: proj.x, py: proj.y, depth: proj.depth };
      });
      projectedCells.sort((a, b) => b.depth - a.depth);

      // Draw horizontal 3D boundary planes
      ctx.lineWidth = 1;
      layerBounds.forEach((y, idx) => {
        // Draw square plane in 3D
        const corners = [
          {x: -120, y: y, z: -120},
          {x: 120, y: y, z: -120},
          {x: 120, y: y, z: 120},
          {x: -120, y: y, z: 120}
        ];
        const projCorners = corners.map(c => project3D(c.x, c.y, c.z, cx, cy, angleX, angleY, 1.0));
        
        ctx.fillStyle = "rgba(38, 41, 46, 0.15)";
        ctx.strokeStyle = "rgba(125, 122, 115, 0.25)";
        ctx.beginPath();
        ctx.moveTo(projCorners[0].x, projCorners[0].y);
        for (let i = 1; i < 4; i++) ctx.lineTo(projCorners[i].x, projCorners[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // draw layer text labels in 3D space next to planes
        if (idx < 6) {
          const textPos = project3D(-140, (layerBounds[idx] + layerBounds[idx+1])/2, -120, cx, cy, angleX, angleY, 1.0);
          ctx.font = "8px IBM Plex Mono";
          ctx.fillStyle = "var(--ink-faint)";
          ctx.fillText(`Layer ${["I", "II/III", "IV", "V", "VI", "WM"][idx]}`, textPos.x, textPos.y);
        }
      });

      // Draw cells (glowing point clouds)
      projectedCells.forEach(c => {
        ctx.fillStyle = c.color;
        ctx.beginPath();
        // size varies based on depth/perspective scale
        const sz = c.size * (400 / (400 + c.depth));
        ctx.arc(c.px, c.py, Math.max(0.5, sz), 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw animated vertical signal bursts
      const burstY = -160 + ((t * 2) % 340);
      const burstCorners = [
        {x: -50, y: burstY, z: -50},
        {x: 50, y: burstY, z: -50},
        {x: 50, y: burstY, z: 50},
        {x: -50, y: burstY, z: 50}
      ].map(c => project3D(c.x, c.y, c.z, cx, cy, angleX, angleY, 1.0));

      ctx.strokeStyle = "rgba(100, 255, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(burstCorners[0].x, burstCorners[0].y);
      for(let i=1; i<4; i++) ctx.lineTo(burstCorners[i].x, burstCorners[i].y);
      ctx.closePath();
      ctx.stroke();

    } else if (scale === 3) {
      // ====================================================================
      // 4. COLUMN: Spinning 3D cylinder with vertical dendritic trees
      // ====================================================================
      const cylinderH = 260;
      const radius = 80;
      
      // Draw Cylinder rings (top, middle, bottom)
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(38, 41, 46, 0.4)";
      
      [-130, 0, 130].forEach(y => {
        ctx.beginPath();
        for (let a = 0; a <= 32; a++) {
          const angle = (a / 32) * Math.PI * 2;
          const pt = project3D(Math.cos(angle) * radius, y, Math.sin(angle) * radius, cx, cy, angleX, angleY, 1.0);
          if (a === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      });

      // Draw cylinder vertical bounds
      columnStruts.forEach(st => {
        const pt1 = project3D(st.x1, -130, st.z1, cx, cy, angleX, angleY, 1.0);
        const pt2 = project3D(st.x2, 130, st.z2, cx, cy, angleX, angleY, 1.0);
        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.stroke();
      });

      // Render rotating pseudo-3D neural branching structures
      // Pre-generated coordinates for simple 3D dendrites
      ctx.strokeStyle = "rgba(243, 241, 236, 0.55)";
      ctx.lineWidth = 1.8;

      // Draw three dendritic trees in column
      const drawTree3D = (offsetX, offsetZ, baseHeight) => {
        // soma
        const s = project3D(offsetX, baseHeight, offsetZ, cx, cy, angleX, angleY, 1.0);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(243, 241, 236, 0.8)";
        ctx.fill();
        ctx.stroke();

        // vertical apical dendrite trunk
        const apicalTop = project3D(offsetX, baseHeight - 120, offsetZ, cx, cy, angleX, angleY, 1.0);
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(apicalTop.x, apicalTop.y);
        ctx.stroke();

        // tufts at top
        ctx.lineWidth = 1.0;
        const tufts = [
          {x: -30, y: -40, z: -20},
          {x: 30, y: -40, z: 20},
          {x: -10, y: -50, z: 30},
          {x: 10, y: -50, z: -30}
        ];
        tufts.forEach(tf => {
          const tfPos = project3D(offsetX + tf.x, baseHeight - 120 + tf.y, offsetZ + tf.z, cx, cy, angleX, angleY, 1.0);
          ctx.beginPath();
          ctx.moveTo(apicalTop.x, apicalTop.y);
          ctx.lineTo(tfPos.x, tfPos.y);
          ctx.stroke();
        });
      };

      drawTree3D(0, 0, 80);
      drawTree3D(-40, -30, 20);
      drawTree3D(35, 40, -10);

    } else if (scale === 4) {
      // ====================================================================
      // 5. CANONICAL MICROCIRCUIT: Glowing rotating 3D network node display
      // ====================================================================
      const nodes3D = [
        { id: "L13_exc", x: -80, y: -100, z: 0, c: "var(--exc)", bg: "var(--exc-bg)" },
        { id: "L13_inh", x: 80, y: -100, z: 0, c: "var(--inh)", bg: "var(--inh-bg)" },
        { id: "L4_exc", x: -80, y: 0, z: 0, c: "var(--exc)", bg: "var(--exc-bg)" },
        { id: "L4_inh", x: 80, y: 0, z: 0, c: "var(--inh)", bg: "var(--inh-bg)" },
        { id: "L56_exc", x: -80, y: 100, z: 0, c: "var(--exc)", bg: "var(--exc-bg)" },
        { id: "L56_inh", x: 80, y: 100, z: 0, c: "var(--inh)", bg: "var(--inh-bg)" }
      ];

      const projNodes = nodes3D.map(n => {
        const proj = project3D(n.x, n.y, n.z, cx, cy, angleX, angleY, 1.15);
        return { ...n, px: proj.x, py: proj.y, depth: proj.depth };
      });

      // Connections paths in 3D wireframe
      // Map connections
      const connPairs = [
        ["L13_exc", "L13_inh"], ["L13_inh", "L13_exc"],
        ["L4_exc", "L4_inh"], ["L4_inh", "L4_exc"],
        ["L56_exc", "L56_inh"], ["L56_inh", "L56_exc"],
        ["L4_exc", "L13_exc"], ["L13_exc", "L56_exc"], ["L4_exc", "L56_exc"]
      ];

      ctx.lineWidth = 2.0;
      ctx.strokeStyle = "rgba(243, 241, 236, 0.25)";
      
      connPairs.forEach(pair => {
        const n1 = projNodes.find(n => n.id === pair[0]);
        const n2 = projNodes.find(n => n.id === pair[1]);
        if (n1 && n2) {
          ctx.beginPath();
          ctx.moveTo(n1.px, n1.py);
          ctx.lineTo(n2.px, n2.py);
          ctx.stroke();

          // Draw floating signal packet on connection
          const packT = (t * 0.015) % 1.0;
          const px = n1.px + (n2.px - n1.px) * packT;
          const py = n1.py + (n2.py - n1.py) * packT;

          ctx.fillStyle = "var(--accent)";
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw population nodes (spheres) sorted by depth
      projNodes.sort((a,b) => b.depth - a.depth);
      projNodes.forEach(n => {
        ctx.fillStyle = n.bg;
        ctx.strokeStyle = n.c;
        ctx.lineWidth = 3.0;

        const radius = 24 * (400 / (400 + n.depth));
        
        ctx.beginPath();
        ctx.arc(n.px, n.py, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = n.c;
        ctx.font = "bold 9px IBM Plex Mono";
        ctx.fillText(n.id.replace("_", " ").toUpperCase(), n.px - 22, n.py + 3);
      });

    } else if (scale === 5) {
      // ====================================================================
      // 6. NEURONS: High-fidelity rotating 3D Pyramidal Cell wireframe
      // ====================================================================
      ctx.save();
      
      const zoomVal = 1.25;
      
      // Draw soma (3D wireframe double-pyramid)
      const soma3D = [
        {x: 0, y: 0, z: 0}, // apex
        {x: -18, y: 25, z: -18},
        {x: 18, y: 25, z: -18},
        {x: 18, y: 25, z: 18},
        {x: -18, y: 25, z: 18},
        {x: 0, y: 35, z: 0}  // base
      ];

      const projSoma = soma3D.map(p => project3D(p.x, p.y, p.z, cx, cy, angleX, angleY, zoomVal));

      ctx.strokeStyle = "var(--exc)";
      ctx.lineWidth = 2.0;
      ctx.fillStyle = "rgba(255, 100, 100, 0.08)";
      
      // Draw wireframe soma faces
      const drawFace = (i1, i2, i3) => {
        ctx.beginPath();
        ctx.moveTo(projSoma[i1].x, projSoma[i1].y);
        ctx.lineTo(projSoma[i2].x, projSoma[i2].y);
        ctx.lineTo(projSoma[i3].x, projSoma[i3].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };
      
      drawFace(0, 1, 2); drawFace(0, 2, 3); drawFace(0, 3, 4); drawFace(0, 4, 1);
      drawFace(5, 1, 2); drawFace(5, 2, 3); drawFace(5, 3, 4); drawFace(5, 4, 1);

      // Draw dendrite and axon fibers in 3D
      neuronFibers.forEach(f => {
        const pt1 = project3D(f.x1, f.y1, f.z1, cx, cy, angleX, angleY, zoomVal);
        const pt2 = project3D(f.x2, f.y2, f.z2, cx, cy, angleX, angleY, zoomVal);
        
        ctx.strokeStyle = f.c;
        ctx.lineWidth = f.w;
        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.stroke();
      });

      // Action Potential traveling down axon
      const apT = (t % 80) / 80;
      const apY = 35 + apT * 135;
      const apPos = project3D(0, apY, 0, cx, cy, angleX, angleY, zoomVal);

      // glowing sphere
      ctx.shadowBlur = 10;
      ctx.shadowColor = "var(--accent)";
      ctx.fillStyle = "var(--accent)";
      ctx.beginPath();
      ctx.arc(apPos.x, apPos.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Firing shockwaves expanding from apex
      const shockAge = t % 80;
      if (shockAge < 25) {
        const shockRadius = shockAge * 2.2;
        const centerPos = project3D(0, 15, 0, cx, cy, angleX, angleY, zoomVal);
        ctx.strokeStyle = `rgba(255, 100, 100, ${1 - shockAge / 25})`;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(centerPos.x, centerPos.y, shockRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

    } else if (scale === 6) {
      // ====================================================================
      // 7. SYNAPSE: Rotating 3D Synaptic Cleft with vesicles and receptors
      // ====================================================================
      ctx.save();
      const zoomVal = 1.1;

      // Draw Pre-synaptic Bulb (dome shell in 3D)
      ctx.fillStyle = "rgba(20, 22, 25, 0.8)";
      ctx.strokeStyle = "var(--line-2)";
      ctx.lineWidth = 2.5;

      const preMembrane = [];
      const postMembrane = [];
      const sliceSteps = 16;

      for (let i = 0; i <= sliceSteps; i++) {
        const theta = (i / sliceSteps) * Math.PI - Math.PI/2;
        // pre-membrane plane at y = -70
        preMembrane.push({ x: Math.sin(theta) * 110, y: -70, z: Math.cos(theta) * 70 });
        // post-membrane plane at y = 60
        postMembrane.push({ x: Math.sin(theta) * 110, y: 60, z: Math.cos(theta) * 70 });
      }

      // Draw rotating membranes
      const projPre = preMembrane.map(p => project3D(p.x, p.y, p.z, cx, cy, angleX, angleY, zoomVal));
      const projPost = postMembrane.map(p => project3D(p.x, p.y, p.z, cx, cy, angleX, angleY, zoomVal));

      // Draw pre curve
      ctx.strokeStyle = "var(--accent)";
      ctx.beginPath();
      ctx.moveTo(projPre[0].x, projPre[0].y);
      for(let i=1; i<projPre.length; i++) ctx.lineTo(projPre[i].x, projPre[i].y);
      ctx.stroke();

      // Draw post curve
      ctx.strokeStyle = "var(--exc)";
      ctx.beginPath();
      ctx.moveTo(projPost[0].x, projPost[0].y);
      for(let i=1; i<projPost.length; i++) ctx.lineTo(projPost[i].x, projPost[i].y);
      ctx.stroke();

      // Draw Vesicles inside pre-bulb
      ctx.fillStyle = "rgba(100, 255, 255, 0.25)";
      ctx.strokeStyle = "var(--accent)";
      ctx.lineWidth = 1;
      
      const projVesicles = synapseVesicles.map(v => {
        const proj = project3D(v.x, v.y, v.z, cx, cy, angleX, angleY, zoomVal);
        return { ...v, px: proj.x, py: proj.y, depth: proj.depth };
      });
      // Sort and draw vesicles
      projVesicles.sort((a,b) => b.depth - a.depth);
      projVesicles.forEach(v => {
        const sz = v.r * (400 / (400 + v.depth));
        ctx.beginPath();
        ctx.arc(v.px, v.py, Math.max(1, sz), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Animated Vesicle Fusion and Transmitter release
      const fuseCycle = t % 120;
      const fuseT = fuseCycle / 120;

      // Fusion point in 3D
      const fx = Math.sin(t*0.02) * 40;
      const fz = Math.cos(t*0.03) * 20;
      
      const fuseSite = project3D(fx, -70, fz, cx, cy, angleX, angleY, zoomVal);

      if (fuseT < 0.4) {
        // Vesicle approaching pre-membrane
        const apY = -120 + (fuseT / 0.4) * 50;
        const pos = project3D(fx, apY, fz, cx, cy, angleX, angleY, zoomVal);
        ctx.fillStyle = "var(--accent)";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Fusion: open pore on membrane
        ctx.fillStyle = "var(--ink)";
        ctx.beginPath();
        ctx.arc(fuseSite.x, fuseSite.y, 8 * (1 - (fuseT - 0.4)), 0, Math.PI * 2);
        ctx.fill();

        // Release transmitter molecules diffusing downwards in 3D space
        const diffP = (fuseT - 0.4) / 0.6; // 0 to 1
        ctx.fillStyle = "var(--exc)";
        
        for (let nt = 0; nt < 12; nt++) {
          // calculate diffusion coordinates in 3D
          const angle = (nt / 12) * Math.PI * 2;
          const spreadR = diffP * 70;
          
          const ntx = fx + Math.cos(angle) * spreadR + Math.sin(nt + t)*5;
          const nty = -70 + diffP * 130 + Math.cos(nt)*5; // moves down to post membrane
          const ntz = fz + Math.sin(angle) * spreadR;

          const ntPos = project3D(ntx, nty, ntz, cx, cy, angleX, angleY, zoomVal);
          
          ctx.beginPath();
          ctx.arc(ntPos.x, ntPos.y, 2.5 * (1 - diffP * 0.4), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    t++;
    state.multiscaleAnimId = requestAnimationFrame(renderScaleFrame);
  }

  state.multiscaleAnimId = requestAnimationFrame(renderScaleFrame);
}

function stopMultiscaleAnimation() {
  if (state.multiscaleAnimId) {
    cancelAnimationFrame(state.multiscaleAnimId);
    state.multiscaleAnimId = null;
  }
}

/* ==========================================================================
   14. MODULE 11: ACADEMIC BLOG & AUTHOR Q&A
   ========================================================================== */

function initBlogModule(path) {
  const readPanel = document.getElementById("blogReadPanel");
  const writePanel = document.getElementById("blogWritePanel");
  const authorPanel = document.getElementById("blogAuthorPanel");

  const tabRead = document.getElementById("btn-blog-read");
  const tabWrite = document.getElementById("btn-blog-write");
  const tabAuthor = document.getElementById("btn-blog-author");

  // Deactivate panels
  readPanel.classList.add("hidden");
  writePanel.classList.add("hidden");
  authorPanel.classList.add("hidden");
  
  tabRead.classList.remove("active");
  tabWrite.classList.remove("active");
  tabAuthor.classList.remove("active");

  if (path === "#/blog-write") {
    writePanel.classList.remove("hidden");
    tabWrite.classList.add("active");
    setupWritePostForm();
  } else if (path === "#/blog-author") {
    authorPanel.classList.remove("hidden");
    tabAuthor.classList.add("active");
    setupAuthorQAPanel();
  } else {
    // default read
    readPanel.classList.remove("hidden");
    tabRead.classList.add("active");
    renderBlogPostsList();
  }

  // Bind tab click events
  tabRead.onclick = () => window.location.hash = "#/blog-read";
  tabWrite.onclick = () => window.location.hash = "#/blog-write";
  tabAuthor.onclick = () => window.location.hash = "#/blog-author";
}

function renderBlogPostsList() {
  const container = document.getElementById("blogPostsList");
  container.innerHTML = "";

  state.blogPosts.forEach(post => {
    const card = document.createElement("div");
    card.className = "blog-post-card card";
    
    card.innerHTML = `
      <div class="post-header">
        <span class="card-tag tag-accent">Research Update</span>
        <h2>${post.title}</h2>
        <div class="post-metadata">
          <span>Author: ${post.author}</span>
          <span>Date: ${post.date}</span>
        </div>
      </div>
      <p class="post-body">${post.content}</p>
      
      <!-- Comments Section -->
      <div class="comments-container">
        <span class="mono-label text-2xs label-heading">Comments (${post.comments.length})</span>
        <div class="comments-list" id="comments-list-${post.id}">
          ${post.comments.map(c => `
            <div class="comment-item">
              <div class="comment-meta">
                <span>${c.name}</span>
                <span>${c.date}</span>
              </div>
              <div class="comment-body">${c.text}</div>
            </div>
          `).join("")}
        </div>
        
        <!-- Add comment form -->
        <form class="comment-form" data-post-id="${post.id}">
          <div class="grid-halves">
            <input type="text" placeholder="Your Name" required class="input-text comment-author-input">
            <input type="text" placeholder="Add academic critique or feedback..." required class="input-text comment-text-input">
          </div>
          <button type="submit" class="btn btn-secondary btn-sm self-start">Post Comment</button>
        </form>
      </div>
    `;

    // Comment form handler
    const form = card.querySelector(".comment-form");
    form.onsubmit = (e) => {
      e.preventDefault();
      const authorInput = form.querySelector(".comment-author-input");
      const textInput = form.querySelector(".comment-text-input");
      
      const newComment = {
        name: authorInput.value.trim(),
        text: textInput.value.trim(),
        date: "Today"
      };

      // update state
      post.comments.push(newComment);
      saveBlogDb();
      showNotification("Comment added successfully.");
      
      // refresh list
      renderBlogPostsList();
    };

    container.appendChild(card);
  });
}

function setupWritePostForm() {
  const form = document.getElementById("writePostForm");
  
  form.onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById("postTitle").value.trim();
    const author = document.getElementById("postAuthor").value.trim();
    const summary = document.getElementById("postSummary").value.trim();
    const content = document.getElementById("postContent").value.trim();

    const newPost = {
      id: state.blogPosts.length + 1,
      title,
      author,
      authorId: "user",
      date: "Today",
      summary,
      content,
      comments: []
    };

    state.blogPosts.unshift(newPost); // add to top
    saveBlogDb();
    
    showNotification("Research post published successfully.");
    form.reset();
    window.location.hash = "#/blog-read";
  };
}

function setupAuthorQAPanel() {
  const authorsContainer = document.getElementById("authorsList");
  authorsContainer.innerHTML = "";

  Object.keys(blogAuthors).forEach(key => {
    const a = blogAuthors[key];
    const card = document.createElement("div");
    card.className = `author-card ${state.selectedAuthorId === key ? "active" : ""}`;
    card.dataset.id = key;

    card.innerHTML = `
      <div class="author-avatar">${a.avatar}</div>
      <div class="author-info">
        <h3>${a.name}</h3>
        <div class="author-title">${a.title}</div>
        <div class="author-topic">Focus: ${a.topic}</div>
      </div>
    `;

    card.onclick = () => {
      document.querySelectorAll(".author-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      state.selectedAuthorId = key;
      document.getElementById("selectedAuthorId").value = key;
      document.getElementById("askAuthorTitle").textContent = `Submit Question to ${a.name}`;
      renderAuthorQuestions();
    };

    authorsContainer.appendChild(card);
  });

  // Pick first author as default if not selected
  if (!state.selectedAuthorId) {
    const firstAuthor = Object.keys(blogAuthors)[0];
    state.selectedAuthorId = firstAuthor;
    const firstCard = authorsContainer.querySelector(`.author-card[data-id="${firstAuthor}"]`);
    if (firstCard) firstCard.click();
  }

  // Handle Question form submit
  const form = document.getElementById("askAuthorForm");
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("authorQuestioner").value.trim();
    const text = document.getElementById("authorQuestionText").value.trim();
    const authorId = document.getElementById("selectedAuthorId").value;

    const newQuery = {
      authorId,
      name,
      text,
      answer: "Thank you for your inquiry. This question has been logged in our research system and will be answered shortly by the author."
    };

    state.blogQuestions.unshift(newQuery);
    saveBlogDb();
    
    showNotification("Question sent to author.");
    form.querySelector("#authorQuestionText").value = "";
    
    renderAuthorQuestions();
  };

  renderAuthorQuestions();
}

function renderAuthorQuestions() {
  const container = document.getElementById("queriesList");
  container.innerHTML = "";

  const filtered = state.blogQuestions.filter(q => q.authorId === state.selectedAuthorId);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-xs text-faint">No queries submitted yet for this author.</div>`;
    return;
  }

  filtered.forEach(q => {
    const item = document.createElement("div");
    item.className = "query-item";
    
    item.innerHTML = `
      <div class="comment-meta">
        <span>From: ${q.name}</span>
      </div>
      <div class="query-question">Q: ${q.text}</div>
      <div class="query-answer">
        <strong>${blogAuthors[q.authorId].name}:</strong> ${q.answer}
      </div>
    `;

    container.appendChild(item);
  });
}

/* ==========================================================================
   15. INITIALIZATION
   ========================================================================= */

window.addEventListener("load", () => {
  initBlogDb();
  setupNavigationListeners();
  
  // Start Routing
  window.addEventListener("hashchange", router);
  router(); // trigger initial route
});
