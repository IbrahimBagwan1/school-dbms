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

function getGradeBadge(grades: number[]) {
  const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
  if (avg >= 90) return <Badge variant="default" className="bg-green-600">A</Badge>;
  if (avg >= 80) return <Badge variant="default" className="bg-blue-500">B</Badge>;
  if (avg >= 70) return <Badge variant="default" className="bg-yellow-500">C</Badge>;
  if (avg >= 60) return <Badge variant="default" className="bg-orange-500">D</Badge>;
  return <Badge variant="destructive">F</Badge>;
}

export default function StudentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Students</CardTitle>
        <CardDescription>
          A list of all students in the school.
        </CardDescription>
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
            {students.map((student) => {
              return (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>Standard {student.class}</TableCell>
                <TableCell className="hidden md:table-cell">{student.id}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {getGradeBadge(student.grades)}
                </TableCell>
                <TableCell className="hidden md:table-cell">{student.attendance}%</TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
