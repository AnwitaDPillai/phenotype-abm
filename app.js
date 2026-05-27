// ============================================================================
// --- 1. SYSTEM STRUCTURAL ARCHITECTURE & COEFFICIENTS -----------------------
// ============================================================================
const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const lorenzCanvas = document.getElementById('lorenzCanvas');
const lorenzCtx = lorenzCanvas.getContext('2d');
const cladogramCanvas = document.getElementById('cladogramCanvas');
const cladogramCtx = cladogramCanvas.getContext('2d');
const phaseCanvas = document.getElementById('phaseCanvas');
const phaseCtx = phaseCanvas.getContext('2d');

const CONFIG = {
    popSize: 150,
    baseMetabolicCost: 0.05,
    interactionRadius: 9,
    generationFrames: 500,
    mutationRate: 0.12,
    baseTaxRate: 0.06,
    pheromonesResolution: 20
};

// Global Simulation Runtime State Triggers
let currentGeneration = 1;
let elapsedFrames = 0;
let bankReserveEscrow = 100.0;
let centralBankPolicy = "QE"; // "QE" or "AUSTERITY"
let isSimulationPaused = false;
let simulationVelocity = 1;
let activeHoverArchetype = null;

let population = [];
let historicalTrajectory = [];
let uniqueStrainRegistry = new Set();
let historicalLineageTally = {}; 

// ============================================================================
// --- 2. ADVANCED SPATIAL MEMORY MATRIX (TRUST PHEROMONE ENGINE) -------------
// ============================================================================
class DualLayerPheromoneGrid {
    constructor(width, height, res = CONFIG.pheromonesResolution) {
        this.res = res;
        this.cols = Math.ceil(width / res);
        this.rows = Math.ceil(height / res);
        this.cooperationField = [];
        this.defectionField = [];
        this.initializeFields();
    }

    initializeFields() {
        for (let c = 0; c < this.cols; c++) {
            this.cooperationField[c] = new Float32Array(this.rows).fill(0.0);
            this.defectionField[c] = new Float32Array(this.rows).fill(0.0);
        }
    }

    bleedSignal(x, y, signalType, intensity) {
        const c = Math.max(0, Math.min(this.cols - 1, Math.floor(x / this.res)));
        const r = Math.max(0, Math.min(this.rows - 1, Math.floor(y / this.res)));
        if (signalType === 'Cooperate') {
            this.cooperationField[c][r] = Math.min(1.0, this.cooperationField[c][r] + intensity);
        } else {
            this.defectionField[c][r] = Math.min(1.0, this.defectionField[c][r] + intensity);
        }
    }

    evaporateAndDiffuse() {
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                this.cooperationField[c][r] *= 0.985; // Slow evaporation
                this.defectionField[c][r] *= 0.985;
            }
        }
    }

    sampleLocalEnvironment(x, y) {
        const c = Math.max(0, Math.min(this.cols - 1, Math.floor(x / this.res)));
        const r = Math.max(0, Math.min(this.rows - 1, Math.floor(y / this.res)));
        return {
            coopDensity: this.cooperationField[c][r],
            defectDensity: this.defectionField[c][r]
        };
    }

    renderOverlay() {
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                const coop = this.cooperationField[c][r];
                const defect = this.defectionField[c][r];
                if (coop > 0.05 || defect > 0.05) {
                    ctx.fillStyle = coop > defect 
                        ? `rgba(62, 125, 94, ${coop * 0.15})` 
                        : `rgba(184, 59, 46, ${defect * 0.15})`;
                    ctx.fillRect(c * this.res, r * this.res, this.res, this.res);
                }
            }
        }
    }
}
const environmentalLandscape = new DualLayerPheromoneGrid(canvas.width, canvas.height);

// ============================================================================
// --- 3. EPIGENETIC ENTITY ARCHITECTURE (MATERNAL LINEAGES) ------------------
// ============================================================================
class ChromosomalAgent {
    constructor(x, y, genome = null, lineageCode = null) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2.5;
        this.vy = (Math.random() - 0.5) * 2.5;
        this.id = Math.random().toString(36).substr(2, 9);
        this.energy = 30.0;
        this.consecutiveDefections = 0;

