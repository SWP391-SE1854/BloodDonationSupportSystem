import { useQuery } from '@tanstack/react-query';
import DonationHistoryService, { DonationHistoryRecord } from '@/services/donation-history.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

type DonationHistoryServerResponse = DonationHistoryRecord[] | { $values: DonationHistoryRecord[] };

const MemberDonationHistory = () => {
  const { data: donations, isLoading, isError, error } = useQuery<DonationHistoryRecord[], Error>({
    queryKey: ['memberDonationHistory'],
    queryFn: async () => {
      const response: DonationHistoryServerResponse = await DonationHistoryService.getMemberHistory();
      console.log("Raw donation history from API:", response);
      if (response && '$values' in response) {
        return Array.isArray(response.$values) ? response.$values : [];
      }
      return Array.isArray(response) ? response : [];
    },
  });

  const filteredDonations = useMemo(() => {
    if (!donations) return [];
    const finalStatuses = ['Completed', 'Rejected', 'Cancelled', 'rejcted'];
    return donations.filter(donation => finalStatuses.includes(donation.status));
  }, [donations]);

  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Rejected':
      case 'rejcted':
        return 'destructive';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{error?.message || 'Không thể tải lịch sử hiến máu.'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch Sử Hiến Máu Của Tôi</CardTitle>
        <p className="text-sm text-muted-foreground">Hồ sơ về các hoạt động hiến máu đã qua của bạn.</p>
      </CardHeader>
      <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Địa điểm</TableHead>
              <TableHead>Số lượng (ml)</TableHead>
              <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                </TableRow>
              ))
            ) : filteredDonations.length > 0 ? (
              filteredDonations.map((donation) => (
                <TableRow key={donation.donation_id}>
                  <TableCell>{new Date(donation.donation_date).toLocaleDateString()}</TableCell>
                  <TableCell>{donation.location}</TableCell>
                  <TableCell>{donation.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(donation.status)}>{donation.status}</Badge>
                  </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Bạn không có lần hiến máu nào đã hoàn thành, bị từ chối hoặc đã hủy.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </CardContent>
    </Card>
  );
};

export default MemberDonationHistory;
