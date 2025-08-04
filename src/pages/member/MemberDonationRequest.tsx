import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { DonationService } from "@/services/donation.service";
import { Donation } from "@/types/api";
import { Heart, Calendar as CalendarIcon, FileText, Send, Clock, CheckCircle, AlertCircle, Stethoscope, HeartPulse, XCircle } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLocation, Link } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { HealthRecordService, HealthRecord } from '@/services/health-record.service';
import { DonationHistoryService } from '@/services/donation-history.service';
import { DonationHistoryRecord } from '@/services/donation-history.service';
import { isEligibleToDonate } from '@/utils/healthValidation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { permanentDisqualifications, temporaryDisqualifications } from '@/utils/disqualificationReasons';
import { WrappedResponse } from '@/types/api';

const allergyOptions = [
  { id: 'antibiotics', label: 'Dị ứng thuốc kháng sinh' },
  { id: 'aspirin', label: 'Dị ứng Aspirin' },
  { id: 'seafood', label: 'Dị ứng hải sản' },
  { id: 'pollen', label: 'Dị ứng phấn hoa' },
  { id: 'animal_dander', label: 'Dị ứng lông động vật' },
  { id: 'other', label: 'Khác (ghi rõ ở ghi chú)' },
];

const medicationOptions = [
  { id: 'blood_pressure', label: 'Thuốc huyết áp' },
  { id: 'diabetes', label: 'Thuốc tiểu đường' },
  { id: 'blood_thinners', label: 'Thuốc chống đông máu' },
  { id: 'antihistamines', label: 'Thuốc kháng histamin' },
  { id: 'pain_relievers', label: 'Thuốc giảm đau' },
  { id: 'other', label: 'Khác (ghi rõ ở ghi chú)' },
];

const statusTranslations: { [key: string]: string } = {
  Pending: 'Đang chờ',
  Approved: 'Đã duyệt',
  Completed: 'Đã hoàn thành',
  Rejected: 'Đã từ chối',
  Cancelled: 'Đã hủy',
};

function isWrapped<T>(response: T | WrappedResponse<T>): response is WrappedResponse<T> {
  return (response as WrappedResponse<T>).$values !== undefined;
}

// ==================== Component Props Interface ====================
interface MemberDonationRequestProps {
  isOpen?: boolean;
  onClose?: () => void;
  eventDate?: string;
  requestId?: string;
}

