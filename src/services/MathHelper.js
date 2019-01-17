export function truncateNumber(number, count) {
  const base = Math.pow(10, count);
  return Math.floor(number * base) / base;
}