        if (genome) {
            this.genome = { ...genome };
        } else {
            this.genome = {
                G1_Altruism: Math.random(),
                G2_Forgiveness: Math.random(),
                G3_DesperationLimit: Math.random() * 8 + 4.0
            };
        }

        // Maternal lineage registration tree logic
        if (lineageCode) {
            this.lineageCode = lineageCode;
        } else {
            const rootId = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            this.lineageCode = `Strain-${rootId}-${Math.floor(Math.random() * 900 + 100)}`;
        }
        uniqueStrainRegistry.add(this.lineageCode);

        this.historyLog = new Map();
    }

    getExpressedPhenotype() {
        if (this.energy < this.genome.G3_DesperationLimit) return 'Cheater'; // Starvation panic override
        if (this.genome.G1_Altruism < 0.35) return 'Cheater';
        if (this.genome.G1_Altruism > 0.65 && this.genome.G2_Forgiveness > 0.55) return 'Generous';
        return 'Copycat';
    }

    updatePhysics() {
        this.x += this.vx;
        this.y += this.vy;

        // Dynamic metabolism tracking velocity kinetics
        const speedSq = (this.vx * this.vx) + (this.vy * this.vy);
        this.energy -= CONFIG.baseMetabolicCost + (speedSq * 0.003);

        // Boundary reflection handling
        const pad = 8;
        if (this.x - pad < 0 || this.x + pad > canvas.width) { this.vx *= -1; this.x = Math.max(pad, Math.min(canvas.width - pad, this.x)); }
        if (this.y - pad < 0 || this.y + pad > canvas.height) { this.vy *= -1; this.y = Math.max(pad, Math.min(canvas.height - pad, this.y)); }
    }

    evaluateAction(opponentId) {
        // Spatial Signal Signaling Override: If environment is highly poisoned, force defection
        const localSignal = environmentalLandscape.sampleLocalEnvironment(this.x, this.y);
        if (localSignal.defectDensity > 0.60 && this.genome.G2_Forgiveness < 0.75) {
            return 'Defect';
        }

        const archetype = this.getExpressedPhenotype();
        if (archetype === 'Cheater') return 'Defect';
        if (archetype === 'Generous') return 'Cooperate';

        // Copycat Memory Logic
        if (this.historyLog.has(opponentId)) {
            return this.historyLog.get(opponentId);
        }
        return 'Cooperate';
    }

    renderNode() {
        const archetype = this.getExpressedPhenotype();
        
        // Handle Interactive Live Legend Ticker Filter Highlights
        if (activeHoverArchetype && activeHoverArchetype !== archetype) {
            ctx.globalAlpha = 0.08; // Dim unselected agents
        } else {
            ctx.globalAlpha = 1.0;
        }

        ctx.beginPath();
        // Dynamic Visual Scale mapping accumulated structural wealth directly onto node radius
        const dynamicRadius = Math.max(2.5, Math.min(15, 3.0 + (this.energy * 0.15)));
        ctx.arc(this.x, this.y, dynamicRadius, 0, Math.PI * 2);

        if (archetype === 'Cheater') ctx.fillStyle = '#b83b2e';
        else if (archetype === 'Generous') ctx.fillStyle = '#3e7d5a';
        else if (archetype === 'Copycat') ctx.fillStyle = '#3a6186';

        ctx.fill();
        ctx.strokeStyle = '#faf9f6';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }
}

