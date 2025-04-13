
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getContentGenerationStats } from "@/services/api";
import { Genre, Platform } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, LineChart, PieChart as PieChartIcon } from "lucide-react";

type AnalyticsDataItem = {
  created_at: string;
  genre?: string;
  platform?: string;
};

const Analytics = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (user) {
        const data = await getContentGenerationStats();
        if (data) {
          // Convert the data to the correct type
          const typedData: AnalyticsDataItem[] = data.map(item => ({
            created_at: item.created_at,
            genre: item.genre,
            platform: item.platform
          }));
          setAnalyticsData(typedData);
        }
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [user]);
  
  // Process data for charts
  const genreData = analyticsData.reduce((acc, item) => {
    if (item.genre) {
      acc[item.genre] = (acc[item.genre] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const platformData = analyticsData.reduce((acc, item) => {
    if (item.platform) {
      acc[item.platform] = (acc[item.platform] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  // Format data for charts
  const genreChartData = Object.keys(genreData).map(genre => ({
    name: genre,
    value: genreData[genre]
  }));
  
  const platformChartData = Object.keys(platformData).map(platform => ({
    name: platform,
    value: platformData[platform]
  }));
  
  // Group data by day for activity chart
  const activityByDay = analyticsData.reduce((acc, item) => {
    const date = new Date(item.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const activityChartData = Object.keys(activityByDay).map(date => ({
    date,
    count: activityByDay[date]
  })).slice(-7); // Last 7 days
  
  // Colors for pie charts
  const COLORS = ['#8854d0', '#3867d6', '#20bf6b', '#eb3b5a', '#f7b731', '#4b7bec'];

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Your Content Analytics</h1>
      <p className="text-muted-foreground">Track your content creation patterns and optimize your strategy</p>
      
      {analyticsData.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg text-muted-foreground">No analytics data available yet. Start creating content to see your stats!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Content Creation Overview Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-trendspark-blue" />
                Content Creation Activity
              </CardTitle>
              <CardDescription>Your content generation over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityChartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8854d0" name="Content Pieces" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Genre Distribution Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-trendspark-blue" />
                Genre Distribution
              </CardTitle>
              <CardDescription>Content categories you focus on</CardDescription>
            </CardHeader>
            <CardContent className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genreChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Distribution Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <LineChart className="h-5 w-5 text-trendspark-green" />
                Platform Focus
              </CardTitle>
              <CardDescription>Which platforms you create for</CardDescription>
            </CardHeader>
            <CardContent className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={platformChartData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#20bf6b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;
