import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DonationService, Donation } from '@/services/donation.service';
import HealthRecordService from '@/services/health-record.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

type ServerResponse = Donation[] | { $values: Donation[] };

const StaffDonationManagement = () => {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const loadDonations = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await DonationService.getDonationsByStatus('Pending') as ServerResponse;
            console.log('Fetched donation data:', data);
            
            if (data && '$values' in data) {
                setDonations(Array.isArray(data.$values) ? data.$values : []);
            } else if (Array.isArray(data)) {
                setDonations(data);
            } else {
                setDonations([]);
            }
        } catch (error) {
            console.error("Failed to fetch donations:", error);
            toast({
                title: 'Error',
                description: 'Could not fetch donation requests. Please try again later.',
                variant: 'destructive',
            });
            setDonations([]);
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadDonations();
    }, [loadDonations]);

    const handleStatusChange = async (donation: Donation, newStatus: 'Approved' | 'Rejected') => {
        setIsLoading(true);
        try {
            const statusToSend = newStatus === 'Approved' ? 'Completed' : newStatus;
            const updatedDonation = await DonationService.updateDonation({ ...donation, status: statusToSend });

            if (newStatus === 'Approved') {
                // Attempt to update health record, but don't block on it
                try {
                    const healthRecord = await HealthRecordService.getRecordByUserId(donation.user_id.toString());
                    if (healthRecord) {
                        await HealthRecordService.updateUserDonationStats(healthRecord.record_id, true);
                        toast({ title: 'Success', description: `Donation approved and user's health record updated.` });
                    } else {
                        toast({ title: 'Warning', variant: 'destructive', description: `Donation approved, but could not find health record for user ${donation.user_id} to update stats.` });
                    }
                } catch (hrError) {
                    console.error("Failed to update health record:", hrError);
                    toast({ title: 'Warning', variant: 'destructive', description: `Donation approved, but failed to update health record stats.` });
                }
            } else {
                toast({ title: 'Success', description: 'Donation status updated.' });
            }
            
            // Refresh the list with the updated donation
            setDonations(prev => prev.map(d => d.donation_id === donation.donation_id ? updatedDonation : d));

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
    
    const getStatusBadgeVariant = (status: string): 'default' | 'destructive' | 'secondary' => {
        switch (status) {
            case 'Approved':
            case 'Completed':
                return 'default';
            case 'Rejected':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    if (isLoading && donations.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                    <Clock className="mx-auto h-12 w-12 animate-spin" />
                    <p className="mt-4">Loading Donations...</p>
                </div>
            </div>
        );
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
                    <div className="space-y-4">
                        {donations.length > 0 ? (
                            donations.map((donation) => (
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
                                                {donation.status === 'Completed' ? 'Approved' : donation.status}
                                            </Badge>
                                        </div>
                                        <div className="w-[150px]">
                                            <Select
                                                onValueChange={(newStatus: 'Approved' | 'Rejected') => handleStatusChange(donation, newStatus)}
                                                disabled={donation.status !== 'Pending' || isLoading}
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
                            ))
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-muted-foreground">No pending donation requests found.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffDonationManagement;