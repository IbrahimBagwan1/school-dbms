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

export type SinglePredictionState = {
  data: PredictStudentFailureOutput | null;
  error: string | null;
  timestamp: number;
};

export type ClassPredictionState = {
  data: PredictClassFailureOutput | null;
  error: string | null;
  timestamp: number;
};

const SingleStudentActionSchema = z.object({
  studentId: z.string().min(1, 'Please select a student.'),
  grades: z.preprocess((val) => {
    if (typeof val !== 'string') return [];
    return val.split(',').map(s => s.trim()).filter(Boolean).map(Number).filter(n => !isNaN(n));
  }, z.array(z.number())),
  attendanceRate: z.coerce.number().min(0).max(100),
  studyHoursPerWeek: z.coerce.number().min(0),
  testDifficulty: z.enum(['easy', 'medium', 'hard']),
  classAverageGrade: z.coerce.number().min(0).max(100),
});

const ClassActionSchema = z.object({
  classId: z.string().min(1, 'Please select a class.'),
  testDifficulty: z.enum(['easy', 'medium', 'hard']),
});

export async function runSinglePrediction(
  prevState: SinglePredictionState,
  formData: FormData
): Promise<SinglePredictionState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = SingleStudentActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors).flat()[0];
    return {
      data: null,
      error: firstError || 'Invalid form data. Please check your inputs.',
      timestamp: Date.now(),
    };
  }
  
  try {
    const { attendanceRate, ...rest } = validatedFields.data;
    const predictionInput: PredictStudentFailureInput = {
      ...rest,
      attendanceRate: attendanceRate / 100, // Convert percentage to 0-1 range
    };
    const result = await predictStudentFailure(predictionInput);
    return { data: result, error: null, timestamp: Date.now() };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      data: null,
      error: `Failed to run prediction: ${errorMessage}`,
      timestamp: Date.now(),
    };
  }
}

export async function runClassPrediction(
  prevState: ClassPredictionState,
  formData: FormData
): Promise<ClassPredictionState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = ClassActionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
     const firstError = Object.values(validatedFields.error.flatten().fieldErrors).flat()[0];
    return {
      data: null,
      error: firstError || 'Invalid form data. Please check your inputs.',
      timestamp: Date.now(),
    };
  }

  try {
    const { classId, testDifficulty } = validatedFields.data;

    const classStudents = students.filter((s) => s.class === classId);
    if (classStudents.length === 0) {
      return { data: null, error: `No students found for class ${classId}.`, timestamp: Date.now() };
    }

    const classAvg =
      classStudents.reduce(
        (acc, s) => acc + s.grades.reduce((a, b) => a + b, 0) / (s.grades.length || 1),
        0
      ) / classStudents.length;

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
    return { data: result, error: null, timestamp: Date.now() };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      data: null,
      error: `Failed to run prediction: ${errorMessage}`,
      timestamp: Date.now(),
    };
  }
}