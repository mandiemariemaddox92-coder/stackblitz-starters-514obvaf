export function calculateNumerologyNumber(input: string): number {
  // Remove anything that is NOT a number
  const digits = input.replace(/\D/g, "");

  if (!digits) return 0;

  // Initial reduction of the string of digits into a single sum
  let sum = digits
    .split("")
    .reduce((total, digit) => total + Number(digit), 0);

  // Continue reducing until we have a single digit, 
  // but stop if we hit Master Numbers 11 or 22
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum
      .toString()
      .split("")
      .reduce((total, digit) => total + Number(digit), 0);
  }

  return sum;
}