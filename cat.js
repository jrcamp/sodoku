// Pip: an optional cat that lives on the top edge of the board.
// It wanders, sits, grooms, naps, plays with yarn, stalks butterflies,
// and reacts to the game. Everything is decorative (aria-hidden).

const FUR_HEAD = (cx, cy, r, earsLeft, earsRight) => `
  <polygon class="fur" points="${earsLeft}"/>
  <polygon class="fur" points="${earsRight}"/>
  <circle class="fur" cx="${cx}" cy="${cy}" r="${r}"/>`;

const SVG = `
<svg class="cat-svg" viewBox="0 0 80 56" aria-hidden="true">
  <g class="pose pose-stand">
    <path class="tail" d="M21 35 C9 32 6 21 12 11"/>
    <rect class="leg leg-a" x="22" y="40" width="5.5" height="15.5" rx="2.75"/>
    <rect class="leg leg-b" x="30" y="40" width="5.5" height="15.5" rx="2.75"/>
    <rect class="leg leg-b knead-1" x="46" y="40" width="5.5" height="15.5" rx="2.75"/>
    <rect class="leg leg-a paw-bat knead-2" x="54" y="40" width="5.5" height="15.5" rx="2.75"/>
    <ellipse class="fur" cx="39" cy="38" rx="22" ry="11"/>
    <g class="head">
      ${FUR_HEAD(63, 25, 12, '52,21 54,6 63,14', '64,14 73,6 74,21')}
      <polygon class="ear-in" points="55,16 56,10 60,14"/>
      <polygon class="ear-in" points="67,14 71,10 71,16"/>
      <g class="eyes"><ellipse class="eye" cx="58.5" cy="24" rx="2.5" ry="3.1"/><ellipse class="eye" cx="67.8" cy="24" rx="2.5" ry="3.1"/><ellipse class="pupil" cx="59.3" cy="24.3" rx="1" ry="2.3"/><ellipse class="pupil" cx="68.6" cy="24.3" rx="1" ry="2.3"/></g>
      <path class="nose" d="M61.7 29.3h3l-1.5 1.8z"/>
      <path class="whisker" d="M55 30l-8-1.5M55 32.2l-8 1.2M72 30l8-1.5M72 32.2l8 1.2"/>
    </g>
    <path class="collar" d="M54 33.5q7 4.5 14 0"/>
    <circle class="bell" cx="61" cy="37" r="2.1"/>
  </g>

  <g class="pose pose-sit">
    <path class="tail" d="M31 54 C17 57 9 50 15 41"/>
    <ellipse class="fur" cx="38" cy="42" rx="14.5" ry="13"/>
    <rect class="leg" x="31" y="41" width="6" height="14.5" rx="3"/>
    <ellipse class="paw-tip" cx="34" cy="54.3" rx="3.4" ry="1.9"/>
    <g class="head">
      ${FUR_HEAD(38.5, 21, 12.5, '27,17 28.5,1.5 37.5,10', '39.5,10 48.5,1.5 50,17')}
      <polygon class="ear-in" points="30,12 31,5.5 35,10"/>
      <polygon class="ear-in" points="42,10 46,5.5 47,12"/>
      <g class="eyes"><ellipse class="eye" cx="33.8" cy="20.5" rx="2.6" ry="3.2"/><ellipse class="eye" cx="43.2" cy="20.5" rx="2.6" ry="3.2"/><ellipse class="pupil" cx="33.8" cy="20.8" rx="1" ry="2.4"/><ellipse class="pupil" cx="43.2" cy="20.8" rx="1" ry="2.4"/></g>
      <g class="yawn"><ellipse class="yawn-mouth" cx="38.5" cy="30.6" rx="3.1" ry="3.5"/><ellipse class="yawn-tongue" cx="38.5" cy="32.9" rx="2" ry="1.2"/></g>
      <path class="nose" d="M37 25.6h3l-1.5 1.8z"/>
      <ellipse class="tongue" cx="38.5" cy="29.4" rx="1.5" ry="1.8"/>
      <path class="whisker" d="M31 26.5l-9-1.5M31 28.5l-9 1.5M46 26.5l9-1.5M46 28.5l9 1.5"/>
    </g>
    <path class="collar" d="M31 31.5q7.5 4.5 15 0"/>
    <circle class="bell" cx="38.5" cy="35" r="2.1"/>
    <!-- Drawn after the head so the paw shows in front of the face while grooming. -->
    <g class="paw-lick"><rect class="leg" x="40" y="41" width="6" height="14.5" rx="3"/><ellipse class="paw-tip" cx="43" cy="54.3" rx="3.4" ry="1.9"/></g>
  </g>

  <g class="pose pose-nap">
    <ellipse class="fur nap-body" cx="37" cy="46" rx="24" ry="10"/>
    <g class="head">
      ${FUR_HEAD(57, 44, 10, '49.5,39 51,27.5 57.5,35', '58,34.5 64.5,27.5 66,39')}
      <path class="closed-eye" d="M51.5 44q2.4 1.8 4.8 0M58.3 44q2.4 1.8 4.8 0"/>
      <path class="nose" d="M55.7 47.5h2.6l-1.3 1.5z"/>
    </g>
    <path class="tail" d="M15 47 C11 58 38 59 52 54"/>
  </g>
</svg>`;

