import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Filter, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dummy data structure - easily replaceable with API data
const generateDummyData = () => ({
  salesData: [
    { month: 'Jan', revenue: 45000, orders: 120, customers: 85 },
    { month: 'Feb', revenue: 52000, orders: 145, customers: 98 },
    { month: 'Mar', revenue: 48000, orders: 132, customers: 91 },
    { month: 'Apr', revenue: 61000, orders: 168, customers: 112 },
    { month: 'May', revenue: 55000, orders: 151, customers: 103 },
    { month: 'Jun', revenue: 67000, orders: 189, customers: 128 },
  ],
  categoryData: [
    { name: 'Electronics', value: 35, sales: 125000 },
    { name: 'Clothing', value: 25, sales: 89000 },
    { name: 'Food', value: 20, sales: 71000 },
    { name: 'Books', value: 12, sales: 43000 },
    { name: 'Other', value: 8, sales: 28000 },
  ],
  regions: ['All Regions', 'North America', 'Europe', 'Asia', 'South America'],
  dateRanges: ['Last 6 Months', 'Last 3 Months', 'Last Month', 'Last Year'],
});

const COLORS = ['#880015', '#B8001F', '#E60026', '#FF3347', '#FF6B7A'];

const Dashboard = () => {
  const data = useMemo(() => generateDummyData(), []);
  
  // State for customization
  const [chartType, setChartType] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 6 Months');
  const [categoryChartType, setCategoryChartType] = useState('pie');

  // Metrics configuration - makes it easy to add new metrics
  const metrics = [
    { value: 'revenue', label: 'Revenue', format: (v) => `$${v.toLocaleString()}` },
    { value: 'orders', label: 'Orders', format: (v) => v.toLocaleString() },
    { value: 'customers', label: 'Customers', format: (v) => v.toLocaleString() },
  ];

  const currentMetric = metrics.find(m => m.value === selectedMetric);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalRevenue = data.salesData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = data.salesData.reduce((sum, item) => sum + item.orders, 0);
    const totalCustomers = data.salesData.reduce((sum, item) => sum + item.customers, 0);
    const avgOrderValue = totalRevenue / totalOrders;

    return [
      { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%' },
      { title: 'Total Orders', value: totalOrders.toLocaleString(), change: '+8.2%' },
      { title: 'Customers', value: totalCustomers.toLocaleString(), change: '+15.3%' },
      { title: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, change: '+4.1%' },
    ];
  }, [data.salesData]);

  // Render appropriate chart based on selection
  const renderMainChart = () => {
    const chartData = data.salesData;
    
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }}
                formatter={(value) => currentMetric.format(value)}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#880015" 
                strokeWidth={2}
                dot={{ fill: '#880015', r: 4 }}
                name={currentMetric.label}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }}
                formatter={(value) => currentMetric.format(value)}
              />
              <Legend />
              <Bar dataKey={selectedMetric} fill="#880015" name={currentMetric.label} />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderCategoryChart = () => {
    if (categoryChartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.categoryData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#666" />
            <YAxis dataKey="name" type="category" stroke="#666" width={100} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }} />
            <Bar dataKey="sales" fill="#880015" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor your business performance</p>
          </div>
          <Button className="bg-redcustom hover:bg-redcustom/90 text-whitecustom">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-redcustom/20">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-redcustom" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[180px] border-gray-300">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {data.regions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger className="w-[180px] border-gray-300">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {data.dateRanges.map((range) => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="text-redcustom border-redcustom hover:bg-redcustom/10">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <Card key={index} className="border-l-4 border-l-redcustom">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                <p className="text-xs text-green-600 mt-1">{kpi.change} vs last period</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Chart */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap justify-between items-center gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Trend Analysis
              </CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[140px] border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {metrics.map((metric) => (
                      <SelectItem key={metric.value} value={metric.value}>
                        {metric.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-1 border rounded-md p-1">
                  <Button
                    variant={chartType === 'line' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setChartType('line')}
                    className={chartType === 'line' ? 'bg-redcustom hover:bg-redcustom/90' : ''}
                  >
                    <TrendingUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={chartType === 'bar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                    className={chartType === 'bar' ? 'bg-redcustom hover:bg-redcustom/90' : ''}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderMainChart()}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Sales by Category
                </CardTitle>
                <div className="flex gap-1 border rounded-md p-1">
                  <Button
                    variant={categoryChartType === 'pie' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCategoryChartType('pie')}
                    className={categoryChartType === 'pie' ? 'bg-redcustom hover:bg-redcustom/90' : ''}
                  >
                    Pie
                  </Button>
                  <Button
                    variant={categoryChartType === 'bar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCategoryChartType('bar')}
                    className={categoryChartType === 'bar' ? 'bg-redcustom hover:bg-redcustom/90' : ''}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderCategoryChart()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Top Performing Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center gap-3">
                    <div 
                      className="w-2 h-12 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          ${category.sales.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${category.value * 2}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;