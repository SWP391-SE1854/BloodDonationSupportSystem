
import React, { useState } from 'react';
import { Heart, Calendar, MapPin, FileText, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const DonationRequest = () => {
  const [formData, setFormData] = useState({
    requestDate: '',
    preferredTime: '',
    location: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Donation Request Submitted",
        description: "Your donation request has been submitted successfully. We'll contact you soon to confirm your appointment.",
      });
      setFormData({
        requestDate: '',
        preferredTime: '',
        location: '',
        notes: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const locations = [
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
              <span>Donation Details</span>
            </CardTitle>
            <CardDescription>Please provide your preferred donation details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestDate">Preferred Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="requestDate"
                      type="date"
                      value={formData.requestDate}
                      onChange={(e) => handleInputChange('requestDate', e.target.value)}
                      className="pl-10 border-red-200 focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Select onValueChange={(value) => handleInputChange('preferredTime', value)}>
                    <SelectTrigger className="border-red-200 focus:border-red-500">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9:00 AM - 12:00 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (1:00 PM - 5:00 PM)</SelectItem>
                      <SelectItem value="evening">Evening (5:00 PM - 8:00 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Donation Location</Label>
                <Select onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger className="border-red-200 focus:border-red-500">
                    <SelectValue placeholder="Select donation location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.address}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any special requirements or notes..."
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
              <CardTitle className="text-green-700">Donation Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <h4 className="font-semibold mb-2">Before Donation:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Get a good night's sleep</li>
                  <li>Eat a healthy meal</li>
                  <li>Drink plenty of water</li>
                  <li>Bring a valid ID</li>
                </ul>
              </div>
              <div className="text-sm text-gray-600">
                <h4 className="font-semibold mb-2">Eligibility Requirements:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Age 18-65 years</li>
                  <li>Weight at least 50kg</li>
                  <li>Good health condition</li>
                  <li>No recent illness</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-700">Donation Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">1</div>
                  <div>
                    <h4 className="font-semibold">Registration</h4>
                    <p>Complete registration and health screening</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">2</div>
                  <div>
                    <h4 className="font-semibold">Health Check</h4>
                    <p>Brief medical examination and vitals check</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">3</div>
                  <div>
                    <h4 className="font-semibold">Donation</h4>
                    <p>Blood collection (10-15 minutes)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">4</div>
                  <div>
                    <h4 className="font-semibold">Recovery</h4>
                    <p>Rest and refreshments</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonationRequest;
