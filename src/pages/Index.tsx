import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, MapPin, Phone, Mail, Clock, Menu, X } from "lucide-react";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import NavigationBar from "@/components/NavigationBar";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50">
      <NavigationBar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://media.istockphoto.com/id/1415405974/photo/blood-donor-at-donation-with-bouncy-ball-holding-in-hand.jpg?s=612x612&w=0&k=20&c=j0nkmkJxIP6U6TsI3yTq8iuc0Ufhq6xoW4FSMlKaG6A=" 
            alt="Healthcare professional and blood donor during donation process, showing trust and care in medical setting" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-8">
              <span className="block animate-fade-in-up">EVERY</span>
              <span className="block text-red-400 animate-bounce-in">DROP</span>
              <span className="block animate-fade-in-up">COUNTS</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
              Join our life-saving community and make a difference. Every donation can save up to three lives.
              Be a hero today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animation-delay-500">
              <Link to="/register">
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                  size="lg"
                >
                  Join Now
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  variant="outline" 
                  className="border-2 border-white hover:text-gray-900 px-10 py-4 text-xl font-medium transition-all duration-300 transform hover:scale-105"
                  size="lg"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              How Blood Care Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to make a life-changing difference in someone's life
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Register</h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up and become part of our life-saving community. Quick and easy registration process.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MapPin className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Find Donors</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with nearby donors when you need blood. Real-time matching and notifications.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Save Lives</h3>
              <p className="text-gray-600 leading-relaxed">
                Make a difference by donating blood and saving lives. Track your impact and donation history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              We're Here to Help
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              24/7 support for all your blood donation needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors duration-300">
                <Phone className="h-8 w-8 text-red-500" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">Emergency Hotline</h4>
              <p className="text-gray-600 text-lg">+1 (555) 123-4567</p>
              <p className="text-sm text-gray-500 mt-2">Available 24/7</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors duration-300">
                <Mail className="h-8 w-8 text-red-500" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">Email Support</h4>
              <p className="text-gray-600 text-lg">help@bloodcare.org</p>
              <p className="text-sm text-gray-500 mt-2">Quick response guaranteed</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors duration-300">
                <Clock className="h-8 w-8 text-red-500" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">24/7 Support</h4>
              <p className="text-gray-600 text-lg">Always available</p>
              <p className="text-sm text-gray-500 mt-2">Round the clock assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-2 bg-red-500 rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold">Blood Care</span>
            </div>
            <p className="text-gray-400 text-lg mb-6">
              Every drop counts - Join our life-saving community
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <Link to="/about" className="hover:text-white transition-colors duration-300">About Us</Link>
              <Link to="/blog" className="hover:text-white transition-colors duration-300">Blog</Link>
              <Link to="/blood-request" className="hover:text-white transition-colors duration-300">Blood Request</Link>
              <Link to="/register" className="hover:text-white transition-colors duration-300">Register</Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500">
              <p>&copy; 2024 Blood Care. All rights reserved. Making a difference, one donation at a time.</p>
            </div>
          </div>
        </div>
      </footer>

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
