'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const stats = [
    { label: 'Total Orders', value: '284', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Products', value: '156', icon: Package, color: 'bg-green-100 text-green-600' },
    { label: 'Total Revenue', value: '125,430 DH', icon: BarChart3, color: 'bg-purple-100 text-purple-600' },
    { label: 'Total Customers', value: '892', icon: Users, color: 'bg-pink-100 text-pink-600' },
  ];

  const recentOrders = [
    { id: '001', customer: 'Fatima Ahmed', amount: '1,200 DH', status: 'Pending', date: '2024-01-20' },
    { id: '002', customer: 'Mariam Hassan', amount: '899 DH', status: 'Shipped', date: '2024-01-19' },
    { id: '003', customer: 'Zainab Sultan', amount: '1,450 DH', status: 'Delivered', date: '2024-01-18' },
    { id: '004', customer: 'Noor Khalil', amount: '599 DH', status: 'Pending', date: '2024-01-17' },
  ];

  const products = [
    { id: '1', name: 'Elegant Beige Caftan', price: '599 DH', stock: 45, category: 'Dresses' },
    { id: '2', name: 'Taupe Lounge Set', price: '449 DH', stock: 32, category: 'Lounge Wear' },
    { id: '3', name: 'Silk Luxury Pyjamas', price: '399 DH', stock: 58, category: 'Pyjamas' },
    { id: '4', name: 'White Linen Dress', price: '649 DH', stock: 28, category: 'Dresses' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend authentication
    if (loginEmail && loginPassword) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light tracking-wider mb-2">LAMSA</h1>
            <p className="text-gray-600">Admin Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="input-field"
                placeholder="admin@lamsa.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Demo credentials: admin@lamsa.com / password
            </p>
          </div>

          <div className="mt-4">
            <Link href="/" className="text-center text-sm text-gray-600 hover:text-black block">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-black text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="h-20 flex items-center justify-between px-6">
          {sidebarOpen && <h1 className="text-2xl font-light tracking-wider">LAMSA</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="mt-8 space-y-4 px-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'categories', label: 'Categories', icon: Package },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors border border-gray-700 hover:border-red-400 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light tracking-tight mb-2">
              {activeTab === 'overview' && 'Dashboard'}
              {activeTab === 'products' && 'Products'}
              {activeTab === 'orders' && 'Orders'}
              {activeTab === 'categories' && 'Categories'}
            </h1>
            <p className="text-gray-600">
              {activeTab === 'overview' && 'Welcome back to your admin dashboard'}
              {activeTab === 'products' && 'Manage your product inventory'}
              {activeTab === 'orders' && 'View and manage customer orders'}
              {activeTab === 'categories' && 'Manage product categories'}
            </p>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                      <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className="text-2xl font-light mt-2">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-light mb-6 tracking-tight">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">#{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4 font-medium">{order.amount}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'Delivered'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status === 'Shipped'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Product
              </button>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold">Product Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Category</th>
                        <th className="text-left py-3 px-4 font-semibold">Price</th>
                        <th className="text-left py-3 px-4 font-semibold">Stock</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{product.name}</td>
                          <td className="py-3 px-4">{product.category}</td>
                          <td className="py-3 px-4">{product.price}</td>
                          <td className="py-3 px-4">
                            <span className={product.stock > 30 ? 'text-green-600' : 'text-orange-600'}>
                              {product.stock} units
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="p-2 hover:bg-blue-100 text-blue-600 rounded">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-red-100 text-red-600 rounded">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">#{order.id}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4">{order.amount}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{order.date}</td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:underline text-xs font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-8">
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Category
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Dresses', 'Lounge Wear', 'Pyjamas', 'Home Dresses', 'Accessories'].map(
                  (category, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                      <h3 className="font-medium mb-4">{category}</h3>
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 text-sm border border-gray-200 hover:border-black transition-colors">
                          <Edit2 className="w-4 h-4 inline mr-2" />
                          Edit
                        </button>
                        <button className="flex-1 px-4 py-2 text-sm border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4 inline mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
