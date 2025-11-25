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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { students } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function getStudentAvatar(id: string) {
    return PlaceHolderImages.find((img) => img.id === id);
}

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
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Avatar</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="hidden md:table-cell">Student ID</TableHead>
              <TableHead className="hidden md:table-cell">Avg. Grade</TableHead>
              <TableHead className="hidden md:table-cell">Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const avatar = getStudentAvatar(student.avatar);
              return (
              <TableRow key={student.id}>
                <TableCell className="hidden sm:table-cell">
                  <Avatar>
                    <AvatarImage src={avatar?.imageUrl} alt={student.name} data-ai-hint={avatar?.imageHint} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
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
