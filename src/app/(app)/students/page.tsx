'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { students as staticStudents } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Download, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Student } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


function getGradeBadge(grades: number[]) {
  if (grades.length === 0) return <Badge variant="secondary">N/A</Badge>;
  const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
  if (avg >= 90) return <Badge variant="default" className="bg-green-600">A</Badge>;
  if (avg >= 80) return <Badge variant="default" className="bg-blue-500">B</Badge>;
  if (avg >= 70) return <Badge variant="default" className="bg-yellow-500">C</Badge>;
  if (avg >= 60) return <Badge variant="default" className="bg-orange-500">D</Badge>;
  return <Badge variant="destructive">F</Badge>;
}

const getGradeAvg = (grades: number[]) => {
  if (grades.length === 0) return 'N/A';
  return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1)
};


export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [isClient, setIsClient] = useState(false);

  //   useEffect(() => {
  //   async function loadStudents() {
  //     try {
  //       const res = await fetch('/api/students');
  //       const data: Student[] = await res.json();
  //       setStudents(data);
  //     } catch (err) {
  //       console.error('Failed to load students', err);
  //     } finally {
  //       setIsClient(true);
  //     }
  //   }

  //   loadStudents();
  // }, []);

    useEffect(() => {
    setStudents(staticStudents);
    setIsClient(true);
  }, []);



  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const isClassMatch = selectedClass === 'all' || student.class === selectedClass;
      const isSearchMatch =
        !searchTerm ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase());

      return isClassMatch && isSearchMatch;
    });
  }, [searchTerm, selectedClass, students]);
  
  const classOptions = useMemo(() => {
    return ['all', ...Array.from({ length: 10 }, (_, i) => String(i + 1))];
  }, []);

  const downloadPdf = () => {
    const doc = new jsPDF();
    const tableTitle = selectedClass === 'all' ? 'All Students' : `Students of Standard ${selectedClass}`;
    
    doc.text(tableTitle, 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Name', 'Class', 'Avg. Grade', 'Attendance (%)']],
      body: filteredStudents.map(student => [
        student.id,
        student.name,
        student.class,
        getGradeAvg(student.grades),
        student.attendance
      ]),
    });

    doc.save(`student-list-${selectedClass === 'all' ? 'all' : `std-${selectedClass}`}.pdf`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students</CardTitle>
        <CardDescription>
          A list of all students in the school.
        </CardDescription>
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search students by name, ID..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full md:w-[180px]">
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
            <Button onClick={downloadPdf} disabled={!isClient || filteredStudents.length === 0}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isClient ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