// ============================================================================
// --- 4. HIGH-PERFORMANCE O(N) CELLS GRID COLLISION HARNESS -----------------
// ============================================================================
function processGridCollisions() {
    const cellSize = CONFIG.interactionRadius * 2;
    const cols = Math.ceil(canvas.width / cellSize);
    const rows = Math.ceil(canvas.height / cellSize);
    const cellsGrid = Array.from({ length: cols * rows }, () => []);

    for (let i = 0; i < population.length; i++) {
        const agent = population[i];
        const cx = Math.max(0, Math.min(cols - 1, Math.floor(agent.x / cellSize)));
        const cy = Math.max(0, Math.min(rows - 1, Math.floor(agent.y / cellSize)));
        cellsGrid[cx + cy * cols].push(agent);
    }

    const cellNeighborOffsets = [[0,0], [1,0], [-1,1], [0,1], [1,1]];

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            const currentIdx = x + y * cols;
            const sourceCellBucket = cellsGrid[currentIdx];
            if (sourceCellBucket.length === 0) continue;

            for (const [ox, oy] of cellNeighborOffsets) {
                const nx = x + ox;
                const ny = y + oy;
                if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                    const targetIdx = nx + ny * cols;
                    const targetCellBucket = cellsGrid[targetIdx];

                    for (let i = 0; i < sourceCellBucket.length; i++) {
                        const agentA = sourceCellBucket[i];
                        const loopStart = (currentIdx === targetIdx) ? i + 1 : 0;

                        for (let j = loopStart; j < targetCellBucket.length; j++) {
                            const agentB = targetCellBucket[j];

                            const dx = agentB.x - agentA.x;
                            const dy = agentB.y - agentA.y;
                            const d = Math.sqrt(dx * dx + dy * dy);

                            if (d < CONFIG.interactionRadius) {
                                executeInteractionDynamics(agentA, agentB);
                            }
                        }
                    }
                }
            }
        }
    }
}

function executeInteractionDynamics(a, b) {
    const actionA = a.evaluateAction(b.id);
    const actionB = b.evaluateAction(a.id);

    let yieldA = 0, yieldB = 0;
    if (actionA === 'Cooperate' && actionB === 'Cooperate') { yieldA = 3.0; yieldB = 3.0; }
    else if (actionA === 'Defect' && actionB === 'Cooperate') { yieldA = 5.0; yieldB = 0.0; }
    else if (actionA === 'Cooperate' && actionB === 'Defect') { yieldA = 0.0; yieldB = 5.0; }
    else if (actionA === 'Defect' && actionB === 'Defect') { yieldA = 1.0; yieldB = 1.0; }

    // Bleed performance footprints into the local environment grid
    environmentalLandscape.bleedSignal(a.x, a.y, actionA, 0.25);
    environmentalLandscape.bleedSignal(b.x, b.y, actionB, 0.25);

    // Dynamic Institutional Fines: Fine continuous defection sequences
    a.consecutiveDefections = (actionA === 'Defect') ? a.consecutiveDefections + 1 : 0;
    b.consecutiveDefections = (actionB === 'Defect') ? b.consecutiveDefections + 1 : 0;
    
    if (a.consecutiveDefections >= 4) { yieldA -= 0.8; bankReserveEscrow += 0.8; }
    if (b.consecutiveDefections >= 4) { yieldB -= 0.8; bankReserveEscrow += 0.8; }

    // Apply basic banking tax rates
    const taxA = yieldA * CONFIG.baseTaxRate;
    const taxB = yieldB * CONFIG.baseTaxRate;
    bankReserveEscrow += taxA + taxB;

    a.energy += (yieldA - taxA);
    b.energy += (yieldB - taxB);

    a.historyLog.set(b.id, actionB);
    b.historyLog.set(a.id, actionA);

    // Physics elastic deflection kickback
    a.vx *= -1; a.vy *= -1;
    b.vx *= -1; b.vy *= -1;
}

