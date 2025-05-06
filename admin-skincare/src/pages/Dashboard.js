import React from 'react';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Thống kê</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng đơn hàng"
          value="1,234"
          icon={ShoppingCart}
          color="bg-blue-500"
        />
        <StatCard
          title="Khách hàng"
          value="567"
          icon={Users}
          color="bg-green-500"
        />
        <StatCard
          title="Sản phẩm"
          value="890"
          icon={Package}
          color="bg-purple-500"
        />
        <StatCard
          title="Doanh thu"
          value="123.4M"
          icon={DollarSign}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng gần đây</h2>
          <div className="space-y-4">
            {/* Placeholder for recent orders */}
            <p className="text-gray-500">Danh sách đơn hàng sẽ được hiển thị ở đây</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm bán chạy</h2>
          <div className="space-y-4">
            {/* Placeholder for top products */}
            <p className="text-gray-500">Danh sách sản phẩm bán chạy sẽ được hiển thị ở đây</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;