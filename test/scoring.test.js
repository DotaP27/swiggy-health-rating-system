import assert from 'assert';
import { scoreProduct } from '../src/scoring.js';

function approxEqual(a, b, tol = 2) {
  return Math.abs(a - b) <= tol;
}

// Test 1: healthy cereal (high fiber, moderate protein, low sugar)
const cereal = {
  protein: 8,
  fiber: 7,
  sugar: 5,
  saturatedFat: 1,
  sodium: 150,
  calories: 220
};
let r = scoreProduct(cereal, 'whole grain, fortified');
console.log('Cereal:', r);
assert(r.score >= 75 && r.score <= 95, 'Cereal score in expected range');
assert(r.grade === 'A' || r.grade === 'B');

// Test 2: fried snack (low protein, no fiber, high fat/salt/sugar)
const snack = {
  protein: 4,
  fiber: 1,
  sugar: 12,
  saturatedFat: 5,
  sodium: 700,
  calories: 500
};
r = scoreProduct(snack, 'fried, palm oil');
console.log('Snack:', r);
assert(r.score <= 40, 'Snack should be low score');
assert(['D','E'].includes(r.grade));

// Test 3: no data fallback
r = scoreProduct({}, '');
console.log('Empty:', r);
assert(typeof r.score === 'number');

console.log('All tests passed');