// ============================================================================
// --- 5. AUTOMATED NARRATIVE ORACLE ENGINE -----------------------------------
// ============================================================================
function executeOracleNarration(gini, defPct, copPct, recPct) {
    const oracleBox = document.getElementById('oracleText');
    if (elapsedFrames % 40 !== 0) return; // Restrict evaluation cycles to guarantee frame budget

    if (population.length < 30) {
        oracleBox.innerText = "CRITICAL ECOSYSTEM STRAIN // Extinction threat sequence active. Population below critical density.";
        return;
    }
    if (gini > 0.58) {
        oracleBox.innerText = `Systemic capital is concentrating within predatory networks. Gini coefficient climbs to ${gini.toFixed(2)}.`;
        return;
    }
    if (defPct > 65) {
        oracleBox.innerText = "CRIMSON DOMINANCE // Exploitative strategies oversaturating local vectors. Resource crash imminent.";
        return;
    }
    if (copPct + recPct > 80) {
        oracleBox.innerText = "COOPERATIVE UTOPIA // Mutual trust networks stabilized across spatial boundaries. Wealth inequality nominal.";
        return;
    }
    if (centralBankPolicy === "QE" && bankReserveEscrow < 30) {
        oracleBox.innerText = "FEDERAL RESERVE INTERVENTION // Liquidity pools injected to prevent low-capital systemic failures.";
        return;
    }
    oracleBox.innerText = "System running under balanced metrics. Genetic drift mutations tracing nominal speciation paths.";
}

// ============================================================================
// --- 6. MACRO-EVOLUTIONARY SELECTION & ALGORITHMIC BANK SYSTEM --------------
// ============================================================================
function runMacroEvolutionarySweep() {
    population = population.filter(a => a.energy > 0);
    if (population.length < 10) { reinitializeEcosystem(); pushTerminalLog("[ALERT] EXTINCTION SHOCK. REGEN ALLOCATED."); return; }

    population.sort((a, b) => b.energy - a.energy);
    
    // Calculate final statistics for text outputs before slicing distributions
    let totalAssets = population.reduce((sum, a) => sum + a.energy, 0);
    let avgAssetValue = totalAssets / population.length;

    // Prune baseline bottom 20% according to the core specification
    const survivalThresholdIndex = Math.floor(population.length * 0.80);
    population = population.slice(0, survivalThresholdIndex);

    // Replicate top 20% elite lines
    const eliteLimit = Math.ceil(population.length * 0.20);
    const nursery = [];

    for (let i = 0; i < eliteLimit; i++) {
        const parent = population[i];
        parent.energy /= 2.0; // Siphon energy capital to fuel biological child division

        const mutatedGenome = { ...parent.genome };
        if (Math.random() < CONFIG.mutationRate) {
            mutatedGenome.G1_Altruism = Math.max(0.0, Math.min(1.0, mutatedGenome.G1_Altruism + (Math.random() - 0.5) * 0.25));
            mutatedGenome.G2_Forgiveness = Math.max(0.0, Math.min(1.0, mutatedGenome.G2_Forgiveness + (Math.random() - 0.5) * 0.25));
        }

        // Child inherits continuous maternal lineage classification codes
        const child = new ChromosomalAgent(
            parent.x + (Math.random() - 0.5) * 12,
            parent.y + (Math.random() - 0.5) * 12,
            mutatedGenome,
            parent.lineageCode
        );
        child.energy = parent.energy;
        nursery.push(child);
    }

    // --- AUTONOMOUS ALGORITHMIC CENTRAL BANK REGULATORY MACHINE ---
    const sortedAssets = population.map(a => a.energy).sort((a,b) => a-b);
    let absoluteDiff = 0, n = sortedAssets.length;
    for(let x=0; x<n; x++) { for(let y=0; y<n; y++) { absoluteDiff += Math.abs(sortedAssets[x] - sortedAssets[y]); } }
    const currentGini = n > 0 ? absoluteDiff / (2 * n * n * (totalAssets/n)) : 0;

    if (centralBankPolicy === "QE") {
        if (currentGini > 0.50 && bankReserveEscrow > 20) {
            // QE Intervention: Automatically route dividends to support the bottom 20%
            const baselineRescueCount = Math.ceil(population.length * 0.20);
            const payoutPackage = (bankReserveEscrow * 0.60) / Math.max(1, baselineRescueCount);
            
            // Give cash injection to the lowest asset entries
            population.sort((a,b) => a.energy - b.energy);
            for (let k = 0; k < baselineRescueCount; k++) {
                if (population[k]) population[k].energy += payoutPackage;
            }
            bankReserveEscrow *= 0.40;
            pushTerminalLog(`[FED] QE ALERT: FLOODING BASAL LIQUIDITY // GINI: ${currentGini.toFixed(2)}`);
        }
    } else {
        // AUSTERITY MODE: Bank hoards asset liquidity pools to shield the system grid from total extinction collapses
        if (population.length < 35 && bankReserveEscrow > 50) {
            const safetyStimulus = bankReserveEscrow * 0.70;
            const structuralDividend = safetyStimulus / population.length;
            population.forEach(a => a.energy += structuralDividend);
            bankReserveEscrow -= safetyStimulus;
            pushTerminalLog("[FED] AUSTERITY CRASH PREVENT: RELEASE EMBARGO ASSETS");
        } else {
            // Extra extraction siphons to build reserves
            population.forEach(a => {
                const siphonAmt = a.energy * 0.02;
                a.energy -= siphonAmt;
                bankReserveEscrow += siphonAmt;
            });
            pushTerminalLog(`[FED] HARVEST RESERVES // VAULT DOCK: ${bankReserveEscrow.toFixed(0)}e`);
        }
    }

    population = population.concat(nursery);
    currentGeneration++;
}

