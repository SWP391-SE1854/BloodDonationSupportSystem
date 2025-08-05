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
  // Section 1: Personal Information & Blood Donation History
  fullName: z.string().min(1, "Họ tên là bắt buộc"),
  dateOfBirth: z.string().min(1, "Ngày sinh là bắt buộc"),
  hasDonatedBefore: z.enum(["yes", "no"]),
  lastDonationDate: z.string().optional(),
  hasSideEffects: z.enum(["yes", "no"]),
  sideEffectsDescription: z.string().optional(),

  // Section 2: Medical History
  isCurrentlySick: z.enum(["yes", "no"]),
  hasChronicConditions: z.enum(["yes", "no"]),
  chronicConditionsList: z.string().optional(),
  hasInfectiousDiseases: z.enum(["yes", "no"]),
  hasRecentProcedures: z.enum(["yes", "no"]),
  isOnMedication: z.enum(["yes", "no"]),
  medicationList: z.string().optional(),

  // Section 3: Current Health Status
  isFeelingHealthy: z.enum(["yes", "no"]),
  hasHealthChanges: z.enum(["yes", "no"]),
  healthChangesDescription: z.string().optional(),
  isPregnantOrBreastfeeding: z.enum(["yes", "no", "na"]),

  // Section 4: High-Risk Behaviors
  hasUnprotectedSex: z.enum(["yes", "no"]),
  hasUsedDrugs: z.enum(["yes", "no"]),
  hasBeenInjected: z.enum(["yes", "no"]),

  // Section 5: Physical Examination
  weight: z.number().min(30, "Cân nặng phải ít nhất 30kg").max(200, "Cân nặng không hợp lệ"),
  bloodPressureSystolic: z.number().min(70, "Huyết áp tâm thu không hợp lệ").max(200, "Huyết áp tâm thu không hợp lệ"),
  bloodPressureDiastolic: z.number().min(40, "Huyết áp tâm trương không hợp lệ").max(130, "Huyết áp tâm trương không hợp lệ"),
  pulseRate: z.number().min(40, "Nhịp tim không hợp lệ").max(200, "Nhịp tim không hợp lệ"),
  temperature: z.number().min(35, "Nhiệt độ không hợp lệ").max(42, "Nhiệt độ không hợp lệ"),
  hemoglobin: z.number().min(8, "Hemoglobin quá thấp").max(20, "Hemoglobin không hợp lệ"),
});

type ComprehensiveHealthCheckFormData = z.infer<typeof comprehensiveHealthCheckSchema>;

interface ComprehensiveHealthCheckFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    donation: Donation | null;
    onCheckResult: (donationId: number, isEligible: boolean, formData: ComprehensiveHealthCheckFormData) => void;
    prefillData?: {
        fullName?: string;
        dateOfBirth?: string;
    };
}

