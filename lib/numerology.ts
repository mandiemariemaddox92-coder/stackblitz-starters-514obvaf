export function calculateNumerologyNumber(digits: string): number {
  let sum = digits
    .split("")
    .reduce((total, digit) => total + Number(digit), 0)

  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum
      .toString()
      .split("")
      .reduce((total, digit) => total + Number(digit), 0)
  }

  return sum
}