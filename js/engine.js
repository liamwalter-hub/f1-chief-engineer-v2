// ============================================================
// F1 CHIEF ENGINEER - Game Engine
// Seed-based deterministic season generator
// ============================================================

class SeededRNG {
  constructor(seed) {
    this.seed = this.hashSeed(seed);
  }

  hashSeed(seed) {
    let h = 0;
    const str = String(seed).toUpperCase();
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return Math.abs(h) || 1;
  }

  next() {
    this.seed ^= this.seed << 13;
    this.seed ^= this.seed >> 17;
    this.seed ^= this.seed << 5;
    return (Math.abs(this.seed) % 1000000) / 1000000;
  }

  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFrom(arr) {
    return arr[this.nextInt(0, arr.length - 1)];
  }

  nextFloat(min, max) {
    return this.next() * (max - min) + min;
  }
}

// ============================================================
// DATA TABLES
// ============================================================

const TEAMS = [
  { id: 'veloce',    name: 'Veloce Racing',      color: '#E8002D', accent: '#FFFFFF' },
  { id: 'apex',      name: 'Apex Motorsport',     color: '#00D2BE', accent: '#1A1A2E' },
  { id: 'zenith',    name: 'Zenith F1 Team',      color: '#0600EF', accent: '#FFD700' },
  { id: 'torque',    name: 'Torque Grand Prix',   color: '#FF8700', accent: '#1A1A1A' },
  { id: 'meridian',  name: 'Meridian Racing',     color: '#00A651', accent: '#FFFFFF' },
];

const TP_ARCHETYPES = [
  {
    id: 'glory_hunter',
    name: 'The Glory Hunter',
    trait: 'Wants podiums at any cost',
    avatar: '🏆',
    briefStyle: 'aggressive',
    budgetTolerance: 0.3,   // will accept 30% over budget
    riskAppetite: 0.85,
    catchphrases: [
      "I don't want excuses, I want podiums.",
      "If we're not winning, we're failing. Simple as that.",
      "Spend what you need. Win first, worry later.",
      "The constructor's title is the only thing that matters.",
    ]
  },
  {
    id: 'budget_hawk',
    name: 'The Budget Hawk',
    trait: 'Cost-cap obsessed',
    avatar: '💰',
    briefStyle: 'frugal',
    budgetTolerance: -0.1,  // will only accept 10% under budget
    riskAppetite: 0.25,
    catchphrases: [
      "Every component needs to justify its cost. Every single one.",
      "The FIA cost cap isn't a ceiling — it's a target.",
      "I've seen teams destroyed by overspend. Not this one.",
      "Efficiency wins championships. Extravagance loses them.",
    ]
  },
  {
    id: 'tactician',
    name: 'The Tactician',
    trait: 'Data-driven, methodical',
    avatar: '📊',
    briefStyle: 'analytical',
    budgetTolerance: 0.05,
    riskAppetite: 0.5,
    catchphrases: [
      "Show me the data before I approve anything.",
      "Marginal gains compound. That's how championships are built.",
      "Every decision needs a rationale. Every single one.",
      "The simulation says X. Why are you proposing Y?",
    ]
  },
  {
    id: 'maverick',
    name: 'The Maverick',
    trait: 'Unpredictable, high risk',
    avatar: '⚡',
    briefStyle: 'erratic',
    budgetTolerance: 0.5,
    riskAppetite: 0.95,
    catchphrases: [
      "Forget conventional. What would nobody else do?",
      "The rulebook is a starting point, not a limitation.",
      "I want ideas that make other engineers nervous.",
      "Safe is slow. Slow is last. Be brave.",
    ]
  },
];

