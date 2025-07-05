import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { HealthRecord, HealthRecordService } from '@/services/health-record.service';
import { DonationHistoryService } from '@/services/donation-history.service';
import HealthRecordForm from '@/components/HealthRecordForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, PlusCircle, Calendar, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInDays } from 'date-fns';
import { calculateNextEligibleDate, DonationHistoryEntry, getWaitingPeriod } from '@/utils/donationConstants';
import { isEligibleByHistory } from '@/utils/donationConstants';
import axios from 'axios';

// Data from BloodTypeSelect component
const bloodTypes = [
    { id: "1", name: "A+" }, { id: "2", name: "A-" }, { id: "3", name: "B+" },
    { id: "4", name: "B-" }, { id: "5", name: "AB+" }, { id: "6", name: "AB-" },
    { id: "7", name: "O+" }, { id: "8", name: "O-" }
];

const getBloodTypeName = (id: string | number) => {
    const bloodType = bloodTypes.find(bt => bt.id === id.toString());
    return bloodType ? bloodType.name : 'N/A';
};

type HealthRecordResponse = HealthRecord | { $values: HealthRecord[] };
type DonationHistoryResponse = DonationHistoryEntry[] | { $values: DonationHistoryEntry[] };

const MemberHealthRecords = () => {
  const { toast } = useToast();
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [donationHistory, setDonationHistory] = useState<DonationHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Calculate eligibility and waiting period
  const { nextEligibleDays, waitingPeriod, isEligible, nextEligibleDate } = useMemo(() => {
    const nextDate = calculateNextEligibleDate(donationHistory);
    const today = new Date();
    const daysToWait = nextDate ? differenceInDays(nextDate, today) : 0;
    
    // Get waiting period from last donation if available
    const lastDonation = donationHistory
      .filter(d => d.status.toLowerCase() === 'completed')
      .sort((a, b) => new Date(b.donation_date).getTime() - new Date(a.donation_date).getTime())[0];
    
    const componentWaitingPeriod = lastDonation ? getWaitingPeriod(lastDonation.component) : 0;

    return {
      nextEligibleDays: Math.max(0, daysToWait),
      waitingPeriod: componentWaitingPeriod,
      isEligible: isEligibleByHistory(donationHistory),
      nextEligibleDate: nextDate ? format(nextDate, 'PPP') : 'Now'
    };
  }, [donationHistory]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [recordData, historyData] = await Promise.all([
          HealthRecordService.getMyRecord() as Promise<HealthRecordResponse>,
          DonationHistoryService.getMemberHistory() as Promise<DonationHistoryResponse>
        ]);

        // Handle health record response
        if (recordData && '$values' in recordData && Array.isArray(recordData.$values)) {
          setHealthRecord(recordData.$values[0] || null);
        } else if (recordData && !('$values' in recordData)) {
          setHealthRecord(recordData as HealthRecord);
        }

        // Handle donation history
        if (historyData && '$values' in historyData) {
          setDonationHistory(historyData.$values);
        } else if (Array.isArray(historyData)) {
          setDonationHistory(historyData);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status !== 404) {
          toast({ title: 'Error', description: 'Failed to fetch health record.', variant: 'destructive'});
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleSave = async (data: Partial<HealthRecord>) => {
    try {
      let savedRecord;
      if (healthRecord) {
        savedRecord = await HealthRecordService.updateMyRecord(data);
        toast({ title: 'Success', description: 'Health record updated.' });
      } else {
        savedRecord = await HealthRecordService.createMyRecord(data);
        toast({ title: 'Success', description: 'Health record created.' });
      }
      setHealthRecord(savedRecord);
      setIsFormOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save health record.' });
    }
  };
  
  if (isLoading) {
    return <Skeleton className="w-full h-96" />;
  }

  if (!healthRecord) {
    return (
      <div className="text-center">
        <Alert>
          <AlertTitle>No Health Record Found</AlertTitle>
          <AlertDescription>You haven't created a health record yet. Creating one is the first step to becoming a donor.</AlertDescription>
        </Alert>
        <Button onClick={() => setIsFormOpen(true)} className="mt-4">
          <PlusCircle className="mr-2 h-4 w-4" /> Create Health Record
        </Button>
        <HealthRecordForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSave} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
          <p className="text-gray-600 mt-2">Your complete health information and donation eligibility.</p>
        </div>
      </div>

      <div className={`border-2 rounded-lg p-6 ${isEligible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            {isEligible ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <Calendar className="h-8 w-8 text-red-600" />
            )}
          <div>
            <h3 className="text-xl font-semibold">
                {isEligible ? 'Eligible for Donation' : 'Not Eligible for Donation'}
            </h3>
              <p className={`text-sm ${isEligible ? 'text-gray-600' : 'text-red-600 font-medium'}`}>
                {isEligible 
                  ? 'You can donate now'
                  : nextEligibleDays > 0
                    ? `${nextEligibleDays} days remaining (${nextEligibleDate})`
                    : 'Please check with staff'
                }
              </p>
              {!isEligible && waitingPeriod > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Required waiting period: {waitingPeriod} days
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard 
          title="Blood Type" 
          value={getBloodTypeName(healthRecord.blood_type)} 
          icon={<Heart className="h-5 w-5 text-red-500" />}
        />
        <InfoCard 
          title="Weight" 
          value={`${healthRecord.weight} kg`} 
        />
        <InfoCard 
          title="Height" 
          value={`${healthRecord.height} cm`} 
        />
        <InfoCard 
          title="Last Donation" 
          value={healthRecord.last_donation ? format(new Date(healthRecord.last_donation), 'PPP') : 'N/A'} 
          subValue={!isEligible && nextEligibleDays > 0 ? `Next eligible: ${nextEligibleDate}` : undefined}
          isHighlighted={!isEligible}
          icon={<Calendar className={`h-5 w-5 ${!isEligible ? 'text-red-500' : 'text-gray-500'}`} />}
        />
        <InfoCard 
          title="Allergies" 
          value={healthRecord.allergies || 'None'} 
        />
        <InfoCard 
          title="Medication" 
          value={healthRecord.medication || 'None'} 
        />
      </div>

      <HealthRecordForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSave}
        initialData={healthRecord} 
      />
    </div>
  );
};

const InfoCard = ({ 
  title, 
  value, 
  subValue, 
  isHighlighted, 
  icon 
}: { 
  title: string; 
  value: string; 
  subValue?: string;
  isHighlighted?: boolean;
  icon?: React.ReactNode;
}) => (
  <div className={`bg-white p-4 rounded-lg border ${isHighlighted ? 'border-red-200' : ''}`}>
    <div className="flex items-center space-x-2 mb-1">
      {icon}
      <h4 className={`text-sm ${isHighlighted ? 'text-red-500' : 'text-gray-500'}`}>{title}</h4>
    </div>
    <p className={`text-lg font-semibold ${isHighlighted ? 'text-red-700' : 'text-gray-900'}`}>{value}</p>
    {subValue && (
      <p className="text-sm text-red-500 mt-1">{subValue}</p>
    )}
  </div>
);

export default MemberHealthRecords;