const MemberDonationRequest: React.FC<MemberDonationRequestProps> = ({ isOpen = false, onClose, eventDate: eventDateStr, requestId }) => {
  // ==================== URL Parameters Handling ====================
  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);
  const eventDateFromUrl = queryParams.get('eventDate');
  const requestIdFromUrl = queryParams.get('requestId');

  const eventDate = eventDateStr ? new Date(eventDateStr) : (eventDateFromUrl ? new Date(eventDateFromUrl) : undefined);
  const finalRequestId = requestId || requestIdFromUrl;

  // ==================== State Management ====================
  const [donationDate, setDonationDate] = useState<Date | undefined>(eventDate);
  const [donationTime, setDonationTime] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [activeDonations, setActiveDonations] = useState<Donation[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [donationHistory, setDonationHistory] = useState<DonationHistoryRecord[]>([]);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [selectedPermanentDisqualifications, setSelectedPermanentDisqualifications] = useState<string[]>([]);
  const [selectedTemporaryDisqualifications, setSelectedTemporaryDisqualifications] = useState<string[]>([]);
  const [showHealthWarning, setShowHealthWarning] = useState(false);

  // ==================== Time Slots Configuration ====================
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8;
    return [`${hour}:00 - ${hour}:30`, `${hour}:30 - ${hour + 1}:00`];
  }).flat();

  // ==================== Check for Auto-Rejection ====================
  const hasAutoRejectionConditions = selectedPermanentDisqualifications.length > 0;
  const autoRejectionReasons = selectedPermanentDisqualifications.map(id => 
    permanentDisqualifications.find(item => item.id === id)?.label
  ).filter(Boolean);


  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const [recordResponse, historyResponse] = await Promise.all([
          HealthRecordService.getMyRecord(),
          DonationHistoryService.getMemberHistory()
        ]);
        
        const record = recordResponse as unknown as { $values?: HealthRecord[] };
        const currentRecord = (record && record.$values && Array.isArray(record.$values)) ? record.$values[0] : recordResponse;
        const currentHistory = isWrapped(historyResponse) ? historyResponse.$values : historyResponse;
        
        setHealthRecord(currentRecord as HealthRecord);
        setDonationHistory(currentHistory as DonationHistoryRecord[] || []);

        if (!currentRecord) {
          setIsEligible(false);
        } else {
          setSelectedAllergies(currentRecord.allergies ? currentRecord.allergies.split(',').map(s => s.trim()) : []);
          setSelectedMedications(currentRecord.medication ? currentRecord.medication.split(',').map(s => s.trim()) : []);
          const eligibility = isEligibleToDonate(currentRecord, currentHistory);
          setIsEligible(eligibility);
        }
      } catch (error) {
        setIsEligible(false);
      }
    };
    checkEligibility();
  }, []);

  useEffect(() => {
    setDonationDate(eventDate);
  }, [eventDate]);

  // ==================== Event Handlers ====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationDate || !donationTime) {
      toast({
        title: "Lỗi xác thực",
        description: "Vui lòng chọn ngày và giờ để hiến máu.",
        variant: "destructive",
      });
      return;
    }

    // Validate that donation date is not in the past
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    if (donationDate < today) {
      toast({
        title: "Ngày không hợp lệ",
        description: "Không thể đặt lịch hiến máu cho một ngày trong quá khứ.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Update health record with allergy and medication info
      if (healthRecord) {
        await HealthRecordService.updateMyRecord({
          ...healthRecord,
          allergies: selectedAllergies.join(', '),
          medication: selectedMedications.join(', '),
        });
      }

      // Step 2: Create the donation request
      const disqualificationReasons = [
        ...selectedPermanentDisqualifications.map(id => 
          permanentDisqualifications.find(item => item.id === id)?.label
        ).filter(Boolean),
        ...selectedTemporaryDisqualifications.map(id => 
          temporaryDisqualifications.find(item => item.id === id)?.label
        ).filter(Boolean)
      ];

      const donationData = {
        donation_date: format(donationDate, 'yyyy-MM-dd'),
        donation_time: donationTime,
        note: note + (disqualificationReasons.length > 0 ? `\n\nĐiều kiện sức khỏe cần lưu ý:\n${disqualificationReasons.join(', ')}` : ''),
      };

      // Create the donation request
      await DonationService.createDonation(donationData);

      // Note: The system will automatically handle rejection based on health conditions
      // Staff will review and make the final decision

      // Show health warning if there are permanent disqualifications
      if (hasAutoRejectionConditions) {
        setShowHealthWarning(true);
      }

      toast({
        title: "Gửi yêu cầu thành công!",
        description: `Yêu cầu hiến máu của bạn cho ngày ${format(donationDate!, 'PPP')} đã được gửi đi.`,
      });

      // Reset form
      setDonationDate(eventDate);
      setDonationTime('');
      setNote('');
      setSelectedPermanentDisqualifications([]);
      setSelectedTemporaryDisqualifications([]);
      // We don't reset allergies and medication, as they are part of the health record now


    } catch (error) {
      console.error("Failed to create donation:", error);
      const errorMessage = (error instanceof Error) ? error.message : 'Đã có lỗi xảy ra khi gửi yêu cầu của bạn.';
      toast({
        title: "Yêu cầu thất bại",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

    const handleAllergyChange = (id: string, checked: boolean) => {
        setSelectedAllergies(prev =>
            checked ? [...prev, id] : prev.filter(item => item !== id)
        );
    };

    const handleMedicationChange = (id: string, checked: boolean) => {
        setSelectedMedications(prev =>
            checked ? [...prev, id] : prev.filter(item => item !== id)
        );
    };

    const handlePermanentDisqualificationChange = (id: string, checked: boolean) => {
        setSelectedPermanentDisqualifications(prev =>
            checked ? [...prev, id] : prev.filter(item => item !== id)
        );
    };

    const handleTemporaryDisqualificationChange = (id: string, checked: boolean) => {
        setSelectedTemporaryDisqualifications(prev =>
            checked ? [...prev, id] : prev.filter(item => item !== id)
        );
    };

    const isSubmitDisabled = isSubmitting;

    const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status) {
          case 'Approved':
            return 'default';
          case 'Pending':
            return 'secondary';
          default:
            return 'outline';
        }
    };

  // ==================== Eligibility Check UI ====================
  if (isEligible === null) {
    return <p>Đang kiểm tra điều kiện...</p>;
  }

  if (!isEligible) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Không đủ điều kiện hiến máu</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Không thể tạo yêu cầu hiến máu</AlertTitle>
            <AlertDescription>
              {healthRecord
                ? "Hồ sơ sức khỏe của bạn cho thấy bạn hiện không đủ điều kiện để hiến máu. Vui lòng xem lại thông tin sức khỏe của bạn hoặc liên hệ với chúng tôi để biết thêm chi tiết."
                : "Bạn phải có hồ sơ sức khỏe để tạo yêu cầu hiến máu."}
            </AlertDescription>
          </Alert>
          <Button asChild className="mt-4">
            <Link to="/member/health-records">
              {healthRecord ? 'Xem hồ sơ sức khỏe' : 'Tạo hồ sơ sức khỏe'}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ==================== Form UI Component ====================
  const FormContent = (
    <form onSubmit={handleSubmit} id="donation-form" className="space-y-6">
      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="h-4 w-4 text-red-500" />
            <label className="text-sm font-medium text-gray-700">Ngày hiến máu</label>
          </div>
          {eventDate ? (
            <Input 
              type="text" 
              value={format(eventDate, "PPP")} 
              readOnly 
              className="w-full justify-start text-left font-normal border-red-200 bg-gray-50"
            />
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal border-red-200 ${!donationDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {donationDate ? format(donationDate, "PPP") : <span>Chọn ngày</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={donationDate}
                  onSelect={setDonationDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-red-500" />
            <label className="text-sm font-medium text-gray-700">Giờ hiến máu</label>
          </div>
          <Select onValueChange={setDonationTime} value={donationTime}>
            <SelectTrigger className="w-full border-red-200">
              <SelectValue placeholder="Chọn giờ" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(time => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-red-500" />
          <label htmlFor="note" className="text-sm font-medium text-gray-700">Ghi chú bổ sung</label>
        </div>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Bất kỳ thông tin nào khác bạn muốn chia sẻ..."
          className="border-red-200"
        />
      </div>

      {/* Health Information Section */}
      <div className="space-y-4 rounded-lg border bg-blue-50 p-4">
          <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Thông tin sức khỏe bổ sung</h3>
          </div>
          <div className="space-y-2">
              <Label className="font-semibold">Các loại dị ứng đã biết:</Label>
              <div className="grid grid-cols-2 gap-2">
                  {allergyOptions.map(item => (
                      <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox
                              id={`allergy-${item.id}`}
                              checked={selectedAllergies.includes(item.id)}
                              onCheckedChange={(checked) => handleAllergyChange(item.id, !!checked)}
                          />
                          <label htmlFor={`allergy-${item.id}`} className="text-sm font-medium">
                              {item.label}
                          </label>
                      </div>
                  ))}
              </div>
          </div>
          <div className="space-y-2">
              <Label className="font-semibold">Các loại thuốc đang sử dụng gần đây:</Label>
              <div className="grid grid-cols-2 gap-2">
                  {medicationOptions.map(item => (
                      <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox
                              id={`medication-${item.id}`}
                              checked={selectedMedications.includes(item.id)}
                              onCheckedChange={(checked) => handleMedicationChange(item.id, !!checked)}
                          />
                          <label htmlFor={`medication-${item.id}`} className="text-sm font-medium">
                              {item.label}
                          </label>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Disqualification Reasons Section */}
      <div className="space-y-4 rounded-lg border bg-yellow-50 p-4">
          <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-800">Bạn có mắc các bệnh lý sau đây không?</h3>
          </div>
          <div className="space-y-4">
              <div className="space-y-2">
                  <Label className="font-semibold text-red-700">Bệnh lý nghiêm trọng:</Label>
                  <div className="grid grid-cols-1 gap-2">
                      {permanentDisqualifications.map(item => (
                          <div key={item.id} className="flex items-center space-x-2">
                              <Checkbox
                                  id={`permanent-disqualification-${item.id}`}
                                  checked={selectedPermanentDisqualifications.includes(item.id)}
                                  onCheckedChange={(checked) => handlePermanentDisqualificationChange(item.id, !!checked)}
                              />
                              <label htmlFor={`permanent-disqualification-${item.id}`} className="text-sm font-medium">
                                  {item.label}
                              </label>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="space-y-2">
                  <Label className="font-semibold text-orange-700">Bệnh lý khác:</Label>
                  <div className="grid grid-cols-1 gap-2">
                      {temporaryDisqualifications.map(item => (
                          <div key={item.id} className="flex items-center space-x-2">
                              <Checkbox
                                  id={`temporary-disqualification-${item.id}`}
                                  checked={selectedTemporaryDisqualifications.includes(item.id)}
                                  onCheckedChange={(checked) => handleTemporaryDisqualificationChange(item.id, !!checked)}
                              />
                              <label htmlFor={`temporary-disqualification-${item.id}`} className="text-sm font-medium">
                                  {item.label}
                              </label>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* Health Conditions Warning - Only show after submission */}
      {showHealthWarning && (
        <Alert variant="default" className="border-orange-200 bg-orange-50">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <AlertTitle className="text-orange-800">Lưu ý về điều kiện sức khỏe</AlertTitle>
                <AlertDescription className="text-orange-700">
                  Bạn đã khai báo các điều kiện sức khỏe: {autoRejectionReasons.join(', ')}. 
                  Yêu cầu hiến máu của bạn có thể bị từ chối dựa trên các điều kiện sức khỏe này.
                </AlertDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHealthWarning(false)}
              className="text-orange-600 hover:text-orange-800"
            >
              ×
            </Button>
          </div>
        </Alert>
      )}

      {/* Form Actions */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
        <Button type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Gửi yêu cầu
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );

  // ==================== Component Render ====================
  if (onClose) {
  return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
            <DialogTitle>Đặt lịch hiến máu</DialogTitle>
            </DialogHeader>
            {FormContent}
          </DialogContent>
        </Dialog>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            Đặt lịch hiến máu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {FormContent}
        </CardContent>
      </Card>

    </div>
  );
};

export default MemberDonationRequest;
