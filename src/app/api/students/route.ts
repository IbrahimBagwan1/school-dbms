import { NextResponse } from 'next/server';
import db from '@/lib/mysql';
import type { Student } from '@/lib/types';

export async function GET() {
  try {
    const [rows] = await db.query(
      'SELECT id, name, class, grades_json, attendance, study_hours FROM students'
    );

    const students: Student[] = (rows as any[]).map((row) => {
      let grades: number[] = [];

      try {
        const g = row.grades_json;

        if (Array.isArray(g)) {
          // If MySQL already returned JSON as an array
          grades = g;
        } else if (typeof g === 'string') {
          // If stored as VARCHAR/TEXT
          grades = JSON.parse(g);
        } else {
          grades = [];
        }
      } catch (e) {
        console.error('Failed to parse grades_json for student', row.id, row.grades_json);
        grades = [];
      }

      return {
        id: row.id,
        name: row.name,
        class: String(row.class),
        grades,
        attendance: row.attendance,
        studyHours: row.study_hours,
      };
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students from MySQL:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
