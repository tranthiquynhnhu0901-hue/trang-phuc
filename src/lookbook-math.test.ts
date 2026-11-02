import test from 'node:test';
import assert from 'node:assert/strict';
import {
  wrap,
  clamp,
  computeModelDepth,
  interpolateDepthStops,
  computeCardOffset,
  easePosition,
  KX,
  KO,
} from './lookbook-math.ts';

test('wrap correctly loops positive and negative numbers', () => {
  assert.equal(wrap(0, 6), 0);
  assert.equal(wrap(6, 6), 0);
  assert.equal(wrap(7, 6), 1);
  assert.equal(wrap(-1, 6), 5);
  assert.equal(wrap(-7, 6), 5);
});

test('clamp restricts values to min and max', () => {
  assert.equal(clamp(-5, 0, 10), 0);
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(15, 0, 10), 10);
});

test('computeModelDepth maps 0..5 range and wraparound correctly', () => {
  // When p = 0, model 0 is at depth 0
  assert.equal(computeModelDepth(0, 0, 6), 0);
  // Model 1 is at depth 1
  assert.equal(computeModelDepth(1, 0, 6), 1);
  // When p = 0.5, model 0 is at -0.5
  assert.equal(computeModelDepth(0, 0.5, 6), 5.5 - 6); // -0.5
});

test('interpolateDepthStops returns correct exact values at integer depths', () => {
  const W = 1000;
  const H = 800;
  const base = H * 1.2;
  const r = 0.5;

  // Depth 0: k = 1, KX[1] = 0.744, KO[1] = 1, KB[1] = 0
  const d0 = interpolateDepthStops(0, W, H, base, r);
  assert.equal(d0.opacity, 1);
  assert.equal(d0.blur, 0);
  assert.equal(d0.zIndex, 100);

  // Depth 5: k = 6, KX[6] = 0.085, KO[6] = 0
  const d5 = interpolateDepthStops(5, W, H, base, r);
  assert.equal(d5.opacity, 0);
  assert.equal(d5.zIndex, 50);
});

test('computeCardOffset correctly slides 2 cards per look', () => {
  const cardS = 200;
  // Look 0: card 0 offset is 0
  assert.equal(computeCardOffset(0, 0, cardS, 12), 0);
  // Look 1: card 0 moves back by 2*cardS = -400
  assert.equal(computeCardOffset(0, 1, cardS, 12), wrap(-400, 2400));
  // Look 1: card 2 is at top (0)
  assert.equal(computeCardOffset(2, 1, cardS, 12), 0);
});

test('easePosition approaches target and snaps when within threshold', () => {
  const p1 = easePosition(0, 1, 16);
  assert.ok(p1 > 0 && p1 < 1, 'p should move towards target');

  // Test snap within 0.0004
  const snapped = easePosition(0.9998, 1, 16);
  assert.equal(snapped, 1, 'should snap to target');
});
