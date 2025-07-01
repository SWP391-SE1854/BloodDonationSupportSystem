import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { BloodRequestService, BloodRequest } from '@/services/blood-request.service';
import { useAuth } from '@/contexts/AuthContext';
import { HealthRecordService, HealthRecord } from '@/services/health-record.service';
import MemberDonationRequest from './MemberDonationRequest';

const bloodTypes = [
    { id: "1", name: "A+" }, { id: "2", name: "A-" }, { id: "3", name: "B+" },
    { id: "4", name: "B-" }, { id: "5", name: "AB+" }, { id: "6", "name": "AB-" },
    { id: "7", name: "O+" }, { id: "8", name: "O-" }
];

const compatibilityMap: Record<string, string[]> = {
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-','O+', 'O-'], // Universal donor
};

const getBloodTypeName = (id: string | number | null): string => {
    if (id === null) return 'N/A';
    const stringId = id.toString();
    const bloodType = bloodTypes.find(bt => bt.id === stringId);
    return bloodType ? bloodType.name : 'N/A';
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
    
    const userBloodTypeName = getBloodTypeName(healthRecord.blood_type);
    if (userBloodTypeName === 'N/A' || !compatibilityMap[userBloodTypeName]) {
        return [];
    }

    const compatibleRecipientTypes = compatibilityMap[userBloodTypeName];
    
    return allRequests.filter(request => {
        const requestedBloodTypeName = getBloodTypeName(request.blood_id);
        return compatibleRecipientTypes.includes(requestedBloodTypeName);
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
        <CardTitle>Compatible Blood Requests</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          These are all the active requests compatible with your blood type.
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Blood Type Needed</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingRequests ? (
              <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
            ) : compatibleRequests.length > 0 ? (
              compatibleRequests.map((request) => (
                <TableRow key={request.request_id}>
                  <TableCell>{format(new Date(request.request_date), 'PPP')}</TableCell>
                  <TableCell>{getBloodTypeName(request.blood_id)}</TableCell>
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
                      Donate Now
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No compatible blood requests found at this time.
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