// ============================================================================
// --- 7. REVENUE DIAGNOSTICS & CHARTS VIEWPORTS ------------------------------
// ============================================================================
function calculateMetricsAndDrawCharts() {
    lorenzCtx.clearRect(0, 0, lorenzCanvas.width, lorenzCanvas.height);
    cladogramCtx.clearRect(0, 0, cladogramCanvas.width, cladogramCanvas.height);

    if (population.length === 0) return 0;

    const canvasW = lorenzCanvas.width;   // 300
    const canvasH = lorenzCanvas.height;  // 110

    // A. Calculate Gini Coefficient Indices
    let resources = population.map(a => Math.max(0, a.energy)).sort((a, b) => a - b);
    let cumulativeSum = resources.reduce((s, v) => s + v, 0);
    let len = resources.length;

    let gini = 0;
    if (cumulativeSum > 0) {
        let absoluteDiffSum = 0;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                absoluteDiffSum += Math.abs(resources[i] - resources[j]);
            }
        }
        gini = absoluteDiffSum / (2 * len * len * (cumulativeSum / len));
    }

    // B. Draw Lorenz Analytics Chart Curve (Calibrated to 300x110 Layout Frame)
    const paddingX = 25;
    const paddingY = 15;
    const graphW = canvasW - (paddingX * 2); // 250px active mapping zone
    const graphH = canvasH - (paddingY * 2); // 80px active mapping zone

    lorenzCtx.strokeStyle = '#d7d3c9';
    lorenzCtx.lineWidth = 1;
    lorenzCtx.beginPath(); 
    lorenzCtx.moveTo(paddingX, canvasH - paddingY); 
    lorenzCtx.lineTo(canvasW - paddingX, paddingY); 
    lorenzCtx.stroke(); // Base parity ideal curve line

    lorenzCtx.strokeStyle = '#2c2a29';
    lorenzCtx.lineWidth = 1.5;
    lorenzCtx.beginPath();
    lorenzCtx.moveTo(paddingX, canvasH - paddingY);
    
    let runningSum = 0;
    for (let i = 0; i < len; i++) {
        runningSum += resources[i] / cumulativeSum;
        const xCoord = paddingX + ((i + 1) / len) * graphW;
        const yCoord = (canvasH - paddingY) - (runningSum * graphH);
        lorenzCtx.lineTo(xCoord, yCoord);
    }
    lorenzCtx.stroke();

    // C. Draw Live Generational Lineage Cladograms
    historicalLineageTally = {};
    population.forEach(a => {
        historicalLineageTally[a.lineageCode] = (historicalLineageTally[a.lineageCode] || 0) + 1;
    });

    let strainFrequencies = Object.entries(historicalLineageTally).sort((a, b) => b[1] - a[1]).slice(0, 5);

    let drawingYOffset = 18;
    strainFrequencies.forEach(([code, count]) => {
        let percentShare = count / population.length;
        
        // Draw connection bracket lines scaled nicely into vertical telemetry suite
        cladogramCtx.strokeStyle = '#2c2a29';
        cladogramCtx.lineWidth = 1;
        cladogramCtx.beginPath();
        cladogramCtx.moveTo(20, canvasH / 2);
        cladogramCtx.lineTo(45, drawingYOffset);
        cladogramCtx.lineTo(105, drawingYOffset);
        cladogramCtx.stroke();

        // Output line name nodes
        cladogramCtx.font = '9px monospace';
        cladogramCtx.fillStyle = '#6e6b64';
        cladogramCtx.fillText(`${code} (${Math.round(percentShare * 100)}%)`, 112, drawingYOffset + 3);
        drawingYOffset += 18;
    });

    return gini;
}

