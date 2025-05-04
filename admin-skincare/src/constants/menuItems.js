import { 
  Home, 
  Users, 
  Settings, 
  BarChart2, 
  Package, 
  Calendar, 
  MessageSquare 
} from 'lucide-react';

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: Home,
    path: '/'
  },
  {
    id: 'users',
    title: 'Users',
    icon: Users,
    path: '/users'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: BarChart2,
    path: '/analytics'
  },
  {
    id: 'products',
    title: 'Products',
    icon: Package,
    path: '/products'
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: Calendar,
    path: '/calendar'
  },
  {
    id: 'messages',
    title: 'Messages',
    icon: MessageSquare,
    path: '/messages'
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    path: '/settings'
  }
];

export default menuItems;