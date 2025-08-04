import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bloodTypes } from '@/utils/bloodTypes';

interface BloodTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const BloodTypeSelect: React.FC<BloodTypeSelectProps> = ({ value, onChange, className }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Chọn nhóm máu" />
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