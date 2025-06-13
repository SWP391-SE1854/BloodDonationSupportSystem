
import React from 'react';
import { Activity, Heart, Scale, Ruler, Droplet, AlertCircle, Calendar, CheckCircle } from 'lucide-react';

const MemberHealthRecords = () => {
  // Based on HealthRecords table schema
  const healthRecord = {
    record_id: 1,
    user_id: 1,
    weight: 68.5,
    height: 175,
    blood_type: 'O+',
    allergies: 'None reported',
    medication: 'None',
    last_donation: '2025-05-15',
    eligibility_status: true,
    donation_count: 5
  };

  const vitals = [
    { label: 'Weight', value: `${healthRecord.weight} kg`, status: 'normal', icon: Scale },
    { label: 'Height', value: `${healthRecord.height} cm`, status: 'normal', icon: Ruler },
    { label: 'Blood Type', value: healthRecord.blood_type, status: 'normal', icon: Droplet },
    { label: 'Donation Count', value: healthRecord.donation_count.toString(), status: 'normal', icon: Heart },
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
      <div className={`border-2 rounded-lg p-6 ${healthRecord.eligibility_status ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {healthRecord.eligibility_status ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-600" />
            )}
            <div>
              <h3 className="text-xl font-semibold">
                {healthRecord.eligibility_status ? 'Eligible for Donation' : 'Not Eligible for Donation'}
              </h3>
              <p className="text-gray-600">
                Record ID: {healthRecord.record_id} | Last donation: {healthRecord.last_donation}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded text-sm font-medium ${healthRecord.eligibility_status ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {healthRecord.eligibility_status ? 'Eligible' : 'Not Eligible'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="bg-white border border-red-100 rounded-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Droplet className="h-5 w-5 text-red-600" />
              <span className="font-semibold">Health Overview</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Droplet className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Blood Type</p>
                <p className="text-2xl font-bold text-red-600">{healthRecord.blood_type}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-blue-600">{healthRecord.donation_count}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-semibold">{healthRecord.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Height:</span>
                <span className="font-semibold">{healthRecord.height} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Donation:</span>
                <span className="font-semibold">{healthRecord.last_donation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Measurements */}
        <div className="bg-white border border-red-100 rounded-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-red-600" />
              <span className="font-semibold">Health Measurements</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">From HealthRecords table</p>
          </div>
          <div className="p-6 space-y-4">
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
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(vital.status)}`}>
                    {vital.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white border border-red-100 rounded-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="font-semibold">Medical Information</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Allergies</label>
              <p className="text-gray-600 mt-1">{healthRecord.allergies}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Current Medication</label>
              <p className="text-gray-600 mt-1">{healthRecord.medication}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <button className="w-full border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Update Health Record</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Health Status Summary */}
      <div className="bg-white border border-red-100 rounded-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-red-600" />
            <span className="font-semibold">Health Summary</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Based on your health record data</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Donation Eligible</h3>
              <p className="text-sm text-green-600">Ready for next donation</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">Health Status</h3>
              <p className="text-sm text-blue-600">All vitals normal</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-800">Next Checkup</h3>
              <p className="text-sm text-purple-600">In 3 months</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberHealthRecords;
