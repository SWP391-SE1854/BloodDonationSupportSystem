import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, MapPin, Phone, Mail, Clock, ThumbsUp, Award, Quote, ChevronDown, Facebook, Twitter, Instagram } from "lucide-react";
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
            <span className="block">EVERY <span className="text-red-400 animate-bounce-in">DROP</span> COUNTS</span>
          </h1>
          <p className="text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-light animate-fade-in-up animation-delay-300">
            Join our life-saving community. Every donation can save up to three lives. Be a hero today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-500">
            <Link to="/register">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-bold shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105" size="lg">
                Register Now
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-2 border-white text-black hover:text-red-600 px-8 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Register</h3>
              <p className="text-gray-600 leading-relaxed">Sign up and become part of our life-saving community. Quick and easy registration process.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MapPin className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Find Donors</h3>
              <p className="text-gray-600 leading-relaxed">Connect with nearby donors when you need blood. Real-time matching and notifications.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Save Lives</h3>
              <p className="text-gray-600 leading-relaxed">Make a difference by donating blood and saving lives. Track your impact and donation history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <ThumbsUp className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
              <span className="text-4xl font-bold text-gray-800">12,345</span>
              <span className="text-lg text-gray-600">Donations Made</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-red-500 mb-4 animate-bounce animation-delay-300" />
              <span className="text-4xl font-bold text-gray-800">8,900</span>
              <span className="text-lg text-gray-600">Lives Saved</span>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="h-12 w-12 text-red-500 mb-4 animate-bounce animation-delay-500" />
              <span className="text-4xl font-bold text-gray-800">2,100</span>
              <span className="text-lg text-gray-600">Active Donors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">What Our Donors Say</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[1,2,3].map((i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl shadow-lg p-8 flex flex-col items-center animate-fade-in-up transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-red-50"
              >
                <Quote className="h-8 w-8 text-red-400 mb-4" />
                <p className="text-lg text-gray-700 italic mb-4">“{i === 1 ? 'Donating blood was suprisingly easy and it was a really rewarding experience!' 
                : i === 2 ? 'I needed blood urgently and this community genuinely saved my life. I can\'t thank them enough.' 
                : 'The staffs made the process really enjoyable and I would definitely donate again.'}”</p>
                <span className="font-semibold text-gray-800">{i === 1 ? 'Alex N.' : i === 2 ? 'Maria P.' : 'John D.'}</span>
                <span className="text-sm text-gray-500">{i === 1 ? 'Donor' : i === 2 ? 'Recipient' : 'Donor'}</span> 
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-red-100 to-pink-50 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Ready to Make a Difference?</h2>
        <p className="text-lg text-gray-600 mb-8">Register now or log in to join our community of heroes.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/register">
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-bold shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105" size="lg">
              Register
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105" size="lg">
              Login
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Who can donate blood?</h3>
              <p className="text-gray-600">Most healthy adults can donate blood. There are some eligibility requirements regarding age, weight, and health status.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">How often can I donate?</h3>
              <p className="text-gray-600">You can typically donate whole blood every 56 days. Other types of donations may have different intervals.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Is blood donation safe?</h3>
              <p className="text-gray-600">Yes! Blood donation is a safe process. All equipment is sterile and used only once.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">What should I do before donating?</h3>
              <p className="text-gray-600">Eat a healthy meal, drink plenty of water, and bring a photo ID. Avoid strenuous activity before and after donating.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
              Every drop counts - Join our life-saving community
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400 mb-6">
              <Link to="/about" className="hover:text-white transition-colors duration-300">About Us</Link>
              <Link to="/blog" className="hover:text-white transition-colors duration-300">Blog</Link>
              <Link to="/register" className="hover:text-white transition-colors duration-300">Register</Link>
            </div>
            <div className="flex justify-center space-x-4 mb-8">
              <a href="#" className="hover:text-red-400"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="hover:text-red-400"><Twitter className="h-6 w-6" /></a>
              <a href="#" className="hover:text-red-400"><Instagram className="h-6 w-6" /></a>
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
