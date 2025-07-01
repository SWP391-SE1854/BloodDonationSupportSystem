import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, RefreshCw, XCircle, HeartPulse } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DonationService from '@/services/donation.service';
import { Donation } from '@/types/api';
import HealthRecordService from '@/services/health-record.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { HealthCheckForm } from '@/components/HealthCheckForm';

const StaffDonationManagement = () => {
    const [pendingDonations, setPendingDonations] = useState<Donation[]>([]);
    const [approvedDonations, setApprovedDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [isHealthCheckOpen, setIsHealthCheckOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const [healthCheckPassed, setHealthCheckPassed] = useState<Record<number, boolean>>({});

  const loadDonations = useCallback(async () => {
    setIsLoading(true);
    try {
            const pendingPromise = DonationService.getDonationsByStatus('Pending');
            const approvedPromise = DonationService.getDonationsByStatus('Approved');
            
            const [pendingData, approvedData] = await Promise.all([pendingPromise, approvedPromise]);

            setPendingDonations(pendingData);
            setApprovedDonations(approvedData);

    } catch (error) {
            console.error("Failed to fetch donations:", error);
            toast({
                title: 'Error',
                description: 'Could not fetch donation requests. Please try again later.',
                variant: 'destructive',
            });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const handleHealthCheckResult = (donationId: number, isEligible: boolean) => {
    if (isEligible) {
      setHealthCheckPassed(prev => ({ ...prev, [donationId]: true }));
    } else {
      const donation = approvedDonations.find(d => d.donation_id === donationId);
      if (donation) {
        handleStatusUpdate(donation, 'Rejected');
      }
    }
  };

  const handleOpenHealthCheck = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsHealthCheckOpen(true);
  };

    const handleStatusUpdate = async (donation: Donation, newStatus: 'Approved' | 'Rejected' | 'Completed') => {
        setIsLoading(true);
    try {
            await DonationService.updateDonation({ ...donation, status: newStatus });
      
            if (newStatus === 'Completed') {
                try {
                    await HealthRecordService.updateUserDonationStats(donation.user_id.toString(), donation.donation_date);
                        toast({ title: 'Success', description: `Donation completed and user's health record updated.` });
                } catch (hrError) {
                    console.error("Failed to update health record:", hrError);
                    toast({ 
                        title: 'Warning', 
                        variant: 'destructive', 
                        description: `Donation status was updated, but failed to update the user's health record stats.` 
                    });
      }
            } else {
                 toast({ title: 'Success', description: 'Donation status updated.' });
            }
            
            loadDonations();

    } catch (error) {
            console.error(`Failed to update donation to ${newStatus}:`, error);
            toast({
                title: 'Update Failed',
                description: 'An error occurred while updating the donation.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
    }
  };

    const getStatusBadgeVariant = (status: string): 'default' | 'destructive' | 'secondary' | 'outline' => {
    switch (status) {
            case 'Completed':
                return 'default';
            case 'Approved':
                return 'outline';
            case 'Rejected':
            case 'Cancelled':
                return 'destructive';
            default:
                return 'secondary';
    }
  };

    const renderDonationList = (donations: Donation[], type: 'pending' | 'approved') => {
  if (isLoading) {
    return (
                <div className="flex items-center justify-center h-48">
                    <div className="text-center text-muted-foreground">
                        <Clock className="mx-auto h-8 w-8 animate-spin" />
                        <p className="mt-2">Loading Donations...</p>
        </div>
      </div>
    );
  }

        if (donations.length === 0) {
            return <div className="text-center py-16"><p className="text-muted-foreground">No {type} donations found.</p></div>
        }

  return (
            <div className="space-y-4">
              {donations.map((donation) => (
                <Card key={donation.donation_id}>
                  <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                                <p className="font-semibold">Donor ID: {donation.user_id}</p>
                                <p className="text-sm text-muted-foreground">Component: {donation.component}</p>
                    </div>
                    <div>
                      <p>{format(new Date(donation.donation_date), 'PPP')}</p>
                                <p className="text-sm text-muted-foreground">Location: {donation.location}</p>
                    </div>
                    <div>
                                <Badge variant={getStatusBadgeVariant(donation.status)}>
                                    {donation.status}
                                </Badge>
                    </div>
                            {type === 'pending' && (
                    <div className="w-[150px]">
                      <Select
                                        onValueChange={(newStatus: 'Approved' | 'Rejected') => handleStatusUpdate(donation, newStatus)}
                                        disabled={isLoading}
                      >
                                        <SelectTrigger><SelectValue placeholder="Update Status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Approved">Approve</SelectItem>
                          <SelectItem value="Rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                            )}
                             {type === 'approved' && (
                               <div className="flex gap-2">
                                 <Button onClick={() => handleOpenHealthCheck(donation)} variant="outline">
                                   <HeartPulse className="h-4 w-4 mr-2" />
                                   Health Check
                                 </Button>
                                 <Button onClick={() => handleStatusUpdate(donation, 'Completed')} disabled={isLoading || !healthCheckPassed[donation.donation_id]}>
                                     <CheckCircle className="h-4 w-4 mr-2" />
                                     Mark as Complete
                                 </Button>
                               </div>
                            )}
                  </CardContent>
                </Card>
              ))}
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Manage Donation Requests</CardTitle>
                    <Button onClick={loadDonations} variant="outline" size="sm" disabled={isLoading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="pending">
                                <Clock className="mr-2 h-4 w-4" /> In Progress ({pendingDonations.length})
                            </TabsTrigger>
                            <TabsTrigger value="approved">
                                <CheckCircle className="mr-2 h-4 w-4" /> Approved ({approvedDonations.length})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending" className="pt-4">
                            {renderDonationList(pendingDonations, 'pending')}
                        </TabsContent>
                        <TabsContent value="approved" className="pt-4">
                             {renderDonationList(approvedDonations, 'approved')}
                        </TabsContent>
                    </Tabs>
        </CardContent>
      </Card>
      <HealthCheckForm 
        isOpen={isHealthCheckOpen}
        onOpenChange={setIsHealthCheckOpen}
        donation={selectedDonation}
        onCheckResult={handleHealthCheckResult}
      />
    </div>
  );
};

export default StaffDonationManagement; 