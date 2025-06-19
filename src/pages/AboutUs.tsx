import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Target, Award, BarChart, Globe, UserCheck, Calendar } from "lucide-react";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";
import NavigationBar from "@/components/NavigationBar";

const teamMembers = [
  {
    name: "Dr. Sarah Johnson",
    role: "Medical Director",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    description: "Leading our medical initiatives with 15+ years of experience in transfusion medicine."
  },
  {
    name: "Michael Chen",
    role: "Operations Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    description: "Ensuring smooth operations and coordination between blood banks and hospitals."
  },
  {
    name: "Dr. Emily Wilson",
    role: "Research Head",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    description: "Spearheading research initiatives in blood banking and donation technologies."
  }
];

const stats = [
  {
    icon: UserCheck,
    value: "50,000+",
    label: "Registered Donors"
  },
  {
    icon: Calendar,
    value: "1,000+",
    label: "Monthly Donations"
  },
  {
    icon: Globe,
    value: "100+",
    label: "Partner Hospitals"
  },
  {
    icon: Award,
    value: "10+",
    label: "Years of Service"
  }
];

const AboutUs = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      <NavigationBar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Our Mission to Save Lives
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Blood Care is dedicated to connecting blood donors with those in need,
            making the process of blood donation more accessible and efficient than ever before.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg">
                Join Our Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Vision & Mission</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Target className="h-8 w-8 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Vision</h3>
                    <p className="text-gray-600">
                      To create a world where no life is lost due to lack of blood availability,
                      connecting donors and recipients seamlessly through technology.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Mission</h3>
                    <p className="text-gray-600">
                      To build and maintain a robust network of blood donors and healthcare
                      facilities, ensuring timely access to safe blood for all who need it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-red-100 to-pink-200 rounded-3xl flex items-center justify-center">
                <Heart className="h-32 w-32 text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-red-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-red-500 mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">Blood Care</span>
          </div>
          <p className="text-gray-400">
            Every drop counts - Join our life-saving community
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs; 