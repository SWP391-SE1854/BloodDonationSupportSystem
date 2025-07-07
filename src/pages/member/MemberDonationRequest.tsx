import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { DonationService } from "@/services/donation.service";
import { Donation } from "@/types/api";
import { Heart, Calendar as CalendarIcon, FileText, Send, Clock, CheckCircle, AlertCircle, Stethoscope } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLocation } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

// ==================== Component Props Interface ====================
interface MemberDonationRequestProps {
  isOpen?: boolean;
  onClose?: () => void;
  eventDate?: string;
  requestId?: string;
}

// List of common diseases and allergies that may affect blood donation
const DISEASES = [
  "Diabetes",
  "Heart Disease",
  "High Blood Pressure",
  "Hepatitis",
  "HIV/AIDS",
  "Cancer",
  "Anemia",
  "Thyroid Disease",
  "Other"
];

const ALLERGIES = [
  "Medication Allergies",
  "Food Allergies",
  "Latex Allergy",
  "Seasonal Allergies",
  "Other"
];

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
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [otherDisease, setOtherDisease] = useState('');
  const [otherAllergy, setOtherAllergy] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [activeDonations, setActiveDonations] = useState<Donation[]>([]);
  const [isFetching, setIsFetching] = useState(true);

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
      const donationData = {
        donation_date: format(donationDate, 'yyyy-MM-dd'),
        donation_time: donationTime,
        diseases: [...selectedDiseases, ...(otherDisease ? ['Other: ' + otherDisease] : [])],
        allergies: [...selectedAllergies, ...(otherAllergy ? ['Other: ' + otherAllergy] : [])],
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
      setSelectedDiseases([]);
      setSelectedAllergies([]);
      setOtherDisease('');
      setOtherAllergy('');
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

      {/* Diseases Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-red-500" />
          <label className="text-sm font-medium text-gray-700">Medical Conditions</label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {DISEASES.map((disease) => (
            <div key={disease} className="flex items-center space-x-2">
              <Checkbox
                id={`disease-${disease}`}
                checked={selectedDiseases.includes(disease)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedDiseases([...selectedDiseases, disease]);
                  } else {
                    setSelectedDiseases(selectedDiseases.filter(d => d !== disease));
                  }
                }}
              />
              <label
                htmlFor={`disease-${disease}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {disease}
              </label>
            </div>
          ))}
        </div>
        {selectedDiseases.includes('Other') && (
          <Input
            placeholder="Please specify other medical conditions"
            value={otherDisease}
            onChange={(e) => setOtherDisease(e.target.value)}
            className="mt-2"
          />
        )}
      </div>

      {/* Allergies Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <label className="text-sm font-medium text-gray-700">Allergies</label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {ALLERGIES.map((allergy) => (
            <div key={allergy} className="flex items-center space-x-2">
              <Checkbox
                id={`allergy-${allergy}`}
                checked={selectedAllergies.includes(allergy)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedAllergies([...selectedAllergies, allergy]);
                  } else {
                    setSelectedAllergies(selectedAllergies.filter(a => a !== allergy));
                  }
                }}
              />
              <label
                htmlFor={`allergy-${allergy}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {allergy}
              </label>
            </div>
          ))}
        </div>
        {selectedAllergies.includes('Other') && (
          <Input
            placeholder="Please specify other allergies"
            value={otherAllergy}
            onChange={(e) => setOtherAllergy(e.target.value)}
            className="mt-2"
          />
        )}
      </div>

      {/* Notes Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-4 w-4 text-red-500" />
          <label className="text-sm font-medium text-gray-700">Additional Notes</label>
        </div>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter any additional notes if needed"
          className="border-red-200"
        />
      </div>

      {/* Form Actions */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
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
              <div className="text-center">Loading...</div>
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
