
import React, { useState } from 'react';
import { Heart, Calendar, MapPin, FileText, Send, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const MemberDonationRequest = () => {
  const [formData, setFormData] = useState({
    requested_date: '',
    note: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call to create donation request
    setTimeout(() => {
      toast({
        title: "Donation Request Submitted",
        description: "Your donation request has been submitted successfully. Status: Pending",
      });
      setFormData({
        requested_date: '',
        note: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const donationLocations = [
    { id: 1, name: "City Medical Center", address: "123 Main St, Downtown" },
    { id: 2, name: "Community Health Center", address: "456 Oak Ave, Midtown" },
    { id: 3, name: "Regional Blood Bank", address: "789 Pine St, Uptown" },
    { id: 4, name: "University Hospital", address: "321 College Rd, Campus" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Donation Request</h1>
        <p className="text-gray-600 mt-2">Schedule your next blood donation appointment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <Card className="lg:col-span-2 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span>Donation Request Details</span>
            </CardTitle>
            <CardDescription>Based on DonationRequests table schema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="requested_date">Requested Date & Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="requested_date"
                    type="datetime-local"
                    value={formData.requested_date}
                    onChange={(e) => handleInputChange('requested_date', e.target.value)}
                    className="pl-10 border-red-200 focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Additional Notes (Optional)</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="note"
                    value={formData.note}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                    placeholder="Any special requirements or health notes..."
                    className="pl-10 border-red-200 focus:border-red-500 min-h-[100px]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Submitting Request...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Donation Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Information Panel */}
        <div className="space-y-6">
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="text-green-700">Donation Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <h4 className="font-semibold mb-2">Before Donation:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Get adequate sleep (6-8 hours)</li>
                  <li>Eat a healthy meal</li>
                  <li>Drink plenty of water</li>
                  <li>Bring valid ID</li>
                  <li>Weight at least 50kg</li>
                </ul>
              </div>
              <div className="text-sm text-gray-600">
                <h4 className="font-semibold mb-2">Eligibility:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Age 18-65 years</li>
                  <li>Good health condition</li>
                  <li>No recent illness</li>
                  <li>56 days since last donation</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-700">Available Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                {donationLocations.map((location) => (
                  <div key={location.id} className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">{location.name}</h4>
                      <p className="text-xs">{location.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-100">
            <CardHeader>
              <CardTitle className="text-yellow-700">Request Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-semibold">Pending Review</p>
                  <p className="text-sm text-gray-600">Your request will be processed within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberDonationRequest;