const CIRCUITS = [
  { name: 'Bahrain',       code: 'BHR', type: 'balanced',   downforce: 'medium', temp: 'hot',  laps: 57, icon: '🇧🇭' },
  { name: 'Saudi Arabia',  code: 'SAU', type: 'street',     downforce: 'low',    temp: 'hot',  laps: 50, icon: '🇸🇦' },
  { name: 'Australia',     code: 'AUS', type: 'street',     downforce: 'medium', temp: 'mild', laps: 58, icon: '🇦🇺' },
  { name: 'Japan',         code: 'JPN', type: 'technical',  downforce: 'high',   temp: 'mild', laps: 53, icon: '🇯🇵' },
  { name: 'China',         code: 'CHN', type: 'balanced',   downforce: 'medium', temp: 'mild', laps: 56, icon: '🇨🇳' },
  { name: 'Miami',         code: 'MIA', type: 'street',     downforce: 'low',    temp: 'hot',  laps: 57, icon: '🇺🇸' },
  { name: 'Monaco',        code: 'MON', type: 'street',     downforce: 'high',   temp: 'mild', laps: 78, icon: '🇲🇨' },
  { name: 'Canada',        code: 'CAN', type: 'power',      downforce: 'low',    temp: 'mild', laps: 70, icon: '🇨🇦' },
  { name: 'Spain',         code: 'ESP', type: 'balanced',   downforce: 'medium', temp: 'hot',  laps: 66, icon: '🇪🇸' },
  { name: 'Austria',       code: 'AUT', type: 'power',      downforce: 'low',    temp: 'mild', laps: 71, icon: '🇦🇹' },
  { name: 'Britain',       code: 'GBR', type: 'technical',  downforce: 'medium', temp: 'mild', laps: 52, icon: '🇬🇧' },
  { name: 'Hungary',       code: 'HUN', type: 'technical',  downforce: 'high',   temp: 'hot',  laps: 70, icon: '🇭🇺' },
  { name: 'Belgium',       code: 'BEL', type: 'power',      downforce: 'low',    temp: 'mild', laps: 44, icon: '🇧🇪' },
  { name: 'Netherlands',   code: 'NED', type: 'technical',  downforce: 'high',   temp: 'mild', laps: 72, icon: '🇳🇱' },
  { name: 'Italy',         code: 'ITA', type: 'power',      downforce: 'low',    temp: 'hot',  laps: 53, icon: '🇮🇹' },
  { name: 'Singapore',     code: 'SGP', type: 'street',     downforce: 'high',   temp: 'hot',  laps: 61, icon: '🇸🇬' },
  { name: 'Azerbaijan',    code: 'AZE', type: 'street',     downforce: 'low',    temp: 'mild', laps: 51, icon: '🇦🇿' },
  { name: 'United States', code: 'USA', type: 'balanced',   downforce: 'medium', temp: 'mild', laps: 56, icon: '🇺🇸' },
  { name: 'Mexico',        code: 'MEX', type: 'power',      downforce: 'high',   temp: 'mild', laps: 71, icon: '🇲🇽' },
  { name: 'Brazil',        code: 'BRA', type: 'balanced',   downforce: 'medium', temp: 'hot',  laps: 71, icon: '🇧🇷' },
  { name: 'Las Vegas',     code: 'LVS', type: 'power',      downforce: 'low',    temp: 'cold', laps: 50, icon: '🇺🇸' },
  { name: 'Qatar',         code: 'QAT', type: 'technical',  downforce: 'high',   temp: 'hot',  laps: 57, icon: '🇶🇦' },
  { name: 'Abu Dhabi',     code: 'ABU', type: 'balanced',   downforce: 'medium', temp: 'hot',  laps: 58, icon: '🇦🇪' },
];

const EVENTS = [
  { type: 'regulation', text: 'FIA announce a floor regulation change — downforce balance shifts mid-season.', effect: 'aero_nerf' },
  { type: 'scandal',    text: 'A rival team is found in breach of the cost cap — championship implications loom.', effect: 'morale_boost' },
  { type: 'budget_cut', text: 'Sponsors threaten to pull funding. The TP wants an emergency budget review.', effect: 'budget_penalty' },
  { type: 'talent',     text: 'A top aero engineer approaches the team. The TP wants you to assess their impact.', effect: 'aero_boost' },
  { type: 'parts',      text: 'A critical component fails in testing. You must redesign before the next race.', effect: 'time_penalty' },
  { type: 'weather',    text: 'Freak weather conditions are forecast for the next Grand Prix weekend.', effect: 'weather_variance' },
  { type: 'rival',      text: 'A rival team launches a major upgrade package — the benchmark has shifted.', effect: 'rival_boost' },
  { type: 'press',      text: 'Media scrutiny intensifies after a poor result. The TP needs visible progress.', effect: 'pressure' },
];

const COMPONENTS = {
  chassis:     { label: 'Chassis',          icon: '🏗️',  affects: ['cornering', 'weight'],     baseTime: 8 },
  aero:        { label: 'Aerodynamics',     icon: '💨',  affects: ['downforce', 'drag'],        baseTime: 10 },
  power_unit:  { label: 'Power Unit',       icon: '⚡',  affects: ['straight_speed', 'energy'], baseTime: 12 },
  suspension:  { label: 'Suspension',       icon: '🔧',  affects: ['cornering', 'tyre_wear'],   baseTime: 6 },
  brakes:      { label: 'Brakes',           icon: '🛑',  affects: ['braking', 'heat'],          baseTime: 5 },
  tyres:       { label: 'Tyre Strategy',    icon: '🔴',  affects: ['tyre_wear', 'pace'],        baseTime: 3 },
};

