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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
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
import { User, FileText, Activity, Shield, Stethoscope, AlertTriangle } from "lucide-react";

// Health check form schema
const comprehensiveHealthCheckSchema = z.object({
  // Section 1: Blood Donation History
  hasDonatedBefore: z.enum(["yes", "no"], { required_error: "Vui lòng chọn câu trả lời" }),
  lastDonationDate: z.string().optional(),
  hasSideEffects: z.enum(["yes", "no"], { required_error: "Vui lòng chọn câu trả lời" }),
  sideEffectsDescription: z.string().optional(),

  // Section 2: Medical History
  isCurrentlySick: z.enum(["yes", "no"], { required_error: "Vui lòng chọn câu trả lời" }),
  hasChronicConditions: z.enum(["yes", "no"], { required_error: "Vui lòng chọn câu trả lời" }),
  chronicConditionsList: z.string().optional(),
  hasInfectiousDiseases: z.enum(["yes", "no"], { required_error: "Vui lòng chọn câu trả lời" }),
  hasRecentProcedures: z.enum(["yes", "no"], { required_error: "Vui lòng chọn câu trả lời" }),
  isOnMedication: z.enum(["yes", "no"], { required_error: "Vui lòng chọn câu trả lời" }),
  medicationList: z.string().optional(),

  // Section 3: Current Health Status
  isFeelingHealthy: z.enum(["yes", "no"], { required_error: "Vui lòng chọn câu trả lời" }),
  hasHealthChanges: z.enum(["yes", "no"], { required_error: "Vui lòng chọn câu trả lời" }),
  healthChangesDescription: z.string().optional(),
  isPregnantOrBreastfeeding: z.enum(["yes", "no", "na"], { required_error: "Vui lòng chọn câu trả lời" }),

  // Section 4: High-Risk Behaviors
  hasUnprotectedSex: z.enum(["yes", "no"], { required_error: "Vui lòng chọn câu trả lời" }),
  hasUsedDrugs: z.enum(["yes", "no"], { required_error: "Vui lòng chọn câu trả lời" }),
  hasBeenInjected: z.enum(["yes", "no"], { required_error: "Vui lòng chọn câu trả lời" }),

  // Section 5: Physical Examination
  weight: z.string()
    .min(1, "Cân nặng là bắt buộc")
    .refine((val) => !isNaN(Number(val)), { message: "Cân nặng phải là số" })
    .refine((val) => Number(val) >= 30 && Number(val) <= 200, {
      message: "Cân nặng phải từ 30-200kg"
    }),
  height: z.string()
    .min(1, "Chiều cao là bắt buộc")
    .refine((val) => !isNaN(Number(val)), { message: "Chiều cao phải là số" })
    .refine((val) => Number(val) >= 120 && Number(val) <= 220, {
      message: "Chiều cao phải từ 120-220cm"
    }),
  bloodPressureSystolic: z.string()
    .min(1, "Huyết áp tâm thu là bắt buộc")
    .refine((val) => !isNaN(Number(val)), { message: "Huyết áp tâm thu phải là số" })
    .refine((val) => Number(val) >= 70 && Number(val) <= 220, {
      message: "Huyết áp tâm thu phải từ 70-220 mmHg"
    }),
  bloodPressureDiastolic: z.string()
    .min(1, "Huyết áp tâm trương là bắt buộc")
    .refine((val) => !isNaN(Number(val)), { message: "Huyết áp tâm trương phải là số" })
    .refine((val) => Number(val) >= 40 && Number(val) <= 150, {
      message: "Huyết áp tâm trương phải từ 40-150 mmHg"
    }),
  pulseRate: z.string()
    .min(1, "Nhịp tim là bắt buộc")
    .refine((val) => !isNaN(Number(val)), { message: "Nhịp tim phải là số" })
    .refine((val) => Number(val) >= 30 && Number(val) <= 200, {
      message: "Nhịp tim phải từ 30-200 bpm"
    }),
  temperature: z.string()
    .min(1, "Nhiệt độ là bắt buộc")
    .refine((val) => !isNaN(Number(val)), { message: "Nhiệt độ phải là số" })
    .refine((val) => Number(val) >= 34 && Number(val) <= 42, {
      message: "Nhiệt độ phải từ 34-42°C"
    }),
  hemoglobin: z.string()
    .min(1, "Huyết sắc tố là bắt buộc")
    .refine((val) => !isNaN(Number(val)), { message: "Huyết sắc tố phải là số" })
    .refine((val) => Number(val) >= 8 && Number(val) <= 22, {
      message: "Huyết sắc tố phải từ 8-22 g/dL"
    }),
});

