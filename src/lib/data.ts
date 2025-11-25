import type { Student, Teacher, Course } from './types';

export const students: Student[] = [
  { id: 'S001', name: 'Alice Johnson', class: '10A', avatar: 'student-1', grades: [85, 92, 78, 88], attendance: 95, studyHours: 15 },
  { id: 'S002', name: 'Bob Williams', class: '10B', avatar: 'student-2', grades: [72, 65, 70, 75], attendance: 80, studyHours: 8 },
  { id: 'S003', name: 'Charlie Brown', class: '11A', avatar: 'student-3', grades: [95, 98, 97, 96], attendance: 98, studyHours: 20 },
  { id: 'S004', name: 'Diana Miller', class: '11B', avatar: 'student-4', grades: [60, 55, 62, 58], attendance: 75, studyHours: 5 },
  { id: 'S005', name: 'Ethan Davis', class: '12A', avatar: 'student-5', grades: [88, 82, 90, 85], attendance: 92, studyHours: 12 },
  { id: 'S006', name: 'Fiona Garcia', class: '12B', avatar: 'student-6', grades: [78, 80, 75, 82], attendance: 88, studyHours: 10 },
];

export const teachers: Teacher[] = [
  { id: 'T01', name: 'Mr. Smith', subject: 'Mathematics', avatar: 'teacher-1', contact: 'msmith@example.com' },
  { id: 'T02', name: 'Ms. Jones', subject: 'Physics', avatar: 'teacher-2', contact: 'ajones@example.com' },
  { id: 'T03', name: 'Dr. Rodriguez', subject: 'Chemistry', avatar: 'teacher-3', contact: 'mrodriguez@example.com' },
  { id: 'T04', name: 'Mrs. Wilson', subject: 'English', avatar: 'teacher-4', contact: 'swilson@example.com' },
];

export const courses: Course[] = [
  { id: 'C101', name: 'Algebra II', teacher: 'Mr. Smith', schedule: 'Mon, Wed, Fri 10:00 AM', studentsEnrolled: 30 },
  { id: 'C102', name: 'Mechanics', teacher: 'Ms. Jones', schedule: 'Tue, Thu 1:00 PM', studentsEnrolled: 25 },
  { id: 'C103', name: 'Organic Chemistry', teacher: 'Dr. Rodriguez', schedule: 'Mon, Wed 2:00 PM', studentsEnrolled: 28 },
  { id: 'C104', name: 'World Literature', teacher: 'Mrs. Wilson', schedule: 'Tue, Thu 9:00 AM', studentsEnrolled: 32 },
];
