
import React, { useEffect, useState, useMemo } from 'react';
import { format, differenceInDays } from 'date-fns';
import { Activity, Heart, Scale, Ruler, Droplet, AlertCircle, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HealthRecord } from '@/services/health-record.service';
import { DonationHistoryService } from '@/services/donation-history.service';
import { calculateNextEligibleDate, DonationHistoryEntry, getWaitingPeriod, getLatestDonation } from '@/utils/donationConstants';
import { isEligibleByHistory } from '@/utils/donationConstants';

interface HealthRecordsProps {
  healthData: HealthRecord;
}

const HealthRecords = ({ healthData }: HealthRecordsProps) => {
  const [donationHistory, setDonationHistory] = useState<DonationHistoryEntry[]>([]);

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const history = await DonationHistoryService.getMemberHistory();
        if (history && Array.isArray(history)) {
          setDonationHistory(history as DonationHistoryEntry[]);
        }
      } catch (error) {
        console.error('Failed to fetch donation history:', error);
      }
    };
    fetchDonationHistory();
  }, []);

  const { isEligible, nextEligibleDate, waitingPeriod, lastDonation } = useMemo(() => {
    const nextDate = calculateNextEligibleDate(donationHistory);
    const latestDonation = getLatestDonation(donationHistory);
    const waitingPeriod = latestDonation ? getWaitingPeriod(latestDonation.component) : 0;
    
    return {
      isEligible: isEligibleByHistory(donationHistory),
      nextEligibleDate: nextDate ? format(nextDate, 'PPP') : 'Now',
      waitingPeriod,
      lastDonation: latestDonation
    };
  }, [donationHistory]);

  // Sort donation history by date (newest first)
  const sortedHistory = useMemo(() => {
    return [...donationHistory]
      .filter(d => d.status.toLowerCase() === 'completed')
      .sort((a, b) => new Date(b.donation_date).getTime() - new Date(a.donation_date).getTime());
  }, [donationHistory]);

  const vitals = [
    {
      icon: <Droplet className="h-6 w-6 text-red-500" />,
      title: 'Blood Type',
      value: healthData.blood_type
    },
    {
      icon: <Scale className="h-6 w-6 text-blue-500" />,
      title: 'Weight',
      value: `${healthData.weight} kg`
    },
    {
      icon: <Ruler className="h-6 w-6 text-green-500" />,
      title: 'Height',
      value: `${healthData.height} cm`
    },
    {
      icon: <Calendar className={`h-6 w-6 ${isEligible ? 'text-purple-500' : 'text-red-500'}`} />,
      title: 'Last Donation',
      value: lastDonation ? format(new Date(lastDonation.donation_date), 'PPP') : 'No donations yet',
      isHighlighted: !isEligible,
      subtext: !isEligible ? `Next eligible: ${nextEligibleDate}` : null
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: 'Total Donations',
      value: sortedHistory.length
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
        <p className="text-gray-600 mt-2">Your complete health information and donation eligibility</p>
      </div>

      {/* Eligibility Status */}
      <Card className={`border-2 ${isEligible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isEligible ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Calendar className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h3 className="text-xl font-semibold">
                  Next Eligible
                </h3>
                <p className={`text-sm ${isEligible ? 'text-gray-600' : 'text-red-600'}`}>
                  {isEligible ? 'Now' : `${waitingPeriod} days`}
                </p>
                {lastDonation && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last donation ({lastDonation.component}): {format(new Date(lastDonation.donation_date), 'PPP')}
                  </p>
                )}
                {!isEligible && (
                  <p className="text-xs text-gray-500">
                    Next eligible: {nextEligibleDate}
                  </p>
                )}
              </div>
            </div>
            <Badge 
              variant={isEligible ? "default" : "destructive"}
              className={isEligible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
            >
              {isEligible ? 'Eligible' : 'Not Eligible'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Health Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vital Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Vital Statistics</CardTitle>
            <CardDescription>Your current health measurements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vitals.map((vital, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  vital.isHighlighted 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {vital.icon}
                  <div>
                    <p className={`font-medium ${vital.isHighlighted ? 'text-red-900' : 'text-gray-900'}`}>
                      {vital.title}
                    </p>
                    <p className={`text-sm ${vital.isHighlighted ? 'text-red-600' : 'text-gray-500'}`}>
                      {vital.value}
                    </p>
                    {vital.subtext && (
                      <p className="text-xs text-red-500 mt-0.5">{vital.subtext}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Donation History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Your donation history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedHistory.length > 0 ? (
                sortedHistory.map((donation, index) => (
                  <div key={donation.donation_id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{format(new Date(donation.donation_date), 'PPP')}</p>
                        <p className="text-sm text-gray-600">{donation.component}</p>
                        {donation.location && (
                          <p className="text-xs text-gray-500">{donation.location}</p>
                        )}
                      </div>
                      <Badge variant="outline">{donation.status}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No donation history available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthRecords;
