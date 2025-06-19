
import React from 'react';
import { Activity, Heart, Scale, Ruler, Droplet, AlertCircle, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const HealthRecords = () => {
  const healthData = {
    bloodType: 'O+',
    weight: 68.5,
    height: 175,
    lastDonation: '2025-05-15',
    eligibilityStatus: true,
    donationCount: 5,
    allergies: 'None reported',
    medication: 'None',
    nextEligible: '2025-06-29'
  };

  const vitals = [
    { label: 'Blood Pressure', value: '120/80 mmHg', status: 'normal', icon: Heart },
    { label: 'Pulse Rate', value: '72 bpm', status: 'normal', icon: Activity },
    { label: 'Hemoglobin', value: '14.2 g/dL', status: 'normal', icon: Droplet },
    { label: 'BMI', value: '22.4', status: 'normal', icon: Scale },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
        <p className="text-gray-600 mt-2">Your complete health information and donation eligibility</p>
      </div>

      {/* Eligibility Status */}
      <Card className={`border-2 ${healthData.eligibilityStatus ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {healthData.eligibilityStatus ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h3 className="text-xl font-semibold">
                  {healthData.eligibilityStatus ? 'Eligible for Donation' : 'Not Eligible for Donation'}
                </h3>
                <p className="text-gray-600">
                  {healthData.eligibilityStatus 
                    ? `Next eligible date: ${healthData.nextEligible}`
                    : 'Please consult with medical staff'
                  }
                </p>
              </div>
            </div>
            <Badge 
              className={healthData.eligibilityStatus ? 'bg-green-600' : 'bg-red-600'}
            >
              {healthData.eligibilityStatus ? 'Eligible' : 'Not Eligible'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplet className="h-5 w-5 text-red-600" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Droplet className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Blood Type</p>
                <p className="text-2xl font-bold text-red-600">{healthData.bloodType}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Donations</p>
                <p className="text-2xl font-bold text-blue-600">{healthData.donationCount}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-semibold">{healthData.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Height:</span>
                <span className="font-semibold">{healthData.height} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Donation:</span>
                <span className="font-semibold">{healthData.lastDonation}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Vitals */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-red-600" />
              <span>Current Vitals</span>
            </CardTitle>
            <CardDescription>Latest health measurements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vitals.map((vital, index) => {
              const Icon = vital.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{vital.label}</p>
                      <p className="text-sm text-gray-500">{vital.value}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(vital.status)}>
                    {vital.status}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>Medical Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Allergies</Label>
              <p className="text-gray-600 mt-1">{healthData.allergies}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Current Medication</Label>
              <p className="text-gray-600 mt-1">{healthData.medication}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <Button 
                variant="outline" 
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Health Checkup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Timeline */}
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-red-600" />
            <span>Health Timeline</span>
          </CardTitle>
          <CardDescription>Recent health record updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: '2025-05-15', event: 'Blood Donation', details: 'Successful donation - 450ml', type: 'donation' },
              { date: '2025-05-10', event: 'Health Screening', details: 'Annual health checkup completed', type: 'checkup' },
              { date: '2025-04-20', event: 'Vitals Update', details: 'Blood pressure and weight recorded', type: 'vitals' },
              { date: '2025-03-15', event: 'Blood Donation', details: 'Successful donation - 450ml', type: 'donation' },
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  item.type === 'donation' ? 'bg-red-100' :
                  item.type === 'checkup' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {item.type === 'donation' && <Heart className="h-4 w-4 text-red-600" />}
                  {item.type === 'checkup' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {item.type === 'vitals' && <Activity className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{item.event}</h4>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Label = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={className}>{children}</div>
);

export default HealthRecords;
