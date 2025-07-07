import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface NavigationBarProps {
  fixed?: boolean;
}

const navLinks = [
  { to: "/", label: "Home", aria: "Go to home page" },
  { to: "/blog", label: "Blog", aria: "Go to blog page" },
  { to: "/about", label: "About Us", aria: "Go to about us page" },
];

const NavigationBar = ({ fixed = false }: NavigationBarProps) => {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navClass = fixed
    ? "fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50"
    : "bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50";

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors duration-300">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <span className="text-2xl font-bold text-gray-800 group-hover:text-red-500 transition-colors duration-300">
              Blood Care
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-gray-700 hover:text-red-500 transition-colors duration-300 font-medium${location.pathname === link.to ? " text-red-500" : ""}`}
                aria-label={link.aria}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <>
                <Link to="/register">
                  <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Register Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium px-6 py-2 transition-all duration-300">
                    Login
                  </Button>
                </Link>
              </>
            ) : (
              <UserProfileDropdown />
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-red-500 hover:bg-red-50 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-gray-700 hover:text-red-500 transition-colors duration-300 font-medium px-4 py-2${location.pathname === link.to ? " text-red-500" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated ? (
                <div className="flex flex-col space-y-2 px-4">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2">
                      Register Now
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium py-2">
                      Login
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="px-4">
                  <UserProfileDropdown />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar; 