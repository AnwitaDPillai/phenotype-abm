// --- 1. SYSTEM INITIALIZATION & CORE COEFFICIENTS ---
const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const lorenzCanvas = document.getElementById('lorenzCanvas');
const lorenzCtx = lorenzCanvas.getContext('2d');
const phaseCanvas = document.getElementById('phaseCanvas');
const phaseCtx = phaseCanvas.getContext('2d');

const CONFIG = {
    popSize: 130,
    baseMetabolicCost: 0.05,
    interactionRadius: 9,
    generationFrames: 450,
    mutationRate: 0.12,
    taxRate: 0.07,
    trustDecay: 0.002
};

let currentGeneration = 1;
let elapsedFrames = 0;
let bankReserveEscrow = 0;
let historicalTrajectory = []; // Cache for phase-space orbit tracking

// --- 2. THERMODYNAMIC RESOURCE GEOGRAPHY (REACTION-DIFFUSION GRID) ---
class ThermodynamicField {
    constructor(width, height, resolution = 25) {
        this.res = resolution;
        this.cols = Math.ceil(width / resolution);
        this.rows = Math.ceil(height / resolution);
        this.resources = [];
        this.thermalWaste = [];
        this.initializeFields();
    }

    initializeFields() {
        for (let c = 0; c < this.cols; c++) {
            this.resources[c] = [];
            this.thermalWaste[c] = [];
            for (let r = 0; r < this.rows; r++) {
                // Initialize high-density resource pockets via harmonic sine distribution waves
                const wave = Math.sin(c * 0.4) * Math.cos(r * 0.4);
                this.resources[c][r] = wave > 0.15 ? 1.0 : 0.1;
                this.thermalWaste[c][r] = 0;
            }
        }
    }

    computeDynamics() {
        // Run continuous local diffusion and dissipate kinetic thermal waste heat
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                if (this.thermalWaste[c][r] > 0) this.thermalWaste[c][r] *= 0.98; // Heat dissipation
                
                // Reaction-Diffusion: Soil replenishes slowly if it hasn't overheated
                if (this.thermalWaste[c][r] < 0.7) {
                    if (this.resources[c][r] < 1.0) this.resources[c][r] += 0.003;
                } else {
                    this.resources[c][r] -= 0.005; // Thermal degradation of local carrying capacity
                    if (this.resources[c][r] < 0) this.resources[c][r] = 0;
                }
            }
        }
    }

    render() {
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                const resValue = this.resources[c][r];
                const heatValue = this.thermalWaste[c][r];
                
                // Visual blending: Ivory backgrounds modulated by nutrient density and thermal distress
                ctx.fillStyle = `rgba(215, 211, 201, ${resValue * 0.35})`;
                ctx.fillRect(c * this.res, r * this.res, this.res, this.res);

                if (heatValue > 0.4) {
                    ctx.fillStyle = `rgba(184, 59, 46, ${heatValue * 0.12})`;
                    ctx.fillRect(c * this.res, r * this.res, this.res, this.res);
                }
            }
        }
    }
}

const macroWorld = new ThermodynamicField(canvas.width, canvas.height);

// --- 3. EPIGENETIC SOCIO-KINETIC AGENT CLASS ---
class ChromosomalAgent {
    constructor(x, y, genome = null) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2.8;
        this.vy = (Math.random() - 0.5) * 2.8;
        this.id = Math.random().toString(36).substr(2, 9);
        this.energy = 30;
        this.isDead = false;

        // --- 🧬 MULTI-VARIABLE CONTINUOUS GENOME ---
        if (genome) {
            this.genome = { ...genome };
        } else {
            this.genome = {
                G1_Altruism: Math.random(),           // Propensity to offer trust on interaction 0
                G2_Forgiveness: Math.random(),        // Memory decay factor for incoming betrayals
                G3_DesperationLimit: Math.random() * 12 // Energy floor triggering defensive defection
            };
        }

