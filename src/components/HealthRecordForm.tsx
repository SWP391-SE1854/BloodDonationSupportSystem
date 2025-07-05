import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { HealthRecord } from '@/services/health-record.service';
import BloodTypeSelect from '@/components/BloodTypeSelect';
import { useUserRole } from '@/hooks/useUserRole';
import { validateHealthRecord, ValidationError } from '@/utils/healthValidation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface HealthRecordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<HealthRecord>) => void;
  initialData?: Partial<HealthRecord> | null;
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<HealthRecord>>(initialData || {});
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const userRole = useUserRole();

  useEffect(() => {
    setFormData(initialData || {});
    setErrors([]);
    setTouched({});
  }, [initialData]);

  const handleInputChange = (field: keyof HealthRecord, value: string | number | boolean) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on change
    const validation = validateHealthRecord(newFormData);
    setErrors(validation.errors);
  };

  const getFieldError = (field: string): string | undefined => {
    if (!touched[field]) return undefined;
    const error = errors.find(e => e.field === field);
    return error?.message;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);

    // Validate all fields
    const validation = validateHealthRecord(formData);
    setErrors(validation.errors);

    if (validation.isValid) {
      onSave(formData);
    } else {
      toast({
        title: "Validation Error",
        description: "Please correct the errors before saving.",
        variant: "destructive"
      });
    }
  };

  const renderError = (field: string) => {
    const error = getFieldError(field);
    if (!error) return null;

    return (
      <Alert variant="destructive" className="mt-1">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
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
              <Input 
                id="weight" 
                type="number" 
                value={formData.weight || ''} 
                onChange={e => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                className={getFieldError('weight') ? 'border-red-500' : ''}
              />
              {renderError('weight')}
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input 
                id="height" 
                type="number" 
                value={formData.height || ''} 
                onChange={e => handleInputChange('height', parseFloat(e.target.value) || 0)}
                className={getFieldError('height') ? 'border-red-500' : ''}
              />
              {renderError('height')}
            </div>
          </div>
          
          {/* BMI Error if exists */}
          {renderError('bmi')}

          <div className="space-y-2">
            <Label>Blood Type</Label>
            <BloodTypeSelect 
              value={formData.blood_type || ''} 
              onChange={value => handleInputChange('blood_type', value)}
              className={getFieldError('blood_type') ? 'border-red-500' : ''}
            />
            {renderError('blood_type')}
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Input 
              id="allergies" 
              value={formData.allergies || ''} 
              onChange={e => handleInputChange('allergies', e.target.value)}
              className={getFieldError('allergies') ? 'border-red-500' : ''}
            />
            {renderError('allergies')}
          </div>

          <div className="space-y-2">
            <Label htmlFor="medication">Current Medication</Label>
            <Input 
              id="medication" 
              value={formData.medication || ''} 
              onChange={e => handleInputChange('medication', e.target.value)}
              className={getFieldError('medication') ? 'border-red-500' : ''}
            />
            {renderError('medication')}
          </div>

          {(userRole === 'Admin' || userRole === 'Staff') && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="eligibility_status" 
                  checked={formData.eligibility_status || false} 
                  onCheckedChange={checked => handleInputChange('eligibility_status', checked)}
                />
                <Label htmlFor="eligibility_status">Eligible to Donate</Label>
              </div>
              <p className="text-sm text-gray-500">
                Note: Staff can override automatic eligibility determination
              </p>
            </div>
          )}

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please correct the validation errors before saving.
              </AlertDescription>
            </Alert>
          )}

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