# Phenotype: An ABM

An open-source computational sandbox translating game theory, continuous genetics, and macroeconomics into a fluid, high-fidelity visual simulation.

**Live Sandbox:** [Deploying via GitHub Pages Soon]

---

## The Core Concept

Phenotype simulates an ecosystem of hundreds of autonomous agents interacting across an evaporating biochemical plane. When spatial collisions trigger, agents execute non-zero-sum exchanges modeled on the **Iterated Prisoner's Dilemma** and the **Tragedy of the Commons**. 

Strategy selection is entirely fluid. Instead of relying on hardcoded, discrete choice profiles, agent behaviors adapt continuously to multi-variable genetic vectors, local environmental signals, and resource constraints.

The interface implements an editorial print aesthetic—charcoal typography, crisp data presentation, and warm ivory surfaces—presenting complex multi-canvas analytics without arcade-style distraction.

---

## Architectural Mechanics

The engine runs at a locked 60 FPS by implementing high-performance spatial algorithms and structured runtime phases per animation frame:

1. **Spatial Grid Partitioning ($O(N)$ Complexity):** Instead of evaluating collisions via brute-force nested loops ($O(N^2)$), the canvas is divided into a localized cell grid based on interaction radii. Agents only evaluate coordinates against immediate neighbors, maximizing performance.
2. **Kinetics & Scaled Wealth Inequality:** Coordinates update via independent velocity vectors. Physical node radii scale dynamically in real time ($r \propto \text{Capital}$), physically mapping wealth concentration onto the grid field.
3. **Macro-Evolutionary Sweeps:** Every 500 frames, evolutionary selection executes. Agents with exhausted resource scores are pruned. The top 20% elite earners replicate, splitting their asset capital to produce offspring that inherit their continuous genomic traits under a 12% Gaussian mutation filter.

---

## Continuous Genomic Vectors

Entities carry an embedded chromosomal strand, $\mathbf{G} = [G_1, G_2, G_3]$, defining their baseline behavioral profile:

* $G_1$ **(Altruism):** Dictates baseline willingness to cooperate.
* $G_2$ **(Forgiveness):** Controls memory decay and retaliation thresholds.
* $G_3$ **(Desperation Panic Limit):** Represents an economic survival line. If an agent's internal energy reserves dip below $G_3$, it overrides its genome and defaults to predatory defection to avoid metabolic extinction.

These variables dynamically map into three visible archetypes:

| Strategy Archetype | Structural Rule Matrix | Color Mapping |
| :--- | :--- | :--- |
| **The Cheater** | Vector expressions where $G_1 < 0.35$ or energy is depleted past panic limits ($E < G_3$). Always defects. | Crimson |
| **The Generous** | Altruistic expressions where $G_1 > 0.65$ and $G_2 > 0.55$. Always cooperates. | Deep Forest Green |
| **The Copycat** | Adaptive memory loops. Handshakes with cooperation, then duplicates the rival's previous choice. | Slate Cobalt |

---

## State-of-the-Art Core Systems

### 1. Spatial Signal Signaling (Trust Pheromone Field)
Actions leave invisible, slow-evaporating chemical footprints across a secondary spatial memory matrix terrain. Cooperation bleeds a positive trail; defection poisons the local tile with an adversarial trace. Agents moving through high-poison zones automatically engage defensive pre-emptive defection strategies, visually simulating the localized collapse of societal trust.

### 2. Genetic Lineage Cladograms
A live visual sub-canvas maps maternal lineage trees. When an elite agent clones itself, its offspring inherits a continuous strain code (e.g., `Strain-A-412`). The cladogram traces real-time speciation, allowing observers to watch a predatory strain wipe out ancient cooperators or a hybrid strain survive economic famine to colonize the map.

### 3. The Algorithmic Central Bank Terminal
A rule-based macro-institution tracks the ecosystem's Gini coefficient and manages an autonomous tax fund through two toggleable policy regimes:
* **Quantitative Easing (QE) Mode:** If systemic inequality spikes