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
import { Textarea } from '@/components/ui/textarea';

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
        title: "Lỗi Xác Thực",
        description: "Vui lòng sửa các lỗi trước khi lưu.",
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
          <DialogTitle>{initialData?.record_id ? 'Chỉnh Sửa' : 'Tạo'} Hồ Sơ Sức Khỏe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Cân nặng (kg)</Label>
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
              <Label htmlFor="height">Chiều cao (cm)</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nhóm Máu</Label>
              <BloodTypeSelect 
                value={formData.blood_type || ''} 
                onChange={value => handleInputChange('blood_type', value)}
                className={getFieldError('blood_type') ? 'border-red-500' : ''}
              />
              {renderError('blood_type')}
            </div>
            <div className="space-y-2">
              <Label htmlFor="heart_rate">Nhịp Tim (nhịp/phút)</Label>
              <Input 
                id="heart_rate" 
                type="number" 
                value={formData.heart_rate || ''} 
                onChange={e => handleInputChange('heart_rate', parseFloat(e.target.value) || 0)}
                className={getFieldError('heart_rate') ? 'border-red-500' : ''}
              />
              {renderError('heart_rate')}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medication">Thuốc Đang Sử Dụng</Label>
            <Input 
              id="medication" 
              value={formData.medication || ''} 
              onChange={e => handleInputChange('medication', e.target.value)}
              className={getFieldError('medication') ? 'border-red-500' : ''}
            />
            {renderError('medication')}
          </div>

          {(userRole === 'Admin' || userRole === 'Staff') && (
            <>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="eligibility_status" 
                    checked={formData.eligibility_status || false} 
                    onCheckedChange={checked => handleInputChange('eligibility_status', checked)}
                  />
                  <Label htmlFor="eligibility_status">Đủ Điều Kiện Hiến Máu</Label>
                </div>
                <p className="text-sm text-gray-500">
                  Lưu ý: Nhân viên có thể ghi đè trạng thái đủ điều kiện tự động
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection_reason">Lý Do Từ Chối (nếu có)</Label>
                <Textarea 
                  id="rejection_reason" 
                  value={formData.rejection_reason || ''} 
                  onChange={e => handleInputChange('rejection_reason', e.target.value)}
                  className={getFieldError('rejection_reason') ? 'border-red-500' : ''}
                  placeholder="Nhập lý do từ chối hiến máu nếu không đủ điều kiện"
                />
                {renderError('rejection_reason')}
              </div>
            </>
          )}

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Vui lòng sửa các lỗi xác thực trước khi lưu.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HealthRecordForm;