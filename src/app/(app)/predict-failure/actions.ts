'use server';

import {
  predictStudentFailure,
  type PredictStudentFailureInput,
  type PredictStudentFailureOutput,
} from '@/ai/flows/predict-student-failure';
import {
  predictClassFailure,
  type PredictClassFailureInput,
  type PredictClassFailureOutput,
} from '@/ai/flows/predict-class-failure';
import { students } from '@/lib/data';
import { z } from 'zod';

const SingleStudentActionSchema = z.object({
  studentId: z.string().min(1, 'Student ID is missing.'),
  grades: z.array(z.number()),
  attendanceRate: z.number().min(0).max(1),
  studyHoursPerWeek: z.number().min(0),
  testDifficulty: z.enum(['easy', 'medium', 'hard']),
  classAverageGrade: z.number().min(0).max(100),
});

const ClassActionSchema = z.object({
  classId: z.string().min(1, 'Class ID is missing.'),
  testDifficulty: z.enum(['easy', 'medium', 'hard']),
});

export type SinglePredictionState = {
  data: PredictStudentFailureOutput | null;
  error: string | null;
};

export type ClassPredictionState = {
  data: PredictClassFailureOutput | null;
  error: string | null;
};

function parseGrades(gradesStr: string | null): number[] {
  if (!gradesStr) return [];
  return gradesStr
    .split(',')
    .map((str) => str.trim())
    .filter((str) => str !== '')
    .map(Number)
    .filter((num) => !isNaN(num) && num >= 0 && num <= 100);
}

export async function runSinglePrediction(
  formData: FormData
): Promise<SinglePredictionState> {
  const rawFormData = {
    studentId: formData.get('studentId'),
    grades: parseGrades(formData.get('grades') as string | null),
    attendanceRate: Number(formData.get('attendanceRate') || 0) / 100,
    studyHoursPerWeek: Number(formData.get('studyHoursPerWeek') || 0),
    testDifficulty: formData.get('testDifficulty'),
    classAverageGrade: Number(formData.get('classAverageGrade') || 0),
  };

  const validatedFields = SingleStudentActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError =
      Object.values(errorMessages).flat()[0] ||
      'Invalid form data. Please check your inputs.';
    return {
      data: null,
      error: firstError,
    };
  }

  try {
    const predictionInput: PredictStudentFailureInput = validatedFields.data;
    const result = await predictStudentFailure(predictionInput);
    return { data: result, error: null };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      data: null,
      error: `Failed to run prediction: ${errorMessage}`,
    };
  }
}

export async function runClassPrediction(
  formData: FormData
): Promise<ClassPredictionState> {
  const rawFormData = {
    classId: formData.get('classId'),
    testDifficulty: formData.get('testDifficulty'),
  };

  const validatedFields = ClassActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError =
      Object.values(errorMessages).flat()[0] ||
      'Invalid form data. Please check your inputs.';
    return {
      data: null,
      error: firstError,
    };
  }

  try {
    const { classId, testDifficulty } = validatedFields.data;

    const classStudents = students.filter((s) => s.class === classId);
    if (classStudents.length === 0) {
      return {
        data: null,
        error: `No students found for class ${classId}.`,
      };
    }

    const classAvg =
      classStudents.length > 0
        ? classStudents.reduce(
            (acc, s) =>
              acc +
              s.grades.reduce((a, b) => a + b, 0) / (s.grades.length || 1),
            0
          ) / classStudents.length
        : 75;

    const predictionInput: PredictClassFailureInput = {
      classId,
      testDifficulty,
      classAverageGrade: classAvg,
      students: classStudents.map((s) => ({
        studentId: s.id,
        name: s.name,
        grades: s.grades,
        attendanceRate: s.attendance / 100,
        studyHoursPerWeek: s.studyHours,
      })),
    };

    const result = await predictClassFailure(predictionInput);
    return { data: result, error: null };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      data: null,
      error: `Failed to run prediction: ${errorMessage}`,
    };
  }
}
