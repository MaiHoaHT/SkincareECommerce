// Helper function to get page title
export function getPageTitle(menuItem) {
    const titles = {
      dashboard: 'Dashboard',
      users: 'User Management',
      analytics: 'Analytics',
      products: 'Product Management',
      calendar: 'Calendar',
      messages: 'Messages',
      settings: 'Settings',
    };
    
    return titles[menuItem] || 'Dashboard';
  }