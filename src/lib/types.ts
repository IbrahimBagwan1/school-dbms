export interface Student {
  id: string;
  name: string;
  class: string;
  grades: number[];
  attendance: number;
  studyHours: number;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  contact: string;
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  schedule: string;
  studentsEnrolled: number;
}
