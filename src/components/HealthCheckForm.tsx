import React from "react";
import { ComprehensiveHealthCheckForm } from "./ComprehensiveHealthCheckForm";
import { Donation } from "@/types/api";

interface HealthCheckFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    donation: Donation | null;
    onCheckResult: (donationId: number, isEligible: boolean) => void;
}

export const HealthCheckForm = ({ isOpen, onOpenChange, donation, onCheckResult }: HealthCheckFormProps) => {
    const handleCheckResult = (donationId: number, isEligible: boolean, formData: Record<string, unknown>) => {
        // Convert the comprehensive form data to the expected format
        onCheckResult(donationId, isEligible);
    };

    return (
        <ComprehensiveHealthCheckForm
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            donation={donation}
            onCheckResult={handleCheckResult}
            prefillData={{
                fullName: donation?.user_id || "",
                dateOfBirth: ""
            }}
        />
    );
}; 