# Phenotype: An Evolutionary Agent-Based Model (ABM)

An open-source computational sandbox translating game theory and evolutionary dynamics into fluid visual simulation.

* **Primary (Vercel):** [Launch Live Sandbox](https://phenotype-abm.vercel.app/)
* **Secondary (GitHub Pages):** [View Mirror Link](https://anwitadpillai.github.io/phenotype-abm/)

---

## Core Simulation Concepts

### The Prisoner's Dilemma (Iterated)

When two agents meet, they each decide to **Cooperate** or **Defect** without knowing the other's choice. Their payoffs follow this classic matrix:

| Agent A | Agent B | A's payoff | B's payoff |
|:---|:---|:---|:---|
| Cooperate | Cooperate | +3.0 | +3.0 |
| Cooperate | Defect    | 0.0  | +5.0 |
| Defect    | Cooperate | +5.0 | 0.0  |
| Defect    | Defect    | +1.0 | +1.0 |

Agents remember past encounters (Copycats use this memory) and can adjust their behavior based on local chemical signals left by others.

### Strategy Phenotypes

Every agent carries a set of continuous genetic parameters that map to one of three observable strategies:

| Strategy | Behavior | Color |
|:---|:---|:---|
| **The Cheater (Defector)** | Always defects. Maximizes short-term gains but risks system collapse if too many exploit cooperators. | Red |
| **The Generous (Cooperator)** | Always cooperates. Thrives in trusting clusters but is vulnerable to exploitation by cheaters. | Green |
| **The Copycat (Tit-for-Tat)** | Starts by cooperating, then mirrors the opponent's last move. Enforces accountability without aggression. | Blue |

An agent's genome also includes **forgiveness** (how likely it is to forgive past defections) and a **desperation threshold**—if energy drops below this limit, even a cooperator will defect to survive.

### Generations and Evolution

Every 500 simulation frames, a **generation** ends:

1. **Bottom 20%** of agents (by energy) are **pruned**.
2. **Top 20%** replicate, passing their genes (and lineage codes) to offspring.
3. A **12% mutation rate** introduces random variations in altruism and forgiveness, mimicking genetic drift.

This cycle repeats indefinitely, allowing strategies to evolve under selective pressure.

### Environmental Pheromone Memory

Agents leave behind invisible chemical footprints when they cooperate or defect. These pheromones diffuse across a low-resolution grid and slowly evaporate. An agent standing in an area heavily saturated with "defection pheromones" may become more likely to defect itself—a simple form of spatial culture.

---

## Dashboard Layout

The simulation runs in a **three-column research dashboard**:

### Left Panel — Theory & Configuration
- Mathematical specification of the model (genome, spatial signals) rendered with LaTeX.
- **Campaign Preset** buttons to load pre-built scenarios.
- Explanatory prose detailing the underlying mechanics.

### Center Panel — The Sandbox
- A **620×620 canvas** where agents move, collide, and evolve.
- **System Oracle**: A real-time narrative commentary on the state of the economy (e.g., "CRIMSON DOMINANCE // Exploitative strategies oversaturating local vectors").
- **Control Bar**: Play/Pause, simulation speed (1×–5×), and **God Mode** crisis buttons.

### Right Panel — Telemetry & Diagnostics
- Live metrics: generation number, Gini coefficient, population, central bank reserves, tax rate, aggregate debt.
- **Strategy Demographics** with interactive hover filtering (highlight only one strategy on the canvas).
- **Central Bank Console** with autonomous QE/Austerity policies and a scrolling terminal log.
- Four miniature diagnostic charts:
  - **Lorenz Curve** (wealth inequality)
  - **Lineage Cladogram** (top surviving genetic strains)
  - **Foraging Saturation vs. Kinetic Activity** (placeholder)
  - **Lotka-Volterra Phase Trajectory** (cooperator vs. defector orbit over time)

---

## Features

### God Mode Interventions
Three buttons let you play macro-level crisis designer:
- **Induce Thermodynamic Famine**: Instantly wipes 70% of all agent energy reserves.
- **Inject Ideological Mutation**: Forces 60% of agents to become extreme Cheaters with a shared "Plague" lineage.
- **Reinitialize System Matrix**: Full reset to default starting conditions.

### Campaign Presets
Quickly load four distinct socio-economic scenarios:
1. **Standard Baseline Spectrum** – Random initial strategies.
2. **The Tragedy of the Commons** – 90% cooperators, 10% defectors. Watch how fast the commons collapse.
3. **Late-Stage Capitalist Corridor** – Low starting capital, austerity enforced. Inequality skyrockets immediately.
4. **The Fragile Utopian Loop** – 60% of agents are Copycats clustered in the center. Can trust survive without enforcement?

### Autonomous Central Bank
A built-in AI fiscal policy engine monitors inequality and population health:
- **QE Mode (Quantitative Easing)**: If the Gini coefficient exceeds 0.50, the bank injects 60% of its reserves into the poorest 20% of agents.
- **Austerity Mode**: The bank hoards reserves and siphons 2% of all agent energy each generation. Only releases emergency stimulus if the population crashes below 35 agents.
- The tax rate on every interaction (6% by default) feeds the central escrow pool.

### Interactive Legend Filtering
Hover over any strategy name in the telemetry panel to dim all other agents on the canvas—instantly seeing where Cooperators, Cheaters, or Copycats are concentrated.

### Real-Time Diagnostic Charts
Four continuously updated mini-graphs track the system's health:
- **Lorenz Curve**: Visualizes wealth inequality against the line of perfect equality.
- **Lineage Cladogram**: Shows the most common genetic family trees and their population share.
- **Phase Trajectory**: Plots the ratio of cooperators to defectors over time in a predator-prey phase space, revealing cyclic dynamics.

---

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
### Acknowledgements
This project was developed using a human-in-the-loop workflow, leveraging AI tools for structural organization and technical drafting. All logic, implementation, and system design were reviewed, verified, and refined by Anwita D Pillai.
