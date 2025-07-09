// Donation component types
export type DonationComponent = 'Whole Blood' | 'Platelets' | 'Power Red';

// Waiting periods in days for each donation component
export const DONATION_INTERVALS = {
  'Whole Blood': 0, // 8 weeks
  'Platelets': 7,    // 7 days
  'Power Red': 112,  // 16 weeks
} as const;

// Interface matching the API's DonationHistoryRecord
export interface DonationHistoryEntry {
  donation_id: number;
  user_id: number;
  donation_date: string;
  component: string;
  status: string;
  location?: string;
  note?: string;
}

// Get waiting period for a specific component
export const getWaitingPeriod = (component: string): number => {
  return DONATION_INTERVALS[component as DonationComponent] || DONATION_INTERVALS['Whole Blood'];
};

// Get the latest completed donation
export const getLatestDonation = (donationHistory: DonationHistoryEntry[]): DonationHistoryEntry | null => {
  if (!donationHistory || donationHistory.length === 0) return null;

  const completedDonations = donationHistory
    .filter(donation => donation.status.toLowerCase() === 'completed')
    .sort((a, b) => new Date(b.donation_date).getTime() - new Date(a.donation_date).getTime());

  return completedDonations[0] || null;
};

// Calculate next eligible date based only on the latest donation
export const calculateNextEligibleDate = (donationHistory: DonationHistoryEntry[]): Date | null => {
  const latestDonation = getLatestDonation(donationHistory);
  if (!latestDonation) return null;

  const lastDonationDate = new Date(latestDonation.donation_date);
  const waitingPeriod = getWaitingPeriod(latestDonation.component);
  
  const nextEligible = new Date(lastDonationDate);
  nextEligible.setDate(nextEligible.getDate() + waitingPeriod);
  
  return nextEligible;
};

// Check if eligible based on latest donation only
export const isEligibleByHistory = (donationHistory: DonationHistoryEntry[]): boolean => {
  const nextEligible = calculateNextEligibleDate(donationHistory);
  if (!nextEligible) return true; // No donation history means eligible
  return new Date() >= nextEligible;
}; 