/**
 * ELIFKULA Winter Blog - Dynamic Time-Based Theme
 * Changes background atmosphere based on time of day
 */

(function () {
    'use strict';

    let manualOverride = null;

    function updateTheme() {
        // Use manual override if set, otherwise real time
        let time;
        if (manualOverride !== null) {
            time = manualOverride;
        } else {
            const now = new Date();
            time = now.getHours() + now.getMinutes() / 60;
        }

        // Define color palettes for different times
        // Format: [Stop 1 (Dark), Stop 2 (Mid), Stop 3 (Light)]
        const palettes = {
            night: ['#0f1729', '#1a2744', '#2d4a6f'], // Deep Night (00-05)
            dawn: ['#152036', '#2a4066', '#5d7da0'], // Dawn (05-08)
            day: ['#2c3e50', '#4b6c9e', '#809ab5'], // Snowy Day (08-16) - brighter but still moody
            dusk: ['#1a1626', '#352a4f', '#604875'], // Winter Sunset (16-19) - purple/pink tints
            evening: ['#0f1729', '#1a2744', '#2d4a6f']  // Back to Night (19-24)
        };

        let startColor, endColor, progress;

        // Determine current phase and interpolation progress
        if (time >= 5 && time < 8) {
            // Dawn Phase
            startColor = palettes.night;
            endColor = palettes.dawn;
            progress = (time - 5) / 3;
        } else if (time >= 8 && time < 11) {
            // Morning Transition
            startColor = palettes.dawn;
            endColor = palettes.day;
            progress = (time - 8) / 3;
        } else if (time >= 11 && time < 15) {
            // Mid Day (Stable)
            startColor = palettes.day;
            endColor = palettes.day;
            progress = 0;
        } else if (time >= 15 && time < 18) {
            // Afternoon to Dusk
            startColor = palettes.day;
            endColor = palettes.dusk;
            progress = (time - 15) / 3;
        } else if (time >= 18 && time < 20) {
            // Dusk to Evening
            startColor = palettes.dusk;
            endColor = palettes.evening;
            progress = (time - 18) / 2;
        } else {
            // Night (Stable)
            startColor = palettes.night;
            endColor = palettes.night;
            progress = 0;
        }

        // Interpolate colors
        const currentColors = [
            interpolateColor(startColor[0], endColor[0], progress),
            interpolateColor(startColor[1], endColor[1], progress),
            interpolateColor(startColor[2], endColor[2], progress)
        ];

        // Apply to CSS variables
        const root = document.documentElement;
        root.style.setProperty('--color-bg-dark', currentColors[0]);
        root.style.setProperty('--color-bg-mid', currentColors[1]);
        root.style.setProperty('--color-bg-light', currentColors[2]);
    }

    // Helper: Linear Interpolation between two hex colors
    function interpolateColor(color1, color2, factor) {
        if (arguments.length < 3) {
            return color1;
        }

        // Ensure factor is between 0 and 1
        factor = Math.max(0, Math.min(1, factor));

        let result = "#";
        // Parse hex to rgb
        const r1 = parseInt(color1.substring(1, 3), 16);
        const g1 = parseInt(color1.substring(3, 5), 16);
        const b1 = parseInt(color1.substring(5, 7), 16);

        const r2 = parseInt(color2.substring(1, 3), 16);
        const g2 = parseInt(color2.substring(3, 5), 16);
        const b2 = parseInt(color2.substring(5, 7), 16);

        // Interpolate
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));

        // Convert back to hex
        const toHex = (n) => {
            const hex = n.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // Run on load and update every minute
    updateTheme();
    setInterval(updateTheme, 60000);

    // EXPOSE TEST MODE TO CONSOLE
    window.WinterTheme = {
        /**
         * Safely changing the time for testing
         * @param {number} hour - Hour of the day (0-24), e.g., 7.5 for 07:30
         */
        setTime: function (hour) {
            manualOverride = hour;
            updateTheme();
            console.log(`❄️ Time manually set to: ${hour.toFixed(2)}:00. Theme updated.`);
            console.log(`(Type 'WinterTheme.reset()' to go back to real time)`);
        },

        /**
         * Reset to real local time
         */
        reset: function () {
            manualOverride = null;
            updateTheme();
            console.log(`❄️ Returned to real time.`);
        }
    };

    console.log("❄️ Winter Theme Loaded. Debug with: WinterTheme.setTime(14) or WinterTheme.reset()");

})();
