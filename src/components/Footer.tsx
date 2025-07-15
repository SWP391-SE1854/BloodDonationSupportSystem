import { Link } from "react-router-dom";
import { Heart, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="p-2 bg-red-500 rounded-full">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <span className="text-3xl font-bold">Blood Care</span>
        </div>
        <p className="text-gray-400 text-lg mb-6">
          Mỗi giọt máu đều quý giá - Tham gia cộng đồng cứu người của chúng tôi
        </p>
        <div className="flex justify-center space-x-8 text-sm text-gray-400 mb-6">
          <Link to="/about" className="hover:text-white transition-colors duration-300">Về Chúng Tôi</Link>
          <Link to="/blog" className="hover:text-white transition-colors duration-300">Blog</Link>
          <Link to="/register" className="hover:text-white transition-colors duration-300">Đăng Ký</Link>
        </div>
        <div className="flex justify-center space-x-4 mb-8">
          <a href="#" className="hover:text-red-400"><Facebook className="h-6 w-6" /></a>
          <a href="#" className="hover:text-red-400"><Twitter className="h-6 w-6" /></a>
          <a href="#" className="hover:text-red-400"><Instagram className="h-6 w-6" /></a>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500">
          <p>&copy; 2024 Blood Care. Bảo lưu mọi quyền. Tạo nên sự khác biệt, mỗi lần một lần hiến.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 