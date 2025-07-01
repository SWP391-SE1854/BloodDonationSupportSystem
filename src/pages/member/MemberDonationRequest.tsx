import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Calendar as CalendarIcon, FileText, Send, Clock, MapPin, Droplet, TestTube, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { DonationService } from '@/services/donation.service';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Donation } from '@/types/api';
import { Label } from '@/components/ui/label';

interface MemberDonationRequestProps {
  isOpen?: boolean;
  onClose?: () => void;
  eventDate?: string;
  requestId?: string;
  location?: string;
}

const MemberDonationRequest: React.FC<MemberDonationRequestProps> = ({ isOpen = false, onClose, eventDate: eventDateStr, requestId, location: propLocation }) => {
  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);
  const eventDateFromUrl = queryParams.get('eventDate');
  const requestIdFromUrl = queryParams.get('requestId');

  const eventDate = eventDateStr ? new Date(eventDateStr) : (eventDateFromUrl ? new Date(eventDateFromUrl) : undefined);
  const finalRequestId = requestId || requestIdFromUrl;

  const [donationDate, setDonationDate] = useState<Date | undefined>(eventDate);
  const [donationTime, setDonationTime] = useState('');
  const [location, setLocation] = useState<string>(propLocation || 'Main Hospital');
  const [component, setComponent] = useState<'Whole Blood' | 'Platelets' | 'Power Red'>('Whole Blood');
  const [quantity, setQuantity] = useState(450);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [activeDonations, setActiveDonations] = useState<Donation[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8; // 8 AM to 5 PM
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

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

  useEffect(() => {
    if (!onClose) { // Only fetch if it's the standalone page
    fetchMemberDonations();
    }
  }, [fetchMemberDonations, onClose]);

  useEffect(() => {
    // When the eventDate from props changes, update the state
    setDonationDate(eventDate);
  }, [eventDate]);

  const handleCancelDonation = async (donationId: number) => {
    try {
      await DonationService.updateDonation({ donation_id: donationId, status: 'Cancelled' });
      toast({
        title: 'Request Cancelled',
        description: 'Your donation request has been successfully cancelled.',
      });
      fetchMemberDonations(); // Refresh the list
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: 'Could not cancel the donation request.',
        variant: 'destructive',
      });
    }
  };

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
    setIsSubmitting(true);
    try {
      const donationData = {
        donation_date: format(donationDate, 'yyyy-MM-dd'),
        donation_time: donationTime,
        component: component as 'Whole Blood' | 'Platelets' | 'Power Red',
        quantity: quantity,
        location: location,
        note: note,
      };
      await DonationService.createDonation(donationData);
      toast({
        title: "Request Submitted!",
        description: `Your donation request for ${format(donationDate!, 'PPP')} has been submitted.`,
      });
      // Reset form
      setDonationDate(eventDate);
      setDonationTime('');
      setComponent('Whole Blood');
      setLocation(propLocation || 'Main Hospital');
      setQuantity(450);
      setNote('');
      if (!onClose) { // If it's the standalone page, refresh the list
      fetchMemberDonations();
      }
      onClose?.(); // Close modal on success

    } catch (error) {
      console.error("Failed to create donation:", error);
      const errorMessage = (error instanceof Error) ? error.message : 'There was an error submitting your request.';
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = (
    <form onSubmit={handleSubmit} id="donation-form" className="space-y-6">
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
                  {donationDate ? format(donationDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={donationDate}
                  onSelect={setDonationDate}
                  initialFocus
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
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <label className="text-sm font-medium text-gray-700">Location</label>
                </div>
        <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter donation location"
            className="border-red-200"
        />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplet className="h-4 w-4 text-red-500" />
                    <label className="text-sm font-medium text-gray-700">Donation Component</label>
                  </div>
            <Select 
                value={component} 
                onValueChange={(value: 'Whole Blood' | 'Platelets' | 'Power Red') => setComponent(value)}
            >
                <SelectTrigger id="component">
                    <SelectValue placeholder="Select blood component" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="Whole Blood">Whole Blood</SelectItem>
                       <SelectItem value="Platelets">Platelets</SelectItem>
                    <SelectItem value="Power Red">Power Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <TestTube className="h-4 w-4 text-red-500" />
                    <label className="text-sm font-medium text-gray-700">Quantity (ml)</label>
                  </div>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="e.g., 450"
                    className="border-red-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-red-500" />
                  <label className="text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                </div>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any special requirements or health notes..."
                  className="w-full border border-red-200 focus:border-red-500 rounded-lg px-3 py-2 outline-none min-h-[100px] resize-none"
                />
              </div>
    </form>
  );

  if (!onClose) {
    // Standalone page version
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Donation Request</h1>
          <p className="text-gray-600 mt-2">Schedule your next blood donation appointment</p>
        </div>
        <div className="lg:col-span-2 bg-white border border-red-100 rounded-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span className="font-semibold">Donation Request Details</span>
            </div>
          </div>
          <div className="p-6">
            {FormContent}
              <Button
                type="submit"
              form="donation-form"
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              <Send className="h-4 w-4 ml-2" />
              </Button>
          </div>
        </div>

        {/* New section for active donations */}
      <Card className="border-red-100">
        <CardHeader>
          <div className="flex items-center justify-between">
              <CardTitle>My Active Donations</CardTitle>
              <Button onClick={fetchMemberDonations} variant="outline" size="sm" disabled={isFetching}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
             <p className="text-sm text-muted-foreground">Your upcoming or pending donations.</p>
        </CardHeader>
        <CardContent>
            {isFetching ? (
            <p>Loading donations...</p>
            ) : activeDonations.length > 0 ? (
            <div className="space-y-4">
                {activeDonations.map(donation => (
                <div key={donation.donation_id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                      <p className="font-semibold">{donation.component} Donation on {format(new Date(donation.donation_date), 'PPP')}</p>
                      <p className="text-sm text-muted-foreground">at {donation.location} - <Badge variant="secondary">{donation.status}</Badge></p>
                  </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelDonation(donation.donation_id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                </div>
              ))}
      </div>
          ) : (
              <p className="text-center text-muted-foreground py-4">You have no active donation requests.</p>
          )}
        </CardContent>
      </Card>
      </div>
    );
  }

  // Modal version
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create Donation Request</DialogTitle>
        </DialogHeader>
        <div className="p-1">
          {FormContent}
    </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            form="donation-form"
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
            <Send className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDonationRequest;
