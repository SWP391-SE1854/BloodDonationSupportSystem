import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, MapPin, Phone, Mail, Clock, Droplet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Cứu người qua <span className="text-red-500">việc hiến máu</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Tham gia cộng đồng hiến máu của chúng tôi và giúp cứu sống nhiều người. Mỗi giọt máu đều tạo nên sự khác biệt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
                      Trở thành người hiến máu
                    </Button>
                  </Link>
                  <Link to="/blood-request">
                    <Button size="lg" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                      Yêu cầu máu
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/blood-request">
                  <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
                    Yêu cầu máu
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Tại sao nên hiến máu?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-pink-50">
              <Heart className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cứu sống mạng người</h3>
              <p className="text-gray-600">
                Một lần hiến máu có thể cứu sống đến ba người. Máu của bạn có thể giúp bệnh nhân trong các tình huống khẩn cấp.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-pink-50">
              <Users className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tham gia cộng đồng</h3>
              <p className="text-gray-600">
                Trở thành một phần của cộng đồng luôn sẵn sàng giúp đỡ người khác và tạo ra sự khác biệt.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-pink-50">
              <Droplet className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nhu cầu thường xuyên</h3>
              <p className="text-gray-600">
                Máu luôn cần thiết mỗi hai giây. Việc hiến máu thường xuyên đảm bảo nguồn cung cấp máu ổn định.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Quy trình hoạt động</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Đăng ký</h3>
              <p className="text-gray-600">Tạo tài khoản và hoàn thành hồ sơ của bạn</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Tìm kiếm</h3>
              <p className="text-gray-600">Tìm kiếm các yêu cầu máu phù hợp với nhóm máu của bạn</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Hiến máu</h3>
              <p className="text-gray-600">Đến ngân hàng máu gần nhất để hiến máu</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="text-xl font-semibold mb-2">Theo dõi</h3>
              <p className="text-gray-600">Theo dõi lịch sử hiến máu và tác động của bạn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Liên hệ chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-4">
              <Phone className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold">Điện thoại</h3>
                <p className="text-gray-600">+84 123 456 789</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Mail className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">lienhe@mauyeuthuong.com</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <MapPin className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold">Địa chỉ</h3>
                <p className="text-gray-600">123 Đường Máu Yêu Thương, Thành phố</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold">Máu Yêu Thương</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 Máu Yêu Thương. Đã đăng ký bản quyền.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 