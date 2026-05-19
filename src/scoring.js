// Nutrition scoring module for Instamart Health Rater
// Inputs expected in per-100g units where possible.

function clamp(v, a = 0, b = 100) {
  return Math.max(a, Math.min(b, v));
}

function normalizeGood(value, target) {
  if (value == null || isNaN(value)) return 0;
  return clamp((value / target) * 100);
}

function normalizeBad(value, limit) {
  if (value == null || isNaN(value)) return 100;
  // higher value -> worse score
  return clamp(100 - (value / limit) * 100);
}

const DEFAULT_TARGETS = {
  protein: 10, // grams per 100g considered good
  fiber: 6,
  sugar: 10, // grams per 100g limit
  saturatedFat: 3, // grams per 100g limit
  sodium: 400, // mg per 100g limit
  calories: 250 // kcal per 100g limit
};

const WEIGHTS = {
  protein: 0.20,
  fiber: 0.15,
  sugar: 0.20,
  saturatedFat: 0.20,
  sodium: 0.20,
  calories: 0.05
};

const INGREDIENT_ADJUSTMENTS = [
  {kw: /whole\s*grain|wholegrain|whole\s*wheat/i, delta: 5},
  {kw: /no\s*added\s*sugar/i, delta: 6},
  {kw: /fortified|enriched/i, delta: 3},
  {kw: /high[-\s]*fructose|hfcs/i, delta: -8},
  {kw: /palm\s*oil/i, delta: -6},
  {kw: /fried|deep[-\s]*fried/i, delta: -8},
  {kw: /hydrogenated|trans\s*fat/i, delta: -10},
  {kw: /added\s*sugar|syrup/i, delta: -8}
];

function computeIngredientAdjustment(ingredients) {
  if (!ingredients) return 0;
  let text = ingredients.toString();
  let total = 0;
  for (const adj of INGREDIENT_ADJUSTMENTS) {
    if (adj.kw.test(text)) total += adj.delta;
  }
  return clamp(total, -20, 20);
}

function mapGrade(score) {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'E';
}

/**
 * Compute health score and grade.
 * @param {{protein:number,fiber:number,sugar:number,saturatedFat:number,sodium:number,calories:number}} nutrients per-100g values
 * @param {string} ingredients ingredient text
 * @param {object} opts optional targets and weights
 */
// New: implement calculateHealthScore using the example logic provided by the user.
export function calculateHealthScore(data) {
  // data expected: { productName, category, calories, protein, fiber, sugar, satFat, sodium, ingredients }
  function clampLocal(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function getIngredientAdjustment(text) {
    const t = (text || '').toLowerCase();
    let score = 0;
    const reasons = [];
    const positives = [
      { keywords: ['whole grain', 'whole wheat', 'oats', 'millet'], value: 4, reason: 'Contains whole-grain ingredients.' },
      { keywords: ['live cultures', 'probiotic'], value: 4, reason: 'Has probiotic or culture-based benefit.' },
      { keywords: ['nuts', 'seeds'], value: 3, reason: 'Includes nuts or seeds.' },
      { keywords: ['no artificial sweeteners', 'no artificial colors'], value: 2, reason: 'Cleaner ingredient profile.' },
      { keywords: ['fruit pulp', 'fruit'], value: 2, reason: 'Contains fruit-based ingredients.' },
      { keywords: ['no fried oil', 'baked'], value: 3, reason: 'Avoids or reduces fried processing.' }
    ];
    const negatives = [
      { keywords: ['palm oil'], value: -4, reason: 'Uses palm oil.' },
      { keywords: ['artificial sweetener', 'sucralose', 'acesulfame'], value: -3, reason: 'Contains artificial sweetener.' },
      { keywords: ['preservative', 'added flavour', 'added flavor', 'flavor enhancer'], value: -3, reason: 'Has highly processed additives.' },
      { keywords: ['fried', 'frying'], value: -4, reason: 'Processed as a fried product.' },
      { keywords: ['refined flour', 'maida'], value: -4, reason: 'Uses refined flour.' },
      { keywords: ['color', 'caramel color'], value: -2, reason: 'Contains added color.' }
    ];

    positives.forEach(item => { if (item.keywords.some(k => t.includes(k))) { score += item.value; reasons.push(item.reason); } });
    negatives.forEach(item => { if (item.keywords.some(k => t.includes(k))) { score += item.value; reasons.push(item.reason); } });
    return { score: clampLocal(score, -10, 12), reasons };
  }

  let score = 50;
  const reasons = [];

  const proteinBoost = clampLocal((data.protein || 0) * 1.4, 0, 15);
  score += proteinBoost;
  if (proteinBoost >= 8) reasons.push('Strong protein density supports satiety.');
  else if (proteinBoost >= 3) reasons.push('Moderate protein adds some value.');

  const fiberBoost = clampLocal((data.fiber || 0) * 2.2, 0, 15);
  score += fiberBoost;
  if (fiberBoost >= 8) reasons.push('High fiber improves overall quality.');
  else if (fiberBoost >= 3) reasons.push('Some fiber contributes to the score.');

  const sugar = data.sugar || 0;
  if (sugar <= 5) { score += 10; reasons.push('Low sugar level is a positive sign.'); }
  else if (sugar <= 10) { score += 3; reasons.push('Sugar is moderate, so the product stays balanced.'); }
  else if (sugar <= 15) { score -= 4; reasons.push('Sugar is on the higher side.'); }
  else { score -= 12; reasons.push('Very high sugar pulls the score down sharply.'); }

  const satFat = data.satFat || 0;
  if (satFat <= 1.5) { score += 8; reasons.push('Low saturated fat supports a better rating.'); }
  else if (satFat <= 4) { score += 2; }
  else if (satFat <= 7) { score -= 4; reasons.push('Saturated fat is somewhat high.'); }
  else { score -= 10; reasons.push('High saturated fat reduces the health score.'); }

  const sodium = data.sodium || 0;
  if (sodium <= 120) { score += 8; reasons.push('Sodium is low and consumer-friendly.'); }
  else if (sodium <= 300) { score += 3; }
  else if (sodium <= 500) { score -= 4; reasons.push('Sodium is moderately high.'); }
  else { score -= 10; reasons.push('Very high sodium makes this a weaker option.'); }

  const calories = data.calories || 0;
  if (calories <= 120) score += 4;
  else if (calories <= 220) score += 1;
  else if (calories >= 450) { score -= 5; reasons.push('Calories are dense for the serving basis.'); }

  const ingredientAdjustment = getIngredientAdjustment(data.ingredients || '');
  score += ingredientAdjustment.score;
  reasons.push(...ingredientAdjustment.reasons);

  score = Math.round(clampLocal(score, 0, 100));

  let grade = 'C';
  let gradeText = 'Okay sometimes, balance needed.';
  let color = 'var(--color-score-c)';
  if (score >= 80) { grade = 'A'; gradeText = 'Excellent everyday choice.'; color = 'var(--color-score-a)'; }
  else if (score >= 65) { grade = 'B'; gradeText = 'Good choice with small caution.'; color = 'var(--color-score-b)'; }
  else if (score >= 50) { grade = 'C'; gradeText = 'Average health quality.'; color = 'var(--color-score-c)'; }
  else if (score >= 35) { grade = 'D'; gradeText = 'Lower health quality.'; color = 'var(--color-score-d)'; }
  else { grade = 'E'; gradeText = 'Best kept occasional.'; color = 'var(--color-score-e)'; }

  return { score, grade, color, gradeText, reasons: [...new Set(reasons)].slice(0,5) };
}

export default { calculateHealthScore };
