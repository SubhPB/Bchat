/** Byimaan */

export function generateRandomColor(): string {
    // Random values for HSL components
    const hue = Math.floor(Math.random() * 360); // Hue: 0 to 360
    const saturation = Math.floor(Math.random() * 30) + 30; // Saturation: 30% to 60%
    const lightness = Math.floor(Math.random() * 20) + 30; // Lightness: 30% to 50%
    const alpha = 0.7; // Alpha: slightly transparent

    // Return HSLA color string
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}