/**
 * Calculate the estimated monthly payment for an amortizing loan.
 * Uses the standard amortization formula:
 * M = P * r(1+r)^n / ((1+r)^n - 1)
 */
export function calculateMonthlyPayment(
  principal: number,
  annualInterestRatePercent: number,
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) return 0;

  const monthlyRate = annualInterestRatePercent / 100 / 12;

  if (monthlyRate === 0) {
    return principal / termMonths;
  }

  const factor = Math.pow(1 + monthlyRate, termMonths);
  const payment = (principal * monthlyRate * factor) / (factor - 1);

  return Math.round(payment * 100) / 100;
}

/**
 * Haversine distance between two lat/lng points, in kilometers.
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 10) / 10;
}

export function formatCurrencyUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
