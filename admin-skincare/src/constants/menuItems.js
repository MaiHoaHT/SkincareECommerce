import { 
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingCart,
  Users, 
  Settings, 
  UserCog,
  Shield,
  Code,
  Lock,
  List
} from 'lucide-react';

const menuItems = [
  {
    id: 'dashboard',
    title: 'Thống kê',
    icon: LayoutDashboard,
    path: '/'
  },
  {
    id: 'products',
    title: 'Sản phẩm',
    icon: Package,
    path: '/products',
    children: [
  {
        id: 'productList',
        title: 'Danh sách sản phẩm',
        icon: List,
        path: '/products/list'
      },
      {
        id: 'categories',
        title: 'Danh mục',
        icon: FolderTree,
        path: '/products/categories'
  },
  {
        id: 'brands',
        title: 'Thương hiệu',
        icon: Tag,
        path: '/products/brands'
      }
    ]
  },
  {
    id: 'orders',
    title: 'Đơn hàng',
    icon: ShoppingCart,
    path: '/orders'
  },
  {
    id: 'customers',
    title: 'Khách hàng',
    icon: Users,
    path: '/customers'
  },
  {
    id: 'system',
    title: 'Hệ thống',
    icon: Settings,
    path: '/system',
    children: [
      {
        id: 'users',
        title: 'Tài khoản',
        icon: UserCog,
        path: '/system/users'
      },
      {
        id: 'roles',
        title: 'Phân quyền',
        icon: Shield,
        path: '/system/roles'
      },
      {
        id: 'functions',
        title: 'Chức năng',
        icon: Code,
        path: '/system/functions'
      },
      {
        id: 'permissions',
        title: 'Quyền hạn',
        icon: Lock,
        path: '/system/permissions'
      }
    ]
  }
];

export default menuItems;