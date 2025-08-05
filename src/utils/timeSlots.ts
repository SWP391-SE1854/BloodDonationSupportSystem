// Predefined time slots for blood donation appointments
export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  label: string;
}

export const PREDEFINED_TIME_SLOTS: TimeSlot[] = [
  { id: 'slot1', start: '08:00', end: '08:30', label: '08:00 - 08:30' },
  { id: 'slot2', start: '08:30', end: '09:00', label: '08:30 - 09:00' },
  { id: 'slot3', start: '09:00', end: '09:30', label: '09:00 - 09:30' },
  { id: 'slot4', start: '09:30', end: '10:00', label: '09:30 - 10:00' },
  { id: 'slot5', start: '10:00', end: '10:30', label: '10:00 - 10:30' },
  { id: 'slot6', start: '10:30', end: '11:00', label: '10:30 - 11:00' },
  { id: 'slot7', start: '11:00', end: '11:30', label: '11:00 - 11:30' },
  { id: 'slot8', start: '11:30', end: '12:00', label: '11:30 - 12:00' },
  { id: 'slot9', start: '13:00', end: '13:30', label: '13:00 - 13:30' },
  { id: 'slot10', start: '13:30', end: '14:00', label: '13:30 - 14:00' },
  { id: 'slot11', start: '14:00', end: '14:30', label: '14:00 - 14:30' },
  { id: 'slot12', start: '14:30', end: '15:00', label: '14:30 - 15:00' },
  { id: 'slot13', start: '15:00', end: '15:30', label: '15:00 - 15:30' },
  { id: 'slot14', start: '15:30', end: '16:00', label: '15:30 - 16:00' },
  { id: 'slot15', start: '16:00', end: '16:30', label: '16:00 - 16:30' },
  { id: 'slot16', start: '16:30', end: '17:00', label: '16:30 - 17:00' },
];

// Validation function to check if a time slot is valid
export const isValidTimeSlot = (startTime: string, endTime: string): boolean => {
  const slot = PREDEFINED_TIME_SLOTS.find(
    slot => slot.start === startTime && slot.end === endTime
  );
  return !!slot;
};

// Get time slot by ID
export const getTimeSlotById = (id: string): TimeSlot | undefined => {
  return PREDEFINED_TIME_SLOTS.find(slot => slot.id === id);
};

// Get all valid time slot IDs
export const getValidTimeSlotIds = (): string[] => {
  return PREDEFINED_TIME_SLOTS.map(slot => slot.id);
};

// Validate that start time is before end time
export const isValidTimeRange = (startTime: string, endTime: string): boolean => {
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  return start < end;
}; 