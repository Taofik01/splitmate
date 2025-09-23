'use client'
import React from 'react';
import { useEffect  } from 'react';
import  {
    Users,
    Menu,
    X,
} from 'lucide-react'
import Link from 'next/link';

export default function Navbar () {

  

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
      const [isScrolled, setIsScrolled] = React.useState(false);

       useEffect(() => {
          const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
          }
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
          
        }, [])

          const toggleMobileMenu = () => {
   setIsMobileMenuOpen(!isMobileMenuOpen);
  }
     const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'about', href: '#about' },
    { name: 'Contact', href: '#contact' }, 
  ];



    return (
         <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auo px-4 sm:px-6 lg:px8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">SplitMate</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href="{item.href}"
                    className="text-gray-700 hover:text-blue-600px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-blue-50  rounded-lg">
                    {item.name}

                  </a>
                ))}
                <Link href='/signin' className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform-hover:scale-105 transition-all duratio-200 duration-200">
                  Sign In
                </Link>
              </div>

            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={toggleMobileMenu} className="inline-flex item-center justify-center p-2 text-gray-700 p-2 rounded-lg hover:text-blue-600 hover:bg-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {
                    isMobileMenuOpen ? ( <X className="w-6 h-6" /> ): (<Menu className="w-6 h-6" />
                  )}

                </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-gray-200 shadow-lg animate-slide-down">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 "
                  onClick={() => setIsMobileMenuOpen(false)}
                  >
                  {item.name}
                  </a>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  Sign In
                </button>

              </div>
            </div>
          </div>
        )}

      </nav>
    )
}

//day 1 of being a clown 
//day 2 of peak fooling