// ============================================================
// SEASON GENERATOR
// ============================================================

function generateSeason(seedInput) {
  const rng = new SeededRNG(seedInput);
  const seed = String(seedInput).toUpperCase();

  // Pick team
  const team = TEAMS[rng.nextInt(0, TEAMS.length - 1)];

  // Pick TP archetype
  const tp = TP_ARCHETYPES[rng.nextInt(0, TP_ARCHETYPES.length - 1)];

  // Starting budget (in millions)
  const baseBudget = rng.nextFloat(85, 135);

  // Driver lineup
  const driverNames = [
    ['Luca Ferretti', 'Kai Nakamura'], ['Alexei Volkov', 'Pierre Dubois'],
    ['Marcus Steele', 'Yusuf Al-Rashid'], ['Connor Walsh', 'Erik Lindqvist'],
    ['Rafa Montoya', 'Jin-ho Park'],
  ];
  const drivers = rng.nextFrom(driverNames);

  // Starting car specs (0–100 for each component)
  const startingSpecs = {
    chassis:    rng.nextInt(40, 75),
    aero:       rng.nextInt(35, 80),
    power_unit: rng.nextInt(50, 85),
    suspension: rng.nextInt(40, 70),
    brakes:     rng.nextInt(45, 75),
    tyres:      rng.nextInt(40, 70),
  };

  // Rival team strengths
  const rivals = TEAMS.filter(t => t.id !== team.id).map(rival => ({
    ...rival,
    strength: rng.nextFloat(0.5, 1.0),
    trajectory: rng.nextFrom(['improving', 'declining', 'stable']),
  }));

  // Season calendar (all 23 rounds)
  const calendar = CIRCUITS.map((circuit, i) => ({
    ...circuit,
    round: i + 1,
    event: rng.next() > 0.75 ? rng.nextFrom(EVENTS) : null,
    weather: rng.nextFrom(['clear', 'clear', 'clear', 'overcast', 'wet', 'mixed']),
  }));

  // Season-level narrative pressures
  const pressurePoints = [
    rng.nextInt(3, 7),   // first crisis round
    rng.nextInt(10, 15), // mid-season pivot
    rng.nextInt(18, 22), // title fight crunch
  ];

  return {
    seed,
    team,
    tp,
    drivers,
    baseBudget: Math.round(baseBudget * 10) / 10,
    remainingBudget: Math.round(baseBudget * 10) / 10,
    startingSpecs,
    currentSpecs: { ...startingSpecs },
    rivals,
    calendar,
    pressurePoints,
    currentRound: 0,
    results: [],
    points: 0,
    constructorPoints: 0,
    seasonLog: [],
  };
}

// ============================================================
// RACE SIMULATOR
// ============================================================

function simulateRace(season, allocations) {
  const circuit = season.calendar[season.currentRound];
  const specs = season.currentSpecs;

  // Score car vs circuit requirements
  let carScore = 0;
  if (circuit.downforce === 'high')   carScore += (specs.aero * 0.4 + specs.suspension * 0.2);
  if (circuit.downforce === 'medium') carScore += (specs.aero * 0.25 + specs.chassis * 0.15);
  if (circuit.downforce === 'low')    carScore += (specs.power_unit * 0.35 + specs.brakes * 0.15);

  if (circuit.type === 'technical')   carScore += specs.suspension * 0.2;
  if (circuit.type === 'power')       carScore += specs.power_unit * 0.2;
  if (circuit.type === 'street')      carScore += specs.brakes * 0.15 + specs.aero * 0.15;
  if (circuit.type === 'balanced')    carScore += (specs.chassis + specs.aero + specs.power_unit) / 3 * 0.2;

  carScore += specs.tyres * 0.1;

  // Normalise to 0–100
  carScore = Math.min(100, carScore);

  // Weather variance
  let weatherMod = 0;
  if (circuit.weather === 'wet')     weatherMod = (Math.random() - 0.5) * 25;
  if (circuit.weather === 'mixed')   weatherMod = (Math.random() - 0.5) * 15;

  // Rival comparison
  const rivalAvg = season.rivals.reduce((sum, r) => sum + r.strength * 100, 0) / season.rivals.length;

  // Final race score
  const finalScore = Math.max(0, Math.min(100, carScore + weatherMod - (rivalAvg * 0.3) + (Math.random() * 10 - 5)));

  // Translate to finishing position (out of 20 cars)
  let position;
  if (finalScore >= 85) position = Math.floor(Math.random() * 2) + 1;
  else if (finalScore >= 72) position = Math.floor(Math.random() * 3) + 2;
  else if (finalScore >= 60) position = Math.floor(Math.random() * 4) + 4;
  else if (finalScore >= 48) position = Math.floor(Math.random() * 4) + 7;
  else if (finalScore >= 35) position = Math.floor(Math.random() * 4) + 10;
  else position = Math.floor(Math.random() * 6) + 14;

  // Points system
  const pointsTable = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  const racePoints = position <= 10 ? pointsTable[position - 1] : 0;

  return {
    round: season.currentRound + 1,
    circuit: circuit.name,
    position,
    points: racePoints,
    carScore: Math.round(carScore),
    weather: circuit.weather,
    event: circuit.event,
  };
}

