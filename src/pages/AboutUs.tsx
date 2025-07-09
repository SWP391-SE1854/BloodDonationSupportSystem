import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Target, Award, BarChart, Globe, UserCheck, Calendar, Linkedin } from "lucide-react";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import Footer from '@/components/Footer';
import { useAuth } from "@/contexts/AuthContext";
import NavigationBar from "@/components/NavigationBar";
import { useState } from "react";

const teamMembers = [
  {
    name: "Dr. Sarah Johnson",
    role: "Medical Director",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    description: "Leading our medical initiatives with 15+ years of experience in transfusion medicine.",
    quote: "Every drop donated is a life saved. Our mission is deeply personal to me.",
    linkedin: "https://linkedin.com/in/sarahjohnson"
  },
  {
    name: "Michael Chen",
    role: "Operations Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    description: "Ensuring smooth operations and coordination between blood banks and hospitals.",
    quote: "Behind every successful donation is a team working tirelessly for hope.",
    linkedin: "https://linkedin.com/in/michaelchen"
  },
  {
    name: "Dr. Emily Wilson",
    role: "Research Head",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    description: "Spearheading research initiatives in blood banking and donation technologies.",
    quote: "Innovation in blood care means more lives touched, more families helped.",
    linkedin: "https://linkedin.com/in/emilywilson"
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      <NavigationBar />

      {/* Hero Section */}
      <section
        className="relative py-20 px-4 flex items-center justify-center min-h-[400px]"
        style={{
          backgroundImage: `url('https://www.aamc.org/sites/default/files/styles/scale_and_crop_1200_x_666/public/Workforce%20Report%201200x666.jpg?itok=wkKO8t-E')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-label="Blood Care Hero Section"
      >
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" aria-hidden="true" />
        <div className="relative z-10 max-w-6xl mx-auto text-center flex flex-col items-center justify-center w-full">
          <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}>
            Our Mission to Save Lives
          </h1>
          <p className="text-xl text-gray-100 mb-12 max-w-3xl mx-auto drop-shadow-md" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
            Blood Care is dedicated to connecting blood donors with those in need, making the process of blood donation more accessible and efficient than ever before.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
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
              <div className="w-full h-96 bg-gradient-to-br from-red-100 to-pink-200 rounded-3xl flex items-center justify-center overflow-hidden shadow-lg">
                <img
                  src="https://media.istockphoto.com/id/1415405974/photo/blood-donor-at-donation-with-bouncy-ball-holding-in-hand.jpg?s=612x612&w=0&k=20&c=j0nkmkJxIP6U6TsI3yTq8iuc0Ufhq6xoW4FSMlKaG6A="
                  alt="Blood donor at donation with bouncy ball holding in hand. Photo by istockphoto."
                  className="object-cover w-full h-full opacity-90"
                  style={{ borderRadius: '1.5rem' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Story Section */}
      <section className="py-16 bg-gradient-to-br from-pink-100 to-red-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">A Life Saved: Real Stories</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400"
              alt="Priya, a grateful recipient, smiling with her son."
              className="rounded-full w-40 h-40 object-cover border-4 border-red-200 shadow-lg"
            />
            <blockquote className="text-lg text-gray-700 italic">
              “When my son needed blood urgently, Blood Care connected us with a donor in minutes. Their compassion and speed saved his life.”
              <br />
              <span className="block mt-4 font-semibold text-red-500">— Priya, Mother & Advocate</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Stats Section with animated numbers */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedStat key={index} icon={stat.icon} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with interactive cards */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl focus-within:ring-2 focus-within:ring-red-400 cursor-pointer border border-gray-100 rounded-xl bg-white shadow-md ${expandedIndex === index ? 'ring-2 ring-red-400' : ''}`}
                tabIndex={0}
                aria-label={`Learn more about ${member.name}`}
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                onKeyDown={e => { if (e.key === 'Enter') setExpandedIndex(expandedIndex === index ? null : index); }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={`Portrait of ${member.name}, ${member.role}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{member.name}</h3>
                  <p className="text-red-500 mb-3">{member.role}</p>
                  <p className="text-gray-600 mb-2">{member.description}</p>
                  {expandedIndex === index && (
                    <div className="mt-4 border-t pt-4">
                      <blockquote className="italic text-gray-700 mb-2">“{member.quote}”</blockquote>
                      <div className="flex gap-2 mt-2 justify-center">
                        <a href={member.linkedin} aria-label={`LinkedIn profile of ${member.name}`} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="text-blue-700 hover:text-blue-900" />
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;

// AnimatedStat component for animated numbers
import { useEffect, useRef, useState as useReactState } from 'react';
function AnimatedStat({ icon: Icon, value, label }: { icon: any, value: string, label: string }) {
  const [displayValue, setDisplayValue] = useReactState('0');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/\D/g, ''));
    if (isNaN(end)) {
      setDisplayValue(value);
      return;
    }
    let current = start;
    const duration = 1200;
    const step = Math.max(1, Math.floor(end / 60));
    let startTime: number | null = null;
    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const progress = ts - startTime;
      current = Math.min(end, Math.floor((progress / duration) * end));
      setDisplayValue(current.toLocaleString());
      if (progress < duration && current < end) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end.toLocaleString() + '+');
      }
    }
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [value]);
  return (
    <div ref={ref} className="text-center group">
      <div className="flex justify-center mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <div
        className="text-3xl font-bold mb-2 text-white group-hover:animate-bounce-in-line focus-within:animate-bounce-in-line transition-colors duration-200"
        style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
        tabIndex={-1}
        aria-label={displayValue}
      >
        {displayValue}
      </div>
      <div className="text-red-100 font-medium">{label}</div>
    </div>
  );
}

// Add the bounce animation to the page
<style>{`
@keyframes bounce-in-line {
  0%, 100% { transform: translateY(0); }
  20% { transform: translateY(-18%); }
  40% { transform: translateY(0); }
  60% { transform: translateY(-10%); }
  80% { transform: translateY(0); }
}
.animate-bounce-in-line {
  animation: bounce-in-line 0.7s cubic-bezier(.68,-0.55,.27,1.55);
}
`}</style> 