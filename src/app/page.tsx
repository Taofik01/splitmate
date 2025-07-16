'use client';
// This file is a placeholder for the home page of the application.
// It currently does not render any content but can be expanded in the future.
// You can add components, styles, or any other elements as needed.
// This is a client-side component, as indicated by the 'use client' directive.
// The 'use client' directive allows this component to be rendered on the client side.
import React from "react";
import { 
  Users, 
  ArrowRight,
  CheckCircle,
  Smartphone,
  DollarSign,
  Heart,
  Star,
  Play,

 
} from "lucide-react"
import Navbar from '../component/navbar';




export default function Home() {

 
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 ">
      {/* Navigation Bar */}
     
        <Navbar />
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto ">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left mb-12 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
                Split bills
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                Track easily.                                                                                                                              
              </span>
              <br />
              Stay Friends.

              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.2s'}}>
                The simplest way to split expenses with roomates, friends, or travel groups.
                No more awkward money conversations, just clear and easy tracking., 
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.4s'}}>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group">
                  Create Group
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 duration-200" />
                </button>
                <button className="bg-white text-gray-700 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo

                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-cente justify-center lg:justify-start space-x-8 animate-fade-in-up" style={{ animationDelay: '0.6s'}}>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4 ].map((_, index) => (
                      <div key={index} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white flex items-center justify-center">
                        <span className="text-white text-us font-semibold">
                          U
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="ml-3 text-sm text-gray-600 ">
                    10+ users  
                  </span>
              </div>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <Star key={index} className="w-5 h-5 fill-current" />
                  ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">4.8/5 rating</span>
              </div>
            </div>

          </div>

          {/* Hero Illustration */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative mx-auto max-w-md lg:max-w-lg">
                  {/* Phone mockup */}
                  <div className="relative z-10 bg-white rounded3xl shadow-2xl p-6 transform rotate-6 hover:rotate-3 transition-transform duration-500">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4">
                      {/* Mock app header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-gray-800">House Expense</span>
                        </div>
                        <span className="text-sm text-gray-600">4 members</span>
                      </div>

                      {/* Mock Balance */}
                      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                        <div className="text-center">
                          <p className="text-gray-600 text-sm">You are owed</p>
                          <p className="text-2xl font-bold text-green-600">+$127.50</p>
                        </div>
                      </div>

                      {/* Mock Expenses */}
                      <div className="space-y-2">
                        {[
                          { name: 'Groceries', amount : '$85.50', user: 'Sarah'},    
                          { name: 'Utilities', amount : '$120.00', user: 'Mike'},    
                          { name: 'Internet', amount : '$60.00', user: 'You'}    
                        ].map((expense, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{expense.name}</p>
                              <p className=" text-gray-600 text-xs">by {expense.user}</p>
                            </div>
                            </div>
                            <span className="font-semibold text-gray-800">{expense.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                  {/* Background decoration */}
                  <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-br from-blue-200 to-pink-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s'}}></div>


                  {/* Floatings elements  */}
                  <div className="absolute top-12 -left-4 bg-white rounded-full p-3 shadow-lg animate-float">
                        <DollarSign  className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="absolute bottom-12 -right-4 bg-white rounded-full p-3 shadow-lg animate-float " style={{ animationDelay: '0.5s'}}>
                    <Heart className="w-6 h-6 text-red-500"   />

                  </div>
            </div>

          </div>
          </div>

        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto">
                          <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why SplitMate?</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                              Built for real-life situations. No math, no awkwardness, no lost friendship
                            </p>
                          </div>

                          <div className="grid md:grid-cols-3 gap-8">
                            {[
                              {
                                icon: <Smartphone className="w-8 h-8 text-blue-500" />,
                                title: "Mobile First",
                                description: "Add expense on the go. Works perfectly on your phone."
                              },
                              {
                                icon: <CheckCircle className="w-8 h-8 text-green-500" />,
                                title: "Smart splitting",
                                description: "Automatically calculates who owes what, No mental math required."
                              },
                              {
                                icon: <Heart className="w-8 h-8 text-red-500" />,
                                title: "Friendship first",
                                description: "Built to help you maintain healthy relationships, not to create new conflicts."
                              }
                            ].map((feature, index) => (
                              <div key={index} className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-4">
                                    {feature.icon}
                                  </div>
                                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                  <p className="text-gray-600 ">{feature.description}</p>
                              </div>
                            ))}
                          </div>

                        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to split your first expense?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of Users who&#39;ve made money management effortless
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center group">
              Start Splitting Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"/>
            </button>
        </div>
      </section>

      
      {/* Footer */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold">SplitMate</span>
                </div>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed max-w-md">
                  The simplest way to split expenses with friends, roommates, and travel groups. 
                  No more awkward money conversations or complicated calculations.
                </p>
                
                {/* Social Links */}
                <div className="flex space-x-4">
                  {[
                    { icon: '𝕏', name: 'Twitter', href: '#' },
                    { icon: '𝑓', name: 'Facebook', href: '#' },
                    { icon: 'in', name: 'LinkedIn', href: '#' },
                    { icon: '📷', name: 'Instagram', href: '#' }
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                      aria-label={social.name}
                    >
                      <span className="text-xl font-bold">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Product
                </h3>
                <ul className="space-y-4">
                  {[
                    { name: 'Features', href: '#features' },
                    { name: 'How it Works', href: '#how-it-works' },
                    { name: 'Pricing', href: '#pricing' },
                    { name: 'Mobile App', href: '#mobile' },
                    { name: 'Integrations', href: '#integrations' },
                    { name: 'API', href: '#api' }
                  ].map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline decoration-blue-500 underline-offset-4"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Company
                </h3>
                <ul className="space-y-4">
                  {[
                    { name: 'About Us', href: '#about' },
                    { name: 'Careers', href: '#careers', badge: 'We\'re hiring!' },
                    { name: 'Press', href: '#press' },
                    { name: 'Blog', href: '#blog' },
                    { name: 'Contact', href: '#contact' },
                    { name: 'Partners', href: '#partners' }
                  ].map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline decoration-purple-500 underline-offset-4 inline-flex items-center"
                      >
                        {link.name}
                        {link.badge && (
                          <span className="ml-2 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full animate-pulse">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="py-12 border-t border-gray-800">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Stay in the loop</h3>
              <p className="text-gray-300 mb-8">
                Get the latest updates, tips, and exclusive offers delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          </div>
          
</footer>



    <style jsx>
      {`
      @keyframes fadeInUp{
      from {
        opacity: 0;
        transform: translateY(30px);
        }
        to {
        opacity: 1;
        transform: translateY(0);
      }
      }

      @keyframes slideDown {
        from {
        opacity: 0;
        transform: translateY(-10px)
        }
        to {
        opacity: 1;
        transform: translateY(0);
      }
      }

      @keyframes float {
        0%, 100% {
        transform: translateY(0px);
        } 50% {
         transform: translateY(-10px)
        }
      }

      .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
      opacity: 0
      }
      .animate-slide-down {
        animation: slideDown 0.3s ease-out forwards;
      }
        .animate-float {
        animation: float 3s ease-in-out infinte
        }
      `}
    </style>

    </div>
  );
};