const BUTTERFLY = `<svg viewBox="0 0 20 16" aria-hidden="true"><g class="wing wing-l"><path d="M10 8C7 1 1 0 1.5 5S7 9 10 8z"/><path d="M10 8C6 9 3 13 5.5 14.5S9.5 11 10 8z"/></g><g class="wing wing-r"><path d="M10 8C13 1 19 0 18.5 5S13 9 10 8z"/><path d="M10 8C14 9 17 13 14.5 14.5S10.5 11 10 8z"/></g><rect x="9.3" y="5" width="1.4" height="7" rx=".7" class="bf-body"/></svg>`;

// Pip's bed: a folded blanket in the theme's colors. Pip steps up onto it.
const BED_BACK = `<svg viewBox="0 0 84 12" aria-hidden="true"><rect class="blanket-under" x="1.5" y="3.2" width="81" height="8.8" rx="3.6"/><path class="blanket-top" d="M3 2.6C9 1.2 15 3.2 22 2.2C29 1.2 35 3 42 2C50 .9 57 2.9 64 1.9C70 1.1 76 2.6 81 1.8V8.2C81 9.6 80 10.2 78.5 10.2H5.5C4 10.2 3 9.6 3 8.2Z"/><path class="blanket-stripe" d="M3.5 5.2C20 6.2 64 4.6 80.5 5.2M3.5 7.4C20 8.3 64 6.8 80.5 7.4"/><path class="blanket-fold" d="M81 1.8C82.6 3.4 82.8 8.6 81 10.2"/><path class="blanket-fringe" d="M1.6 4.6H.2M1.6 6.6H0M1.6 8.6H.2M1.6 10.6H.4"/></svg>`;

const rand = (a, b) => a + Math.random() * (b - a);
const ABORT = Symbol('abort');

