const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

// --- 1. THE AGENT CLASS BLUEPRINT ---
class Agent {
    constructor(x, y, strategy) {
        this.x = x;
        this.y = y;
        // Continuous velocity vectors (-1.5 to +1.5 pixels per frame)
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        this.strategy = strategy; // "Cheater", "Generous", or "Copycat"
        this.radius = 5;          // Standardized pixel scale
    }

    // Update spatial kinetics and handle boundary vectors
    update() {
        this.x += this.vx;
        this.y += this.vy;

        // X-Axis Boundary Collision
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -1;
        } else if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx *= -1;
        }

        // Y-Axis Boundary Collision
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy *= -1;
        } else if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy *= -1;
        }
    }

    // Render agent based on phenotype color palette
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        if (this.strategy === 'Cheater') ctx.fillStyle = '#b83b2e';      // Crimson Red
        else if (this.strategy === 'Generous') ctx.fillStyle = '#3e7d5a';  // Deep Green
        else if (this.strategy === 'Copycat') ctx.fillStyle = '#3a6186';   // Slate Blue
        
        ctx.fill();
        ctx.closePath();
    }
}

// --- 2. POPULATION INITIALIZATION ---
const agents = [];
const POPULATION_SIZE = 150; // Total starting pool
const strategies = ['Cheater', 'Generous', 'Copycat'];

// Evenly spawn strategies across random spatial coordinates
for (let i = 0; i < POPULATION_SIZE; i++) {
    const randomX = Math.random() * (canvas.width - 20) + 10;
    const randomY = Math.random() * (canvas.height - 20) + 10;
    const assignedStrategy = strategies[i % strategies.length]; // Cycles through the 3 types
    
    agents.push(new Agent(randomX, randomY, assignedStrategy));
}

// --- 3. HIGH-FREQUENCY RUN LOOP ---
function engineLoop() {
    // Phase 1: Clear the current display frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Phase 2: Update and render the entire agent registry array
    agents.forEach(agent => {
        agent.update();
        agent.draw();
    });

    // Phase 3: Recurse frame at monitor refresh rate
    requestAnimationFrame(engineLoop);
}

// Ignite engine
engineLoop();