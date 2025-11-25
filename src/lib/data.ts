import type { Student, Teacher, Course } from './types';
import { indianBoyNames, indianGirlNames, indianLastNames } from './data-indian';

const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateGrades = (base: number) => {
  const grades = [];
  for (let i = 0; i < 4; i++) {
    grades.push(Math.min(100, Math.max(0, base + generateRandomNumber(-15, 15))));
  }
  return grades;
};

const allNames = [...indianBoyNames, ...indianGirlNames];

const generateStudents = (): Student[] => {
  const students: Student[] = [];
  let studentIdCounter = 1;
  for (let standard = 1; standard <= 10; standard++) {
    const numberOfStudents = generateRandomNumber(55, 65); // Approx. 60 +/- 5
    for (let i = 0; i < numberOfStudents; i++) {
      const name = `${allNames[generateRandomNumber(0, allNames.length - 1)]} ${indianLastNames[generateRandomNumber(0, indianLastNames.length - 1)]}`;
      
      let baseGrade;
      if (standard < 4) {
        // More stable, higher grades for lower classes
        baseGrade = 90 - (standard * 2) + generateRandomNumber(-5, 5);
      } else {
        // More variability and slightly lower average for higher classes
        baseGrade = 85 - (standard * 3.5) + generateRandomNumber(-10, 10);
      }
      
      students.push({
        id: `S${String(studentIdCounter++).padStart(4, '0')}`,
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
  { id: 'C001', name: 'English - Class 1', teacher: 'Mrs. Suman Aggarwal', schedule: 'Mon, Wed, Fri 9:00 AM', studentsEnrolled: 30 },
  { id: 'C002', name: 'Mathematics - Class 1', teacher: 'Mr. Anil Kumar', schedule: 'Tue, Thu 9:00 AM', studentsEnrolled: 30 },
  { id: 'C003', name: 'Environmental Science - Class 1', teacher: 'Mrs. Rina Bose', schedule: 'Mon, Wed 10:00 AM', studentsEnrolled: 30 },
  { id: 'C004', name: 'Hindi - Class 1', teacher: 'Mrs. Aarti Gupta', schedule: 'Tue, Thu 10:00 AM', studentsEnrolled: 30 },
  { id: 'C005', name: 'Art - Class 1', teacher: 'Mrs. Jyoti Mukherjee', schedule: 'Fri 11:00 AM', studentsEnrolled: 30 },

  { id: 'C011', name: 'English - Class 2', teacher: 'Mrs. Suman Aggarwal', schedule: 'Mon, Wed, Fri 9:00 AM', studentsEnrolled: 30 },
  { id: 'C012', name: 'Mathematics - Class 2', teacher: 'Mr. Anil Kumar', schedule: 'Tue, Thu 9:00 AM', studentsEnrolled: 30 },
  { id: 'C013', name: 'Environmental Science - Class 2', teacher: 'Mrs. Rina Bose', schedule: 'Mon, Wed 10:00 AM', studentsEnrolled: 30 },
  { id: 'C014', name: 'Hindi - Class 2', teacher: 'Mrs. Aarti Gupta', schedule: 'Tue, Thu 10:00 AM', studentsEnrolled: 30 },
  { id: 'C015', name: 'Music - Class 2', teacher: 'Mr. Suresh Menon', schedule: 'Fri 11:00 AM', studentsEnrolled: 30 },

  { id: 'C021', name: 'English - Class 3', teacher: 'Mrs. Priya Patel', schedule: 'Mon, Wed, Fri 9:00 AM', studentsEnrolled: 30 },
  { id: 'C022', name: 'Mathematics - Class 3', teacher: 'Mr. Deepak Mishra', schedule: 'Tue, Thu 9:00 AM', studentsEnrolled: 30 },
  { id: 'C023', name: 'Social Studies - Class 3', teacher: 'Ms. Meera Joshi', schedule: 'Mon, Wed 10:00 AM', studentsEnrolled: 30 },
  { id: 'C024', name: 'Science - Class 3', teacher: 'Ms. Sunita Sharma', schedule: 'Tue, Thu 10:00 AM', studentsEnrolled: 30 },
  { id: 'C025', name: 'Physical Education - Class 3', teacher: 'Mr. Alok Verma', schedule: 'Fri 11:00 AM', studentsEnrolled: 30 },

  { id: 'C031', name: 'English - Class 4', teacher: 'Mrs. Priya Patel', schedule: 'Mon, Wed, Fri 11:00 AM', studentsEnrolled: 30 },
  { id: 'C032', name: 'Mathematics - Class 4', teacher: 'Mr. Deepak Mishra', schedule: 'Tue, Thu 11:00 AM', studentsEnrolled: 30 },
  { id: 'C033', name: 'Social Studies - Class 4', teacher: 'Ms. Meera Joshi', schedule: 'Mon, Wed 1:00 PM', studentsEnrolled: 30 },
  { id: 'C034', name: 'Science - Class 4', teacher: 'Ms. Sunita Sharma', schedule: 'Tue, Thu 1:00 PM', studentsEnrolled: 30 },
  { id: 'C035', name: 'Computer Science - Class 4', teacher: 'Mr. Sanjay Mehta', schedule: 'Fri 1:00 PM', studentsEnrolled: 30 },
  
  { id: 'C041', name: 'English - Class 5', teacher: 'Mrs. Priya Patel', schedule: 'Mon, Wed, Fri 8:00 AM', studentsEnrolled: 30 },
  { id: 'C042', name: 'Mathematics - Class 5', teacher: 'Mr. Anil Kumar', schedule: 'Tue, Thu 8:00 AM', studentsEnrolled: 30 },
  { id: 'C043', name: 'Social Studies - Class 5', teacher: 'Ms. Divya Banerjee', schedule: 'Mon, Wed 9:00 AM', studentsEnrolled: 30 },
  { id: 'C044', name: 'Science - Class 5', teacher: 'Ms. Nisha Trivedi', schedule: 'Tue, Thu 9:00 AM', studentsEnrolled: 30 },
  { id: 'C045', name: 'Hindi - Class 5', teacher: 'Mrs. Geeta Chatterjee', schedule: 'Fri 9:00 AM', studentsEnrolled: 30 },

  { id: 'C051', name: 'English - Class 6', teacher: 'Mrs. Suman Aggarwal', schedule: 'Mon, Wed 1:00 PM', studentsEnrolled: 30 },
  { id: 'C052', name: 'Mathematics - Class 6', teacher: 'Mr. Deepak Mishra', schedule: 'Tue, Thu 1:00 PM', studentsEnrolled: 30 },
  { id: 'C053', name: 'History - Class 6', teacher: 'Mr. Vikram Rao', schedule: 'Mon 2:00 PM', studentsEnrolled: 30 },
  { id: 'C054', name: 'Geography - Class 6', teacher: 'Mr. Rohan Desai', schedule: 'Wed 2:00 PM', studentsEnrolled: 30 },
  { id: 'C055', name: 'Science - Class 6', teacher: 'Ms. Deepa Iyer', schedule: 'Fri 2:00 PM', studentsEnrolled: 30 },

  { id: 'C061', name: 'English - Class 7', teacher: 'Mrs. Suman Aggarwal', schedule: 'Mon, Wed 10:00 AM', studentsEnrolled: 30 },
  { id: 'C062', name: 'Mathematics - Class 7', teacher: 'Mr. Anil Kumar', schedule: 'Tue, Thu 10:00 AM', studentsEnrolled: 30 },
  { id: 'C063', name: 'History & Civics - Class 7', teacher: 'Mr. Ajay Goel', schedule: 'Mon, Wed 11:00 AM', studentsEnrolled: 30 },
  { id: 'C064', name: 'Geography - Class 7', teacher: 'Mr. Sameer Shah', schedule: 'Tue, Thu 11:00 AM', studentsEnrolled: 30 },
  { id: 'C065', name: 'Physics - Class 7', teacher: 'Ms. Sunita Sharma', schedule: 'Fri 10:00 AM', studentsEnrolled: 30 },
  { id: 'C066', name: 'Chemistry - Class 7', teacher: 'Dr. Rajesh Singh', schedule: 'Fri 11:00 AM', studentsEnrolled: 30 },

  { id: 'C071', name: 'English - Class 8', teacher: 'Mrs. Priya Patel', schedule: 'Mon, Wed 8:00 AM', studentsEnrolled: 30 },
  { id: 'C072', name: 'Mathematics - Class 8', teacher: 'Mr. Deepak Mishra', schedule: 'Tue, Thu 8:00 AM', studentsEnrolled: 30 },
  { id: 'C073', name: 'History - Class 8', teacher: 'Mr. Vikram Rao', schedule: 'Mon, Wed 9:00 AM', studentsEnrolled: 30 },
  { id: 'C074', name: 'Biology - Class 8', teacher: 'Ms. Deepa Iyer', schedule: 'Tue 9:00 AM', studentsEnrolled: 30 },
  { id: 'C075', name: 'Computer Science - Class 8', teacher: 'Mr. Sanjay Mehta', schedule: 'Thu 9:00 AM', studentsEnrolled: 30 },
  { id: 'C076', name: 'Hindi - Class 8', teacher: 'Mrs. Aarti Gupta', schedule: 'Fri 9:00 AM', studentsEnrolled: 30 },

  { id: 'C081', name: 'English - Class 9', teacher: 'Mrs. Priya Patel', schedule: 'Tue, Thu 9:00 AM', studentsEnrolled: 30 },
  { id: 'C082', name: 'Mathematics - Class 9', teacher: 'Mr. Anil Kumar', schedule: 'Mon, Wed, Fri 9:00 AM', studentsEnrolled: 30 },
  { id: 'C083', name: 'Physics - Class 9', teacher: 'Ms. Neha Pandey', schedule: 'Tue, Thu 10:00 AM', studentsEnrolled: 30 },
  { id: 'C084', name: 'Chemistry - Class 9', teacher: 'Mr. Karan Malhotra', schedule: 'Mon, Wed 10:00 AM', studentsEnrolled: 30 },
  { id: 'C085', name: 'Biology - Class 9', teacher: 'Ms. Nisha Trivedi', schedule: 'Fri 10:00 AM', studentsEnrolled: 30 },
  { id: 'C086', name: 'Economics - Class 9', teacher: 'Ms. Pooja Reddy', schedule: 'Tue, Thu 11:00 AM', studentsEnrolled: 30 },

  { id: 'C091', name: 'English - Class 10', teacher: 'Mrs. Suman Aggarwal', schedule: 'Mon, Wed, Fri 11:00 AM', studentsEnrolled: 30 },
  { id: 'C092', name: 'Mathematics - Class 10', teacher: 'Mr. Anil Kumar', schedule: 'Mon, Wed, Fri 10:00 AM', studentsEnrolled: 30 },
  { id: 'C093', name: 'Physics - Class 10', teacher: 'Ms. Sunita Sharma', schedule: 'Tue, Thu 1:00 PM', studentsEnrolled: 30 },
  { id: 'C094', name: 'Chemistry - Class 10', teacher: 'Dr. Rajesh Singh', schedule: 'Mon, Wed 2:00 PM', studentsEnrolled: 30 },
  { id: 'C095', name: 'Biology - Class 10', teacher: 'Ms. Deepa Iyer', schedule: 'Fri 2:00 PM', studentsEnrolled: 30 },
  { id: 'C096', name: 'Computer Science - Class 10', teacher: 'Mr. Sanjay Mehta', schedule: 'Tue, Thu 3:00 PM', studentsEnrolled: 30 },
  { id: 'C097', name: 'Political Science - Class 10', teacher: 'Mr. Harish Nair', schedule: 'Tue, Thu 2:00 PM', studentsEnrolled: 30 },
];
