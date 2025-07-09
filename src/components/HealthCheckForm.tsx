import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Donation } from "@/types/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import HealthRecordService, { HealthRecord } from "@/services/health-record.service";
import { useEffect } from "react";

const healthValidationSchema = z.object({
  weight: z.number().min(45, "Cân nặng phải ít nhất 45kg."),
  height: z.number().min(145, "Chiều cao phải ít nhất 145cm."),
  blood_pressure_systolic: z.number().min(90, "Huyết áp phải lớn hơn 90.").max(160, "Huyết áp tâm thu ngoài phạm vi cho phép."),
  blood_pressure_diastolic: z.number().min(60, "Huyết áp phải lớn hơn 60.").max(100, "Huyết áp tâm trương ngoài phạm vi cho phép."),
  temperature: z.number().min(36.0, "Nhiệt độ phải lớn hơn 36.0.").max(37.5, "Nhiệt độ ngoài phạm vi cho phép."),
  heart_rate: z.number().min(60, "Nhịp tim phải lớn hơn 60.").max(100, "Nhịp tim ngoài phạm vi cho phép.").optional(),
});

type HealthFormData = z.infer<typeof healthValidationSchema>;

interface HealthCheckFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    donation: Donation | null;
    onCheckResult: (donationId: number, isEligible: boolean) => void;
}

export const HealthCheckForm = ({ isOpen, onOpenChange, donation, onCheckResult }: HealthCheckFormProps) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const userRole = user?.role;
    let recordIdToUpdate: number | undefined;


    const form = useForm<HealthFormData>({
        resolver: zodResolver(healthValidationSchema),
    });

     useEffect(() => {
        if (isOpen && donation && donation.user_id) {
            HealthRecordService.getRecordByUserId(donation.user_id)
                .then(record => {
                    if (record) {
                        recordIdToUpdate = record.record_id;
                        form.reset({
                            weight: record.weight,
                            height: record.height,
                            blood_pressure_systolic: record.blood_pressure_systolic,
                            blood_pressure_diastolic: record.blood_pressure_diastolic,
                            temperature: record.temperature,
                            heart_rate: record.heart_rate,
                        });
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch health record:", err)
                    toast({
                        title: "Lỗi",
                        description: "Không thể tải hồ sơ sức khỏe của người dùng.",
                        variant: "destructive",
                    });
                });
        }
    }, [isOpen, donation, form]);

    const onSubmit = async (data: HealthFormData) => {
        if (!donation) return;

        try {
            if(recordIdToUpdate) {
                await HealthRecordService.updateRecord(recordIdToUpdate.toString(), data as Partial<HealthRecord>);
            }
            onCheckResult(donation.donation_id, true);
            toast({
                title: 'Kiểm tra thành công',
                description: 'Người hiến đủ điều kiện dựa trên dữ liệu đã nhập.',
            });
            onOpenChange(false);
        } catch (error) {
             toast({
                title: 'Lỗi',
                description: 'Không thể cập nhật hồ sơ sức khỏe.',
                variant: 'destructive',
            });
        }
    };
    
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
        }
        onOpenChange(open);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kiểm tra sức khỏe</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin sức khỏe cho người hiến ID: {donation?.user_id}. Việc đủ điều kiện sẽ được xác định tự động.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="weight" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cân nặng (kg)</FormLabel>
                                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="height" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chiều cao (cm)</FormLabel>
                                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="blood_pressure_systolic" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Huyết áp tâm thu</FormLabel>
                                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="blood_pressure_diastolic" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Huyết áp tâm trương</FormLabel>
                                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="temperature" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nhiệt độ (°C)</FormLabel>
                                    <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            {userRole !== 'Member' && (
                                <FormField control={form.control} name="heart_rate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nhịp tim (bpm)</FormLabel>
                                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            )}
                        </div>
                        <DialogFooter>
                             <DialogClose asChild>
                                <Button type="button" variant="secondary">Hủy</Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu và phê duyệt'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}; 