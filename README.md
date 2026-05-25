# Phenotype: An Evolutionary Agent-Based Model

An open-source computational sandbox translating game theory and evolutionary dynamics into fluid visual simulation.

**Live Sandbox:** [Deploying Soon]

---

## The Core Concept

Phenotype simulates an ecosystem of hundreds of autonomous agents moving across a 2D grid. When agents collide, they interact according to the **Iterated Prisoner's Dilemma** and the **Tragedy of the Commons**. Over successive generations, strategies compete, mutate, and either survive or die out based on accumulated resources.

Each agent carries a behavioral phenotype—a strategy that determines how it responds to others. The simulation does not prescribe outcomes; it surfaces emergent dynamics. Under what conditions do cooperative strategies thrive? When does exploitation collapse the system? How does copying your neighbor's behavior reshape the population?

The UI uses a minimalist, print-editorial layout consistent with my broader design language—dark text on warm ivory, serif typography, clean data presentation. No arcade aesthetics. Just the raw behavior of the system, rendered legibly.

---

## Architectural Mechanics

The simulation runs on a single `requestAnimationFrame` loop processing three phases per frame:

1. **Spatial Kinetics:** Agent positions updated via continuous velocity vectors. Boundary collisions resolved. Agent-to-agent proximity mapped for interaction detection.
2. **Game-Theoretic Payoffs:** When two agents overlap, their strategies determine the resource exchange using a standard Prisoner's Dilemma payoff matrix.
3. **Macro-Evolutionary Pressure:** At the end of each generation, agents below a resource threshold are pruned. High-resource agents replicate, passing down their strategy phenotype. A small mutation rate introduces random strategy assignments.

---

## Strategy Phenotypes

Three archetypes, visually distinguished by color:

| Strategy | Behavior | Color |
|:---|:---|:---|
| **The Cheater (Defector)** | Always defects. Extracts maximum resources from cooperators but performs poorly in isolation. | Red |
| **The Generous (Cooperator)** | Always cooperates. Builds mutual gains with other cooperators but is vulnerable to exploitation. | Green |
| **The Copycat (Tit-for-Tat)** | Begins by cooperating, then mirrors the opponent's last move in subsequent encounters. Enforces accountability without aggression. | Blue |

---

## What a Generation Looks Like
```
Generation N
├── Agents move randomly across grid
├── Collisions trigger payoff calculations
│   ├── Cheater vs. Generous → Cheater +5, Generous +0
│   ├── Cheater vs. Cheater → Both +1
│   ├── Generous vs. Generous → Both +3
│   └── Copycat vs. any → First round cooperate, then mirror
├── After 500 frames: generation ends
│   ├── Bottom 20% by resource score → pruned
│   ├── Top 20% → replicate (inherit strategy)
│   └── 5% of new agents → random mutation
└── Generation N+1 begins
```

---

## Planned Sandbox Features

- **"God Mode" Environmental Modifiers:** Brush tools to draw localized micro-crises onto the canvas—Famine zones that accelerate resource decay, Ideological Plagues that force mutation cascades, Institutional Sanctions that freeze rogue defectors.
- **Macroeconomic Campaign Scenarios:** Pre-configured setups modeled on real-world dynamics: structural inequality corridors, restricted extraction infrastructures, fragile utopian trust loops.
- **Dynamic Visual Scale:** Agent size scales proportionally to accumulated capital, mapping structural wealth inequality onto the grid in real time.

---

## Current Status

**Pre-alpha.** Rendering engine and single-agent movement functional. Collision detection and payoff matrix integration in progress. Evolutionary selection loop planned next.

---

## Why This Matters

The Prisoner's Dilemma is typically studied through static payoff matrices in economics textbooks. But real-world strategy evolution is spatial, temporal, and emergent. Phenotype makes these dynamics visible. It asks: in a world where cheaters exploit and cooperators sustain, what survives—and what collapses the system?

This project sits at the intersection of computational social science, evolutionary biology, and political economy. It's a sandbox for questions that can't be answered with algebra alone.

---

## Repository Structure

```text
phenotype-abm/
├── index.html   # Semantic structural wrappers & canvas DOM mounting
├── style.css    # Typography architecture and print-editorial color palettes
├── app.js       # Vector math, matrix logic, and frame rendering engine
└── README.md    # Theoretical documentation and deployment maps
```
