import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { HealthRecord } from '@/services/health-record.service';
import BloodTypeSelect from '@/components/BloodTypeSelect';

interface HealthRecordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<HealthRecord>) => void;
  initialData?: Partial<HealthRecord> | null;
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<HealthRecord>>(initialData || {});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleInputChange = (field: keyof HealthRecord, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData?.record_id ? 'Edit' : 'Create'} Health Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" value={formData.weight || ''} onChange={e => handleInputChange('weight', parseInt(e.target.value, 10) || 0)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" value={formData.height || ''} onChange={e => handleInputChange('height', parseInt(e.target.value, 10) || 0)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Blood Type</Label>
            <BloodTypeSelect value={formData.blood_type || ''} onChange={value => handleInputChange('blood_type', value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Input id="allergies" value={formData.allergies || ''} onChange={e => handleInputChange('allergies', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medication">Current Medication</Label>
            <Input id="medication" value={formData.medication || ''} onChange={e => handleInputChange('medication', e.target.value)} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="eligibility_status" checked={formData.eligibility_status || false} onCheckedChange={checked => handleInputChange('eligibility_status', checked)} />
            <Label htmlFor="eligibility_status">Eligible to Donate</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HealthRecordForm;