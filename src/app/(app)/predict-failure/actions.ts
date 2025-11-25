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
  studentId: z.string().min(1, 'Please select a student.'),
  grades: z
    .string()
    .transform(s =>
      s
        .split(',')
        .map(str => str.trim())
        .filter(str => str !== '')
        .map(Number)
        .filter(num => !isNaN(num) && num >= 0 && num <= 100)
    )
    .refine(arr => arr.length > 0, {
      message: 'Grades must be a comma-separated list of valid numbers.',
    }),
  attendanceRate: z.coerce.number().min(0).max(100).transform(n => n / 100),
  studyHoursPerWeek: z.coerce.number().min(0),
  testDifficulty: z.enum(['easy', 'medium', 'hard']),
  classAverageGrade: z.coerce.number().min(0).max(100),
});

const ClassActionSchema = z.object({
  classId: z.string().min(1, 'Please select a class.'),
  testDifficulty: z.enum(['easy', 'medium', 'hard']),
});

export type SinglePredictionState = {
  type: 'single';
  data: PredictStudentFailureOutput | null;
  error: string | null;
};

export type ClassPredictionState = {
  type: 'class';
  data: PredictClassFailureOutput | null;
  error: string | null;
}

export type PredictionState = SinglePredictionState | ClassPredictionState;

export async function runSinglePrediction(
  formData: FormData
): Promise<SinglePredictionState> {
  const rawFormData = {
    studentId: formData.get('studentId') || '',
    grades: formData.get('grades') || '',
    attendanceRate: formData.get('attendanceRate') || '',
    studyHoursPerWeek: formData.get('studyHoursPerWeek') || '',
    testDifficulty: formData.get('testDifficulty') || 'medium',
    classAverageGrade: formData.get('classAverageGrade') || '0',
  };

  const validatedFields = SingleStudentActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessages).flat()[0] || 'Invalid form data. Please check your inputs.';
    return {
      type: 'single',
      data: null,
      error: firstError,
    };
  }

  try {
    const predictionInput: PredictStudentFailureInput = validatedFields.data;
    const result = await predictStudentFailure(predictionInput);
    return { type: 'single', data: result, error: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      type: 'single',
      data: null,
      error: `Failed to run prediction: ${errorMessage}`,
    };
  }
}

export async function runClassPrediction(
  formData: FormData
): Promise<ClassPredictionState> {
  const rawFormData = {
    classId: formData.get('classId') || '',
    testDifficulty: formData.get('testDifficulty') || 'medium',
  };

  const validatedFields = ClassActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
     const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessages).flat()[0] || 'Invalid form data. Please check your inputs.';
    return {
      type: 'class',
      data: null,
      error: firstError,
    };
  }

  try {
    const { classId, testDifficulty } = validatedFields.data;
    
    const classStudents = students.filter(s => s.class === classId);
    if (classStudents.length === 0) {
      return { type: 'class', data: null, error: `No students found for class ${classId}.` };
    }

    const classAvg = classStudents.length > 0
        ? classStudents.reduce((acc, s) => acc + (s.grades.reduce((a, b) => a + b, 0) / s.grades.length), 0) 
          / classStudents.length
        : 75;

    const predictionInput: PredictClassFailureInput = {
      classId,
      testDifficulty,
      classAverageGrade: classAvg,
      students: classStudents.map(s => ({
        studentId: s.id,
        name: s.name,
        grades: s.grades,
        attendanceRate: s.attendance / 100,
        studyHoursPerWeek: s.studyHours,
      })),
    };

    const result = await predictClassFailure(predictionInput);
    return { type: 'class', data: result, error: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      type: 'class',
      data: null,
      error: `Failed to run prediction: ${errorMessage}`,
    };
  }
}
