/**
 * ELIFKULA Winter Blog - Enhanced Snowfall Animation
 * Premium lightweight canvas-based snowfall effect with depth
 * Updated with specific snowflake shapes
 */

(function () {
    'use strict';

    const canvas = document.getElementById('snow-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Snowflake characters
    const snowChars = ['❄', '❅', '❆'];

    // Configuration
    const config = {
        particleCount: getParticleCount(),
        layers: [
            { sizeRange: [1, 2], speedRange: [0.3, 0.8], opacity: 0.4 },   // Far layer
            { sizeRange: [2, 4], speedRange: [0.8, 1.5], opacity: 0.6 },   // Mid layer
            { sizeRange: [3, 6], speedRange: [1.2, 2.2], opacity: 0.8 }    // Near layer
        ],
        windSpeed: 0.4,
        windVariation: 0.02
    };

    let globalWind = 0;
    let windTarget = 0;

    // Determine particle count based on device
    function getParticleCount() {
        const width = window.innerWidth;
        if (width < 480) return 30;
        if (width < 768) return 50; // Increased slightly for visibility
        return 70;
    }

    // Snowflake class
    class Snowflake {
        constructor(layerIndex) {
            this.layer = config.layers[layerIndex];
            this.reset();
            // Start at random Y position for initial population
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20; // Start slightly higher to hide text render

            this.size = this.layer.sizeRange[0] + Math.random() * (this.layer.sizeRange[1] - this.layer.sizeRange[0]);
            this.speed = this.layer.speedRange[0] + Math.random() * (this.layer.speedRange[1] - this.layer.speedRange[0]);
            this.opacity = this.layer.opacity * (0.7 + Math.random() * 0.3);

            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = 0.015 + Math.random() * 0.02;
            this.wobbleAmp = 0.3 + Math.random() * 0.5;

            // Assign a random shape
            this.char = snowChars[Math.floor(Math.random() * snowChars.length)];
        }

        update() {
            this.y += this.speed;
            this.wobble += this.wobbleSpeed;
            this.x += globalWind * (this.speed * 0.5) + Math.sin(this.wobble) * this.wobbleAmp;

            // Reset if out of bounds
            if (this.y > canvas.height + 20) {
                this.reset();
            }

            // Wrap horizontally
            if (this.x > canvas.width + 20) {
                this.x = -20;
            } else if (this.x < -20) {
                this.x = canvas.width + 10;
            }
        }

        draw() {
            // Convert radius size to font size multiplier for good visibility
            // Size 1-2 -> 5-10px
            // Size 3-6 -> 15-30px
            const fontSize = this.size * 5;

            ctx.font = `${fontSize}px sans-serif`;
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText(this.char, this.x, this.y);
        }
    }

    // Snowflakes array
    let snowflakes = [];

    // Initialize snowflakes
    function init() {
        resize();
        snowflakes = [];
        const perLayer = Math.floor(config.particleCount / config.layers.length);

        for (let layer = 0; layer < config.layers.length; layer++) {
            for (let i = 0; i < perLayer; i++) {
                snowflakes.push(new Snowflake(layer));
            }
        }
    }

    // Resize canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Update particle count on resize
        const newCount = getParticleCount();
        if (Math.abs(newCount - config.particleCount) > 10) {
            config.particleCount = newCount;
            init();
        }
    }

    // Update wind
    function updateWind() {
        // Slowly change wind direction
        if (Math.random() < 0.01) {
            windTarget = (Math.random() - 0.5) * config.windSpeed * 2;
        }
        globalWind += (windTarget - globalWind) * config.windVariation;
    }

    // Animation loop
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update wind
        updateWind();

        // Update and draw each snowflake
        for (let i = 0; i < snowflakes.length; i++) {
            snowflakes[i].update();
            snowflakes[i].draw();
        }

        requestAnimationFrame(animate);
    }

    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Event listeners
    window.addEventListener('resize', debounce(resize, 200));

    // Reduce animation when page not visible
    let animating = true;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            animating = false;
        } else {
            animating = true;
            animate();
        }
    });

    // Start animation
    init();
    animate();
})();
