import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getBloodTypeName } from "@/utils/bloodTypes";
import { PREDEFINED_TIME_SLOTS } from "@/utils/timeSlots";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { DonationService } from "@/services/donation.service";
import { Donation } from "@/types/api";
import { Heart, Calendar as CalendarIcon, FileText, Send, Clock, CheckCircle, AlertCircle, HeartPulse, XCircle } from 'lucide-react';
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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [activeDonations, setActiveDonations] = useState<Donation[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [donationHistory, setDonationHistory] = useState<DonationHistoryRecord[]>([]);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [selectedPermanentDisqualifications, setSelectedPermanentDisqualifications] = useState<string[]>([]);
  const [selectedTemporaryDisqualifications, setSelectedTemporaryDisqualifications] = useState<string[]>([]);
  const [showHealthWarning, setShowHealthWarning] = useState(false);
  const [selectedOther, setSelectedOther] = useState(false);

  // ==================== Predefined Time Slots Configuration ====================
  const timeSlots = PREDEFINED_TIME_SLOTS;

  // ==================== Check for Auto-Rejection ====================
  const hasAutoRejectionConditions = selectedPermanentDisqualifications.length > 0 || selectedTemporaryDisqualifications.length > 0;
  const hasAnyDisqualification = hasAutoRejectionConditions; // Only count actual health conditions, not "Khác"
  const autoRejectionReasons = [
    ...selectedPermanentDisqualifications.map(id => 
      permanentDisqualifications.find(item => item.id === id)?.label
    ).filter(Boolean),
    ...selectedTemporaryDisqualifications.map(id => 
      temporaryDisqualifications.find(item => item.id === id)?.label
    ).filter(Boolean)
  ];


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
    if (!donationDate || !selectedTimeSlot) {
      toast({
        title: "Lỗi xác thực",
        description: "Vui lòng chọn ngày và khung giờ hiến máu.",
        variant: "destructive",
      });
      return;
    }

    // Prevent submission if any disqualification is selected
    if (hasAnyDisqualification) {
      toast({
        title: "Không thể tạo yêu cầu",
        description: "Bạn đã chọn các điều kiện sức khỏe không phù hợp để hiến máu.",
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
      // Step 1: Update health record (allergies and medications are already stored in health record)
      // No need to update here as they are managed separately

      // Step 2: Create the donation request
      const disqualificationReasons = [
        ...selectedPermanentDisqualifications.map(id => 
          permanentDisqualifications.find(item => item.id === id)?.label
        ).filter(Boolean),
        ...selectedTemporaryDisqualifications.map(id => 
          temporaryDisqualifications.find(item => item.id === id)?.label
        ).filter(Boolean)
      ];

      const selectedSlot = timeSlots.find(slot => slot.id === selectedTimeSlot);
      const donationData = {
        donation_date: format(donationDate, 'yyyy-MM-dd'),
        start_time: selectedSlot?.start || '',
        end_time: selectedSlot?.end || '',
        blood_type: healthRecord?.blood_type ? getBloodTypeName(healthRecord.blood_type || null) : undefined,
        status: 'Pending', // Default status for new donations
        note: note, // Only include user's note, not disqualification reasons
      };

      // Create the donation request
      await DonationService.createDonation(donationData);

      // Note: The system will automatically handle rejection based on health conditions
      // Staff will review and make the final decision

      toast({
        title: "Gửi yêu cầu thành công!",
        description: `Yêu cầu hiến máu của bạn cho ngày ${format(donationDate!, 'PPP')} đã được gửi đi.`,
      });

      // Reset form
      setDonationDate(eventDate);
      setSelectedTimeSlot('');
      setNote('');
      setSelectedPermanentDisqualifications([]);
      setSelectedTemporaryDisqualifications([]);
      setSelectedOther(false);
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

    const handleOtherChange = (checked: boolean) => {
        setSelectedOther(checked);
    };

    const isSubmitDisabled = isSubmitting || hasAnyDisqualification;

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
            <label className="text-sm font-medium text-gray-700">Thời gian hiến máu</label>
          </div>
          <div>
            <Select onValueChange={setSelectedTimeSlot} value={selectedTimeSlot}>
              <SelectTrigger className="w-full border-red-200">
                <SelectValue placeholder="Chọn khung giờ hiến máu" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(slot => (
                  <SelectItem key={slot.id} value={slot.id}>{slot.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <Label className="font-semibold text-red-700">Bệnh lý nghiêm trọng (không được chấp nhận):</Label>
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
                  <Label className="font-semibold text-red-700">Bệnh lý khác (không được chấp nhận):</Label>
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
              <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                      <Checkbox
                          id="other-condition"
                          checked={selectedOther}
                          onCheckedChange={(checked) => handleOtherChange(!!checked)}
                      />
                      <label htmlFor="other-condition" className="text-sm font-medium">
                          Khác
                      </label>
                  </div>
              </div>
          </div>
      </div>

      {/* Notes Section - Only enabled when "Khác" is selected */}
      <div className={`space-y-2 ${!selectedOther ? 'opacity-50' : ''}`}>
          <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-500" />
              <label htmlFor="note" className="text-sm font-medium text-gray-700">Ghi chú bổ sung</label>
          </div>
          <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={selectedOther ? "Bất kỳ thông tin nào khác bạn muốn chia sẻ..." : "Chọn 'Khác' để nhập ghi chú"}
              className="border-red-200"
              disabled={!selectedOther}
          />
      </div>

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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
