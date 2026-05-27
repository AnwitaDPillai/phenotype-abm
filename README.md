# Phenotype: An Agent-Based Model (ABM)

Phenotype is an Agent-Based Model (ABM) designed to simulate the co-evolution of game-theoretic behaviors, maternal lineages, and spatial macroeconomic policies. Built with vanilla JavaScript using HTML5 Canvases, the simulation maps microscopic interactions (Iterated Prisoner’s Dilemma matches) to global emergent behaviors, including tracking resource wealth distributions, spatial memory gradients, and lineage tracing.

---

## 1. System Core Architecture & Configurable Thresholds

The simulation runs on a continuous coordinate environment where agents interact based on spatial proximity. System stability and interaction frequency are regulated by fixed structural constants:

*   **Population Size (`popSize: 150`)**: The target count of initialization agents injected into the sandbox workspace.
*   **Interaction Radius (`interactionRadius: 9`)**: The physical distance threshold within which two agents register an collision, locking them into a game-theoretic interaction phase.
*   **Base Metabolic Cost (`baseMetabolicCost: 0.05`)**: The baseline continuous energy drain subtracted from an agent every execution frame.
*   **Generation Frames (`generationFrames: 500`)**: The duration of an evolutionary epoch. When the global frame counter reaches this threshold, selection and replication scripts trigger.
*   **Mutation Rate (`mutationRate: 0.12`)**: The probability (12%) that a newly spawned child agent undergoes genetic drift, deviating from its parent's phenotypic strategy parameters.
*   **Base Tax Rate (`baseTaxRate: 0.06`)**: A flat 6% tariff applied to all individual transaction yields generated during Prisoner’s Dilemma matches, which directly funds the Central Bank Escrow pool.
*   **Pheromone Grid Resolution (`pheromonesResolution: 20`)**: The cell tile spacing size (in pixels) used to subdivide the canvas for spatial signaling memory updates.

---

## 2. Epigenetic Entity Structure & The Genome Array

Each agent (`ChromosomalAgent`) possesses an individual identity code, kinetic vectors, an energy pool (asset capital), and a three-gene locus (`genome`) that governs decision-making behavior:

### The Gene Locus
1.  **G1_Altruism ($[0.0, 1.0]$)**: Dictates baseline willingness to cooperate. Lower ranges signify predatory tendencies.
2.  **G2_Forgiveness ($[0.0, 1.0]$)**: Controls memory clearance behavior. Dictates whether an agent overrides environmental defection signals or historical betrayal metrics.
3.  **G3_DesperationLimit ($[4.0, 12.0]$)**: The metabolic stress threshold. If an agent's energy reserves fall below this value, it overrides its genetic strategy to engage in absolute defection to survive starvation.

### Phenotypic Classifications
An agent's dynamic state maps to one of three observable behavioral strategies:
*   **Cheater**: Expressed if $G1 < 0.35$ or if the agent’s energy dips below its desperation limit ($G3$). Cheaters consistently default to defection.
*   **Generous**: Expressed if $G1 > 0.65$ and $G2 > 0.55$. Generous agents prioritize cooperation and actively attempt to heal broken cooperation networks.
*   **Copycat**: The baseline intermediate strategy. It mimics the historical action last chosen by a specific opponent during their prior interaction encounter.

### Maternal Lineages
Every agent carries a maternal string token (`lineageCode`), assigned at initialization or inherited exactly from its clonal parent line (e.g., `Strain-A-412`). This acts as an evolutionary tag to trace lineage persistence, dominance, and speciation rates across multi-generational spans without affecting gameplay mechanics.

---

## 3. High-Performance Spatial Indexing Matrix

To avoid the performance degradation of an $O(N^2)$ brute-force distance calculation loop among 150+ entities, the physics engine implements a grid-based spatial partition system matching an $O(N)$ lookup footprint:

1.  The spatial dimensions of the simulation canvas are partitioned into square cells proportional to the agent interaction diameter ($CellSize = InteractionRadius \times 2$).
2.  At the beginning of each physics update, agents are indexed into array buckets corresponding to their grid cell based on their coordinates.
3.  The algorithm evaluates collision checks exclusively within an agent’s native cell and its immediate adjacent neighbor cells (using structural offsets to avoid redundant calculations).
4.  When two agents overlap ($Distance < 9\text{px}$), they exchange velocity vectors (elastic physical bounce) and lock into the interaction payoff engine.

---

## 4. Game-Theoretic Interaction Mechanics

When a spatial collision occurs, agents play an Iterated Prisoner's Dilemma round using decisions calculated from their genomes, transaction logs, and local environmental variables:

| Agent A Choice | Agent B Choice | Raw Payoff A | Raw Payoff B |
| :--- | :--- | :--- | :--- |
| **Cooperate** | **Cooperate** | +3.0 Energy | +3.0 Energy |
| **Defect** | **Cooperate** | +5.0 Energy |  0.0 Energy |
| **Cooperate** | **Defect** |  0.0 Energy | +5.0 Energy |
| **Defect** | **Defect** | +1.0 Energy | +1.0 Energy |

