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
export function scoreProduct(nutrients = {}, ingredients = '', opts = {}) {
  const targets = Object.assign({}, DEFAULT_TARGETS, opts.targets || {});
  const weights = Object.assign({}, WEIGHTS, opts.weights || {});

  const proteinScore = normalizeGood(nutrients.protein, targets.protein);
  const fiberScore = normalizeGood(nutrients.fiber, targets.fiber);
  const sugarScore = normalizeBad(nutrients.sugar, targets.sugar);
  const satFatScore = normalizeBad(nutrients.saturatedFat, targets.saturatedFat);
  const sodiumScore = normalizeBad(nutrients.sodium, targets.sodium);
  const caloriesScore = normalizeBad(nutrients.calories, targets.calories);

  const breakdown = {
    protein: Math.round(proteinScore),
    fiber: Math.round(fiberScore),
    sugar: Math.round(sugarScore),
    saturatedFat: Math.round(satFatScore),
    sodium: Math.round(sodiumScore),
    calories: Math.round(caloriesScore)
  };

  const weighted =
    (proteinScore * weights.protein) +
    (fiberScore * weights.fiber) +
    (sugarScore * weights.sugar) +
    (satFatScore * weights.saturatedFat) +
    (sodiumScore * weights.sodium) +
    (caloriesScore * weights.calories);

  const ingredientAdj = computeIngredientAdjustment(ingredients || '');

  let raw = weighted + ingredientAdj;
  let finalScore = Math.round(clamp(raw, 0, 100));
  const grade = mapGrade(finalScore);

  return {
    score: finalScore,
    grade,
    breakdown,
    ingredientAdjustment: ingredientAdj
  };
}

export default { scoreProduct };