type ComprehensiveHealthCheckFormData = z.infer<typeof comprehensiveHealthCheckSchema>;

interface ComprehensiveHealthCheckFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    donation: Donation | null;
    onCheckResult: (donationId: number, isEligible: boolean, formData: ComprehensiveHealthCheckFormData) => void;
}

export const ComprehensiveHealthCheckForm = ({ 
    isOpen, 
    onOpenChange, 
    donation, 
    onCheckResult
}: ComprehensiveHealthCheckFormProps) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState<ComprehensiveHealthCheckFormData | null>(null);

    const form = useForm<ComprehensiveHealthCheckFormData>({
        resolver: zodResolver(comprehensiveHealthCheckSchema),
        defaultValues: {
            hasDonatedBefore: "no",
            lastDonationDate: "",
            hasSideEffects: "no",
            sideEffectsDescription: "",
            isCurrentlySick: "no",
            hasChronicConditions: "no",
            chronicConditionsList: "",
            hasInfectiousDiseases: "no",
            hasRecentProcedures: "no",
            isOnMedication: "no",
            medicationList: "",
            isFeelingHealthy: "yes",
            hasHealthChanges: "no",
            healthChangesDescription: "",
            isPregnantOrBreastfeeding: "no",
            hasUnprotectedSex: "no",
            hasUsedDrugs: "no",
            hasBeenInjected: "no",
            weight: "",
            height: "",
            bloodPressureSystolic: "",
            bloodPressureDiastolic: "",
            pulseRate: "",
            temperature: "",
            hemoglobin: "",
        }
    });

    useEffect(() => {
        if (isOpen) {
            form.reset({
                hasDonatedBefore: "no",
                lastDonationDate: "",
                hasSideEffects: "no",
                sideEffectsDescription: "",
                isCurrentlySick: "no",
                hasChronicConditions: "no",
                chronicConditionsList: "",
                hasInfectiousDiseases: "no",
                hasRecentProcedures: "no",
                isOnMedication: "no",
                medicationList: "",
                isFeelingHealthy: "yes",
                hasHealthChanges: "no",
                healthChangesDescription: "",
                isPregnantOrBreastfeeding: "no",
                hasUnprotectedSex: "no",
                hasUsedDrugs: "no",
                hasBeenInjected: "no",
                weight: "",
                height: "",
                bloodPressureSystolic: "",
                bloodPressureDiastolic: "",
                pulseRate: "",
                temperature: "",
                hemoglobin: "",
            });
        }
    }, [isOpen, form]);

    const determineEligibility = (data: ComprehensiveHealthCheckFormData): boolean => {
        // Tiêu chuẩn y tế cho hiến máu
        const weightOk = Number(data.weight) >= 45; // Tối thiểu 45kg
        const heightOk = Number(data.height) >= 140; // Tối thiểu 140cm
        const bloodPressureOk = Number(data.bloodPressureSystolic) >= 90 && Number(data.bloodPressureSystolic) <= 160 &&
                               Number(data.bloodPressureDiastolic) >= 60 && Number(data.bloodPressureDiastolic) <= 100;
        const temperatureOk = Number(data.temperature) >= 36.0 && Number(data.temperature) <= 37.5;
        const hemoglobinOk = Number(data.hemoglobin) >= 12.5; // Tối thiểu 12.5 g/dL cho nữ, 13.5 g/dL cho nam (dùng 12.5 làm chuẩn chung)
        const pulseOk = Number(data.pulseRate) >= 50 && Number(data.pulseRate) <= 100;

        // Tiêu chuẩn sức khỏe tổng quát
        const notCurrentlySick = data.isCurrentlySick === "no";
        const noInfectiousDiseases = data.hasInfectiousDiseases === "no";
        const noRecentProcedures = data.hasRecentProcedures === "no";
        const feelingHealthy = data.isFeelingHealthy === "yes";

        // Tiêu chuẩn hành vi nguy cơ
        const noUnprotectedSex = data.hasUnprotectedSex === "no";
        const noDrugUse = data.hasUsedDrugs === "no";
        const noUnknownInjections = data.hasBeenInjected === "no";

        return weightOk && heightOk && bloodPressureOk && temperatureOk && hemoglobinOk && pulseOk &&
               notCurrentlySick && noInfectiousDiseases && noRecentProcedures && feelingHealthy &&
               noUnprotectedSex && noDrugUse && noUnknownInjections;
    };

    const onSubmit = async (data: ComprehensiveHealthCheckFormData) => {
        if (!donation) return;

        const isEligible = determineEligibility(data);
        const hasValidationErrors = Object.keys(form.formState.errors).length > 0;

        if (hasValidationErrors) {
            setPendingSubmit(data);
            setShowConfirmationDialog(true);
            return;
        }

        try {
            onCheckResult(donation.donation_id, isEligible, data);
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
            onCheckResult(donation.donation_id, isEligible, pendingSubmit);
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

    const isFormValid = form.formState.isValid && Object.keys(form.formState.errors).length === 0;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Kiểm tra sức khỏe toàn diện
                        </DialogTitle>
                        <DialogDescription>
                            Vui lòng điền đầy đủ thông tin để đảm bảo an toàn cho người hiến máu và người nhận máu.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Section 1: Blood Donation History */}
                            <Card className="border-gray-200">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        <User className="h-5 w-5 text-blue-600" />
                                        Lịch sử hiến máu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="hasDonatedBefore"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Đã từng hiến máu chưa?
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="donated-yes" />
                                                            <Label htmlFor="donated-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="donated-no" />
                                                            <Label htmlFor="donated-no" className="text-sm">Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {form.watch("hasDonatedBefore") === "yes" && (
                                        <FormField
                                            control={form.control}
                                            name="lastDonationDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">
                                                        Lần hiến máu gần nhất
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} className="max-w-xs" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="hasSideEffects"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Có gặp tác dụng phụ sau khi hiến máu không? (chóng mặt, ngất xỉu, buồn nôn)
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="side-effects-yes" />
                                                            <Label htmlFor="side-effects-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="side-effects-no" />
                                                            <Label htmlFor="side-effects-no" className="text-sm">Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {form.watch("hasSideEffects") === "yes" && (
                                        <FormField
                                            control={form.control}
                                            name="sideEffectsDescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">
                                                        Mô tả tác dụng phụ
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea 
                                                            placeholder="Mô tả chi tiết các tác dụng phụ..." 
                                                            {...field} 
                                                            className="min-h-[80px]"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* Section 2: Medical History */}
                            <Card className="border-gray-200">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        <FileText className="h-5 w-5 text-green-600" />
                                        Tiền sử bệnh lý
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="isCurrentlySick"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Có đang bị bệnh không? (cảm, sốt, cúm, ho, tiêu chảy)
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="sick-yes" />
                                                            <Label htmlFor="sick-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="sick-no" />
                                                            <Label htmlFor="sick-no" className="text-sm">Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="hasChronicConditions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Có bệnh mãn tính không? (bệnh tim, tiểu đường, cao huyết áp, hen suyễn)
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="chronic-yes" />
                                                            <Label htmlFor="chronic-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="chronic-no" />
                                                            <Label htmlFor="chronic-no" className="text-sm">Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {form.watch("hasChronicConditions") === "yes" && (
                                        <FormField
                                            control={form.control}
                                            name="chronicConditionsList"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">
                                                        Danh sách bệnh mãn tính
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea 
                                                            placeholder="Liệt kê các bệnh mãn tính..." 
                                                            {...field} 
                                                            className="min-h-[80px]"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="hasInfectiousDiseases"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Có từng mắc bệnh truyền nhiễm không? (viêm gan B/C, HIV/AIDS, giang mai)
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="infectious-yes" />
                                                            <Label htmlFor="infectious-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="infectious-no" />
                                                            <Label htmlFor="infectious-no" className="text-sm">Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="hasRecentProcedures"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Có phẫu thuật, truyền máu, xăm hình, xỏ khuyên trong 6-12 tháng qua không?
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="procedures-yes" />
                                                            <Label htmlFor="procedures-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="procedures-no" />
                                                            <Label htmlFor="procedures-no" className="text-sm">Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="isOnMedication"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Có đang dùng thuốc không?
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="medication-yes" />
                                                            <Label htmlFor="medication-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="medication-no" />
                                                            <Label htmlFor="medication-no" className="text-sm">Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {form.watch("isOnMedication") === "yes" && (
                                        <FormField
                                            control={form.control}
                                            name="medicationList"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">
                                                        Danh sách thuốc đang dùng
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea 
                                                            placeholder="Liệt kê các loại thuốc..." 
                                                            {...field} 
                                                            className="min-h-[80px]"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* Section 3: Current Health Status */}
                            <Card className="border-gray-200">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        <Activity className="h-5 w-5 text-purple-600" />
                                        Tình trạng sức khỏe hiện tại
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="isFeelingHealthy"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Có cảm thấy khỏe mạnh hôm nay không?
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="healthy-yes" />
                                                            <Label htmlFor="healthy-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="healthy-no" />
                                                            <Label htmlFor="healthy-no" className="text-sm">Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="hasHealthChanges"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Có thay đổi sức khỏe gần đây không? (sụt cân đột ngột, mất ngủ kéo dài)
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="changes-yes" />
                                                            <Label htmlFor="changes-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="changes-no" />
                                                            <Label htmlFor="changes-no" className="text-sm">Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {form.watch("hasHealthChanges") === "yes" && (
                                        <FormField
                                            control={form.control}
                                            name="healthChangesDescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">
                                                        Mô tả thay đổi sức khỏe
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea 
                                                            placeholder="Mô tả chi tiết các thay đổi..." 
                                                            {...field} 
                                                            className="min-h-[80px]"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="isPregnantOrBreastfeeding"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Đối với phụ nữ: Có đang mang thai, cho con bú hoặc đang trong kỳ kinh không?
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="pregnant-yes" />
                                                            <Label htmlFor="pregnant-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="pregnant-no" />
                                                            <Label htmlFor="pregnant-no" className="text-sm">Không</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="na" id="pregnant-na" />
                                                            <Label htmlFor="pregnant-na" className="text-sm">Không áp dụng</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Section 4: High-Risk Behaviors */}
                            <Card className="border-gray-200">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        <Shield className="h-5 w-5 text-red-600" />
                                        Hành vi nguy cơ cao
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="hasUnprotectedSex"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Có quan hệ tình dục không an toàn trong 12 tháng qua không?
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="sex-yes" />
                                                            <Label htmlFor="sex-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="sex-no" />
                                                            <Label htmlFor="sex-no" className="text-sm">Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="hasUsedDrugs"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Có sử dụng ma túy hoặc chất kích thích không?
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="drugs-yes" />
                                                            <Label htmlFor="drugs-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="drugs-no" />
                                                            <Label htmlFor="drugs-no" className="text-sm">Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="hasBeenInjected"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Có bị tiêm chất không rõ nguồn gốc không?
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="injected-yes" />
                                                            <Label htmlFor="injected-yes" className="text-sm">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="injected-no" />
                                                            <Label htmlFor="injected-no" className="text-sm">Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Section 5: Physical Examination */}
                            <Card className="border-gray-200">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        <Stethoscope className="h-5 w-5 text-indigo-600" />
                                        Khám sức khỏe nhanh
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="weight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">
                                                        Cân nặng (kg)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="text"
                                                            placeholder="Ví dụ: 65"
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="height"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">
                                                        Chiều cao (cm)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="text"
                                                            placeholder="Ví dụ: 165"
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="bloodPressureSystolic"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium text-gray-700">
                                                            Huyết áp tâm thu (mmHg)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                type="text"
                                                                placeholder="Ví dụ: 120"
                                                                {...field} 
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="bloodPressureDiastolic"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium text-gray-700">
                                                            Huyết áp tâm trương (mmHg)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                type="text"
                                                                placeholder="Ví dụ: 80"
                                                                {...field} 
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="pulseRate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">
                                                        Nhịp tim (bpm)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="text"
                                                            placeholder="Ví dụ: 72"
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="temperature"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">
                                                        Nhiệt độ (°C)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="text"
                                                            placeholder="Ví dụ: 36.5"
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="hemoglobin"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">
                                                        Huyết sắc tố (g/dL)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="text"
                                                            placeholder="Ví dụ: 13.5"
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
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
                                <div className="flex gap-3">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Hủy
                                        </Button>
                                    </DialogClose>
                                    <Button 
                                        type="submit" 
                                        disabled={form.formState.isSubmitting}
                                        className="min-w-[140px] bg-blue-600 hover:bg-blue-700"
                                    >
                                        {form.formState.isSubmitting ? 'Đang xử lý...' : 'Gửi kiểm tra sức khỏe'}
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
                            Form vẫn còn một số lỗi chưa được điền đầy đủ. Có chắc chắn muốn gửi form này không?
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