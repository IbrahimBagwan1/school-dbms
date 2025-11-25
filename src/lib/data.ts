import type { Student, Teacher, Course } from './types';
import { indianBoyNames, indianGirlNames, indianLastNames } from './data-indian';

const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateGrades = (base: number) => {
  const grades = [];
  for (let i = 0; i < 4; i++) {
    grades.push(Math.min(100, Math.max(0, base + generateRandomNumber(-10, 10))));
  }
  return grades;
};

const allNames = [...indianBoyNames, ...indianGirlNames];

const generateStudents = (): Student[] => {
  const students: Student[] = [];
  let studentIdCounter = 1;
  for (let standard = 1; standard <= 10; standard++) {
    for (let i = 0; i < 30; i++) {
      const name = `${allNames[generateRandomNumber(0, allNames.length - 1)]} ${indianLastNames[generateRandomNumber(0, indianLastNames.length - 1)]}`;
      const baseGrade = 100 - (standard * 4) + generateRandomNumber(-5, 5);
      
      students.push({
        id: `S${String(studentIdCounter++).padStart(3, '0')}`,
        name: name,
        class: String(standard),
        grades: generateGrades(baseGrade),
        attendance: generateRandomNumber(70, 100),
        studyHours: generateRandomNumber(2, 20),
      });
    }
  }
  return students;
};

export const students: Student[] = generateStudents();

export const teachers: Teacher[] = [
  { id: 'T01', name: 'Mr. Anil Kumar', subject: 'Mathematics', contact: 'akumar@example.com' },
  { id: 'T02', name: 'Ms. Sunita Sharma', subject: 'Physics', contact: 'ssharma@example.com' },
  { id: 'T03', name: 'Dr. Rajesh Singh', subject: 'Chemistry', contact: 'rsingh@example.com' },
  { id: 'T04', name: 'Mrs. Priya Patel', subject: 'English', contact: 'ppatel@example.com' },
  { id: 'T05', name: 'Mr. Vikram Rao', subject: 'History', contact: 'vrao@example.com' },
  { id: 'T06', name: 'Ms. Deepa Iyer', subject: 'Biology', contact: 'diyer@example.com' },
  { id: 'T07', name: 'Mr. Sanjay Mehta', subject: 'Computer Science', contact: 'smehta@example.com' },
  { id: 'T08', name: 'Mrs. Aarti Gupta', subject: 'Hindi', contact: 'agupta@example.com' },
  { id: 'T09', name: 'Mr. Rohan Desai', subject: 'Geography', contact: 'rdesai@example.com' },
  { id: 'T10', name: 'Ms. Meera Joshi', subject: 'Social Studies', contact: 'mjoshi@example.com' },
  { id: 'T11', name: 'Mr. Alok Verma', subject: 'Physical Education', contact: 'averma@example.com' },
  { id: 'T12', name: 'Mrs. Kavita Pillai', subject: 'Art', contact: 'kpillai@example.com' },
  { id: 'T13', name: 'Mr. Suresh Menon', subject: 'Music', contact: 'smenon@example.com' },
  { id: 'T14', name: 'Ms. Pooja Reddy', subject: 'Economics', contact: 'preddy@example.com' },
  { id: 'T15', name: 'Mr. Harish Nair', subject: 'Political Science', contact: 'hnair@example.com' },
  { id: 'T16', name: 'Mrs. Rina Bose', subject: 'Environmental Science', contact: 'rbose@example.com' },
  { id: 'T17', name: 'Mr. Deepak Mishra', subject: 'Mathematics', contact: 'dmishra@example.com' },
  { id: 'T18', name: 'Ms. Neha Pandey', subject: 'Physics', contact: 'npandey@example.com' },
  { id: 'T19', name: 'Mr. Karan Malhotra', subject: 'Chemistry', contact: 'kmalhotra@example.com' },
  { id: 'T20', name: 'Mrs. Suman Aggarwal', subject: 'English', contact: 'sagarwal@example.com' },
  { id: 'T21', name: 'Mr. Ajay Goel', subject: 'History', contact: 'agoel@example.com' },
  { id: 'T22', name: 'Ms. Nisha Trivedi', subject: 'Biology', contact: 'ntrivedi@example.com' },
  { id: 'T23', name: 'Mr. Varun Dubey', subject: 'Computer Science', contact: 'vdubey@example.com' },
  { id: 'T24', name: 'Mrs. Geeta Chatterjee', subject: 'Hindi', contact: 'gchatterjee@example.com' },
  { id: 'T25', name: 'Mr. Sameer Shah', subject: 'Geography', contact: 'sshah@example.com' },
  { id: 'T26', name: 'Ms. Divya Banerjee', subject: 'Social Studies', contact: 'dbanerjee@example.com' },
  { id: 'T27', name: 'Mr. Rahul Kapoor', subject: 'Physical Education', contact: 'rkapoor@example.com' },
  { id: 'T28', name: 'Mrs. Jyoti Mukherjee', subject: 'Art', contact: 'jmukherjee@example.com' },
];

export const courses: Course[] = [
  { id: 'C101', name: 'Mathematics - Class 10', teacher: 'Mr. Anil Kumar', schedule: 'Mon, Wed, Fri 10:00 AM', studentsEnrolled: 30 },
  { id: 'C102', name: 'Physics - Class 10', teacher: 'Ms. Sunita Sharma', schedule: 'Tue, Thu 1:00 PM', studentsEnrolled: 25 },
  { id: 'C103', name: 'Chemistry - Class 10', teacher: 'Dr. Rajesh Singh', schedule: 'Mon, Wed 2:00 PM', studentsEnrolled: 28 },
  { id: 'C104', name: 'English - Class 9', teacher: 'Mrs. Priya Patel', schedule: 'Tue, Thu 9:00 AM', studentsEnrolled: 32 },
  { id: 'C105', name: 'History - Class 9', teacher: 'Mr. Vikram Rao', schedule: 'Mon, Wed, Fri 11:00 AM', studentsEnrolled: 40 },
  { id: 'C106', name: 'Biology - Class 9', teacher: 'Ms. Deepa Iyer', schedule: 'Tue, Thu 10:30 AM', studentsEnrolled: 22 },
  { id: 'C107', name: 'Computer Science - Class 10', teacher: 'Mr. Sanjay Mehta', schedule: 'Mon, Wed 3:00 PM', studentsEnrolled: 35 },
  { id: 'C108', name: 'Hindi - Class 8', teacher: 'Mrs. Aarti Gupta', schedule: 'Tue, Thu 11:30 AM', studentsEnrolled: 29 },
];