### Institutional Fines & Taxation
*   **Anti-Social Penalty**: If an agent executes $\ge 4$ consecutive defections, it is flagged as a systemic risk. Its transaction yield is penalized by $-0.8$ energy, which is siphoned into the bank reserves.
*   **Macro Tariff**: The flat tax ($6\%$) is deducted from every yield payout and added to the `bankReserveEscrow` pool.

### Dual-Layer Spatial Trust Pheromones
The environment tracks behavior over time through a coordinate matrix (`DualLayerPheromoneGrid`). 
*   Cooperation and Defection events bleed digital signatures ($+0.25$ intensity) into localized tracking cells.
*   Pheromones steadily evaporate across execution frames at a rate of $1.5\%$ per step (`multiplier: 0.985`).
*   Agents scan local tiles before choosing an action. If the defection signature density exceeds $60\%$, agents with a forgiveness index below $0.75$ will override their normal behavior and choose to **Defect**, simulating localized systemic panic.

---

## 5. Selection and Evolutionary Sweeps

When `elapsedFrames` reaches `500`, the environment stops spatial execution to simulate natural selection, generational culling, and clonal reproduction:

1.  **Starvation Filter**: Agents whose energy pools dropped to $\le 0$ during the epoch are eliminated.
2.  **Asset Stratification**: The remaining population is sorted in descending order based on accumulated energy assets.
3.  **The Bottom 20% Pruning**: The lowest $20\%$ of the population distribution is permanently removed from the ecosystem.
4.  **The Top 20% Elite Replication**: The highest-performing $20\%$ of agents clone themselves. The parent halves its energy pool to supply the child with a matching baseline capital pool.
5.  **Genetic Drift Mutation**: During cloning, there is a $12\%$ probability that the child's $G1$ (Altruism) and $G2$ (Forgiveness) genes shift up or down by a random offset ($\pm 0.125$). The child retains the exact `lineageCode` of the parent, enabling cross-generational family tracking.

---

## 6. Algorithmic Central Bank Interventions

During the selection phase, the engine calculates the system's **Gini Coefficient** index ($G$) to measure wealth inequality:

$$G = \frac{\sum_{i=1}^{n} \sum_{j=1}^{n} |x_i - x_j|}{2n^2\mu}$$

Where $x$ represents individual agent energy asset values, $n$ is the active population count, and $\mu$ is the mean energy score. The central bank uses this metric to automate macroeconomic policies based on its active mode:

### Quantitative Easing (QE) Mode
If the Gini inequality score climbs past $0.50$ and the `bankReserveEscrow` vault contains over $20$ units of currency:
*   The bank takes $60\%$ of its capital reserves and divides it equally among the bottom $20\%$ of agents.
*   This mechanism injects liquidity directly into resource-depleted populations to prevent systemic collapse and high extinction rates at the start of the next generation.

### Austerity Mode
The bank hoards asset pools to hedge against absolute population depletion:
*   If the system falls below a critical population floor ($< 35$ agents) and the bank holds over $50$ capital units, it releases $70\%$ of its vault reserves as an emergency structural dividend divided equally across all surviving agents.
*   Otherwise, the bank extracts an additional $2\%$ wealth tax from every agent's asset balance to build safety reserves, letting inequality rise to secure the bank's liquidity.

---

## 7. Real-Time Telemetry Dashboard Suite

The interface processes analytics panels every frame call to visualize real-time macro-dynamics:

*   **Lorenz Wealth Curve Canvas**: Maps the cumulative share of energy assets held by the cumulative share of the population. A straight 45-degree line indicates absolute parity, while the lower dark curve plots real inequality. The gap between them scales dynamically with the calculated Gini index.
*   **Genetic Cladogram Workspace**: Aggregates the `lineageCode` of all active agents, filters the top 5 dominant maternal strains, and draws structural phylogenetic line charts indicating their active percentage share of the ecosystem.
*   **Lotka-Volterra Phase Space Orbit**: Tracks the relationship between cooperative strategies (Generous + Copycat) along the X-axis and predatory strategies (Cheaters) along the Y-axis. It draws a 200-point parametric trajectory line that maps population shifts between prey (cooperators) and predators (defectors).

---

## 8. Built-in Simulation Presets

The sandbox includes four configuration profiles to test behavior under different conditions:

1.  **Standard Spectrum Baseline**: Launches a balanced, random distribution of genes across the ecosystem.
2.  **Tragedy of the Commons**: Spawns $90\%$ pure cooperators and $10\%$ aggressive defectors, demonstrating how quickly unpunished predatory strategies can deplete mutual resource networks.
3.  **Late-Stage Capitalist Drift**: Sets all agents to a low starting capital pool ($10$ energy) and forces the Central Bank into **Austerity Mode**, showing how resource scarcity affects cooperation.
4.  **Cooperative Trust Loop**: Places a high-density cluster of pure Copycat agents in the center of the canvas, demonstrating how local spatial clustering can shield cooperative lineages from external exploitation.