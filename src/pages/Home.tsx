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
              Save Lives Through <span className="text-red-500">Blood Donation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community of blood donors and help save lives. Every drop counts in making a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
                      Become a Donor
                    </Button>
                  </Link>
                  <Link to="/blood-request">
                    <Button size="lg" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                      Request Blood
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/blood-request">
                  <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
                    Request Blood
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
          <h2 className="text-3xl font-bold text-center mb-12">Why Donate Blood?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-pink-50">
              <Heart className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save Lives</h3>
              <p className="text-gray-600">
                One donation can save up to three lives. Your blood can help patients in emergency situations.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-pink-50">
              <Users className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Join Community</h3>
              <p className="text-gray-600">
                Become part of a community dedicated to helping others and making a difference.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-pink-50">
              <Droplet className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Regular Need</h3>
              <p className="text-gray-600">
                Blood is needed every two seconds. Regular donations ensure a stable blood supply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Register</h3>
              <p className="text-gray-600">Create your account and complete your profile</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Find Matches</h3>
              <p className="text-gray-600">Search for blood requests matching your type</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Donate</h3>
              <p className="text-gray-600">Visit the nearest blood bank to donate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="text-xl font-semibold mb-2">Track Impact</h3>
              <p className="text-gray-600">Monitor your donation history and impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-4">
              <Phone className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-600">+1 234 567 890</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Mail className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">contact@bloodcare.com</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <MapPin className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-gray-600">123 Blood Care Street, City</p>
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
              <span className="text-2xl font-bold">Blood Care</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 Blood Care. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 