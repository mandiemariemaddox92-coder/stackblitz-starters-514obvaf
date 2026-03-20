export function calculateNumerologyNumber(input: string): number {
  // remove anything that is NOT a number
  const digits = input.replace(/\D/g, "")

  if (!digits) return 0

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