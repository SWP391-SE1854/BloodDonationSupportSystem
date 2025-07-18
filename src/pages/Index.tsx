import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, MapPin, Phone, Mail, Clock, ThumbsUp, Award, Quote, ChevronDown, Facebook, Twitter, Instagram } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import NavigationBar from "@/components/NavigationBar";
import Footer from '@/components/Footer';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 flex flex-col">
      <NavigationBar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80" 
            alt="Blood donation hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-lg">
            <span className="block">MỖI <span className="text-red-400 animate-bounce-in">GIỌT</span> MÁU ĐỀU QUÝ GIÁ</span>
          </h1>
          <p className="text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-light animate-fade-in-up animation-delay-300">
            Tham gia cộng đồng cứu sống của chúng tôi. Mỗi lần hiến máu có thể cứu tới ba mạng người. Hãy trở thành anh hùng hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-500">
            <Link to="/register">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-bold shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105" size="lg">
                Đăng ký ngay
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-2 border-white text-black hover:text-red-600 px-8 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105" size="lg">
                Đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">Cách Hoạt Động</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Đăng ký</h3>
              <p className="text-gray-600 leading-relaxed">Đăng ký và trở thành một phần của cộng đồng cứu sống. Quá trình đăng ký nhanh chóng và dễ dàng.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MapPin className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Tìm Người Hiến Máu</h3>
              <p className="text-gray-600 leading-relaxed">Kết nối với người hiến máu gần bạn khi cần thiết. Ghép nối và thông báo theo thời gian thực.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Cứu Sống</h3>
              <p className="text-gray-600 leading-relaxed">Tạo sự khác biệt bằng cách hiến máu và cứu sống người khác. Theo dõi tác động và lịch sử hiến máu của bạn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">Tác Động Của Chúng Tôi</h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <ThumbsUp className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
              <span className="text-4xl font-bold text-gray-800">12,345</span>
              <span className="text-lg text-gray-600">Lượt Hiến Máu</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-red-500 mb-4 animate-bounce animation-delay-300" />
              <span className="text-4xl font-bold text-gray-800">8,900</span>
              <span className="text-lg text-gray-600">Mạng Người Được Cứu</span>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="h-12 w-12 text-red-500 mb-4 animate-bounce animation-delay-500" />
              <span className="text-4xl font-bold text-gray-800">2,100</span>
              <span className="text-lg text-gray-600">Người Hiến Máu Đang Hoạt Động</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">Cảm Nhận Từ Người Hiến Máu</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[1,2,3].map((i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl shadow-lg p-8 flex flex-col items-center animate-fade-in-up transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-red-50"
              >
                <Quote className="h-8 w-8 text-red-400 mb-4" />
                <p className="text-lg text-gray-700 italic mb-4">“{i === 1 ? 'Hiến máu thật sự dễ dàng và là một trải nghiệm rất ý nghĩa!' 
                : i === 2 ? 'Tôi cần máu gấp và cộng đồng này thực sự đã cứu sống tôi. Tôi không biết cảm ơn thế nào cho đủ.' 
                : 'Nhân viên đã khiến quá trình hiến máu trở nên rất dễ chịu và tôi chắc chắn sẽ tiếp tục hiến máu.'}”</p>
                <span className="font-semibold text-gray-800">{i === 1 ? 'Alex N.' : i === 2 ? 'Maria P.' : 'John D.'}</span>
                <span className="text-sm text-gray-500">{i === 1 ? 'Người hiến máu' : i === 2 ? 'Người nhận máu' : 'Người hiến máu'}</span> 
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-red-100 to-pink-50 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Sẵn Sàng Tạo Sự Khác Biệt?</h2>
        <p className="text-lg text-gray-600 mb-8">Đăng ký ngay hoặc đăng nhập để tham gia cộng đồng anh hùng của chúng tôi.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/register">
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-bold shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105" size="lg">
              Đăng ký
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105" size="lg">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">Câu Hỏi Thường Gặp</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Ai có thể hiến máu?</h3>
              <p className="text-gray-600">Hầu hết người trưởng thành khỏe mạnh đều có thể hiến máu. Có một số yêu cầu về độ tuổi, cân nặng và tình trạng sức khỏe.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Bao lâu tôi có thể hiến máu một lần?</h3>
              <p className="text-gray-600">Thông thường bạn có thể hiến máu toàn phần mỗi 56 ngày. Các loại hiến máu khác có thể có khoảng cách khác nhau.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hiến máu có an toàn không?</h3>
              <p className="text-gray-600">Có! Hiến máu là một quy trình an toàn. Tất cả thiết bị đều vô trùng và chỉ sử dụng một lần.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Tôi nên làm gì trước khi hiến máu?</h3>
              <p className="text-gray-600">Hãy ăn uống đầy đủ, uống nhiều nước và mang theo giấy tờ tùy thân có ảnh. Tránh hoạt động gắng sức trước và sau khi hiến máu.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounce-in 1.2s ease-out forwards;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  );
};

export default Index;
