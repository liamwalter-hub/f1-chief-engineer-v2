// ============================================================
// F1 CHIEF ENGINEER - UI Controller
// ============================================================

let season = null;
let currentAllocations = {};

// ── HELPERS ─────────────────────────────────────────────────

const $ = id => document.getElementById(id);

const showScreen = id => {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
};

const ordinal = n => {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const weatherIcon = w => ({
  clear: '☀️', overcast: '☁️', wet: '🌧️', mixed: '⛅'
})[w] || '☀️';

const circuitTypeLabel = t => ({
  balanced: 'Balanced', technical: 'Technical', power: 'Power Circuit', street: 'Street Circuit'
})[t] || t;

function buildSpecsHTML(specs, prevSpecs) {
  return Object.entries(window.GameEngine.COMPONENTS).map(([key, comp]) => {
    const val = specs[key];
    const prev = prevSpecs ? prevSpecs[key] : val;
    const delta = val - prev;
    const deltaStr = delta > 0 ? `<span class="text-green">+${delta}</span>` : '';
    return `
      <div class="spec-bar-wrap">
        <div class="spec-label">${comp.icon} ${comp.label}</div>
        <div class="spec-track">
          <div class="spec-fill" style="width:${val}%"></div>
        </div>
        <div class="spec-value font-mono">${val} ${deltaStr}</div>
      </div>`;
  }).join('');
}

// ── TITLE SCREEN ─────────────────────────────────────────────

function initTitleScreen() {
  $('seed-input').value = randomSeed();

  $('btn-random-seed').addEventListener('click', () => {
    $('seed-input').value = randomSeed();
  });

  $('btn-start').addEventListener('click', () => {
    const seed = $('seed-input').value.trim() || randomSeed();
    $('seed-input').value = seed.toUpperCase();
    startGame(seed);
  });

  $('seed-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') $('btn-start').click();
  });
}

