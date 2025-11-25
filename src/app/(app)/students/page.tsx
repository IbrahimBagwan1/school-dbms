'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { students } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

function getGradeBadge(grades: number[]) {
  const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
  if (avg >= 90) return <Badge variant="default" className="bg-green-600">A</Badge>;
  if (avg >= 80) return <Badge variant="default" className="bg-blue-500">B</Badge>;
  if (avg >= 70) return <Badge variant="default" className="bg-yellow-500">C</Badge>;
  if (avg >= 60) return <Badge variant="default" className="bg-orange-500">D</Badge>;
  return <Badge variant="destructive">F</Badge>;
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `Standard ${student.class}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students</CardTitle>
        <CardDescription>
          A list of all students in the school.
        </CardDescription>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students by name, ID, or class..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="hidden md:table-cell">Student ID</TableHead>
              <TableHead className="hidden md:table-cell">Avg. Grade</TableHead>
              <TableHead className="hidden md:table-cell">Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>Standard {student.class}</TableCell>
                  <TableCell className="hidden md:table-cell">{student.id}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getGradeBadge(student.grades)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{student.attendance}%</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