function processPhaseSpaceOrbit(coopCount, defCount) {
    phaseCtx.clearRect(0, 0, phaseCanvas.width, phaseCanvas.height);
    
    const canvasW = phaseCanvas.width;  // 300
    const canvasH = phaseCanvas.height; // 110

    const sumTotal = coopCount + defCount || 1;
    const xRatio = coopCount / sumTotal;
    const yRatio = defCount / sumTotal;

    const padX = 35;
    const padY = 20;
    const graphW = canvasW - (padX * 2);
    const graphH = canvasH - (padY * 2);

    historicalTrajectory.push({ 
        x: padX + (xRatio * graphW), 
        y: (canvasH - padY) - (yRatio * graphH) 
    });
    if (historicalTrajectory.length > 200) historicalTrajectory.shift();

    // Draw grid bounds for context
    phaseCtx.strokeStyle = '#e6e4de';
    phaseCtx.lineWidth = 1;
    phaseCtx.strokeRect(padX, padY, graphW, graphH);

    // Draw real-time parametric track line
    phaseCtx.strokeStyle = 'rgba(58, 97, 134, 0.45)';
    phaseCtx.lineWidth = 1.25;
    phaseCtx.beginPath();
    if (historicalTrajectory.length > 0) phaseCtx.moveTo(historicalTrajectory[0].x, historicalTrajectory[0].y);
    for (let i = 1; i < historicalTrajectory.length; i++) {
        phaseCtx.lineTo(historicalTrajectory[i].x, historicalTrajectory[i].y);
    }
    phaseCtx.stroke();

    // Active pointer coordinates node head
    if (historicalTrajectory.length > 0) {
        const structuralHead = historicalTrajectory[historicalTrajectory.length - 1];
        phaseCtx.fillStyle = '#3a6186';
        phaseCtx.beginPath(); 
        phaseCtx.arc(structuralHead.x, structuralHead.y, 3.5, 0, Math.PI * 2); 
        phaseCtx.fill();
    }
}

// ============================================================================
// --- 8. SYSTEM SYNC & INTERFACE COMPONENT HARNESS --------------------------
// ============================================================================
function flushTelemetryUI(gini) {
    document.getElementById('valGen').innerText = String(currentGeneration).padStart(4, '0');
    document.getElementById('valPop').innerText = String(population.length).padStart(3, '0');
    document.getElementById('valBank').innerText = `${bankReserveEscrow.toFixed(1)}e`;
    document.getElementById('valGini').innerText = gini.toFixed(2);
    document.getElementById('barGini').style.width = `${gini * 100}%`;

    let cheaters = 0, generous = 0, copycats = 0;
    population.forEach(a => {
        const type = a.getExpressedPhenotype();
        if (type === 'Cheater') cheaters++;
        else if (type === 'Generous') generous++;
        else if (type === 'Copycat') copycats++;
    });

    const total = population.length || 1;
    const cPct = (cheaters / total) * 100;
    const gPct = (generous / total) * 100;
    const rPct = (copycats / total) * 100;

    document.getElementById('pctDef').innerText = `${Math.round(cPct)}%`;
    document.getElementById('pctCop').innerText = `${Math.round(gPct)}%`;
    document.getElementById('pctRec').innerText = `${Math.round(rPct)}%`;

    document.getElementById('statusDef').innerText = cPct > 50 ? "CRIMSON DOMINANCE" : "NOMINAL TRACE";
    document.getElementById('statusCop').innerText = gPct > 50 ? "MUTUAL EXPANSION" : "STABLE POOL";
    document.getElementById('statusRec').innerText = rPct > 50 ? "SYSTEM BALANCED" : "RECONCILING";

    executeOracleNarration(gini, cPct, gPct, rPct);
    processPhaseSpaceOrbit(generous + copycats, cheaters);
}

