// helper for simple easing / tween
export function easeOutQuad(t){ return 1 - (1-t)*(1-t); }
export function lerp(a,b,t){ return a + (b-a) * t; }
