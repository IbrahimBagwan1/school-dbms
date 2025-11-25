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
import { teachers as staticTeachers } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Teacher } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setTeachers(staticTeachers);
    setIsClient(true);
  }, []);

  const filteredTeachers = useMemo(() => {
    if (!searchTerm) return teachers;
    return teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, teachers]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teachers</CardTitle>
        <CardDescription>
          A list of all teachers in the school.
        </CardDescription>
         <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search teachers by name or subject..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
              <TableHead>Subject</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell className="hidden md:table-cell">{teacher.contact}</TableCell>
                </TableRow>
              ))
             ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No teachers found.
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
