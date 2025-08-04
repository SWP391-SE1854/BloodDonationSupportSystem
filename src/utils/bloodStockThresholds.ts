/**
 * Defines the low-stock thresholds for each blood type.
 * When the number of available units for a blood type drops below its threshold,
 * a notification will be triggered.
 * The key is the blood type name, and the value is the minimum number of units.
 */
export const blood_warning_threshold: Record<string, number> = {
    "A+": 10,
    "A-": 10,
    "B+": 10,
    "B-": 10,
    "AB+": 10,
    "AB-": 10,
    "O+": 10,
    "O-": 10,
};
