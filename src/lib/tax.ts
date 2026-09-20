// Alberta has no PST — GST is the only sales tax that applies to vehicle sales.
export const GST_RATE = 0.05

export function calcGst(amount: number): number {
  return Math.round(amount * GST_RATE * 100) / 100
}
