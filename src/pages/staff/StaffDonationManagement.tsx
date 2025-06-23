import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Droplet, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DonationService, Donation } from '@/services/donation.service';
import HealthRecordService from '@/services/health-record.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const StaffDonationManagement = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadDonations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await DonationService.getAllDonations();
      setDonations(data);
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch donations." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const handleStatusChange = async (donation: Donation, newStatus: 'Approved' | 'Rejected') => {
    try {
      const donationToUpdate = { ...donation, status: newStatus };
      const updatedDonation = await DonationService.updateDonation(donationToUpdate);
      
      if (newStatus === 'Approved') {
        const healthRecord = await HealthRecordService.getRecordByUserId(donation.user_id.toString());
        if (healthRecord) {
          await HealthRecordService.updateUserDonationStats(healthRecord.record_id, true);
          toast({ title: 'Success', description: `Donation approved and user's health record updated.` });
        } else {
          toast({ title: 'Warning', description: `Donation approved, but could not find health record for user ${donation.user_id} to update stats.` });
        }
      } else {
        toast({ title: 'Success', description: 'Donation status updated.' });
      }

      setDonations(prev => prev.map(d => d.donation_id === donation.donation_id ? updatedDonation : d));

    } catch (error) {
      console.error('Failed to update donation:', error);
      toast({ title: 'Error', description: 'Failed to update donation.' });
    }
  };

  const getStatusBadgeVariant = (status: string): "secondary" | "default" | "destructive" => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400 animate-spin" />
          <p className="text-gray-500">Loading donation requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Donation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading donations...</p>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <Card key={donation.donation_id}>
                  <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="font-semibold">User ID: {donation.user_id}</p>
                      <p className="text-sm text-muted-foreground">{donation.component}</p>
                    </div>
                    <div>
                      <p>{format(new Date(donation.donation_date), 'PPP')}</p>
                      <p className="text-sm text-muted-foreground">{donation.location}</p>
                    </div>
                    <div>
                      <Badge variant={getStatusBadgeVariant(donation.status)}>{donation.status}</Badge>
                    </div>
                    <div className="w-[150px]">
                      <Select
                        value={donation.status}
                        onValueChange={(newStatus: 'Approved' | 'Rejected') => handleStatusChange(donation, newStatus)}
                        disabled={donation.status !== 'Pending'}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Approved">Approve</SelectItem>
                          <SelectItem value="Rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDonationManagement; 