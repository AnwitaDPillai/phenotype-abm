const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

// --- 1. THE AGENT CLASS BLUEPRINT ---
class Agent {
    constructor(x, y, strategy) {
        this.x = x;
        this.y = y;
        // Assign a random velocity vector between -2 and +2 pixels per frame
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.strategy = strategy; // "Cheater", "Generous", or "Copycat"
        this.radius = 6;          // Visual scale size of the pixel agent
    }

    // Update kinetic position and calculate wall-bounce vectors
    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wall collisions (X axis bounds)
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.vx *= -1; // Reverse vector direction on collision
        }
        // Wall collisions (Y axis bounds)
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.vy *= -1;
        }
    }

    // Render the agent onto the 2D canvas context
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Strategy color mappings based on your design table
        if (this.strategy === 'Cheater') ctx.fillStyle = '#b83b2e';   /* Elegant Red */
        else if (this.strategy === 'Generous') ctx.fillStyle = '#3e7d5a'; /* Deep Green */
        else ctx.fillStyle = '#3a6186';                                /* Slate Blue */
        
        ctx.fill();
        ctx.closePath();
    }
}

// --- 2. INITIALIZATION ---
// Create an array to hold all our agents, and drop a test "Cheater" into the center
const agents = [];
agents.push(new Agent(canvas.width / 2, canvas.height / 2, 'Cheater'));

// --- 3. THE HIGH-FREQUENCY RUN LOOP ---
function engineLoop() {
    // Phase 1: Clear the entire canvas frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Phase 2: Loop through and execute behaviors for every single agent
    agents.forEach(agent => {
        agent.update();
        agent.draw();
    });

    // Phase 3: Synchronize with monitor refresh rate (approx. 60 FPS)
    requestAnimationFrame(engineLoop);
}

// Ignite the engine
engineLoop();