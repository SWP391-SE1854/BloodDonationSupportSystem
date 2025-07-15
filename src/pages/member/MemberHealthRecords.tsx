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
import { isEligibleToDonate } from '@/utils/healthValidation';
import axios from 'axios';
import { getBloodTypeName } from '@/utils/bloodTypes';

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
    const eligibility = healthRecord ? isEligibleToDonate(healthRecord, donationHistory) : false;

    return {
      nextEligibleDays: Math.max(0, daysToWait),
      waitingPeriod: componentWaitingPeriod,
      isEligible: eligibility,
      nextEligibleDate: nextDate ? format(nextDate, 'PPP') : 'Bây giờ'
    };
  }, [donationHistory, healthRecord]);

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
          toast({ title: 'Lỗi', description: 'Không thể tải hồ sơ sức khỏe.', variant: 'destructive'});
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
        toast({ title: 'Thành công', description: 'Đã cập nhật hồ sơ sức khỏe.' });
      } else {
        savedRecord = await HealthRecordService.createMyRecord(data);
        toast({ title: 'Thành công', description: 'Đã tạo hồ sơ sức khỏe.' });
      }
      setHealthRecord(savedRecord);
      setIsFormOpen(false);
    } catch (error) {
      toast({ title: 'Lỗi', description: 'Không thể lưu hồ sơ sức khỏe.' });
    }
  };
  
  if (isLoading) {
    return <Skeleton className="w-full h-96" />;
  }

  if (!healthRecord) {
    return (
      <div className="text-center">
        <Alert>
          <AlertTitle>Không Tìm Thấy Hồ Sơ Sức Khỏe</AlertTitle>
          <AlertDescription>Bạn chưa tạo hồ sơ sức khỏe. Tạo hồ sơ là bước đầu tiên để trở thành người hiến máu.</AlertDescription>
        </Alert>
        <Button onClick={() => setIsFormOpen(true)} className="mt-4">
          <PlusCircle className="mr-2 h-4 w-4" /> Cập nhật hồ sơ
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
          <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Sức Khỏe</h1>
          <p className="text-gray-600 mt-2">Thông tin sức khỏe đầy đủ và tình trạng đủ điều kiện hiến máu của bạn.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Cập nhật hồ sơ
        </Button>
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
                {isEligible ? 'Đủ điều kiện hiến máu' : 'Chưa đủ điều kiện hiến máu'}
            </h3>
              <p className={`text-sm ${isEligible ? 'text-gray-600' : 'text-red-600 font-medium'}`}>
                {isEligible 
                  ? 'Bạn có thể hiến máu ngay bây giờ'
                  : nextEligibleDays > 0
                    ? `Còn ${nextEligibleDays} ngày (${nextEligibleDate})`
                    : 'Vui lòng kiểm tra với nhân viên'
                }
              </p>
              {!isEligible && waitingPeriod > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Thời gian chờ yêu cầu: {waitingPeriod} ngày
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard 
          title="Nhóm Máu" 
          value={getBloodTypeName(healthRecord.blood_type)} 
          icon={<Heart className="h-5 w-5 text-red-500" />}
        />
        <InfoCard 
          title="Cân nặng" 
          value={`${healthRecord.weight} kg`} 
        />
        <InfoCard 
          title="Chiều cao" 
          value={`${healthRecord.height} cm`} 
        />
        <InfoCard 
          title="Lần hiến cuối" 
          value={healthRecord.last_donation ? format(new Date(healthRecord.last_donation), 'PPP') : 'Chưa có'} 
          subValue={!isEligible && nextEligibleDays > 0 ? `Lần tiếp theo: ${nextEligibleDate}` : undefined}
          isHighlighted={!isEligible}
          icon={<Calendar className={`h-5 w-5 ${!isEligible ? 'text-red-500' : 'text-gray-500'}`} />}
        />
        <InfoCard 
          title="Dị ứng" 
          value={healthRecord.allergies || 'Không có'} 
        />
        <InfoCard 
          title="Bệnh nền" 
          value={healthRecord.disease || 'Không có'} 
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
