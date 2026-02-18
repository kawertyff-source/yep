export default class Map {
  constructor(width=2500, height=800){
    this.width = width;
    this.height = height;
    // decorative neon signs x positions
    this.signs = Array.from({length:12}, (_,i) => ({x: i*220 + 120 + (i%2?30:0), y: 200 + (i%3)*20}));
  }

  draw(ctx){
    // sky / distant
    const w = this.width;
    ctx.fillStyle = '#070712';
    ctx.fillRect(0, 0, w, this.height);

    // horizon / neon city silhouette
    ctx.fillStyle = '#0b0b0f';
    ctx.fillRect(0, 420, w, 380);

    // ground platform / street
    ctx.fillStyle = '#121217';
    ctx.fillRect(0, 560, w, 240);

    // stripes / platforms
    ctx.fillStyle = '#1a1a2b';
    for(let i=0;i<w;i+=160){
      ctx.fillRect(i, 540 + (i%320===0?0:8), 120, 12);
    }

    // neon signs (parallax)
    this.signs.forEach((s, idx) => {
      ctx.save();
      ctx.fillStyle = idx%2? '#ff89c6' : '#7fffd4';
      ctx.fillRect(s.x, s.y, 80, 18);
      ctx.restore();
    });
  }
}
