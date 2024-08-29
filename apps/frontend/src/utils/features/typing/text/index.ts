/**
 * Byimaan
 */

export function captializeText(str:string){
    if (!str.length) return str;
    let text = str.toLowerCase();
    return text[0].toUpperCase() + text.substring(1)
}