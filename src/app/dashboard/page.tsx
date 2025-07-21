'use client'

import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Users, 
  Plus, 
  CreditCard, 
  User, 
  Bell, 
  Search,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  UserCheck,
  Receipt,
  Menu,
  X,
  CheckCircle,
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle
} from 'lucide-react';
 import { useRouter } from 'next/navigation';
 import { toast } from 'react-toastify';
 import { auth } from '@/app/firebase/config';
 import {signOut } from 'firebase/auth'
 import { useAuthState } from 'react-firebase-hooks/auth';


 interface Balance {
  id: number;
  group: string;
  member: string;
  amount: number;
  type: 'owe' | 'owed';
  avatar: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  currency: string;
  notifications: boolean;
}

 interface Group {
    id: number;
    name: string;
    members: number;
    totalSpent: number;
    yourBalance: number;
    color: string;
    icon: string;
    recentActivity: string;
  }

  interface User {
    displayName : string | null | undefined
  }

const ExpenseSplitterDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  

  


  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample data
  const groups = [
    {
      id: 1,
      name: 'Ibadan Trip',
      members: 5,
      totalSpent: 45000,
      yourBalance: -2000,
      color: 'from-blue-500 to-cyan-500',
      icon: '🏖️',
      recentActivity: 'Taofik added ₦4,000 for Uber'
    },
    {
      id: 2,
      name: 'Startup Team',
      members: 8,
      totalSpent: 120000,
      yourBalance: 5500,
      color: 'from-purple-500 to-pink-500',
      icon: '💼',
      recentActivity: 'Sarah paid ₦8,000 for lunch'
    },
    {
      id: 3,
      name: 'House Expenses',
      members: 4,
      totalSpent: 89000,
      yourBalance: -1200,
      color: 'from-green-500 to-emerald-500',
      icon: '🏠',
      recentActivity: 'Mike added ₦3,000 for utilities'
    },
    {
      id: 4,
      name: 'Weekend Getaway',
      members: 6,
      totalSpent: 32000,
      yourBalance: 800,
      color: 'from-orange-500 to-red-500',
      icon: '🎒',
      recentActivity: 'Alex settled ₦2,500'
    }
  ];

  const recentActivity = [
    { user: 'Taofik', action: 'added ₦4,000 for Uber', group: 'Ibadan Trip', time: '2 hours ago', avatar: '👨‍💼' },
    { user: 'Sarah', action: 'paid ₦8,000 for lunch', group: 'Startup Team', time: '4 hours ago', avatar: '👩‍💻' },
    { user: 'Mike', action: 'added ₦3,000 for utilities', group: 'House Expenses', time: '1 day ago', avatar: '👨‍🔧' },
    { user: 'Alex', action: 'settled ₦2,500', group: 'Weekend Getaway', time: '2 days ago', avatar: '👨‍🎨' }
  ];

   const balances: Balance[] = [
    { id: 1, group: 'Ibadan Trip', member: 'Taofik', amount: 2000, type: 'owe', avatar: '👨‍💼' },
    { id: 2, group: 'Startup Team', member: 'Sarah', amount: 5500, type: 'owed', avatar: '👩‍💻' },
    { id: 3, group: 'House Expenses', member: 'Mike', amount: 1200, type: 'owe', avatar: '👨‍🔧' },
    { id: 4, group: 'Weekend Getaway', member: 'Alex', amount: 800, type: 'owed', avatar: '👨‍🎨' }
  ];

  const userProfile: UserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'JD',
    currency: 'NGN',
    notifications: true
  };
 

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };


  const getBalanceColor = (balance: number): string => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };


  const getBalanceText = (balance: number): string => {
    if (balance > 0) return `You are owed ${formatCurrency(balance)}`;
    if (balance < 0) return `You owe ${formatCurrency(Math.abs(balance))}`;
    return 'You are settled up';
  };

  const handleNavigation = (page: string ) => {
    setCurrentPage(page);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const Sidebar = () => {
    const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-64';
    const sidebarPosition = isMobile ? 'fixed' : 'fixed';
    const sidebarTransform = isMobile && sidebarCollapsed ? '-translate-x-full' : 'translate-x-0';

    return (
      <>
        {/* Overlay backdrop when sidebar is open on mobile */}
        {isMobile && !sidebarCollapsed && (
          <div 
            className='inset-0 transparent  bg-opacity-50 z-40 absofixed' 
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
         {isMobile && sidebarCollapsed && (
  <button
    onClick={() => setSidebarCollapsed(false)}
    className="fixed top-4 left-4 z-40 p-2 bg-white rounded-md shadow"
  >
    <Menu className="w-5 h-5 text-gray-800" />
  </button>
)} 
        
        <div className={`${sidebarWidth} ${sidebarPosition} left-0 top-0 z-40 transition-all duration-300 transform ${sidebarTransform} bg-white border-r border-gray-200 h-screen`}>
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            {!sidebarCollapsed && <h1 className="text-2xl font-bold text-gray-800">SplitMate</h1>}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5 text-gray-600" /> : <X className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
          
          <nav className="mt-8">
            <div className={`${sidebarCollapsed ? 'px-1' : 'px-6'} space-y-4`}>
              <button 
                onClick={() => handleNavigation('dashboard')}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start space-x-3'} w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentPage === 'dashboard' 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={sidebarCollapsed ? 'Dashboard' : ''}
              >
                <Home className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">Dashboard</span>}
              </button>
              
              <button 
                onClick={() => handleNavigation('groups')}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start space-x-3'} w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentPage === 'groups' 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={sidebarCollapsed ? 'My Groups' : ''}
              >
                <Users className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">My Groups</span>}
              </button>
              
              <button 
                onClick={() => setShowAddExpenseModal(true)}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start space-x-3'} w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200`}
                title={sidebarCollapsed ? 'Add Expense' : ''}
              >
                <Plus className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">Add Expense</span>}
              </button>
              
              <button 
                onClick={() => handleNavigation('settle')}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start space-x-3'} w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentPage === 'settle' 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={sidebarCollapsed ? 'Settle Balance' : ''}
              >
                <CreditCard className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">Settle Balance</span>}
              </button>
              
              <button 
                onClick={() => handleNavigation('profile')}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start space-x-3'} w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentPage === 'profile' 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={sidebarCollapsed ? 'Profile' : ''}
              >
                <User className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">Profile</span>}
              </button>
            </div>
          </nav>
        </div>
      </>
    );
  };

 const TopNav = () => {
 
  const [isDropDownOpen, setIsDropDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const notify = () => toast("You've been Logged out successfully!", {
    autoClose: 3000,
  })

  const [user] = useAuthState(auth);
  console.log(user);

    // manipulate the display name and bring out just the first letter in both names
  let initials : string = '';

  if (user?.displayName) {
    const profileName : string = user?.displayName;
    const word = profileName.split(' ').filter(Part => Part.length > 0);

    if (word.length === 1) {
      initials = word[0].charAt(0)
    } else if (word.length >= 2) {
      initials = word[0].charAt(0) + word[1].charAt(0)
    }
    
  }

  initials = initials.toUpperCase();

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const  handleLogout = async () => {

    if (user) {
    signOut(auth);
    sessionStorage.removeItem('user')
    sessionStorage.clear();

    notify();
    await new Promise(resolve => setTimeout(resolve, 1000));

    router.push('/signin')

    }

    
  };

  const dropdownItems = [
    { 
      icon: User, 
      label: 'Profile', 
      onClick: () => console.log('Profile clicked'),
      divider: false 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      onClick: () => console.log('Settings clicked'),
      divider: false 
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      onClick: () => console.log('Help clicked'),
      divider: true 
    },
    { 
      icon: LogOut, 
      label: 'Sign Out', 
      onClick: handleLogout,
      divider: false,
      danger: true 
    }
  ];
    
  return (
    <div className={`h-16 bg-white border-b border-gray-200 top-0 ${!isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''} right-0 z-30 transition-all duration-300`}>
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center space-x-4">
          <div className={`relative ${isMobile ? 'ml-9' : 'ml-0'}`}>
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups, expenses..."
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropDown(!isDropDownOpen)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-medium text-sm">{initials}</span>
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-gray-700 font-medium text-sm block">{user?.displayName}</span>
                <span className="text-gray-500 text-xs">{user?.email}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropDownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropDownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  {dropdownItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <button
                        onClick={() => {
                          item.onClick();
                          setIsDropDown(false);
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150 ${
                          item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                      {item.divider && <div className="my-1 border-t border-gray-100" />}
                    </React.Fragment>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-100 mt-1">
                  <p className="text-xs text-gray-500">SplitMate v1.0.0</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

  const GroupCard = ({ group }: { group: Group }) => (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
      onClick={() => {
        setSelectedGroup(group);
        setCurrentPage('group-detail');
      }}
    >
      <div className={`h-32 bg-gradient-to-br ${group.color} rounded-t-2xl p-6 relative overflow-hidden`}>
        <div className="absolute top-4 right-4 text-4xl opacity-20">
          {group.icon}
        </div>
        <div className="text-white">
          <h3 className="text-xl font-bold mb-2">{group.name}</h3>
          <p className="text-white/80 text-sm">{group.members} members</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-600 text-sm mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(group.totalSpent)}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-sm mb-1">Your Balance</p>
            <p className={`text-lg font-semibold ${getBalanceColor(group.yourBalance)}`}>
              {formatCurrency(Math.abs(group.yourBalance))}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <p className="text-gray-500 text-sm">{group.recentActivity}</p>
        </div>
        
        <div className="mt-4 flex justify-end">
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const MyGroups = () => (
  <div className="min-h-screen bg-gray-50">
    <div className={`${!isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''} pt-16 transition-all duration-300`}>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">All Groups</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);


  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <div className={` pt-16 transition-all duration-300 ${!isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''}`}>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Track your expenses and settle up with friends</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-gray-800">₦286,000</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-gray-600 text-sm">Active Groups</p>
              <p className="text-2xl font-bold text-gray-800">4</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-orange-600" />
                </div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm">You Owe</p>
              <p className="text-2xl font-bold text-red-600">₦2,400</p>
            </div>
          </div>

          {/* Your Groups */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Your Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{activity.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">{activity.group} • {activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );


    const SettleBalance = () => (
    <div className="min-h-screen bg-gray-50">
      <div className={`pt-16 transition-all duration-300 ${!isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''}`}>
        <div className="p-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Settle Balance</h1>
            <p className="text-gray-600">Review and settle your outstanding balances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transform transition-all hover:scale-105 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-600 text-sm">Total You Are Owed</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(balances.reduce((sum, b) => b.type === 'owed' ? sum + b.amount : sum, 0))}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transform transition-all hover:scale-105 animate-slide-up delay-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm">Total You Owe</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(balances.reduce((sum, b) => b.type === 'owe' ? sum + b.amount : sum, 0))}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Outstanding Balances</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {balances.map((balance) => (
                <div key={balance.id} className="p-6 hover:bg-gray-50 transition-colors animate-slide-up">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{balance.avatar}</span>
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">{balance.member}</p>
                        <p className="text-sm text-gray-500">{balance.group}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className={`text-lg font-semibold ${balance.type === 'owed' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(balance.amount)} {balance.type === 'owed' ? 'owed to you' : 'you owe'}
                      </p>
                      <button 
                        onClick={() => {
                          setSelectedBalance(balance);
                          setCurrentPage('settle-detail');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
                      >
                        Settle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettleBalanceDetail = () => {
    if (!selectedBalance) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className={`pt-16 transition-all duration-300 ${!isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''}`}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8 animate-fade-in">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentPage('settle')}
                  className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors transform hover:scale-110"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Settle with {selectedBalance.member}</h1>
                  <p className="text-gray-600">{selectedBalance.group}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 animate-slide-up">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{selectedBalance.avatar}</span>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${selectedBalance.type === 'owed' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(selectedBalance.amount)} {selectedBalance.type === 'owed' ? 'owed to you' : 'you owe'}
                  </p>
                  <p className="text-gray-600">Balance with {selectedBalance.member}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Settle</label>
                  <input
                    type="number"
                    defaultValue={selectedBalance.amount}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                    <option>Mobile Payment</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional note..."
                    rows={4}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={() => setCurrentPage('settle')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors transform hover:scale-105"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Simulate settling balance
                    setCurrentPage('settle');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
                >
                  Confirm Settlement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
 const Profile = () => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [profile, setProfile] = useState<UserProfile>(userProfile);

    const handleSave = () => {
      // Simulate saving profile changes
      setEditMode(false);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className={`pt-16 transition-all duration-300 ${!isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''}`}>
          <div className="p-8">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xl">{profile.avatar}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors transform hover:scale-105"
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {editMode ? (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleSave}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Preferred Currency</p>
                    <p className="text-lg font-semibold text-gray-800">{profile.currency}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Notifications</p>
                    <p className="text-lg font-semibold text-gray-800">{profile.notifications ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-slide-up delay-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors animate-slide-up">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{activity.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-sm text-gray-500">{activity.group} • {activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };




  const GroupDetail = () => {
    if (!selectedGroup) return null;

    const members = [
      { name: 'John Doe', balance: 1200, avatar: '👨‍💼' },
      { name: 'Sarah Wilson', balance: -800, avatar: '👩‍💻' },
      { name: 'Mike Johnson', balance: 0, avatar: '👨‍🔧' },
      { name: 'Alex Brown', balance: -400, avatar: '👨‍🎨' }
    ];

    const expenses = [
      { description: 'Uber ride', amount: 4000, paidBy: 'Taofik', date: '2 hours ago' },
      { description: 'Lunch at restaurant', amount: 8000, paidBy: 'Sarah', date: '4 hours ago' },
      { description: 'Hotel booking', amount: 25000, paidBy: 'Mike', date: '1 day ago' },
      { description: 'Groceries', amount: 3500, paidBy: 'Alex', date: '2 days ago' }
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        <div className={` pt-16 transition-all duration-300 ${!isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''}`}>
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{selectedGroup.name}</h1>
                  <p className="text-gray-600">{selectedGroup.members} members</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Add Expense
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Settle Up
                </button>
              </div>
            </div>

            {/* Group Summary */}
            <div className={`bg-gradient-to-br ${selectedGroup.color} rounded-2xl p-8 mb-8 text-white`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-white/80 text-sm mb-1">Total Spent</p>
                  <p className="text-3xl font-bold">{formatCurrency(selectedGroup.totalSpent)}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-1">Your Balance</p>
                  <p className={`text-2xl font-bold ${selectedGroup.yourBalance >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                    {getBalanceText(selectedGroup.yourBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-1">Group Status</p>
                  <p className="text-lg font-semibold">Active</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Members */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">Members</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {members.map((member, index) => (
                    <div key={index} className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{member.avatar}</span>
                        </div>
                        <span className="font-medium text-gray-800">{member.name}</span>
                      </div>
                      <div className={`text-right ${getBalanceColor(member.balance)}`}>
                        <p className="font-semibold">
                          {member.balance === 0 ? 'Settled' : formatCurrency(Math.abs(member.balance))}
                        </p>
                        <p className="text-sm">
                          {member.balance > 0 ? 'Gets back' : member.balance < 0 ? 'Owes' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expenses */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">Recent Expenses</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {expenses.map((expense, index) => (
                    <div key={index} className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-800">{expense.description}</h3>
                        <span className="text-lg font-bold text-gray-800">{formatCurrency(expense.amount)}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Paid by {expense.paidBy} • {expense.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

 const AddExpenseModal = () => {
  const [splitType, setSplitType] = useState('equal');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    groupId: ''
  });

  // Mock data - replace with your actual data
  const groups = [
    { id: '1', name: 'Ibadan Trip', members: ['John Doe', 'Sarah Wilson', 'Mike Johnson'] },
    { id: '2', name: 'House Expenses', members: ['John Doe', 'Sarah Wilson'] },
    { id: '3', name: 'Startup Team', members: ['John Doe', 'Alex Brown', 'Lisa Davis'] }
  ];

  const categories = [
    { id: 'food', name: 'Food & Dining', emoji: '🍽️' },
    { id: 'transport', name: 'Transport', emoji: '🚗' },
    { id: 'utilities', name: 'Utilities', emoji: '💡' },
    { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
    { id: 'shopping', name: 'Shopping', emoji: '🛍️' },
    { id: 'healthcare', name: 'Healthcare', emoji: '🏥' },
    { id: 'other', name: 'Other', emoji: '📦' }
  ];

  const selectedGroup = groups.find(g => g.id === formData.groupId);
  const groupMembers = selectedGroup?.members || [];

  const handleMemberToggle = (member: string) => {
    setSelectedMembers(prev => 
      prev.includes(member) 
        ? prev.filter(m => m !== member)
        : [...prev, member]
    );
  };

  const handleSubmit = () => {
    // Add your submit logic here
    console.log('Expense Data:', {
      ...formData,
      splitType,
      selectedMembers
    });
    setShowAddExpenseModal(false);
  };

  return (
    <div className={`fixed inset-0 z-[999] transition-opacity duration-300 ${showAddExpenseModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30 z-50" onClick={() => setShowAddExpenseModal(false)}></div>
      
      <div className={`absolute z-60 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transition-transform duration-300 ${showAddExpenseModal ? 'scale-100' : 'scale-95'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-700">
              Add New Expense
            </h2>
            <button 
              onClick={() => setShowAddExpenseModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-5">
            {/* 1. Expense Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border text-purple-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Dinner at restaurant"
              />
            </div>

            {/* 2. Total Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-900 text-bold font-medium">₦</span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full pl-8 pr-4 py-3 text-purple-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            {/* 3. Group Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group <span className="text-red-500">*</span>
              </label>
              <select 
                value={formData.groupId}
                onChange={(e) => {
                  setFormData({...formData, groupId: e.target.value});
                  setSelectedMembers([]);
                }}
                className="w-full px-4 py-3 border text-purple-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a group</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>

            {/* 4. Split Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Split Type</label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSplitType('equal')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    splitType === 'equal' 
                      ? 'border-purple-600 bg-purple-50 text-purple-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4 text-purple-700" />
                    <span className="font-medium text-purple-700">Equal</span>
                  </div>
                </button>
                <button
                  onClick={() => setSplitType('custom')}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    splitType === 'custom' 
                      ? 'border-purple-600 bg-purple-50 text-purple-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Settings className="w-4 h-4 text-purple-700" />
                    <span className="font-medium text-purple-700">Custom</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 5. Shared With (Members) */}
            {formData.groupId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Shared With <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {groupMembers.map(member => (
                    <label key={member} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member)}
                        onChange={() => handleMemberToggle(member)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">{member.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <span className="text-gray-700">{member}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedMembers.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}

            {/* 6. Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setFormData({...formData, category: category.id})}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-purple-500 ${
                      formData.category === category.id 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{category.emoji}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Description/Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description/Notes</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-purple-700 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 resize-none"
                rows={3}
                placeholder="Add any additional details about this expense..."
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3 mt-8 pt-4 border-t border-gray-100">
            <button 
              onClick={() => setShowAddExpenseModal(false)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!formData.title || !formData.amount || !formData.groupId || selectedMembers.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

  const FloatingAddButton = () => (
    <button 
      onClick={() => setShowAddExpenseModal(true)}
      className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 z-30"
    >
      <Plus className="w-6 h-6 mx-auto" />
    </button>
  );

  return (
    <div className="relative bg-gray-50 min-h-screen overflow-hidden">
      <Sidebar />
      <div className='relative z-0'>
      <TopNav />
      
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'group-detail' && <GroupDetail />}
      {currentPage === 'groups' && <MyGroups />}
      {currentPage === 'settle' && <SettleBalance />}
      {currentPage === 'settle-detail' && <SettleBalanceDetail />}
      {currentPage === 'profile' && <Profile />}
      
      
      <AddExpenseModal />
      <FloatingAddButton />
      </div>
    </div>
  );
};

export default ExpenseSplitterDashboard;
