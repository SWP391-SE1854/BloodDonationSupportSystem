import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { HealthRecord, HealthRecordService } from '@/services/health-record.service';
import HealthRecordForm from '@/components/HealthRecordForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, PlusCircle, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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

const MemberHealthRecords = () => {
  const { toast } = useToast();
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      setIsLoading(true);
      try {
        const data = await HealthRecordService.getMyRecord() as HealthRecordResponse;
        if (data && '$values' in data && Array.isArray(data.$values)) {
          // Handle the case where the server wraps the response
          setHealthRecord(data.$values[0] || null);
        } else if (data && !('$values' in data)) {
          // Handle a direct object response
          setHealthRecord(data as HealthRecord);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status !== 404) {
          toast({ title: 'Error', description: 'Failed to fetch health record.', variant: 'destructive'});
        }
        // A 404 error is expected if the user has no record, so we don't show a toast for it.
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecord();
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
        <Button onClick={() => setIsFormOpen(true)}>
          <Calendar className="mr-2 h-4 w-4" /> Update Record
        </Button>
      </div>

      <div className={`border-2 rounded-lg p-6 ${healthRecord.eligibility_status ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <div className="flex items-center space-x-4">
          <CheckCircle className={`h-8 w-8 ${healthRecord.eligibility_status ? 'text-green-600' : 'text-red-600'}`} />
          <div>
            <h3 className="text-xl font-semibold">
              {healthRecord.eligibility_status ? 'Eligible for Donation' : 'Not Eligible for Donation'}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard title="Blood Type" value={getBloodTypeName(healthRecord.blood_type)} />
        <InfoCard title="Weight" value={`${healthRecord.weight} kg`} />
        <InfoCard title="Height" value={`${healthRecord.height} cm`} />
        <InfoCard title="Allergies" value={healthRecord.allergies || 'None'} />
        <InfoCard title="Medication" value={healthRecord.medication || 'None'} />
        <InfoCard title="Last Donation" value={healthRecord.last_donation ? new Date(healthRecord.last_donation).toLocaleDateString() : 'N/A'} />
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

const InfoCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white p-4 rounded-lg border">
    <h4 className="text-sm text-gray-500">{title}</h4>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

export default MemberHealthRecords;
