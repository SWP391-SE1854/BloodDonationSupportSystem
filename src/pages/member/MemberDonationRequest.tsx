import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { DonationService } from "@/services/donation.service";
import { Donation } from "@/types/api";
import { Heart, Calendar as CalendarIcon, FileText, Send, Clock, CheckCircle, AlertCircle, Stethoscope, HeartPulse } from 'lucide-react';
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
import { DonationHistoryEntry } from '@/utils/donationConstants';
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
  const [donationHistory, setDonationHistory] = useState<DonationHistoryEntry[]>([]);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);

  // ==================== Time Slots Configuration ====================
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8; // 8 AM to 5 PM
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  // ==================== Data Fetching Logic ====================
  const fetchMemberDonations = useCallback(async () => {
    setIsFetching(true);
    try {
      const allDonations = await DonationService.getMemberDonations();
      setActiveDonations(allDonations.filter((d: Donation) => d.status === 'Pending' || d.status === 'Approved'));
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch your active donations.",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  }, [toast]);

  // ==================== Effects ====================
  useEffect(() => {
    if (!onClose) {
      fetchMemberDonations();
    }
  }, [fetchMemberDonations, onClose]);

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
        setDonationHistory(currentHistory as DonationHistoryEntry[] || []);

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
        title: "Validation Error",
        description: "Please select a date and time for your donation.",
        variant: "destructive",
      });
      return;
    }

    // Validate that donation date is not in the past
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    if (donationDate < today) {
      toast({
        title: "Invalid Date",
        description: "Cannot schedule a donation for a past date.",
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
      const donationData = {
        donation_date: format(donationDate, 'yyyy-MM-dd'),
        donation_time: donationTime,
        note: note,
      };
      await DonationService.createDonation(donationData);

      toast({
        title: "Request Sent!",
        description: `Your donation request for ${format(donationDate!, 'PPP')} has been sent.`,
      });

      // Reset form
      setDonationDate(eventDate);
      setDonationTime('');
      setNote('');
      // We don't reset allergies and medication, as they are part of the health record now

      if (!onClose) {
        fetchMemberDonations();
      }
      onClose?.();

    } catch (error) {
      console.error("Failed to create donation:", error);
      const errorMessage = (error instanceof Error) ? error.message : 'There was an error submitting your request.';
      toast({
        title: "Request Failed",
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

    const isSubmitDisabled = isSubmitting;

  // ==================== Eligibility Check UI ====================
  if (isEligible === null) {
    return <p>Checking eligibility...</p>;
  }

  if (!isEligible) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Eligible to Donate</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Cannot Make a Donation Request</AlertTitle>
            <AlertDescription>
              {healthRecord
                ? "Your health record indicates you are not currently eligible to donate. Please review your health information or contact us for more details."
                : "You must have a health record on file to make a donation request."}
            </AlertDescription>
          </Alert>
          <Button asChild className="mt-4">
            <Link to="/member/health-records">
              {healthRecord ? 'View My Health Record' : 'Create My Health Record'}
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
            <label className="text-sm font-medium text-gray-700">Donation Date</label>
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
                  {donationDate ? format(donationDate, "PPP") : <span>Select date</span>}
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
            <label className="text-sm font-medium text-gray-700">Donation Time</label>
          </div>
          <Select onValueChange={setDonationTime} value={donationTime}>
            <SelectTrigger className="w-full border-red-200">
              <SelectValue placeholder="Select time" />
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
          <label htmlFor="note" className="text-sm font-medium text-gray-700">Additional Notes</label>
        </div>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any other information you want to share..."
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

      {/* Form Actions */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Request
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
            <DialogTitle>Schedule Blood Donation</DialogTitle>
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
            Schedule Blood Donation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {FormContent}
        </CardContent>
      </Card>

      {/* Active Donations List */}
      {!onClose && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Active Donation Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {isFetching ? (
              <div className="text-center">Đang tải...</div>
            ) : activeDonations.length === 0 ? (
              <div className="text-center text-gray-500">No active donation requests</div>
            ) : (
              <div className="space-y-4">
                {activeDonations.map((donation) => (
                  <Card key={donation.donation_id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            Scheduled for: {format(new Date(donation.donation_date), 'PPP')} at {donation.donation_time}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Status: {donation.status}</p>
                          {donation.note && (
                            <p className="text-sm text-gray-600 mt-2">Note: {donation.note}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemberDonationRequest;
