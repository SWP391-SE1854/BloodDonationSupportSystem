import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { DonationHistoryService, DonationHistoryRecord } from '@/services/donation-history.service';

type DonationHistoryServerResponse = DonationHistoryRecord[] | { $values: DonationHistoryRecord[] };

const statusTranslations: { [key: string]: string } = {
  Pending: 'Đang chờ',
  Approved: 'Đã duyệt',
  Completed: 'Đã hoàn thành',
  Rejected: 'Đã từ chối',
  Cancelled: 'Đã hủy',
};

const MemberDonationHistory = () => {
  const { data: donations, isLoading, isError, error } = useQuery<DonationHistoryRecord[], Error>({
    queryKey: ['memberDonationHistory'],
    queryFn: async () => {
      const response: DonationHistoryServerResponse = await DonationHistoryService.getMemberHistory();
      if (response && '$values' in response) {
        return Array.isArray(response.$values) ? response.$values : [];
      }
      return Array.isArray(response) ? response : [];
    },
  });

  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Approved':
        return 'secondary';
      case 'Pending':
        return 'outline';
      case 'Rejected':
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
        <CardTitle>Lịch sử hiến máu</CardTitle>
        <p className="text-sm text-muted-foreground">Hồ sơ về các hoạt động hiến máu đã qua của bạn.</p>
      </CardHeader>
      <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Lịch sử</TableHead>
                <TableHead>Ngày</TableHead>
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
            ) : donations && donations.length > 0 ? (
              donations.map((donation) => (
                <TableRow key={donation.history_id}>
                  <TableCell>#{donation.history_id}</TableCell>
                  <TableCell>{new Date(donation.donation_date).toLocaleDateString()}</TableCell>
                  <TableCell>{donation.bloodInventory?.quantity || 0}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(donation.status)}>
                      {statusTranslations[donation.status] || donation.status}
                    </Badge>
                  </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Bạn chưa có lịch sử hiến máu.
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
