import React, { useState, useEffect } from 'react';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

// Health check data interface for donation health checks
interface HealthCheckData {
  weight: number;
  height: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  temperature: number;
  heart_rate?: number;
}

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
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState<HealthFormData | null>(null);

    const form = useForm<HealthFormData>({
        resolver: zodResolver(healthValidationSchema),
        defaultValues: {
            weight: 0,
            height: 0,
            blood_pressure_systolic: 0,
            blood_pressure_diastolic: 0,
            temperature: 0,
            heart_rate: undefined,
        }
    });

    useEffect(() => {
        if (isOpen && donation) {
            // Reset form when dialog opens
            form.reset({
                weight: 0,
                height: 0,
                blood_pressure_systolic: 0,
                blood_pressure_diastolic: 0,
                temperature: 0,
                heart_rate: undefined,
            });
        }
    }, [isOpen, donation, form]);

    const determineEligibility = (data: HealthFormData): boolean => {
        // Basic health requirements
        const weightOk = data.weight >= 45;
        const bloodPressureOk = data.blood_pressure_systolic >= 90 && data.blood_pressure_systolic <= 160 &&
                               data.blood_pressure_diastolic >= 60 && data.blood_pressure_diastolic <= 100;
        const temperatureOk = data.temperature >= 36.0 && data.temperature <= 37.5;
        const heartRateOk = !data.heart_rate || (data.heart_rate >= 60 && data.heart_rate <= 100);

        return weightOk && bloodPressureOk && temperatureOk && heartRateOk;
    };

    const onSubmit = async (data: HealthFormData) => {
        if (!donation) return;

        const isEligible = determineEligibility(data);
        const hasValidationErrors = Object.keys(form.formState.errors).length > 0;

        if (hasValidationErrors) {
            setPendingSubmit(data);
            setShowConfirmationDialog(true);
            return;
        }

        try {
            onCheckResult(donation.donation_id, isEligible);
            toast({
                title: 'Kiểm tra sức khỏe hoàn thành',
                description: isEligible 
                    ? 'Người hiến đủ điều kiện dựa trên kết quả kiểm tra.'
                    : 'Người hiến không đủ điều kiện dựa trên kết quả kiểm tra.',
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Không thể xử lý kiểm tra sức khỏe.',
                variant: 'destructive',
            });
        }
    };

    const handleConfirmSubmit = () => {
        if (pendingSubmit && donation) {
            const isEligible = determineEligibility(pendingSubmit);
            onCheckResult(donation.donation_id, isEligible);
            toast({
                title: 'Kiểm tra sức khỏe hoàn thành',
                description: isEligible 
                    ? 'Người hiến đủ điều kiện dựa trên kết quả kiểm tra.'
                    : 'Người hiến không đủ điều kiện dựa trên kết quả kiểm tra.',
            });
            onOpenChange(false);
        }
        setShowConfirmationDialog(false);
        setPendingSubmit(null);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
            setShowConfirmationDialog(false);
            setPendingSubmit(null);
        }
        onOpenChange(open);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Kiểm tra sức khỏe
                        </DialogTitle>
                        <DialogDescription>
                            Nhập thông tin sức khỏe cho người hiến ID: {donation?.user_id}. Việc đủ điều kiện sẽ được xác định tự động.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Thông tin sức khỏe</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                </CardContent>
                            </Card>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        {Object.keys(form.formState.errors).length} lỗi
                                    </Badge>
                                    {Object.keys(form.formState.errors).length > 0 && (
                                        <span className="text-sm text-muted-foreground">
                                            Vẫn có thể gửi nhưng cần xác nhận
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">Hủy</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu và phê duyệt'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận gửi form</AlertDialogTitle>
                        <AlertDialogDescription>
                            Form vẫn còn một số lỗi chưa được điền đầy đủ. Bạn có chắc chắn muốn gửi form này không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSubmit}>
                            Gửi form
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}; 