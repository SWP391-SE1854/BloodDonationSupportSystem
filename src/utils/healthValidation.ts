import { HealthRecord } from '@/services/health-record.service';
import { DonationHistoryEntry, isEligibleByHistory } from './donationConstants';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Core eligibility criteria
export const DonorEligibilityCriteria = {
  WEIGHT: {
    MIN: 50,
    MAX: 150
  },
  HEIGHT: {
    MIN: 140,
    MAX: 220
  },
  BMI: {
    MIN: 18.5,
    MAX: 35
  }
};

export const validateHealthRecord = (data: Partial<HealthRecord>, donationHistory?: DonationHistoryEntry[]): ValidationResult => {
  const errors: ValidationError[] = [];

  // Weight validation
  if (typeof data.weight !== 'undefined') {
    if (data.weight < DonorEligibilityCriteria.WEIGHT.MIN) {
      errors.push({
        field: 'weight',
        message: `Weight must be at least ${DonorEligibilityCriteria.WEIGHT.MIN}kg to be eligible for donation`
      });
    } else if (data.weight > DonorEligibilityCriteria.WEIGHT.MAX) {
      errors.push({
        field: 'weight',
        message: `Please verify weight - must be less than ${DonorEligibilityCriteria.WEIGHT.MAX}kg`
      });
    }
  } else {
    errors.push({
      field: 'weight',
      message: 'Weight is required'
    });
  }

  // Height validation
  if (typeof data.height !== 'undefined') {
    if (data.height < DonorEligibilityCriteria.HEIGHT.MIN) {
      errors.push({
        field: 'height',
        message: `Height must be at least ${DonorEligibilityCriteria.HEIGHT.MIN}cm`
      });
    } else if (data.height > DonorEligibilityCriteria.HEIGHT.MAX) {
      errors.push({
        field: 'height',
        message: `Please verify height - must be less than ${DonorEligibilityCriteria.HEIGHT.MAX}cm`
      });
    }
  } else {
    errors.push({
      field: 'height',
      message: 'Height is required'
    });
  }

  // Blood type validation
  if (!data.blood_type) {
    errors.push({
      field: 'blood_type',
      message: 'Blood type is required'
    });
  }

  // Calculate BMI and validate
  if (data.weight && data.height) {
    const heightInMeters = data.height / 100;
    const bmi = data.weight / (heightInMeters * heightInMeters);
    
    if (bmi < DonorEligibilityCriteria.BMI.MIN) {
      errors.push({
        field: 'bmi',
        message: `BMI is too low for donation (must be at least ${DonorEligibilityCriteria.BMI.MIN})`
      });
    } else if (bmi > DonorEligibilityCriteria.BMI.MAX) {
      errors.push({
        field: 'bmi',
        message: `BMI is too high for donation (must be below ${DonorEligibilityCriteria.BMI.MAX})`
      });
    }
  }

  // Check eligibility based on donation history
  if (donationHistory && donationHistory.length > 0 && !isEligibleByHistory(donationHistory)) {
    errors.push({
      field: 'last_donation',
      message: 'Must wait the required interval based on your recent donation history before next donation'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const isEligibleToDonate = (healthRecord: Partial<HealthRecord>, donationHistory?: DonationHistoryEntry[]): boolean => {
  const validation = validateHealthRecord(healthRecord, donationHistory);
  
  // Check basic validation
  if (!validation.isValid) return false;
  
  // Check eligibility based on donation history
  if (donationHistory && !isEligibleByHistory(donationHistory)) {
    return false;
  }
  
  // Check explicit eligibility status if set by staff
  if (typeof healthRecord.eligibility_status === 'boolean') {
    return healthRecord.eligibility_status;
  }
  
  return true;
}; 