import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Droplets, Calendar, MapPin, History } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface BloodDonationThankYouProps {
  donorName: string;
  usageDate: Date;
  hospitalName?: string;
  location?: string;
  bloodType?: string;
  donationAmount?: string;
  onViewHistory?: () => void;
  showAnimation?: boolean;
}

export const BloodDonationThankYou: React.FC<BloodDonationThankYouProps> = ({
  donorName,
  usageDate,
  hospitalName,
  location,
  bloodType,
  donationAmount = "350ml",
  onViewHistory,
  showAnimation = true
}) => {
  const motivationalQuotes = [
    "Một giọt máu có thể cứu ba mạng sống.",
    "Bạn là anh hùng trong câu chuyện của ai đó.",
    "Sự tử tế của bạn đã thay đổi cuộc đời của một người.",
    "Máu của bạn là món quà quý giá nhất.",
    "Cảm ơn bạn đã chia sẻ sự sống."
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className={`w-full max-w-md mx-auto ${showAnimation ? 'animate-in fade-in duration-500' : ''}`}>
      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <Heart className="h-12 w-12 text-red-500 animate-pulse" />
              <Droplets className="h-6 w-6 text-red-400 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            💖 Cảm ơn bạn, {donorName}!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Main Message */}
          <div className="text-center space-y-2">
            <p className="text-gray-700 text-lg font-medium">
              Máu hiến của bạn vừa được sử dụng để cứu người!
            </p>
            <p className="text-gray-600">
              Chúng tôi thực sự trân trọng sự đóng góp cứu người của bạn.
            </p>
          </div>

          {/* Usage Details */}
          <div className="bg-white/60 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-red-500" />
              <span>
                <strong>Ngày sử dụng:</strong> {format(usageDate, "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
              </span>
            </div>

            {hospitalName && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>
                  <strong>Bệnh viện:</strong> {hospitalName}
                </span>
              </div>
            )}

            {location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>
                  <strong>Địa điểm:</strong> {location}
                </span>
              </div>
            )}

            {bloodType && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Droplets className="h-4 w-4 text-red-500" />
                <span>
                  <strong>Nhóm máu:</strong> {bloodType}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Droplets className="h-4 w-4 text-red-500" />
              <span>
                <strong>Lượng máu:</strong> {donationAmount}
              </span>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-3 border-l-4 border-red-400">
            <p className="text-gray-700 text-sm italic text-center">
              "{randomQuote}"
            </p>
          </div>

          {/* Impact Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              🏥 Đã cứu được một mạng sống
            </Badge>
          </div>

          {/* Action Button */}
          {onViewHistory && (
            <div className="flex justify-center pt-2">
              <Button 
                onClick={onViewHistory}
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors"
              >
                <History className="h-4 w-4 mr-2" />
                Xem lịch sử hiến máu
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Info Card */}
      <Card className="mt-4 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-blue-800 text-sm">
              💡 Bạn có biết?
            </h4>
            <p className="text-blue-700 text-xs">
              Mỗi năm, Việt Nam cần khoảng 1.8 triệu đơn vị máu để điều trị cho bệnh nhân. 
              Sự đóng góp của bạn thực sự có ý nghĩa!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Variant with different themes
export const BloodDonationThankYouGreen: React.FC<BloodDonationThankYouProps> = (props) => {
  return (
    <div className={`w-full max-w-md mx-auto ${props.showAnimation ? 'animate-in fade-in duration-500' : ''}`}>
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <Heart className="h-12 w-12 text-green-500 animate-pulse" />
              <Droplets className="h-6 w-6 text-green-400 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            💚 Cảm ơn bạn, {props.donorName}!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-gray-700 text-lg font-medium">
              Máu hiến của bạn vừa được sử dụng để cứu người!
            </p>
            <p className="text-gray-600">
              Chúng tôi thực sự trân trọng sự đóng góp cứu người của bạn.
            </p>
          </div>

          <div className="bg-white/60 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-green-500" />
              <span>
                <strong>Ngày sử dụng:</strong> {format(props.usageDate, "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
              </span>
            </div>

            {props.hospitalName && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-green-500" />
                <span>
                  <strong>Bệnh viện:</strong> {props.hospitalName}
                </span>
              </div>
            )}

            {props.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-green-500" />
                <span>
                  <strong>Địa điểm:</strong> {props.location}
                </span>
              </div>
            )}

            {props.bloodType && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Droplets className="h-4 w-4 text-green-500" />
                <span>
                  <strong>Nhóm máu:</strong> {props.bloodType}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Droplets className="h-4 w-4 text-green-500" />
              <span>
                <strong>Lượng máu:</strong> {props.donationAmount}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3 border-l-4 border-green-400">
            <p className="text-gray-700 text-sm italic text-center">
              "Một giọt máu có thể cứu ba mạng sống."
            </p>
          </div>

          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              🏥 Đã cứu được một mạng sống
            </Badge>
          </div>

          {props.onViewHistory && (
            <div className="flex justify-center pt-2">
              <Button 
                onClick={props.onViewHistory}
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-colors"
              >
                <History className="h-4 w-4 mr-2" />
                Xem lịch sử hiến máu
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-blue-800 text-sm">
              💡 Bạn có biết?
            </h4>
            <p className="text-blue-700 text-xs">
              Mỗi năm, Việt Nam cần khoảng 1.8 triệu đơn vị máu để điều trị cho bệnh nhân. 
              Sự đóng góp của bạn thực sự có ý nghĩa!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodDonationThankYou; 