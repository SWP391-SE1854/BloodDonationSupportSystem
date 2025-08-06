import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { BloodRequestService, BloodRequest } from '@/services/blood-request.service';
import { HealthRecordService, HealthRecord } from '@/services/health-record.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import MemberDonationRequest from './MemberDonationRequest';
import { getBloodTypeName } from '@/utils/bloodTypes';

// Blood type compatibility map
const compatibilityMap: { [key: string]: string[] } = {
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-','O+', 'O-'], // Universal donor
};

type BloodRequestServerResponse = BloodRequest[] | { $values: BloodRequest[] };

const MemberBloodRequests = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | undefined>(undefined);

  const { data: healthRecord } = useQuery<HealthRecord, Error>({
      queryKey: ['myHealthRecord'],
      queryFn: HealthRecordService.getMyRecord,
      enabled: !!user,
  });

  const { data: allRequests, isLoading: isLoadingRequests } = useQuery<BloodRequest[], Error>({
    queryKey: ['allBloodRequests'],
    queryFn: async () => {
      const data: BloodRequestServerResponse = await BloodRequestService.getAllBloodRequests();
        if (data && '$values' in data) {
            return Array.isArray(data.$values) ? data.$values : [];
        }
        return Array.isArray(data) ? data : [];
    },
  });

  const compatibleRequests = useMemo(() => {
    if (!healthRecord || !allRequests || typeof healthRecord.blood_type === 'undefined') {
      return [];
    }
    
    const userBloodTypeName = getBloodTypeName(healthRecord.blood_type || null);
    
    if (userBloodTypeName === 'Không xác định' || !compatibilityMap[userBloodTypeName]) {
        return [];
    }

    // For a user with blood type X, they can donate to requests that need blood types compatible with X
    // The compatibility map shows what blood types can RECEIVE from the user's blood type
    const compatibleRecipientTypes = compatibilityMap[userBloodTypeName];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allRequests.filter(request => {
        const requestedBloodTypeName = getBloodTypeName(request.blood_id || null);
        const requestDate = new Date(request.request_date);
        
        // Check if the user can donate to this request
        // The request needs requestedBloodTypeName, and the user has userBloodTypeName
                  // The user can donate if requestedBloodTypeName is in the list of types that can receive from userBloodTypeName
          const canDonateToRequest = compatibleRecipientTypes.includes(requestedBloodTypeName);
          const isFuture = requestDate >= today;
          
          return canDonateToRequest && isFuture;
    });
  }, [healthRecord, allRequests]);

  const handleDonateNow = (request: BloodRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(undefined);
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Yêu cầu hiến máu tương thích</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Đây là tất cả các yêu cầu hiến máu tương thích với máu của bạn.
        </p>
      </CardHeader>
      <CardContent>
        
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead>Địa điểm</TableHead>
              <TableHead>Nhóm máu cần</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Khẩn cấp</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingRequests ? (
              <TableRow><TableCell colSpan={6} className="text-center">Đang tải...</TableCell></TableRow>
            ) : compatibleRequests.length > 0 ? (
              compatibleRequests.map((request) => (
                <TableRow key={request.request_id}>
                  <TableCell>{format(new Date(request.request_date), 'PPP')}</TableCell>
                  <TableCell>{format(new Date(request.end_date), 'PPP')}</TableCell>
                  <TableCell>{request.location_donate || 'N/A'}</TableCell>
                  <TableCell>{getBloodTypeName(request.blood_id || null)}</TableCell>
                  <TableCell>{request.donor_count || 'N/A'}</TableCell>
                  <TableCell>
                    {request.emergency_status ? (
                      <Badge variant="destructive">Emergency</Badge>
                    ) : (
                      <Badge variant="secondary">Standard</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm"
                        onClick={() => handleDonateNow(request)}
                    >
                      Đóng góp ngay
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không tìm thấy yêu cầu hiến máu tương thích với máu của bạn.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
      
      {isModalOpen && selectedRequest && (
        <MemberDonationRequest
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          eventDate={selectedRequest.request_date}
          requestId={selectedRequest.request_id.toString()}
        />
      )}
    </>
  );
};

export default MemberBloodRequests; 