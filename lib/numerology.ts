export function calculateNumerologyNumber(input: string | number): number {
  const digits = String(input).replace(/\D/g, "")
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