function pushTerminalLog(message) {
    const logBox = document.getElementById('fedTerminalLog');
    logBox.innerHTML += `<br>${message}`;
    logBox.scrollTop = logBox.scrollHeight; // Auto anchor scroll track to follow new updates
}

// ============================================================================
// --- 9. ENGINE RUNTIME CLOCK MECHANISM LOOP ---------------------------------
// ============================================================================
function coreSimulationEngine() {
    if (isSimulationPaused) {
        requestAnimationFrame(coreSimulationEngine);
        return;
    }

    // Execute multiple mathematical matrix updates per display frame call based on current velocity settings
    for (let step = 0; step < simulationVelocity; step++) {
        environmentalLandscape.evaporateAndDiffuse();
        population.forEach(agent => agent.updatePhysics());
        processGridCollisions();

        elapsedFrames++;
        if (elapsedFrames >= CONFIG.generationFrames) {
            elapsedFrames = 0;
            runMacroEvolutionarySweep();
        }
    }

    // Clear and execute canvas draws once per frame cycle to save memory bandwidth
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    environmentalLandscape.renderOverlay();
    population.forEach(agent => agent.renderNode());

    const liveGiniIndex = calculateMetricsAndDrawCharts();
    flushTelemetryUI(liveGiniIndex);

    requestAnimationFrame(coreSimulationEngine);
}

