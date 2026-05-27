# Phenotype: An Evolutionary Agent-Based Model (ABM)

## What This Is

Phenotype is a computational sandbox for exploring game theory, evolutionary dynamics, and institutional economics through spatial agent-based simulation.

**The Big Question:** How do cooperation and defection compete when agents are spatial, resources vary, institutions intervene, and evolution shapes behavior?

## How to Run

1. Open `index.html` in a modern browser
2. Simulation starts automatically
3. Watch agents evolve, interact, and form strategies

## Key Features

### Spatial Game Theory
- Agents move randomly across a 2D grid
- Collisions trigger Prisoner's Dilemma interactions
- Each agent carries genetic traits that shape behavior

### Evolutionary Dynamics
- Agents reproduce based on fitness (energy)
- Genetic mutation creates variation
- Natural selection drives strategy evolution
- Lineage tracking shows which families survive

### Macroeconomic Systems
- Taxation system (agents pay % of payoffs)
- Central bank with two policy regimes (QE vs Austerity)
- Emergency interventions when inequality spikes
- Terminal logs show real-time policy decisions

### Spatial Memory
- Pheromone grid tracks local cooperation/defection history
- Agents sense environment and adjust behavior
- Creates "cultural landscapes" of trust/betrayal

### Pre-Built Scenarios
**Standard Baseline** - Balanced initial distribution
**Tragedy of Commons** - Can cooperators resist defectors?
**Late-Stage Capitalist** - Does inequality destabilize society?
**Fragile Utopia** - Can isolated cooperators thrive without defectors?

## Understanding the Telemetry

**Generation** - Timestep counter (increment every 500 frames)

**Gini Coefficient** - Inequality measure
- 0.0 = perfect equality
- 1.0 = one agent has everything
- Watch how policy and strategy mix affect inequality

**Population** - Living agents
- Watch crashes/booms based on strategy dominance

**Central Escrow Pool** - Tax revenue collected by the bank

**Adaptive AI Tax Rate** - Can be toggled between manual/auto

**Strategy Demographics** - % of population in each strategy
- Cheater (red) - Always defects, exploits
- Generous (green) - Always cooperates, trusts
- Copycat (blue) - Mimics opponent's last move

**Lorenz Curve** - Visualizes wealth distribution
- Straight line = equality
- Curved = inequality growing

**Lineage Cladogram** - Shows which genetic families survive

**Phase Orbit** - Predator-prey dynamics (Lotka-Volterra)
- Watch how Cooperators vs Defectors balance over time

## Interactive Controls

**Pause/Resume** - Freeze time to examine specific generation

**Simulation Speed** - 1x to 5x (accelerate to see 1000+ generations)

**Policy Toggle** - Switch between QE and Austerity
- QE: Auto-redistribute to prevent inequality spirals
- Austerity: Hoard reserves, intervene only in catastrophe

**Induce Famine** - Wipe out 70% of resources (test system resilience)

**Inject Mutation** - Force 50% of population to become defectors (test cascades)

**Reinitialize** - Reset to generation 1

## What Questions Can This Answer?

**Game Theory:**
- Why do cooperators persist even when defectors exploit them?
- What role does memory and reputation play?
- How do institutions stabilize or destabilize cooperation?

**Evolutionary Biology:**
- How do traits spread through populations?
- When does mutation help? When does it hurt?
- What determines which lineages survive?

**Economics:**
- Does redistribution prevent inequality spirals?
- What's the optimal tax rate for system stability?
- When does austerity work? When does it fail?

**Complex Systems:**
- How do local interactions create global patterns?
- Can you predict system collapse before it happens?
- Are there stable equilibrium points?

## Expected Behaviors

**Generations 1-50:** Mixed strategies, relatively stable

**Generations 50-200:** One strategy (usually Defector) dominates

**Generations 200+:** Predator-prey cycles
- Defectors crash the system (deplete cooperators)
- Cooperators recover (defectors have nothing to exploit)
- Cycle repeats

**With QE Policy:** Inequality contained, system more stable

**With Austerity:** Inequality spikes, crisis cycles sharper

**With Spatial Pheromones:** Local clusters of trust/betrayal emerge

## Technical Implementation

**No external dependencies** - Pure vanilla JavaScript, HTML5 Canvas

**Performance optimized:**
- Spatial collision grid (O(n) instead of O(n²))
- Pheromone diffusion (reaction-diffusion equations)
- Real-time Gini calculation

**150 agents rendering at 60fps with full evolutionary dynamics**

## Why This Matters

The Prisoner's Dilemma is usually studied in textbooks as a static payoff matrix.

But real life is:
- **Spatial** (you interact with neighbors, not random strangers)
- **Temporal** (you remember past interactions)
- **Ecological** (resources vary, scarcity matters)
- **Institutional** (governments, banks, policies exist)
- **Evolutionary** (behaviors that work spread)

Phenotype makes all of this visible and interactive.

You can watch cooperation and defection compete under realistic constraints. You can see how institutions shape strategy evolution. You can test policy interventions and watch system-wide consequences unfold.

---