        // Live relational map tracker
        this.adjacencyMatrix = new Map(); 
    }

    getExpressedPhenotype() {
        // Epigenetic state mutation: Hunger overrides baseline altruistic genetic programming
        if (this.energy < this.genome.G3_DesperationLimit) {
            return 'Desperate_Defector';
        }
        return this.genome.G1_Altruism > 0.55 ? (this.genome.G2_Forgiveness > 0.5 ? 'Reciprocator' : 'Cooperator') : 'Defector';
    }

    updatePhysics() {
        this.x += this.vx;
        this.y += this.vy;

        // Kinetic metabolic tax calculation: Kinetic energy loss proportional to velocity squared
        const velocitySquared = (this.vx * this.vx) + (this.vy * this.vy);
        this.energy -= CONFIG.baseMetabolicCost + (velocitySquared * 0.008);

        // Map spatial grid interaction vectors to local tiles
        const c = Math.floor(this.x / macroWorld.res);
        const r = Math.floor(this.y / macroWorld.res);

        if (c >= 0 && c < macroWorld.cols && r >= 0 && r < macroWorld.rows) {
            // Expel thermal kinetic waste to local ecosystem tiles
            macroWorld.thermalWaste[c][r] += 0.015;
            
            // Extract energy values from fertile geographic grids
            const harvestable = macroWorld.resources[c][r];
            if (harvestable > 0.1) {
                const intake = 0.08;
                this.energy += intake;
                macroWorld.resources[c][r] -= intake;
            }
        }

        // Rigid spatial vector boundary reflections
        const padding = 7;
        if (this.x - padding < 0 || this.x + padding > canvas.width) { this.vx *= -1; this.x = Math.max(padding, Math.min(canvas.width - padding, this.x)); }
        if (this.y - padding < 0 || this.y + padding > canvas.height) { this.vy *= -1; this.y = Math.max(padding, Math.min(canvas.height - padding, this.y)); }
    }

    evaluateAction(opponentId) {
        const structuralPhenotype = this.getExpressedPhenotype();
        if (structuralPhenotype === 'Desperate_Defector' || structuralPhenotype === 'Defector') return 'Defect';
        if (structuralPhenotype === 'Cooperator') return 'Cooperate';

        // Reciprocator Logic: Analyze structural network memory logs
        if (this.adjacencyMatrix.has(opponentId)) {
            const historicalTrust = this.adjacencyMatrix.get(opponentId);
            return historicalTrust < 0.35 ? 'Defect' : 'Cooperate';
        }
        return 'Cooperate'; // Offer base trust on encounter 0
    }

    renderNode() {
        ctx.beginPath();
        const scalarScale = Math.max(2.8, Math.min(13, 3 + (this.energy * 0.14)));
        ctx.arc(this.x, this.y, scalarScale, 0, Math.PI * 2);

        const activeState = this.getExpressedPhenotype();
        if (activeState === 'Desperate_Defector') ctx.fillStyle = '#ff7b54'; // Neon flare orange signaling famine desperation
        else if (activeState === 'Defector') ctx.fillStyle = '#b83b2e';       // Crimson
        else if (activeState === 'Cooperator') ctx.fillStyle = '#3e7d5a';     // Deep Forest Green
        else if (activeState === 'Reciprocator') ctx.fillStyle = '#3a6186';   // Cobalt

        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }
}

// --- 4. ENGINE ARRAYS & SELECTION REGISTRIES ---
let population = [];

