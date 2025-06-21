import { useEffect, useState } from 'react';
import DonationService, { DonationHistory } from '@/services/donation.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const MemberDonationHistory = () => {
  const [history, setHistory] = useState<DonationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await DonationService.getMemberDonationHistory();
        setHistory(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch donation history.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Donation History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading donation history...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Quantity (ML)</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length > 0 ? (
                history.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.donation_date), 'PPP')}</TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>{record.quantity}</TableCell>
                    <TableCell>{record.notes || 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    You have no donation history.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberDonationHistory;
