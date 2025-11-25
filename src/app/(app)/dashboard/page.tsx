'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { teachers, courses, students as staticStudents } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Student } from '@/lib/types';

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setStudents(staticStudents);
  }, []);

  const generateClassAttendance = (base: number) => {
    if (selectedClass === 'all' || !isClient) return base;
    return Math.min(100, Math.max(70, base + (parseInt(selectedClass, 10) - 5) * 1.5 + (Math.random() - 0.5) * 5));
  };
  
  const filteredStudents = useMemo(() => {
    if (selectedClass === 'all') {
      return students;
    }
    return students.filter(s => s.class === selectedClass);
  }, [selectedClass, students]);

  const performanceData = useMemo(() => {
    const data = [
      { name: 'A Grade', students: 0, fill: 'var(--color-excellent)' },
      { name: 'B Grade', students: 0, fill: 'var(--color-good)' },
      { name: 'C Grade', students: 0, fill: 'var(--color-average)' },
      { name: 'D Grade', students: 0, fill: 'var(--color-below-average)' },
      { name: 'F Grade', students: 0, fill: 'var(--color-failing)' },
    ];
  
    filteredStudents.forEach(s => {
      if (s.grades.length === 0) return;
      const avg = s.grades.reduce((a, b) => a + b, 0) / s.grades.length;
      if (avg >= 90) data[0].students++;
      else if (avg >= 80) data[1].students++;
      else if (avg >= 70) data[2].students++;
      else if (avg >= 60) data[3].students++;
      else data[4].students++;
    });
  
    return data;
  }, [filteredStudents]);

  
  const attendanceData = useMemo(() => {
    // This is mock data as we don't have monthly attendance
    return [
      { month: 'Jan', attendance: generateClassAttendance(92) },
      { month: 'Feb', attendance: generateClassAttendance(90) },
      { month: 'Mar', attendance: generateClassAttendance(85) },
      { month: 'Apr', attendance: generateClassAttendance(88) },
      { month: 'May', attendance: generateClassAttendance(91) },
      { month: 'Jun', attendance: generateClassAttendance(89) },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, isClient]);

  const totalStudents = filteredStudents.length;
  const avgAttendance = useMemo(() => {
    if (!isClient || totalStudents === 0) return '0.0';
    return (filteredStudents.reduce((acc, s) => acc + s.attendance, 0) / totalStudents).toFixed(1);
  }, [filteredStudents, totalStudents, isClient]);


  const classOptions = ['all', ...Array.from({ length: 10 }, (_, i) => String(i + 1))];

  return (
    <div className="space-y-4">
       <Card>
        <CardHeader>
          <CardTitle>Dashboard Analytics</CardTitle>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              Select a class to view specific analytics.
            </p>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === 'all' ? 'All Classes' : `Standard ${option}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents > 0 ? totalStudents : '...'}</div>
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
            <div className="text-2xl font-bold">{avgAttendance}%</div>
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
                <YAxis allowDecimals={false} />
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
                <YAxis domain={[70, 100]} />
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
    </div>
  );
}

    