// ============================================================
// BRIEF GENERATOR
// ============================================================

function generateBrief(season) {
  const circuit = season.calendar[season.currentRound];
  const tp = season.tp;
  const round = season.currentRound + 1;
  const isEarlyRace = round <= 4;
  const isMidSeason = round >= 10 && round <= 16;
  const isLateSeason = round >= 17;
  const isPressurePoint = season.pressurePoints.includes(round);

  const lastResult = season.results[season.results.length - 1];
  const lastPosition = lastResult ? lastResult.position : null;

  // Build brief based on TP style + situation
  let tone = '';
  let demand = '';
  let constraint = '';

  // Tone from archetype + last result
  if (tp.id === 'glory_hunter') {
    if (lastPosition && lastPosition > 6) tone = `${tp.catchphrases[0]} That result was unacceptable.`;
    else if (lastPosition && lastPosition <= 3) tone = `Good. Now let's make it a habit.`;
    else tone = tp.catchphrases[Math.floor(Math.random() * tp.catchphrases.length)];
  } else if (tp.id === 'budget_hawk') {
    tone = tp.catchphrases[Math.floor(Math.random() * tp.catchphrases.length)];
  } else if (tp.id === 'tactician') {
    tone = tp.catchphrases[Math.floor(Math.random() * tp.catchphrases.length)];
  } else {
    tone = tp.catchphrases[Math.floor(Math.random() * tp.catchphrases.length)];
  }

  // Circuit-specific demand
  if (circuit.downforce === 'high') {
    demand = `${circuit.name} is a downforce circuit. I want maximum aero grip — corners are where we win or lose.`;
  } else if (circuit.downforce === 'low') {
    demand = `${circuit.name} is a power circuit. Top speed on the straights is critical. Don't over-wing the car.`;
  } else {
    demand = `${circuit.name} rewards a balanced setup. I want an all-round package — no weaknesses.`;
  }

  if (circuit.type === 'street') {
    demand += ' Braking precision matters massively on a street circuit — don\'t neglect it.';
  }

  // Budget constraint from TP personality
  const budgetPressure = tp.id === 'budget_hawk'
    ? `We have €${Math.round(season.remainingBudget * 0.4)}M available for this round. Don't go over.`
    : tp.id === 'glory_hunter'
    ? `Budget is secondary. Get the car right.`
    : `Manage the spend sensibly — we have €${Math.round(season.remainingBudget * 0.5)}M to work with.`;

  constraint = budgetPressure;

  // Pressure point escalation
  let pressureText = '';
  if (isPressurePoint) {
    if (isEarlyRace) pressureText = 'The board is already asking questions. We need a result to silence them.';
    if (isMidSeason) pressureText = 'We\'re at a crossroads this season. What you build now defines our championship trajectory.';
    if (isLateSeason) pressureText = 'This is crunch time. Every point matters. Don\'t hold back.';
  }

  // Event notification
  let eventText = '';
  if (circuit.event) {
    eventText = `⚠️ LATE BREAKING: ${circuit.event.text}`;
  }

  return { tone, demand, constraint, pressureText, eventText, circuit };
}

// ============================================================
// APPLY UPGRADES
// ============================================================

function applyAllocations(season, allocations) {
  const specs = { ...season.currentSpecs };
  let totalCost = 0;

  for (const [component, amount] of Object.entries(allocations)) {
    if (amount > 0) {
      // Each point of investment = 1–3 spec points depending on component efficiency
      const gain = Math.floor(amount * 1.5);
      specs[component] = Math.min(100, specs[component] + gain);
      totalCost += amount;
    }
  }

  return { newSpecs: specs, totalCost };
}

// Export everything
window.GameEngine = {
  generateSeason,
  generateBrief,
  simulateRace,
  applyAllocations,
  COMPONENTS,
  TEAMS,
};
