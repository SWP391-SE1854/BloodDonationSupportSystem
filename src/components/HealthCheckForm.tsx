// ==================== Imports ====================
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Donation } from "@/types/api";

// ==================== Health Check Criteria ====================
const HealthCriteria = {
  MIN_WEIGHT_KG: 50,
  MAX_TEMP_C: 37.5,
  BP_SYSTOLIC_MIN: 90,
  BP_SYSTOLIC_MAX: 180,
  BP_DIASTOLIC_MIN: 50,
  BP_DIASTOLIC_MAX: 100,
  HEART_RATE_MIN: 50,
  HEART_RATE_MAX: 100,
};

// ==================== Form Schema Validation ====================
const healthCheckSchema = z.object({
  weight: z.number().min(HealthCriteria.MIN_WEIGHT_KG, `Weight must be at least ${HealthCriteria.MIN_WEIGHT_KG} kg.`),
  temperature: z.number().max(HealthCriteria.MAX_TEMP_C, `Temperature must not exceed ${HealthCriteria.MAX_TEMP_C}°C.`),
  bp_systolic: z.number().min(HealthCriteria.BP_SYSTOLIC_MIN).max(HealthCriteria.BP_SYSTOLIC_MAX, "Systolic BP out of range."),
  bp_diastolic: z.number().min(HealthCriteria.BP_DIASTOLIC_MIN).max(HealthCriteria.BP_DIASTOLIC_MAX, "Diastolic BP out of range."),
  heart_rate: z.number().min(HealthCriteria.HEART_RATE_MIN).max(HealthCriteria.HEART_RATE_MAX, "Heart rate must be between 50-100 bpm."),
});

type HealthCheckFormData = z.infer<typeof healthCheckSchema>;

// ==================== Component Props Interface ====================
interface HealthCheckFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  donation: Donation | null;
  onCheckResult: (donationId: number, isEligible: boolean) => void;
}

// ==================== Main Component ====================
export const HealthCheckForm = ({ isOpen, onOpenChange, donation, onCheckResult }: HealthCheckFormProps) => {
  const { toast } = useToast();
  
  // ==================== Form Setup ====================
  const { control, handleSubmit, formState: { errors }, reset } = useForm<HealthCheckFormData>({
    resolver: zodResolver(healthCheckSchema),
    defaultValues: {
        weight: 0,
        temperature: 0,
        bp_systolic: 0,
        bp_diastolic: 0,
        heart_rate: 0
    }
  });

  // ==================== Form Submission Handler ====================
  const onSubmit = (data: HealthCheckFormData) => {
    // This form only validates. The parent component handles the status update.
    onCheckResult(donation!.donation_id, true);
    toast({ title: "Health Check Passed", description: "The donor is eligible. You can now complete the donation." });
    onOpenChange(false);
  };

  // ==================== Manual Rejection Handler ====================
  const handleManualReject = () => {
    onCheckResult(donation!.donation_id, false);
    toast({ title: "Health Check Failed", description: "The donor is not eligible. The donation will be marked as rejected.", variant: 'destructive' });
    onOpenChange(false);
  }

  // ==================== Dialog Close Handler ====================
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  }

  // ==================== Form UI Render ====================
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pre-Donation Health Check</DialogTitle>
          <DialogDescription>
            Enter the donor's vitals. Donor ID: {donation?.user_id}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Weight and Temperature Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Controller name="weight" control={control} render={({ field }) => <Input {...field} type="number" step="0.1" onChange={e => field.onChange(parseFloat(e.target.value))}/>} />
                  {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
              </div>
              <div>
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Controller name="temperature" control={control} render={({ field }) => <Input {...field} type="number" step="0.1" onChange={e => field.onChange(parseFloat(e.target.value))}/>} />
                  {errors.temperature && <p className="text-red-500 text-xs mt-1">{errors.temperature.message}</p>}
              </div>
            </div>

            {/* Blood Pressure Section */}
            <div>
              <Label>Blood Pressure (Systolic/Diastolic)</Label>
              <div className="flex gap-2">
                <Controller name="bp_systolic" control={control} render={({ field }) => <Input {...field} type="number" placeholder="Systolic" onChange={e => field.onChange(parseInt(e.target.value, 10))}/>} />
                <Controller name="bp_diastolic" control={control} render={({ field }) => <Input {...field} type="number" placeholder="Diastolic" onChange={e => field.onChange(parseInt(e.target.value, 10))}/>} />
              </div>
              {errors.bp_systolic && <p className="text-red-500 text-xs mt-1">{errors.bp_systolic.message}</p>}
              {errors.bp_diastolic && <p className="text-red-500 text-xs mt-1">{errors.bp_diastolic.message}</p>}
            </div>

            {/* Heart Rate Section */}
            <div>
              <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
              <Controller 
                name="heart_rate" 
                control={control} 
                render={({ field }) => <Input {...field} type="number" placeholder="Heart Rate" onChange={e => field.onChange(parseInt(e.target.value, 10))}/>} 
              />
              {errors.heart_rate && <p className="text-red-500 text-xs mt-1">{errors.heart_rate.message}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleManualReject}>Mark as Ineligible</Button>
            <Button type="submit">Check & Approve</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 