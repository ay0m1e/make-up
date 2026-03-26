// Money formatting helpers for booking summaries and confirmations.
export function formatPence(amountPence: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: amountPence % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amountPence / 100);
}
