import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BloodTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const bloodTypes = [
    { id: "1", name: "A+" },
    { id: "2", name: "A-" },
    { id: "3", name: "B+" },
    { id: "4", name: "B-" },
    { id: "5", name: "AB+" },
    { id: "6", name: "AB-" },
    { id: "7", name: "O+" },
    { id: "8", name: "O-" }
];

const BloodTypeSelect: React.FC<BloodTypeSelectProps> = ({ value, onChange, className }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select blood type" />
      </SelectTrigger>
      <SelectContent>
        {bloodTypes.map(type => (
          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BloodTypeSelect; 