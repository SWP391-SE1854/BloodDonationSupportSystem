import React, { useState, useEffect } from 'react';
import { Heart, Calendar as CalendarIcon, FileText, Send, Clock, MapPin, Droplet, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { DonationService } from '@/services/donation.service';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import axios from 'axios';

const MemberDonationRequest = () => {
  const [donationDate, setDonationDate] = useState<Date | undefined>(new Date());
  const [donationTime, setDonationTime] = useState('');
  const [location, setLocation] = useState('');
  const [component, setComponent] = useState('Whole Blood'); // Default component
  const [quantity, setQuantity] = useState(450);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8; // 8 AM to 5 PM
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  const donationLocations = [
    { id: "City Medical Center", name: "City Medical Center", address: "123 Main St, Downtown" },
    { id: "Community Health Center", name: "Community Health Center", address: "456 Oak Ave, Midtown" },
    { id: "Regional Blood Bank", name: "Regional Blood Bank", address: "789 Pine St, Uptown" },
    { id: "University Hospital", name: "University Hospital", address: "321 College Rd, Campus" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!donationDate || !donationTime || !location || !component || !quantity) {
      toast({
        title: "Incomplete Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    const [hours, minutes] = donationTime.split(':').map(Number);
    const combinedDateTime = new Date(donationDate);
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);
    
    if (combinedDateTime < new Date()) {
      toast({
        title: "Invalid Date/Time",
        description: "Donation date and time cannot be in the past.",
        variant: "destructive",
      });
      return;
    }

    const quantityNum = Number(quantity);
    if (quantityNum <= 0 || quantityNum > 1000) {
      toast({
        title: "Invalid Quantity",
        description: "Quantity must be between 1 and 1000 ml.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const donationData = {
        unit_id: 1,
        donation_date: combinedDateTime.toISOString(),
        location: location,
        component: component,
        quantity: quantityNum,
        status: "Pending",
        notes: note || undefined
      };
      
      await DonationService.createMemberDonation(donationData);

      toast({
        title: 'Request Submitted!',
        description: 'Your donation request has been sent successfully.',
      });

      setDonationDate(undefined);
      setDonationTime('');
      setLocation('');
      setQuantity(450);
      setNote('');

    } catch (error) {
      console.error('Donation request submission failed:', error);
      let errorMessage = 'There was an error submitting your request. Please try again.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.Message || 'An unknown error occurred.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Donation Request</h1>
        <p className="text-gray-600 mt-2">Schedule your next blood donation appointment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-red-100 rounded-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span className="font-semibold">Donation Request Details</span>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="h-4 w-4 text-red-500" />
                    <label className="text-sm font-medium text-gray-700">Donation Date</label>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal border-red-200"
                      >
                        {donationDate ? format(donationDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={donationDate}
                        onSelect={setDonationDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
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
                <Select onValueChange={setLocation} value={location}>
                  <SelectTrigger className="w-full border-red-200">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {donationLocations.map(loc => (
                      <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplet className="h-4 w-4 text-red-500" />
                    <label className="text-sm font-medium text-gray-700">Donation Component</label>
                  </div>
                   <Select onValueChange={setComponent} value={component}>
                    <SelectTrigger className="w-full border-red-200">
                       <SelectValue placeholder="Select component" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="Whole Blood">Whole Blood</SelectItem>
                       <SelectItem value="Plasma">Plasma</SelectItem>
                       <SelectItem value="Platelets">Platelets</SelectItem>
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

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Before You Donate</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>Eat a healthy meal and avoid fatty foods.</li>
              <li>Drink plenty of water.</li>
              <li>Get a good night's sleep.</li>
              <li>Bring a valid ID.</li>
                </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDonationRequest;
