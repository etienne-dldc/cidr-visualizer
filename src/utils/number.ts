export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

export function incrementPart(part: number, step: number, max: number): number {
  if (Math.abs(step) === 1) {
    return clamp(part + step, 0, max);
  }
  if (part % step === 0) {
    // Already aligned, just add step
    return clamp(part + step, 0, max);
  }
  // Not aligned, snap to next multiple of step
  const next = step > 0 ? Math.ceil(part / step) * step : Math.ceil(part / step) * step;
  return clamp(next, 0, max);
}
