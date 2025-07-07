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
  },
  HEART_RATE: {
    MIN: 50,
    MAX: 100
  }
};

export const validateHealthRecord = (data: Partial<HealthRecord>, donationHistory?: DonationHistoryEntry[]): ValidationResult => {
  const errors: ValidationError[] = [];

  // Weight validation
  if (typeof data.weight !== 'undefined') {
    if (data.weight < DonorEligibilityCriteria.WEIGHT.MIN) {
      errors.push({
        field: 'weight',
        message: `Cân nặng phải ít nhất ${DonorEligibilityCriteria.WEIGHT.MIN}kg để đủ điều kiện hiến máu`
      });
    } else if (data.weight > DonorEligibilityCriteria.WEIGHT.MAX) {
      errors.push({
        field: 'weight',
        message: `Vui lòng kiểm tra cân nặng - phải nhỏ hơn ${DonorEligibilityCriteria.WEIGHT.MAX}kg`
      });
    }
  } else {
    errors.push({
      field: 'weight',
      message: 'Cân nặng là bắt buộc'
    });
  }

  // Height validation
  if (typeof data.height !== 'undefined') {
    if (data.height < DonorEligibilityCriteria.HEIGHT.MIN) {
      errors.push({
        field: 'height',
        message: `Chiều cao phải ít nhất ${DonorEligibilityCriteria.HEIGHT.MIN}cm`
      });
    } else if (data.height > DonorEligibilityCriteria.HEIGHT.MAX) {
      errors.push({
        field: 'height',
        message: `Vui lòng kiểm tra chiều cao - phải nhỏ hơn ${DonorEligibilityCriteria.HEIGHT.MAX}cm`
      });
    }
  } else {
    errors.push({
      field: 'height',
      message: 'Chiều cao là bắt buộc'
    });
  }

  // Heart rate validation
  if (typeof data.heart_rate !== 'undefined') {
    if (data.heart_rate < DonorEligibilityCriteria.HEART_RATE.MIN) {
      errors.push({
        field: 'heart_rate',
        message: `Nhịp tim phải ít nhất ${DonorEligibilityCriteria.HEART_RATE.MIN} nhịp/phút`
      });
    } else if (data.heart_rate > DonorEligibilityCriteria.HEART_RATE.MAX) {
      errors.push({
        field: 'heart_rate',
        message: `Nhịp tim phải nhỏ hơn ${DonorEligibilityCriteria.HEART_RATE.MAX} nhịp/phút`
      });
    }
  } else {
    errors.push({
      field: 'heart_rate',
      message: 'Nhịp tim là bắt buộc'
    });
  }

  // Blood type validation
  if (!data.blood_type) {
    errors.push({
      field: 'blood_type',
      message: 'Nhóm máu là bắt buộc'
    });
  }

  // Calculate BMI and validate
  if (data.weight && data.height) {
    const heightInMeters = data.height / 100;
    const bmi = data.weight / (heightInMeters * heightInMeters);
    
    if (bmi < DonorEligibilityCriteria.BMI.MIN) {
      errors.push({
        field: 'bmi',
        message: `Chỉ số BMI quá thấp để hiến máu (phải ít nhất ${DonorEligibilityCriteria.BMI.MIN})`
      });
    } else if (bmi > DonorEligibilityCriteria.BMI.MAX) {
      errors.push({
        field: 'bmi',
        message: `Chỉ số BMI quá cao để hiến máu (phải dưới ${DonorEligibilityCriteria.BMI.MAX})`
      });
    }
  }

  // Check eligibility based on donation history
  if (donationHistory && donationHistory.length > 0 && !isEligibleByHistory(donationHistory)) {
    errors.push({
      field: 'last_donation',
      message: 'Phải đợi đủ thời gian quy định dựa trên lịch sử hiến máu gần đây trước khi hiến máu tiếp'
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