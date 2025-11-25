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
import { teachers } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function getTeacherAvatar(id: string) {
    return PlaceHolderImages.find((img) => img.id === id);
}

export default function TeachersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teachers</CardTitle>
        <CardDescription>
          A list of all teachers in the school.
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
              <TableHead>Subject</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => {
                const avatar = getTeacherAvatar(teacher.avatar);
                return (
                <TableRow key={teacher.id}>
                    <TableCell className="hidden sm:table-cell">
                    <Avatar>
                        <AvatarImage src={avatar?.imageUrl} alt={teacher.name} data-ai-hint={avatar?.imageHint} />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell className="hidden md:table-cell">{teacher.contact}</TableCell>
                </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