function assembleEcosystem() {
    population = [];
    for (let i = 0; i < CONFIG.popSize; i++) {
        population.push(new ChromosomalAgent(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }
}
assembleEcosystem();

// --- 5. SOCIAL NETWORKS GRAPH & PAYOFF MATRICES ---
function resolveSocioInteraction(agentA, agentB) {
    const moveA = agentA.evaluateAction(agentB.id);
    const moveB = agentB.evaluateAction(agentA.id);

    let matrixYieldA = 0;
    let matrixYieldB = 0;

    // Evaluate Structural Payoff Calculations
    if (moveA === 'Cooperate' && moveB === 'Cooperate') { matrixYieldA = 3.0; matrixYieldB = 3.0; }
    else if (moveA === 'Defect' && moveB === 'Cooperate') { matrixYieldA = 5.0; matrixYieldB = 0.0; }
    else if (moveA === 'Cooperate' && moveB === 'Defect') { matrixYieldA = 0.0; matrixYieldB = 5.0; }
    else if (moveA === 'Defect' && moveB === 'Defect') { matrixYieldA = 1.0; matrixYieldB = 1.0; }

    // Deduct National Transaction Taxation Skims
    const structuralTaxA = matrixYieldA * CONFIG.taxRate;
    const structuralTaxB = matrixYieldB * CONFIG.taxRate;
    bankReserveEscrow += structuralTaxA + structuralTaxB;

    agentA.energy += (matrixYieldA - structuralTaxA);
    agentB.energy += (matrixYieldB - structuralTaxB);

    // Modify Structural Trust Links via Reciprocal Memory Updates
    let weightDeltaA = moveB === 'Cooperate' ? 0.25 : -0.4;
    let weightDeltaB = moveA === 'Cooperate' ? 0.25 : -0.4;

    let currentWeightA = agentA.adjacencyMatrix.get(agentB.id) || 0.5;
    let currentWeightB = agentB.adjacencyMatrix.get(agentA.id) || 0.5;

    agentA.adjacencyMatrix.set(agentB.id, Math.max(0, Math.min(1, currentWeightA + weightDeltaA)));
    agentB.adjacencyMatrix.set(agentA.id, Math.max(0, Math.min(1, currentWeightB + weightDeltaB)));

    // Visualize High-Trust Mutual Network Edges
    if (moveA === 'Cooperate' && moveB === 'Cooperate') {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(62, 125, 94, ${((currentWeightA + currentWeightB) / 2) * 0.22})`;
        ctx.lineWidth = 1;
        ctx.moveTo(agentA.x, agentA.y);
        ctx.lineTo(agentB.x, agentB.y);
        ctx.stroke();
        ctx.closePath();
    }

    // Elastic Collision Vector Reflection
    agentA.vx *= -1; agentA.vy *= -1;
    agentB.vx *= -1; agentB.vy *= -1;
}

// --- 6. MACROECONOMIC TELEMETRY (LORENZ & GINI ENGINES) ---
function calculateGiniAndRenderLorenz() {
    lorenzCtx.clearRect(0, 0, lorenzCanvas.width, lorenzCanvas.height);
    
    if (population.length === 0) return 0;
    
    // Extract asset arrays, sorted ascending
    let capitalVector = population.map(a => Math.max(0, a.energy)).sort((a, b) => a - b);
    let totalBiomassWealth = capitalVector.reduce((sum, val) => sum + val, 0);
    let n = capitalVector.length;

    if (totalBiomassWealth === 0) return 0;

    // Exact Mathematical Gini Calculation Loop
    let absoluteSumDiff = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            absoluteSumDiff += Math.abs(capitalVector[i] - capitalVector[j]);
        }
    }
    const giniCoefficient = absoluteSumDiff / (2 * n * n * totalBiomassWealth);

    // --- RENDER REAL-TIME ACADEMIC LORENZ GRAPH ---
    lorenzCtx.strokeStyle = '#d7d3c9'; // Base Line of Absolute Equality
    lorenzCtx.lineWidth = 1;
    lorenzCtx.beginPath();
    lorenzCtx.moveTo(25, 155);
    lorenzCtx.lineTo(225, 25);
    lorenzCtx.stroke();

    lorenzCtx.strokeStyle = '#2c2a29'; // Curve track
    lorenzCtx.lineWidth = 1.5;
    lorenzCtx.beginPath();
    lorenzCtx.moveTo(25, 155);

    let cumulativePercentageWealth = 0;
    for (let i = 0; i < n; i++) {
        cumulativePercentageWealth += capitalVector[i] / totalBiomassWealth;
        const xCoord = 25 + ((i + 1) / n) * 200;
        const yCoord = 155 - (cumulativePercentageWealth * 130);
        lorenzCtx.lineTo(xCoord, yCoord);
    }
    lorenzCtx.stroke();

    return giniCoefficient;
}

// --- 7. PHASE-SPACE TRAJECTORY DOCK (LOTKA-VOLTERRA RADAR) ---
function synchronizePhaseSpaceOrbit(cooperatorsCount, defectorsCount) {
    phaseCtx.clearRect(0, 0, phaseCanvas.width, phaseCanvas.height);
    
    const total = cooperatorsCount + defectorsCount || 1;
    const xRatio = cooperatorsCount / total;
    const yRatio = defectorsCount / total;

    // Append localized geometric coordinate nodes to tracking arrays
    historicalTrajectory.push({ x: 30 + xRatio * 190, y: 130 - yRatio * 110 });
    if (historicalTrajectory.length > 180) historicalTrajectory.shift(); // Temporal window clamp

    // Render historical trail lines on deep radar panel
    phaseCtx.strokeStyle = 'rgba(62, 125, 94, 0.4)';
    phaseCtx.lineWidth = 1;
    phaseCtx.beginPath();
    if (historicalTrajectory.length > 0) phaseCtx.moveTo(historicalTrajectory[0].x, historicalTrajectory[0].y);
    for (let i = 1; i < historicalTrajectory.length; i++) {
        phaseCtx.lineTo(historicalTrajectory[i].x, historicalTrajectory[i].y);
    }
    phaseCtx.stroke();

    // Flash tracking target coordinate point
    if (historicalTrajectory.length > 0) {
        const head = historicalTrajectory[historicalTrajectory.length - 1];
        phaseCtx.fillStyle = '#3e7d5a';
        phaseCtx.beginPath();
        phaseCtx.arc(head.x, head.y, 3, 0, Math.PI * 2);
        phaseCtx.fill();
    }
}

// --- 8. NATURAL SELECTION PRESSURE & GENETIC MUTATION LOOPS ---
function processEvolutionarySweep() {
    // Decay aging social relationship links inside structural map maps
    population.forEach(agent => {
        for (let [opponentId, weight] of agent.adjacencyMatrix) {
            agent.adjacencyMatrix.set(opponentId, weight - CONFIG.trustDecay);
        }
    });

    // Prune starvation casualties from array registers
    population = population.filter(a => a.energy > 0);
    
    // Terminate system execution loop if complete ecosystem collapse triggers
    if (population.length < 8) { assembleEcosystem(); return; }

    // Sort by physical fitness metrics (Energy pools accumulated)
    population.sort((a, b) => b.energy - a.energy);

    // Prune underperforming assets (Bottom 30% elimination sweep)
    const survivorshipThreshold = Math.floor(population.length * 0.70);
    population = population.slice(0, survivorshipThreshold);

    // Replicate high-fitness lineages (Top 25% allocation models)
    const eliteCount = Math.ceil(population.length * 0.25);
    const dynamicOffspringPool = [];

    for (let i = 0; i < eliteCount; i++) {
        const parent = population[i];
        parent.energy /= 2; // Mitosis energy division profile

        // Replicate parent genome profiles exactly
        const childGenome = { ...parent.genome };

        // Apply continuous Gaussian genetic mutations across chromosomes
        if (Math.random() < CONFIG.mutationRate) childGenome.G1_Altruism = Math.max(0, Math.min(1, childGenome.G1_Altruism + (Math.random() - 0.5) * 0.15));
        if (Math.random() < CONFIG.mutationRate) childGenome.G2_Forgiveness = Math.max(0, Math.min(1, childGenome.G2_Forgiveness + (Math.random() - 0.5) * 0.15));
        if (Math.random() < CONFIG.mutationRate) childGenome.G3_DesperationLimit = Math.max(2, Math.min(22, childGenome.G3_DesperationLimit + (Math.random() - 0.5) * 2));

        const childNode = new ChromosomalAgent(
            parent.x + (Math.random() - 0.5) * 12,
            parent.y + (Math.random() - 0.5) * 12,
            childGenome
        );
        childNode.energy = parent.energy;
        dynamicOffspringPool.push(childNode);
    }

    // --- CENTRAL BANK MACROECONOMIC STABILIZER INTERVENTION ---
    if (bankReserveEscrow > 5 && population.length > 0) {
        let cooperatorsPool = population.filter(a => a.getExpressedPhenotype() === 'Cooperator' || a.getExpressedPhenotype() === 'Reciprocator');
        
        // Quantitative Easing (QE): Inject emergency asset subsidies specifically to cooperative anchors to shield systemic structural integrity
        if (cooperatorsPool.length > 0) {
            const subsidyDividend = bankReserveEscrow / cooperatorsPool.length;
            cooperatorsPool.forEach(a => a.energy += subsidyDividend);
            bankReserveEscrow = 0; // Liquidate escrow vault
        }
    }

    population = population.concat(dynamicOffspringPool);
    currentGeneration++;
}

// --- 9. SYNCHRONIZE TELEMETRY LABELS PANEL ---
function flushTelemetryUI(giniIndex) {
    document.getElementById('valGen').innerText = String(currentGeneration).padStart(4, '0');
    document.getElementById('valPop').innerText = String(population.length).padStart(3, '0');
    document.getElementById('valBank').innerText = `${bankReserveEscrow.toFixed(1)}e`;
    document.getElementById('valGini').innerText = giniIndex.toFixed(2);
    document.getElementById('barGini').style.width = `${giniIndex * 100}%`;

    let defs = 0, cops = 0, recs = 0;
    population.forEach(a => {
        const type = a.getExpressedPhenotype();
        if (type === 'Defector' || type === 'Desperate_Defector') defs++;
        else if (type === 'Cooperator') cops++;
        else if (type === 'Reciprocator') recs++;
    });

    const aggregateTotal = population.length || 1;
    document.getElementById('pctDef').innerText = `${Math.round((defs / aggregateTotal) * 100)}%`;
    document.getElementById('pctCop').innerText = `${Math.round((cops / aggregateTotal) * 100)}%`;
    document.getElementById('pctRec').innerText = `${Math.round((recs / aggregateTotal) * 100)}%`;

    synchronizePhaseSpaceOrbit(cops + recs, defs);
}

// --- 10. SYSTEM HIGH-FREQUENCY RUN LOOP CONTROL ---
function coreSimulationEngine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Compute geographic resource field replenishment wave parameters
    macroWorld.computeDynamics();
    macroWorld.render();

    // Physical position evaluation updates
    population.forEach(agent => agent.updatePhysics());

    // Spatial coordinate adjacency proximity check loops
    for (let i = 0; i < population.length; i++) {
        for (let j = i + 1; j < population.length; j++) {
            const a = population[i];
            const b = population[j];

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const separationVector = Math.sqrt(dx * dx + dy * dy);

            if (separationVector < CONFIG.interactionRadius) {
                resolveSocioInteraction(a, b);
            }
        }
    }

    // Render spatial agent structures
    population.forEach(agent => agent.renderNode());

    // Flush economic evaluations
    const outputGiniValue = calculateGiniAndRenderLorenz();
    flushTelemetryUI(outputGiniValue);

    // Timeline tick updates
    elapsedFrames++;
    if (elapsedFrames >= CONFIG.generationFrames) {
        elapsedFrames = 0;
        processEvolutionarySweep();
    }

    requestAnimationFrame(coreSimulationEngine);
}

// --- 11. INTERVENTION INTERFACE EVENT LISTENER HOOKS ---
document.getElementById('brushFamine').addEventListener('click', () => {
    // Induce Systemic Shock: Force 70% of geographic grid resource patches into absolute structural desertification
    for (let c = Math.floor(macroWorld.cols * 0.15); c < Math.floor(macroWorld.cols * 0.85); c++) {
        for (let r = Math.floor(macroWorld.rows * 0.15); r < Math.floor(macroWorld.rows * 0.85); r++) {
            macroWorld.resources[c][r] = 0;
            macroWorld.thermalWaste[c][r] = 1.5; // Trigger extreme heat degradation loops
        }
    }
});

document.getElementById('brushPlague').addEventListener('click', () => {
    // Strategy Mutator plague vector: Force half the active population's Altruism chromosome ($G_1$) to crash to absolute 0
    population.forEach((agent, index) => {
        if (index % 2 === 0) {
            agent.genome.G1_Altruism = 0.05; // Force pure predatory behaviors
            agent.genome.G3_DesperationLimit = 20.0; // Universal survival panic threshold
        }
    });
});

document.getElementById('bankIntervene').addEventListener('click', () => {
    // Central Bank Emergency Injection: Artificially mint 80 energy units straight into the escrow vault to save collapsing nodes
    bankReserveEscrow += 80.0;
});

document.getElementById('simReset').addEventListener('click', () => {
    currentGeneration = 1;
    elapsedFrames = 0;
    bankReserveEscrow = 0;
    historicalTrajectory = [];
    macroWorld.initializeFields();
    assembleEcosystem();
});

// Run execution loop
coreSimulationEngine();