export const ComprehensiveHealthCheckForm = ({ 
    isOpen, 
    onOpenChange, 
    donation, 
    onCheckResult,
    prefillData 
}: ComprehensiveHealthCheckFormProps) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState<ComprehensiveHealthCheckFormData | null>(null);

    const form = useForm<ComprehensiveHealthCheckFormData>({
        resolver: zodResolver(comprehensiveHealthCheckSchema),
        defaultValues: {
            fullName: prefillData?.fullName || "",
            dateOfBirth: prefillData?.dateOfBirth || "",
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
            isPregnantOrBreastfeeding: "na",
            hasUnprotectedSex: "no",
            hasUsedDrugs: "no",
            hasBeenInjected: "no",
            weight: 0,
            bloodPressureSystolic: 0,
            bloodPressureDiastolic: 0,
            pulseRate: 0,
            temperature: 0,
            hemoglobin: 0,
        }
    });

    useEffect(() => {
        if (isOpen) {
            form.reset({
                fullName: prefillData?.fullName || "",
                dateOfBirth: prefillData?.dateOfBirth || "",
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
                isPregnantOrBreastfeeding: "na",
                hasUnprotectedSex: "no",
                hasUsedDrugs: "no",
                hasBeenInjected: "no",
                weight: 0,
                bloodPressureSystolic: 0,
                bloodPressureDiastolic: 0,
                pulseRate: 0,
                temperature: 0,
                hemoglobin: 0,
            });
        }
    }, [isOpen, prefillData, form]);

    const determineEligibility = (data: ComprehensiveHealthCheckFormData): boolean => {
        const weightOk = data.weight >= 45;
        const bloodPressureOk = data.bloodPressureSystolic >= 90 && data.bloodPressureSystolic <= 160 &&
                               data.bloodPressureDiastolic >= 60 && data.bloodPressureDiastolic <= 100;
        const temperatureOk = data.temperature >= 36.0 && data.temperature <= 37.5;
        const hemoglobinOk = data.hemoglobin >= 12.5;
        const pulseOk = data.pulseRate >= 60 && data.pulseRate <= 100;

        const notCurrentlySick = data.isCurrentlySick === "no";
        const noInfectiousDiseases = data.hasInfectiousDiseases === "no";
        const noRecentProcedures = data.hasRecentProcedures === "no";
        const feelingHealthy = data.isFeelingHealthy === "yes";

        const noUnprotectedSex = data.hasUnprotectedSex === "no";
        const noDrugUse = data.hasUsedDrugs === "no";
        const noUnknownInjections = data.hasBeenInjected === "no";

        return weightOk && bloodPressureOk && temperatureOk && hemoglobinOk && pulseOk &&
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
                            {/* Section 1: Personal Information & Blood Donation History */}
                            <Card className="mb-6">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="h-5 w-5" />
                                        💼 Thông tin cá nhân & Lịch sử hiến máu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Họ và tên *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nhập họ và tên" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dateOfBirth"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Ngày sinh *</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="hasDonatedBefore"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bạn đã từng hiến máu chưa? *</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="donated-yes" />
                                                            <Label htmlFor="donated-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="donated-no" />
                                                            <Label htmlFor="donated-no">Không</Label>
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
                                                    <FormLabel>Lần hiến máu gần nhất?</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
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
                                                <FormLabel>Bạn có gặp tác dụng phụ sau khi hiến máu không? (chóng mặt, ngất xỉu, buồn nôn)</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="side-effects-yes" />
                                                            <Label htmlFor="side-effects-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="side-effects-no" />
                                                            <Label htmlFor="side-effects-no">Không</Label>
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
                                                    <FormLabel>Mô tả tác dụng phụ</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Mô tả chi tiết các tác dụng phụ..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* Section 2: Medical History */}
                            <Card className="mb-6">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileText className="h-5 w-5" />
                                        📋 Tiền sử bệnh lý
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="isCurrentlySick"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bạn có đang bị bệnh không? (cảm, sốt, cúm, ho, tiêu chảy) *</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="sick-yes" />
                                                            <Label htmlFor="sick-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="sick-no" />
                                                            <Label htmlFor="sick-no">Không</Label>
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
                                                <FormLabel>Bạn có bệnh mãn tính không? (bệnh tim, tiểu đường, cao huyết áp, hen suyễn)</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="chronic-yes" />
                                                            <Label htmlFor="chronic-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="chronic-no" />
                                                            <Label htmlFor="chronic-no">Không</Label>
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
                                                    <FormLabel>Danh sách bệnh mãn tính</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Liệt kê các bệnh mãn tính..." {...field} />
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
                                                <FormLabel>Bạn có từng mắc bệnh truyền nhiễm không? (viêm gan B/C, HIV/AIDS, giang mai)</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="infectious-yes" />
                                                            <Label htmlFor="infectious-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="infectious-no" />
                                                            <Label htmlFor="infectious-no">Không</Label>
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
                                                <FormLabel>Bạn có phẫu thuật, truyền máu, xăm hình, xỏ khuyên trong 6-12 tháng qua không?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="procedures-yes" />
                                                            <Label htmlFor="procedures-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="procedures-no" />
                                                            <Label htmlFor="procedures-no">Không</Label>
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
                                                <FormLabel>Bạn có đang dùng thuốc không?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="medication-yes" />
                                                            <Label htmlFor="medication-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="medication-no" />
                                                            <Label htmlFor="medication-no">Không</Label>
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
                                                    <FormLabel>Danh sách thuốc đang dùng</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Liệt kê các loại thuốc..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* Section 3: Current Health Status */}
                            <Card className="mb-6">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Activity className="h-5 w-5" />
                                        🧍 Tình trạng sức khỏe hiện tại
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="isFeelingHealthy"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bạn có cảm thấy khỏe mạnh hôm nay không? *</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="healthy-yes" />
                                                            <Label htmlFor="healthy-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="healthy-no" />
                                                            <Label htmlFor="healthy-no">Không</Label>
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
                                                <FormLabel>Bạn có thay đổi sức khỏe gần đây không? (sụt cân đột ngột, mất ngủ kéo dài)</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="changes-yes" />
                                                            <Label htmlFor="changes-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="changes-no" />
                                                            <Label htmlFor="changes-no">Không</Label>
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
                                                    <FormLabel>Mô tả thay đổi sức khỏe</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Mô tả chi tiết các thay đổi..." {...field} />
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
                                                <FormLabel>Đối với phụ nữ: Bạn có đang mang thai, cho con bú hoặc đang trong kỳ kinh không?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="pregnant-yes" />
                                                            <Label htmlFor="pregnant-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="pregnant-no" />
                                                            <Label htmlFor="pregnant-no">Không</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="na" id="pregnant-na" />
                                                            <Label htmlFor="pregnant-na">Không áp dụng</Label>
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
                            <Card className="mb-6">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Shield className="h-5 w-5" />
                                        🚫 Hành vi nguy cơ cao
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="hasUnprotectedSex"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bạn có quan hệ tình dục không an toàn với nhiều bạn tình trong 12 tháng qua không?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="sex-yes" />
                                                            <Label htmlFor="sex-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="sex-no" />
                                                            <Label htmlFor="sex-no">Không</Label>
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
                                                <FormLabel>Bạn có sử dụng ma túy hoặc chất kích thích không?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="drugs-yes" />
                                                            <Label htmlFor="drugs-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="drugs-no" />
                                                            <Label htmlFor="drugs-no">Không</Label>
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
                                                <FormLabel>Bạn có bị tiêm chất không rõ nguồn gốc không?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id="injected-yes" />
                                                            <Label htmlFor="injected-yes">Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id="injected-no" />
                                                            <Label htmlFor="injected-no">Không</Label>
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
                            <Card className="mb-6">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Stethoscope className="h-5 w-5" />
                                        🩺 Khám sức khỏe nhanh (dành cho nhân viên y tế)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="weight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Cân nặng (kg) *</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="number" 
                                                            placeholder="Ví dụ: 65"
                                                            {...field} 
                                                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
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
                                                        <FormLabel>Huyết áp tâm thu *</FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                type="number" 
                                                                placeholder="Ví dụ: 120"
                                                                {...field} 
                                                                onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} 
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
                                                        <FormLabel>Huyết áp tâm trương *</FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                type="number" 
                                                                placeholder="Ví dụ: 80"
                                                                {...field} 
                                                                onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} 
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
                                                    <FormLabel>Nhịp tim (bpm) *</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="number" 
                                                            placeholder="Ví dụ: 72"
                                                            {...field} 
                                                            onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} 
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
                                                    <FormLabel>Nhiệt độ (°C) *</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="number" 
                                                            step="0.1"
                                                            placeholder="Ví dụ: 36.5"
                                                            {...field} 
                                                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
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
                                                    <FormLabel>Hemoglobin (g/dL) *</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="number" 
                                                            step="0.1"
                                                            placeholder="Ví dụ: 13.5"
                                                            {...field} 
                                                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
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
                                        <Button type="button" variant="outline">
                                            Hủy
                                        </Button>
                                    </DialogClose>
                                    <Button 
                                        type="submit" 
                                        disabled={form.formState.isSubmitting}
                                        className="min-w-[120px]"
                                    >
                                        {form.formState.isSubmitting ? 'Đang xử lý...' : 'Hoàn thành kiểm tra'}
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