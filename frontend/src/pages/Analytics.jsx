import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { BarChart2, TrendingUp, Star, Building } from 'lucide-react';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [byCategory, setByCategory] = useState([]);
  const [byStatus, setByStatus] = useState([]);
  const [topElectricians, setTopElectricians] = useState([]);
  const [hostelStats, setHostelStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [statsRes, catRes, statusRes, topRes, hostelRes] = await Promise.all([
        analyticsAPI.getOverallStats(),
        analyticsAPI.getComplaintsByCategory(),
        analyticsAPI.getComplaintsByStatus(),
        analyticsAPI.getTopElectricians(),
        analyticsAPI.getHostelStats()
      ]);
      setStats(statsRes.data.data);
      setByCategory(catRes.data.data);
      setByStatus(statusRes.data.data);
      setTopElectricians(topRes.data.data);
      setHostelStats(hostelRes.data.data);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <BarChart2 size={28} className="text-blue-600" />
        Analytics Dashboard
      </h1>

      {/* Overview stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Total Complaints</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total_complaints}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed_complaints}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending_complaints}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <p className="text-gray-500 text-sm">Avg Rating</p>
            <p className="text-2xl font-bold text-purple-600">{parseFloat(stats.average_rating || 0).toFixed(1)}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complaints by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            By Category
          </h2>
          <div className="space-y-3">
            {byCategory.map((item) => {
              const total = byCategory.reduce((sum, c) => sum + parseInt(c.count), 0);
              const pct = total > 0 ? Math.round((parseInt(item.count) / total) * 100) : 0;
              return (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{item.category}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Electricians */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Star size={20} className="text-yellow-500" />
            Top Electricians
          </h2>
          <div className="space-y-3">
            {topElectricians.map((e, idx) => (
              <div key={e.id} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{e.name}</p>
                  <p className="text-xs text-gray-500">{e.completed_jobs} jobs</p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  {parseFloat(e.average_rating || 0).toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hostel stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Building size={20} className="text-purple-500" />
          Hostel Statistics
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Hostel</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Total</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Pending</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Completed</th>
              </tr>
            </thead>
            <tbody>
              {hostelStats.map((h) => (
                <tr key={h.id} className="border-t border-gray-100">
                  <td className="py-2 px-4">{h.name}</td>
                  <td className="py-2 px-4 capitalize">{h.hostel_type}</td>
                  <td className="py-2 px-4">{h.total_complaints}</td>
                  <td className="py-2 px-4 text-yellow-600">{h.pending_complaints}</td>
                  <td className="py-2 px-4 text-green-600">{h.completed_complaints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