function randomSeed() {
  const words = [
    'APEX','TURBO','PITLANE','PODIUM','SECTOR','KERB','CARBON',
    'SLICK','SAFETY','DRS','ERS','MGU','STINT','TIFOSI','PRANCING',
    'BOVINE','HAAS','BWOAH','SENNA','PROST','SCHUMI','VETTEL',
  ];
  const w1 = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${w1}${num}`;
}

// ── INTRO SCREEN ─────────────────────────────────────────────

function showIntro() {
  const { team, tp, drivers, baseBudget, startingSpecs } = season;

  $('intro-seed-badge').textContent = `SEED: ${season.seed}`;
  $('intro-team-name').textContent = team.name;
  $('intro-team-bar').style.background = team.color;
  $('intro-team-season').textContent = `2025 F1 World Championship`;
  $('intro-driver-1').textContent = drivers[0];
  $('intro-driver-2').textContent = drivers[1];
  $('intro-budget').textContent = `€${baseBudget}M`;

  $('intro-tp-avatar').textContent = tp.avatar;
  $('intro-tp-name').textContent = tp.name;
  $('intro-tp-trait').textContent = tp.trait;
  $('intro-tp-quote').textContent = tp.catchphrases[0];

  $('intro-specs').innerHTML = buildSpecsHTML(startingSpecs, null);

  $('btn-to-game').addEventListener('click', () => {
    showScreen('screen-game');
    initGameScreen();
  });

  showScreen('screen-intro');
}

// ── GAME SCREEN ──────────────────────────────────────────────

function initGameScreen() {
  renderSidebar();
  renderRound();
}

function renderSidebar() {
  const { team, tp, remainingBudget, points, calendar, results, currentRound } = season;

  document.querySelector('.team-dot').style.background = team.color;
  $('sidebar-team').textContent = team.name;
  $('sidebar-budget').textContent = `€${Math.max(0, remainingBudget).toFixed(1)}M`;
  $('sidebar-points').textContent = points;
  $('sidebar-tp').textContent = `${tp.avatar} ${tp.name}`;

  const calEl = $('calendar-mini');
  calEl.innerHTML = calendar.map((c, i) => {
    const result = results[i];
    const isCurrent = i === currentRound;
    const isPast = i < currentRound;
    let cls = '';
    if (isCurrent) cls = 'current pulse';
    else if (isPast) cls = 'past';

    const posStr = result
      ? `<span class="cal-pos">${ordinal(result.position)}</span>`
      : `<span class="cal-pos dnc">—</span>`;

    return `<div class="cal-round ${cls}">
      <span class="cal-round-num">${i + 1}</span>
      <span class="cal-round-icon">${c.icon}</span>
      <span>${c.code}</span>
      ${isCurrent ? '<span class="text-red">▶</span>' : posStr}
    </div>`;
  }).join('');
}

function renderRound() {
  const circuit = season.calendar[season.currentRound];
  const round = season.currentRound + 1;
  const brief = window.GameEngine.generateBrief(season);

  $('top-round-badge').textContent = `Round ${round} / ${season.calendar.length}`;
  $('top-circuit-name').textContent = `${circuit.icon} ${circuit.name} Grand Prix`;
  $('top-circuit-meta').innerHTML = `
    <span>${circuitTypeLabel(circuit.type)}</span>
    <span class="weather-badge">${weatherIcon(circuit.weather)} ${circuit.weather}</span>
    <span>${circuit.downforce} downforce</span>
  `;

  $('brief-tone').textContent = brief.tone;
  $('brief-demand').textContent = brief.demand;
  $('brief-constraint').textContent = brief.constraint;
  $('brief-pressure').textContent = brief.pressureText;
  $('brief-event').textContent = brief.eventText;
  $('brief-event').style.display = brief.eventText ? 'block' : 'none';

  $('current-specs').innerHTML = buildSpecsHTML(season.currentSpecs, season.currentSpecs);

  currentAllocations = {};
  Object.keys(window.GameEngine.COMPONENTS).forEach(k => currentAllocations[k] = 0);
  renderAllocations();

  $('btn-race').onclick = handleRace;
}

function renderAllocations() {
  const grid = $('allocation-grid');
  const budget = season.remainingBudget;
  const roundBudget = Math.round(budget * 0.45);

  grid.innerHTML = Object.entries(window.GameEngine.COMPONENTS).map(([key, comp]) => {
    const val = currentAllocations[key] || 0;
    const currentSpec = season.currentSpecs[key];
    const maxAlloc = Math.min(roundBudget, 30);
    return `
      <div class="alloc-row">
        <div class="alloc-label">${comp.icon} ${comp.label}</div>
        <input
          type="range" min="0" max="${maxAlloc}" value="${val}"
          class="alloc-slider" data-component="${key}"
          oninput="updateAlloc('${key}', this.value)"
        />
        <div class="alloc-value" id="alloc-val-${key}">€${val}M</div>
        <div class="alloc-current text-dim" id="alloc-cur-${key}">${currentSpec}</div>
      </div>`;
  }).join('');

  updateBudgetSummary();
}

window.updateAlloc = function(component, value) {
  currentAllocations[component] = parseInt(value);
  $(`alloc-val-${component}`).textContent = `€${value}M`;
  updateBudgetSummary();
};

function updateBudgetSummary() {
  const total = Object.values(currentAllocations).reduce((a, b) => a + b, 0);
  const remaining = season.remainingBudget - total;
  $('budget-spend').textContent = `€${total}M`;
  const remEl = $('budget-remaining');
  remEl.textContent = `€${Math.max(0, remaining).toFixed(1)}M remaining`;
  remEl.className = remaining < 0 ? 'budget-figure over' : 'budget-figure';
}

// ── RACE HANDLER ─────────────────────────────────────────────

function handleRace() {
  const { newSpecs, totalCost } = window.GameEngine.applyAllocations(season, currentAllocations);
  const prevSpecs = { ...season.currentSpecs };

  season.currentSpecs = newSpecs;
  season.remainingBudget = Math.max(0, season.remainingBudget - totalCost);

  const result = window.GameEngine.simulateRace(season, currentAllocations);
  season.results.push(result);
  season.points += result.points;

  showResultModal(result, prevSpecs);
}

function showResultModal(result, prevSpecs) {
  const pos = result.position;
  const posEl = $('result-position');
  posEl.textContent = pos;
  posEl.className = 'result-position' + (pos === 1 ? ' p1' : pos === 2 ? ' p2' : pos === 3 ? ' p3' : '');

  $('result-suffix').textContent = ordinal(pos).replace(String(pos), '');
  $('result-circuit').textContent = result.circuit.toUpperCase() + ' GRAND PRIX';

  const pointsEl = $('result-points');
  pointsEl.textContent = result.points > 0 ? `+${result.points} PTS` : 'No points';
  pointsEl.className = result.points > 0 ? 'result-points-badge' : 'result-points-badge zero';

  $('modal-tp-text').textContent = getTPReaction(pos);
  $('result-spec-changes').innerHTML = buildSpecsHTML(season.currentSpecs, prevSpecs);

  $('modal-overlay').classList.add('open');

  $('btn-continue').onclick = () => {
    $('modal-overlay').classList.remove('open');
    season.currentRound++;

    if (season.currentRound >= season.calendar.length) {
      showEndScreen();
    } else {
      renderSidebar();
      renderRound();
    }
  };
}

function getTPReaction(position) {
  const tp = season.tp;
  if (position === 1) {
    return ["That's what I'm talking about. Pure class. Do it again.", "P1. Exactly what this team is capable of.", "Perfection. The engineers did their job today."][Math.floor(Math.random() * 3)];
  } else if (position <= 3) {
    return tp.id === 'glory_hunter'
      ? "Podium. Fine. But I want wins, not consolation prizes."
      : "Podium finish. That's the direction we need to build on.";
  } else if (position <= 6) {
    return tp.id === 'budget_hawk'
      ? "Points scored, budget respected. That's a good day."
      : "Points, but we need to push harder. The car has more in it.";
  } else if (position <= 10) {
    return "Scraping into the points. We need to be better. Identify the issues.";
  } else {
    return tp.id === 'maverick'
      ? "Disaster. But failures are data. What do we learn from this?"
      : "That result is not acceptable. I want answers before the next race.";
  }
}

// ── END SCREEN ───────────────────────────────────────────────

function showEndScreen() {
  const { points, results, team, seed } = season;
  const podiums = results.filter(r => r.position <= 3).length;
  const wins = results.filter(r => r.position === 1).length;

  let trophy = '🏁';
  let title = 'Season Complete';
  if (wins >= 10) { trophy = '🏆'; title = 'World Champions!'; }
  else if (wins >= 5) { trophy = '🥇'; title = 'Race Winners'; }
  else if (podiums >= 8) { trophy = '🥈'; title = 'Podium Contenders'; }
  else if (points >= 150) { trophy = '✅'; title = 'Solid Season'; }
  else { trophy = '🔧'; title = 'Building for Next Year'; }

  $('end-trophy').textContent = trophy;
  $('end-title').textContent = title;
  $('end-subtitle').textContent = `${team.name} • Seed: ${seed}`;
  $('end-points').textContent = points;
  $('end-wins').textContent = wins;
  $('end-podiums').textContent = podiums;

  $('btn-new-season').onclick = () => {
    showScreen('screen-title');
  };

  showScreen('screen-end');
}

// ── BOOT ─────────────────────────────────────────────────────

function startGame(seed) {
  season = window.GameEngine.generateSeason(seed);
  showIntro();
}

document.addEventListener('DOMContentLoaded', () => {
  initTitleScreen();
  showScreen('screen-title');
});