export function createCat({ lane, board }) {
  lane.innerHTML = `<div class="cat-bed cat-bed-back">${BED_BACK}</div><div class="cat" data-pose="sit"><div class="cat-bubble"></div><div class="cat-flip"><div class="cat-body">${SVG}</div></div></div>`;
  const cat = lane.querySelector('.cat');
  const flip = lane.querySelector('.cat-flip');
  const body = lane.querySelector('.cat-body');
  const bubble = lane.querySelector('.cat-bubble');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const pending = new Set();
  const toys = new Set();
  // Pip's bed sits at the left end of the ledge. Outside of bed time, Pip
  // and its toys keep clear of it.
  const BED_W = 84;
  let bedActive = false;
  let x = 0, facing = 1, token = 0, enabled = false, running = false, napping = false;
  let reaction = null, lastActivity = Date.now(), napTimer;

  const catWidth = () => cat.offsetWidth || 64;
  const maxX = () => Math.max(0, lane.clientWidth - catWidth());
  const minX = () => bedActive ? 0 : Math.min(BED_W + 4, maxX());
  const clampX = value => Math.min(maxX(), Math.max(minX(), value));
  const bedX = () => Math.max(0, (BED_W - catWidth()) / 2);
  const inBed = () => cat.classList.contains('in-bed');

  // A wait that is cancelled the moment anything interrupts the cat.
  function wait(ms, tok) {
    return new Promise((resolve, reject) => {
      if (tok !== token) return reject(ABORT);
      const entry = { reject };
      entry.timer = setTimeout(() => { pending.delete(entry); tok === token ? resolve() : reject(ABORT); }, ms);
      pending.add(entry);
    });
  }
  function cancelWaits() {
    for (const entry of pending) { clearTimeout(entry.timer); entry.reject(ABORT); }
    pending.clear();
  }

  function setPose(pose) { cat.dataset.pose = pose; }
  function setMode(...modes) {
    cat.classList.remove('walking', 'grooming', 'batting', 'crouch', 'stretch', 'kneading', 'yawning');
    cat.classList.add(...modes);
  }
  function face(dir) { if (dir) { facing = dir; flip.classList.toggle('left', dir < 0); } }
  function moveTo(target, ms = 0, easing = 'linear') {
    leftBedIfMoved(target);
    x = clampX(target);
    cat.style.transition = ms ? `transform ${ms}ms ${easing}` : 'none';
    cat.style.transform = `translateX(${x}px)`;
  }
  function freeze() {
    // Keep Pip exactly where it is (even inside the bed); no clamping here.
    x = new DOMMatrixReadOnly(getComputedStyle(cat).transform).m41;
    cat.style.transition = 'none';
    cat.style.transform = `translateX(${x}px)`;
  }
  function bodyMove(name) {
    body.classList.remove('hop', 'startle', 'pounce', 'happy');
    void body.offsetWidth;
    body.classList.add(name);
  }
  body.addEventListener('animationend', event => { if (event.target === body) body.classList.remove(event.animationName.replace('cat-', '')); });

  function say(text, ms = 1500) {
    bubble.textContent = text;
    bubble.classList.remove('show');
    void bubble.offsetWidth;
    bubble.classList.add('show');
    clearTimeout(say.timer);
    say.timer = setTimeout(() => bubble.classList.remove('show'), ms);
  }
  function float(className, text, style = {}) {
    const el = document.createElement('span');
    el.className = className;
    el.textContent = text;
    Object.assign(el.style, style);
    cat.append(el);
    el.addEventListener('animationend', () => el.remove());
    setTimeout(() => el.remove(), 4000);
  }
  function hearts(count = 3) {
    for (let i = 0; i < count; i++) float('cat-heart', '♥', { left: `${rand(20, 70)}%`, animationDelay: `${i * 160}ms` });
  }
  function startZs() {
    clearInterval(napTimer);
    const z = () => float('cat-z', 'z', facing > 0 ? { left: '74%' } : { left: '10%' });
    z(); napTimer = setInterval(z, 1700);
  }
  function stopZs() { clearInterval(napTimer); }

  function addToy(el) { toys.add(el); lane.append(el); return el; }
  function removeToy(el) {
    if (!toys.delete(el)) return;
    el.style.transition = `${el.style.transition ? el.style.transition + ', ' : ''}opacity .4s`;
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 450);
  }
  function clearToys() { for (const toy of [...toys]) removeToy(toy); }

  // Leaving the bed's spot (by walking or a pounce) means leaving the bed.
  function leftBedIfMoved(target) {
    if (inBed() && target > bedX() + 12) { cat.classList.remove('in-bed'); bedActive = false; return true; }
    return false;
  }
  async function walkTo(target, tok, speed = 55) {
    if (leftBedIfMoved(target)) bodyMove('hop');
    target = clampX(target);
    const distance = target - x;
    if (Math.abs(distance) < 3) return;
    face(Math.sign(distance));
    setPose('stand'); setMode('walking');
    const ms = Math.abs(distance) / speed * 1000;
    moveTo(target, ms);
    await wait(ms, tok);
    setMode();
  }
  async function goToBed(tok) {
    if (inBed()) return;
    bedActive = true;
    if (reduce.matches) moveTo(bedX());
    else await walkTo(bedX(), tok, 60);
    cat.classList.add('in-bed');
    // Turn around a couple of times before settling, like cats do.
    setPose('stand');
    for (let i = 0; i < 2; i++) { await wait(330, tok); face(-facing); }
    await wait(250, tok);
  }
  async function leaveBed(tok) {
    if (!inBed()) return;
    cat.classList.remove('in-bed');
    bodyMove('hop');
    bedActive = false;
    await walkTo(BED_W + rand(20, 110), tok);
  }
  async function wakeUp(tok) {
    napping = false; stopZs();
    setPose('stand'); setMode('stretch');
    await wait(1100, tok);
    setMode(); setPose('sit');
  }

  const behaviors = {
    async wander(tok) {
      let target = rand(0, maxX());
      if (Math.abs(target - x) < 40) target = clampX(x + (x > maxX() / 2 ? -1 : 1) * rand(60, 140));
      await walkTo(target, tok);
      setPose(Math.random() < .5 ? 'sit' : 'stand');
      await wait(rand(1200, 3500), tok);
    },
    async sit(tok) {
      setPose('sit'); setMode();
      await wait(rand(3000, 7000), tok);
    },
    async groom(tok) {
      setPose('sit'); setMode('grooming');
      await wait(rand(2500, 4500), tok);
      setMode();
      await wait(800, tok);
    },
    async nap(tok) {
      await goToBed(tok);
      await behaviors.yawn(tok, true);
      setPose('nap'); setMode(); napping = true; startZs();
      try { await wait(rand(25000, 50000), tok); }
      finally { stopZs(); }
      await wakeUp(tok);
      await wait(1200, tok);
      // Sometimes stay sitting in the bed for a while.
      if (Math.random() < .5) await leaveBed(tok);
    },
    async yarn(tok, forceKnock = false) {
      const knock = forceKnock || Math.random() < .35;
      const ball = addToy(Object.assign(document.createElement('div'), { className: 'cat-yarn' }));
      const ballSize = 15;
      let bx = clampBall(rand(0, lane.clientWidth));
      function clampBall(v) { return Math.min(lane.clientWidth - ballSize, Math.max(BED_W + 4, v)); }
      const rollTo = (nx, ms) => { bx = clampBall(nx); ball.style.transition = `transform ${ms}ms cubic-bezier(.15,.7,.3,1)`; ball.style.transform = `translateX(${bx}px) rotate(${bx * 5}deg)`; };
      rollTo(bx, 0);
      try {
        await wait(500, tok);
        const rounds = Math.round(rand(2, 4));
        for (let i = 0; i < rounds; i++) {
          const last = i === rounds - 1;
          let side = bx + ballSize / 2 > x + catWidth() / 2 ? 1 : -1;
          // To knock it off, bat it off the far end (away from the bed).
          if (last && knock) side = 1;
          // Stop with the nose just touching the ball.
          await walkTo(side > 0 ? bx - catWidth() * .86 : bx + ballSize - catWidth() * .14, tok, 75);
          face(side); setPose('stand'); setMode('crouch');
          await wait(rand(500, 1300), tok);
          setMode('batting');
          await wait(220, tok);
          if (last && knock) {
            const edge = side > 0 ? lane.clientWidth + 6 : -ballSize - 6;
            const fall = (board?.offsetHeight ?? 300) + 60;
            ball.style.transition = 'transform 650ms cubic-bezier(.2,.6,.4,1)';
            ball.style.transform = `translateX(${edge}px) rotate(${edge * 5}deg)`;
            ball.animate([{ translate: '0 0', opacity: 1 }, { translate: `${side * 14}px ${fall}px`, opacity: 0 }],
              { duration: 800, delay: 560, easing: 'cubic-bezier(.55,0,1,.6)', fill: 'forwards' });
            await wait(300, tok);
            setMode();
            await walkTo(side > 0 ? maxX() : 0, tok, 70);
            face(side); setMode('crouch');
            await wait(1400, tok);
            setMode(); setPose('sit');
            say(['…', 'oops.', 'mrrp.'][Math.floor(Math.random() * 3)], 2000);
            await wait(2400, tok);
            return;
          }
          let next = bx + side * rand(70, 170);
          if (next < 0 || next > lane.clientWidth - ballSize) next = bx - side * rand(70, 150);
          rollTo(next, 900);
          await wait(350, tok);
          setMode();
          await wait(rand(300, 700), tok);
        }
        say('mrrp');
        setPose('sit');
        await wait(1500, tok);
      } finally { removeToy(ball); }
    },
    async yawn(tok, quick = false) {
      setPose('sit'); setMode('yawning');
      await wait(1850, tok);
      setMode();
      await wait(quick ? 300 : rand(1200, 2500), tok);
    },
    // Kneading the ledge ("making biscuits"); often ends in a nap.
    async knead(tok) {
      // Near the bed, knead the cushion instead of the ledge.
      if (inBed() || x < BED_W + 170) await goToBed(tok);
      setPose('stand'); setMode('kneading');
      if (Math.random() < .6) say('prrr', 2000);
      await wait(rand(3000, 5000), tok);
      setMode();
      if (Math.random() < .55) return behaviors.nap(tok);
      setPose('sit');
      await wait(rand(1500, 3000), tok);
    },
    async butterfly(tok) {
      const bf = addToy(Object.assign(document.createElement('div'), { className: 'cat-butterfly', innerHTML: BUTTERFLY }));
      const fromRight = Math.random() < .5;
      let bx = fromRight ? lane.clientWidth + 20 : -30, by = -50;
      const flyTo = (nx, ny, ms) => { bx = nx; by = ny; bf.style.transition = `transform ${ms}ms ease-in-out`; bf.style.transform = `translate(${bx}px, ${by}px)`; };
      flyTo(bx, by, 0);
      try {
        await wait(50, tok);
        const catCenter = () => x + catWidth() / 2;
        for (let i = 0; i < 3; i++) {
          flyTo(Math.min(lane.clientWidth - 20, Math.max(0, catCenter() + rand(-90, 90))), rand(-46, -12), 1500);
          setPose('sit'); face(Math.sign(bx - catCenter()));
          await wait(1500, tok);
        }
        flyTo(Math.min(lane.clientWidth - 20, Math.max(0, catCenter() + facing * rand(40, 70))), -8, 1200);
        setPose('stand'); setMode('crouch');
        await wait(1500, tok);
        setMode(); bodyMove('pounce');
        moveTo(x + facing * 34, 380, 'ease-out');
        flyTo(bx + facing * rand(40, 120), -150, 1300);
        bf.style.transition += ', opacity 1.3s ease-in';
        bf.style.opacity = '0';
        await wait(700, tok);
        say(Math.random() < .5 ? '?!' : 'mew…');
        setPose('sit');
        await wait(1800, tok);
      } finally { removeToy(bf); }
    }
  };

  function chooseBehavior() {
    const idle = Date.now() - lastActivity;
    const sleepy = idle > 45000;
    const options = reduce.matches
      ? [['sit', 3], ['groom', 1], ['nap', sleepy ? 4 : 1]]
      : [['wander', 4], ['sit', 3], ['groom', 1.5], ['yarn', 1.2], ['butterfly', .9], ['knead', .8], ['yawn', .8], ['nap', sleepy ? 7 : .3]];
    let roll = Math.random() * options.reduce((sum, [, w]) => sum + w, 0);
    for (const [name, weight] of options) if ((roll -= weight) <= 0) return name;
    return 'sit';
  }

  async function loop() {
    running = true;
    while (enabled) {
      if (reaction) { await reaction; continue; }
      const tok = token;
      try {
        const name = chooseBehavior();
        // These are fine to do in the bed; anything else, step out first.
        if (inBed() && !['sit', 'groom', 'yawn', 'knead', 'nap'].includes(name)) await leaveBed(tok);
        await behaviors[name](tok);
      }
      catch (error) { if (error !== ABORT) { console.error(error); await new Promise(r => setTimeout(r, 1000)); } }
    }
    running = false;
  }

  // Stop whatever the cat is doing and run a short reaction instead.
  function interrupt(fn) {
    const wasNapping = napping;
    napping = false;
    token++;
    cancelWaits(); freeze(); setMode(); clearToys(); stopZs();
    const tok = token;
    const p = (async () => {
      try { await fn(tok, wasNapping); }
      catch (error) { if (error !== ABORT) console.error(error); }
    })();
    reaction = p;
    p.finally(() => { if (reaction === p) reaction = null; });
    return p;
  }

  const reactions = {
    placed({ col }) {
      if (napping || inBed() || reduce.matches || Math.random() > .3) return;
      interrupt(async tok => {
        const center = (col + .5) * lane.clientWidth / 9;
        await walkTo(center - catWidth() / 2, tok, 95);
        setPose('sit');
        await wait(rand(1500, 2500), tok);
      });
    },
    wrong() {
      interrupt(async (tok, wasNapping) => {
        setPose('stand'); bodyMove('startle');
        say(wasNapping ? '!!' : '!', 1100);
        await wait(800, tok);
        setPose('sit');
        await wait(2000, tok);
      });
    },
    complete() {
      interrupt(async tok => {
        setPose('stand');
        say('♪', 2200); hearts(5);
        for (let i = 0; i < 3; i++) { bodyMove('happy'); await wait(520, tok); }
        setPose('sit');
        await wait(3500, tok);
      });
    },
    newGame() {
      interrupt(async (tok, wasNapping) => {
        if (wasNapping) { await wakeUp(tok); }
        else { setPose('stand'); setMode('stretch'); await wait(1100, tok); setMode(); }
        setPose('sit'); say('mrrp?');
        await wait(2000, tok);
      });
    },
    tap() {
      interrupt(async (tok, wasNapping) => {
        if (wasNapping) { say('…?'); await wakeUp(tok); await wait(1500, tok); return; }
        setPose('sit'); hearts(3);
        say(['prrr', 'mrrp', 'mew', 'prrrr ♥'][Math.floor(Math.random() * 4)]);
        await wait(2200, tok);
      });
    }
  };

  cat.addEventListener('click', () => { lastActivity = Date.now(); reactions.tap(); });
  document.addEventListener('pointerdown', () => { lastActivity = Date.now(); }, { passive: true });
  new ResizeObserver(() => { if (x > maxX()) moveTo(maxX()); }).observe(lane);

  return {
    setEnabled(on) {
      enabled = on;
      lane.hidden = !on;
      if (!on) { interrupt(async () => {}); return; }
      if (!running) {
        moveTo(rand(0, maxX()));
        face(Math.random() < .5 ? 1 : -1); setPose('sit');
        loop();
      }
    },
    react(type, info = {}) {
      if (!enabled) return;
      lastActivity = Date.now();
      reactions[type]?.(info);
    },
    // Debug: force a behavior now.
    perform(name) {
      if (!enabled) return;
      if (name === 'knock') return interrupt(tok => behaviors.yarn(tok, true));
      if (!behaviors[name]) return;
      interrupt(tok => behaviors[name](tok));
    }
  };
}
