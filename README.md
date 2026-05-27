# Phenotype: An Evolutionary Agent-Based Model

An open-source computational sandbox translating game theory and evolutionary dynamics into fluid visual simulation.

**Live Sandbox:** [Deploying Soon]

---

## What is Phenotype?

Phenotype is an interactive simulation that places hundreds of tiny, autonomous agents onto a 2D grid. Each agent follows a simple behavioral strategy—cooperate, cheat, or copy—and when two agents bump into each other, they play a round of the famous **Prisoner's Dilemma**. Over time, successful strategies survive and reproduce; unsuccessful ones die out. The result is a real-time evolutionary arms race you can watch, tweak, and crash.

The simulation doesn't just display numbers. It visualizes **wealth inequality**, **strategy demographics**, **genetic lineages**, and even **macroeconomic policy interventions**—all within a clean, print-editorial dashboard inspired by book design.

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

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/phenotype-abm.git
   cd phenotype-abm
2. Open `index.html` in any modern browser. No build step, no dependencies (except MathJax loaded via CDN for equation rendering).
3. The simulation starts automatically. Use the controls to pause, change speed, or trigger God Mode events.

### Technology Stack
* **HTML5 Canvas:** For high-performance 2D rendering.
* **Vanilla JavaScript (ES6+):** With no frameworks.
* **CSS Grid & Flexbox:** For the three-column dashboard.
* **MathJax:** For LaTeX equation display in the theory panel.

The entire project is a single-page application with zero external runtime dependencies beyond the MathJax CDN script.

### Why This Matters
Most people learn the Prisoner's Dilemma as a static 2×2 table in a textbook. Phenotype makes it spatial, temporal, and visual. It lets you ask:

* Under what conditions does cooperation become evolutionarily stable?
* How does inequality emerge from simple individual interactions?
* Can fiscal policy (QE vs. austerity) prevent systemic collapse?
* What happens when you inject a crisis into a balanced ecosystem?

This is a sandbox for questions that algebra alone cannot answer.
