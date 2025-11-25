'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  LineChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from 'recharts';
import { Users, GraduationCap, BookOpen, Activity } from 'lucide-react';
import { students, teachers, courses } from '@/lib/data';

const performanceData = [
  { name: 'A Grade', students: students.filter(s => (s.grades.reduce((a, b) => a + b, 0) / s.grades.length) >= 90).length, fill: 'var(--color-excellent)' },
  { name: 'B Grade', students: students.filter(s => { const avg = (s.grades.reduce((a, b) => a + b, 0) / s.grades.length); return avg >= 80 && avg < 90; }).length, fill: 'var(--color-good)' },
  { name: 'C Grade', students: students.filter(s => { const avg = (s.grades.reduce((a, b) => a + b, 0) / s.grades.length); return avg >= 70 && avg < 80; }).length, fill: 'var(--color-average)' },
  { name: 'D Grade', students: students.filter(s => { const avg = (s.grades.reduce((a, b) => a + b, 0) / s.grades.length); return avg >= 60 && avg < 70; }).length, fill: 'var(--color-below-average)' },
  { name: 'F Grade', students: students.filter(s => (s.grades.reduce((a, b) => a + b, 0) / s.grades.length) < 60).length, fill: 'var(--color-failing)' },
];

const attendanceData = [
  { month: 'Jan', attendance: 92 },
  { month: 'Feb', attendance: 90 },
  { month: 'Mar', attendance: 85 },
  { month: 'Apr', attendance: 88 },
  { month: 'May', attendance: 91 },
  { month: 'Jun', attendance: 89 },
];

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{students.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teachers.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{courses.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(students.reduce((acc, s) => acc + s.attendance, 0) / students.length).toFixed(1)}%
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Student Performance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData} style={{
              '--color-excellent': '#4caf50',
              '--color-good': '#8bc34a',
              '--color-average': '#ffc107',
              '--color-below-average': '#ff9800',
              '--color-failing': '#f44336',
            } as React.CSSProperties}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Bar dataKey="students" name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Attendance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="attendance" name="Avg. Attendance (%)" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
