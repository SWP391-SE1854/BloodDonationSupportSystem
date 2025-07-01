import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// import { QRCodeSVG } from 'qrcode.react';
import { DonationHistoryRecord } from '@/services/donation-history.service';

interface DonationConfirmationDialogProps {
  donation: DonationHistoryRecord;
  children: React.ReactNode;
}

const DonationConfirmationDialog = ({ donation, children }: DonationConfirmationDialogProps) => {
  // const qrCodeValue = JSON.stringify({
  //   donation_id: donation.donation_id,
  //   location: donation.location,
  //   donation_date: donation.donation_date,
  //   component: donation.component,
  // });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Donation Confirmation</DialogTitle>
          <DialogDescription>
            Show this QR code upon arrival at the donation center.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {/* <QRCodeSVG value={qrCodeValue} size={256} /> */}
          <p className="text-center text-gray-500">[QR Code will be displayed here]</p>
          <div className="text-center">
            <p>
              <strong>Donation ID:</strong> {donation.donation_id}
            </p>
            <p>
              <strong>Location:</strong> {donation.location}
            </p>
            <p>
              <strong>Date:</strong> {new Date(donation.donation_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Component:</strong> {donation.component}
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">Close</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonationConfirmationDialog; 