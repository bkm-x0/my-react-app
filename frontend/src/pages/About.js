import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Users, Globe, Award, Cpu, Target } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We push the boundaries of technology to create cutting-edge solutions for tomorrow.'
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: 'Every product is tested and verified to ensure the highest quality standards.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We build thriving communities where users can connect and share experiences.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Serving customers across 50+ countries with dedicated support teams.'
    }
  ];

  const team = [
    {
      name: 'Dr. Alex Chen',
      role: 'Founder & CEO',
      expertise: 'Cybernetic Systems',
      image: '👨‍💼'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      expertise: 'AI & Neural Networks',
      image: '👩‍💼'
    },
    {
      name: 'Marcus Williams',
      role: 'Head of Product',
      expertise: 'Hardware Engineering',
      image: '👨‍💼'
    },
    {
      name: 'Elena Rodriguez',
      role: 'CFO',
      expertise: 'Strategic Growth',
      image: '👩‍💼'
    }
  ];

  const milestones = [
    { year: '2020', event: 'Founded CyberStore with vision to revolutionize tech retail' },
    { year: '2021', event: 'Launched first neural interface product line' },
    { year: '2022', event: 'Expanded to 25+ countries and reached 50K users' },
    { year: '2023', event: 'Introduced quantum hardware division' },
    { year: '2024', event: 'Hit 500+ premium products and 100K active users' },
    { year: '2025', event: 'Expanded to 50+ countries with 10K+ daily active users' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-cyber-muted-blue/30">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-muted-pink/10 via-transparent to-cyber-muted-blue/10"></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 leading-tight">
              <span className="text-cyber-muted-blue">ABOUT</span>
              <span className="text-cyber-muted-pink"> CYBERSTORE</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 font-rajdhani">
              We're on a mission to make cutting-edge technology accessible to everyone, 
              enabling people to enhance their capabilities and shape the future.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Mission */}
            <div className="cyber-card">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-cyber-muted-pink mr-3" />
                <h2 className="text-3xl font-orbitron font-bold text-cyber-muted-pink">OUR MISSION</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                To democratize access to advanced cybernetic technology, making it affordable and available to everyone who wants to enhance their human potential.
              </p>
              <p className="text-gray-400">
                We believe the future is not limited to mega-corporations. Every individual deserves the opportunity to upgrade their capabilities and reach their full potential.
              </p>
            </div>

            {/* Vision */}
            <div className="cyber-card">
              <div className="flex items-center mb-6">
                <Cpu className="h-8 w-8 text-cyber-muted-blue mr-3" />
                <h2 className="text-3xl font-orbitron font-bold text-cyber-muted-blue">OUR VISION</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                A world where technology and humanity merge seamlessly, creating a society of enhanced individuals pursuing their dreams.
              </p>
              <p className="text-gray-400">
                We envision a future where cybernetic enhancements are not just tools, but extensions of human consciousness and capability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-cyber-dark/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold mb-4">
              <span className="text-cyber-muted-blue">OUR</span>
              <span className="text-cyber-muted-pink"> VALUES</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="cyber-card text-center">
                  <div className="flex justify-center mb-6">
                    <Icon className="h-12 w-12 text-cyber-muted-pink" />
                  </div>
                  <h3 className="text-xl font-orbitron font-bold mb-3 text-cyber-muted-blue">
                    {value.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold mb-4">
              <span className="text-cyber-muted-blue">OUR</span>
              <span className="text-cyber-muted-pink"> JOURNEY</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-lg border border-cyber-muted-blue flex items-center justify-center bg-cyber-dark">
                    <span className="font-orbitron font-bold text-cyber-muted-pink">{milestone.year}</span>
                  </div>
                  {index !== milestones.length - 1 && (
                    <div className="absolute top-20 left-1/2 w-1 h-8 bg-gradient-to-b from-cyber-muted-blue to-transparent"></div>
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <div className="cyber-card">
                    <p className="text-gray-300">{milestone.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-cyber-dark/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold mb-4">
              <span className="text-cyber-muted-blue">OUR</span>
              <span className="text-cyber-muted-pink"> LEADERSHIP</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="cyber-card text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-orbitron font-bold mb-2 text-cyber-muted-blue">
                  {member.name}
                </h3>
                <p className="text-cyber-muted-pink font-semibold mb-2">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 border-t border-cyber-muted-blue/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-orbitron font-bold text-cyber-muted-pink mb-2">500+</div>
              <div className="text-gray-400 font-rajdhani">Premium Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-orbitron font-bold text-cyber-muted-blue mb-2">10K+</div>
              <div className="text-gray-400 font-rajdhani">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-orbitron font-bold text-cyber-muted-green mb-2">50+</div>
              <div className="text-gray-400 font-rajdhani">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-orbitron font-bold text-cyber-muted-purple mb-2">24/7</div>
              <div className="text-gray-400 font-rajdhani">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-muted-blue/10 via-cyber-muted-purple/10 to-cyber-muted-pink/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="cyber-card bg-cyber-dark/80 backdrop-blur-sm">
              <h2 className="text-4xl font-orbitron font-bold mb-6">
                <span className="text-cyber-muted-blue">JOIN OUR</span>
                <span className="text-cyber-muted-pink"> COMMUNITY</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Be part of the revolution. Discover how CyberStore can enhance your capabilities today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="cyber-button text-lg py-4 px-8 flex items-center justify-center">
                  EXPLORE PRODUCTS
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/contact" className="cyber-button cyber-button-secondary text-lg py-4 px-8">
                  GET IN TOUCH
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated grid overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>
    </div>
  );
};

export default About;