function reinitializeEcosystem() {
    population = [];
    uniqueStrainRegistry.clear();
    for (let i = 0; i < CONFIG.popSize; i++) {
        population.push(new ChromosomalAgent(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}
reinitializeEcosystem();

// ============================================================================
// --- 10. CONTROLLER WIRE EVENTS INTEGRATIONS --------------------------------
// ============================================================================
document.getElementById('btnPause').addEventListener('click', (e) => {
    isSimulationPaused = !isSimulationPaused;
    e.target.innerText = isSimulationPaused ? "▶ Resume System" : "⏸ Pause System";
    document.getElementById('systemStatus').innerText = isSimulationPaused ? "SYSTEM PAUSED" : "SANDBOX ACTIVE";
});

document.getElementById('sliderSpeed').addEventListener('input', (e) => {
    simulationVelocity = parseInt(e.target.value);
    document.getElementById('lblSpeed').innerText = `${simulationVelocity}x`;
});

document.getElementById('btnToggleBankPolicy').addEventListener('click', (e) => {
    if (centralBankPolicy === "QE") {
        centralBankPolicy = "AUSTERITY";
        e.target.innerText = "Switch to QE";
        document.getElementById('lblBankPolicy').innerText = "Policy: Austerity";
        pushTerminalLog("[SYS] REGULATORY INVERSION: AUSTERITY ENFORCED.");
    } else {
        centralBankPolicy = "QE";
        e.target.innerText = "Switch to Austerity";
        document.getElementById('lblBankPolicy').innerText = "Policy: QE Active";
        pushTerminalLog("[SYS] REGULATORY INVERSION: QE QUANTUM MATRIX ONLINE.");
    }
});

// God Mode Intervention Hooks
document.getElementById('brushFamine').addEventListener('click', () => {
    population.forEach(a => a.energy *= 0.3); // Wipe out 70% of energy reserves immediately
    pushTerminalLog("[GOD-MODE] INDUCED THERMODYNAMIC CRISIS ZONE.");
});

document.getElementById('brushPlague').addEventListener('click', () => {
    population.forEach(a => {
        if(Math.random() > 0.4) {
            a.genome.G1_Altruism = 0.05; // Force immediate mutation into highly exploitative Cheaters
            a.lineageCode = "Strain-PLAGUE-666";
        }
    });
    pushTerminalLog("[GOD-MODE] INJECTED IDEOLOGICAL CONTAGION VECTORS.");
});

document.getElementById('simReset').addEventListener('click', () => {
    currentGeneration = 1; elapsedFrames = 0; bankReserveEscrow = 100.0;
    historicalTrajectory = [];
    environmentalLandscape.initializeFields();
    reinitializeEcosystem();
    pushTerminalLog("[SYS] FULL SANDBOX MATRICES REINITIALIZED.");
});

// Interactive Live Legend Ticker Hover Highlighting Handlers
document.querySelectorAll('.demo-row').forEach(element => {
    element.addEventListener('mouseenter', (e) => {
        activeHoverArchetype = e.currentTarget.getAttribute('data-archetype');
    });
    element.addEventListener('mouseleave', () => {
        activeHoverArchetype = null;
    });
});

// --- 11. TIME-PARADIGM CAMPAIGN CONFIGURATIONS SELECTORS ---
function resetActivePresetClass(targetButton) {
    document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
    targetButton.classList.add('active');
}

document.getElementById('presetDefault').addEventListener('click', (e) => {
    resetActivePresetClass(e.target);
    reinitializeEcosystem();
    pushTerminalLog("[PARADIGM] LOADED STANDARD SPECTRUM BASELINE.");
});

document.getElementById('presetCommons').addEventListener('click', (e) => {
    resetActivePresetClass(e.target);
    population = [];
    // Injection mix: 90% Pure Cooperators, 10% Aggressive Defectors
    for (let i = 0; i < CONFIG.popSize; i++) {
        let isDefector = i < (CONFIG.popSize * 0.10);
        let genome = {
            G1_Altruism: isDefector ? 0.05 : 0.95,
            G2_Forgiveness: isDefector ? 0.05 : 0.95,
            G3_DesperationLimit: 4.0
        };
        population.push(new ChromosomalAgent(
            Math.random() * canvas.width, 
            Math.random() * canvas.height, 
            genome, 
            isDefector ? "Strain-TRAGEDY-DEF" : "Strain-TRAGEDY-COOP"
        ));
    }
    pushTerminalLog("[PARADIGM] TRAGEDY OF COMMONS INITIALIZED: 90% COOP / 10% DEF.");
});

document.getElementById('presetLateCap').addEventListener('click', (e) => {
    resetActivePresetClass(e.target);
    population = [];
    // Inject extreme metabolic costs, low initial capital pools, and force austerity mode
    for (let i = 0; i < CONFIG.popSize; i++) {
        let agent = new ChromosomalAgent(Math.random() * canvas.width, Math.random() * canvas.height);
        agent.energy = 10.0; // Stranded starting capital
        population.push(agent);
    }
    centralBankPolicy = "AUSTERITY";
    document.getElementById('lblBankPolicy').innerText = "Policy: Austerity";
    document.getElementById('btnToggleBankPolicy').innerText = "Switch to QE";
    pushTerminalLog("[PARADIGM] LATE-STAGE INTERSECT ACTIVE: LOW CAPITAL DRIFT.");
});

document.getElementById('presetUtopia').addEventListener('click', (e) => {
    resetActivePresetClass(e.target);
    population = [];
    // Deploy an isolated high-density cluster of pure Copycats to trace protected cooperative loops
    for (let i = 0; i < CONFIG.popSize; i++) {
        let inCluster = i < (CONFIG.popSize * 0.60);
        let x = inCluster ? (canvas.width/2 + (Math.random()-0.5)*120) : (Math.random()*canvas.width);
        let y = inCluster ? (canvas.height/2 + (Math.random()-0.5)*120) : (Math.random()*canvas.height);
        let genome = {
            G1_Altruism: inCluster ? 0.50 : Math.random(),
            G2_Forgiveness: inCluster ? 0.50 : Math.random(),
            G3_DesperationLimit: 3.0
        };
        population.push(new ChromosomalAgent(x, y, genome, inCluster ? "Strain-UTOPIAN-CORE" : null));
    }
    pushTerminalLog("[PARADIGM] COOPERATIVE ISOLATION TRUST LOOP RUNNING.");
});

// Ignition Execution
coreSimulationEngine();