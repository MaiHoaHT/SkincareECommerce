import React from 'react';
import { Users, BarChart2, Package, MessageSquare } from 'lucide-react';
import { StatCard, ActivityTable } from '../common';
import QuickStats from './QuickStats';

function DashboardContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard 
        title="Total Users" 
        value="8,249" 
        change="+12%" 
        trend="up" 
        icon={<Users className="text-blue-500" />}
      />
      <StatCard 
        title="Revenue" 
        value="$24,780" 
        change="+8%" 
        trend="up" 
        icon={<BarChart2 className="text-green-500" />}
      />
      <StatCard 
        title="Products" 
        value="142" 
        change="+5%" 
        trend="up" 
        icon={<Package className="text-purple-500" />}
      />
      <StatCard 
        title="Messages" 
        value="28" 
        change="-3%" 
        trend="down" 
        icon={<MessageSquare className="text-orange-500" />}
      />
      
      <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
        <ActivityTable />
      </div>
      
      <div className="col-span-1 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Quick Stats</h2>
        <QuickStats />
      </div>
    </div>
  );
}

export default DashboardContent;