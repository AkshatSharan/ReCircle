import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, RefreshCw, Camera, Award, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';

export default function HomePage() {
  const features = [
    {
      icon: RefreshCw,
      title: 'Reuse & Share',
      description: 'Find new homes for your unwanted items through our matching system',
    },
    {
      icon: Camera,
      title: 'Smart Scanner',
      description: 'Scan items to learn how to recycle or dispose of them properly',
    },
    {
      icon: Award,
      title: 'Green Score',
      description: 'Earn points for your sustainable actions and climb the leaderboard',
    },
    {
      icon: MapPin,
      title: 'Find Centers',
      description: 'Locate nearby donation and recycling centers in your area',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">

      <header className="bg-white shadow-sm p-3">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
 
            <div className="flex items-center">
              <Recycle className="text-green-600 mr-2" size={24} />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                ReCircle
              </span>
            </div>

 
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm px-3 py-2 sm:px-4"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="text-xs sm:text-sm px-3 py-2 sm:px-4"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Join</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>


      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Reduce. Reuse. <span className="text-green-600">ReCircle.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the sustainability revolution. Share items you no longer need,
            learn proper recycling practices, and make a positive impact on our planet.
          </p>
          <div className="space-x-4">
            <Link to="/register">
              <Button size="lg" className="px-8">Start Your Journey</Button>
            </Link>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </div>
      </section>

   
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How ReCircle Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform makes sustainable living simple and rewarding through
            innovative technology and community engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Making a Real Impact</h2>
            <p className="text-lg text-gray-600">Join thousands of users already making a difference</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">15K+</div>
              <p className="text-gray-600">Items Reused</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">8.2M</div>
              <p className="text-gray-600">Pounds Recycled</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">3.4K</div>
              <p className="text-gray-600">Active Users</p>
            </div>
          </div>
        </div>
      </section>

     
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Start your sustainable journey today. Every action counts toward
            a cleaner, greener future.
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8">
              Join ReCircle Now
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <Recycle className="mr-2" size={24} />
            <span className="text-xl font-bold">ReCircle</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 ReCircle. Built for Walmart's Sustainability Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}