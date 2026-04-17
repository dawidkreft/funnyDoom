// Menu, pause, and game-over screens
export class Menu {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = 'main'; // 'main' | 'paused' | 'gameover' | 'levelclear'
    this.visible = true;
    this._selected = 0;
    this._items = [];
  }

  show(state) {
    this.state = state;
    this.visible = true;
    this._selected = 0;
    this._items = this._getItems();
  }

  hide() {
    this.visible = false;
  }

  _getItems() {
    switch (this.state) {
      case 'main':       return ['▶  GRAJ', '? STEROWANIE'];
      case 'paused':     return ['▶  WRÓĆ DO GRY', '⏹  MENU GŁÓWNE'];
      case 'gameover':   return ['↺  RESTART', '⏹  MENU GŁÓWNE'];
      case 'levelclear': return ['▶  NASTĘPNY POZIOM'];
      default: return [];
    }
  }

  navigate(dir) {
    this._selected = (this._selected + dir + this._items.length) % this._items.length;
  }

  getSelection() {
    return this._items[this._selected];
  }

  draw(score = 0) {
    if (!this.visible) return;
    const { ctx } = this;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Overlay
    ctx.save();
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    ctx.textAlign = 'center';

    // Title
    if (this.state === 'main') {
      ctx.font = 'bold 52px monospace';
      ctx.fillStyle = '#ff6e40';
      ctx.fillText('🎈 FunnyDoom 🎈', W / 2, H / 2 - 120);
      ctx.font = '18px monospace';
      ctx.fillStyle = '#aaa';
      ctx.fillText('Zabij potwory. Zbierz pizzę. Śmiej się.', W / 2, H / 2 - 80);
    } else if (this.state === 'gameover') {
      ctx.font = 'bold 48px monospace';
      ctx.fillStyle = '#f44336';
      ctx.fillText('💀 KONIEC GRY 💀', W / 2, H / 2 - 110);
      ctx.font = '22px monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText(`Wynik: ${score}`, W / 2, H / 2 - 70);
    } else if (this.state === 'paused') {
      ctx.font = 'bold 42px monospace';
      ctx.fillStyle = '#ffeb3b';
      ctx.fillText('⏸  PAUZA', W / 2, H / 2 - 100);
    } else if (this.state === 'levelclear') {
      ctx.font = 'bold 40px monospace';
      ctx.fillStyle = '#69f0ae';
      ctx.fillText('🏆 POZIOM UKOŃCZONY!', W / 2, H / 2 - 100);
      ctx.font = '22px monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText(`Wynik: ${score}`, W / 2, H / 2 - 60);
    }

    // Menu items
    ctx.font = 'bold 22px monospace';
    this._items.forEach((item, i) => {
      const y = H / 2 - 10 + i * 44;
      ctx.fillStyle = i === this._selected ? '#ff6e40' : '#ccc';
      ctx.fillText(item, W / 2, y);
    });

    // Controls hint
    if (this.state === 'main') {
      ctx.font = '13px monospace';
      ctx.fillStyle = '#555';
      ctx.fillText('↑↓ / Enter — wybierz  |  WASD — ruch  |  Mysz — obrót  |  LPM — strzał  |  Q/E — zmień broń  |  ESC — pauza', W/2, H - 20);
    }

    ctx.textAlign = 'left';
  }
}
