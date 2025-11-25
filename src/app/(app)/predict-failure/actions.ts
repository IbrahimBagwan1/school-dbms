'use server';

import { predictStudentFailure, PredictStudentFailureInput, PredictStudentFailureOutput } from '@/ai/flows/predict-student-failure';
import { z } from 'zod';

const FormSchema = z.object({
  studentId: z.string(),
  grades: z.string().transform(s => s.split(',').map(Number)),
  attendanceRate: z.coerce.number().min(0).max(100).transform(n => n / 100),
  studyHoursPerWeek: z.coerce.number().min(0),
  testDifficulty: z.enum(['easy', 'medium', 'hard']),
  classAverageGrade: z.coerce.number().min(0).max(100),
});

export type PredictionState = {
  data: PredictStudentFailureOutput | null;
  error: string | null;
};

export async function runPrediction(
  prevState: PredictionState,
  formData: FormData
): Promise<PredictionState> {
  const validatedFields = FormSchema.safeParse({
    studentId: formData.get('studentId'),
    grades: formData.get('grades'),
    attendanceRate: formData.get('attendanceRate'),
    studyHoursPerWeek: formData.get('studyHoursPerWeek'),
    testDifficulty: formData.get('testDifficulty'),
    classAverageGrade: formData.get('classAverageGrade'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid form data. Please check your inputs.',
    };
  }

  try {
    const predictionInput: PredictStudentFailureInput = validatedFields.data;
    const result = await predictStudentFailure(predictionInput);
    return { data: result, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: 'Failed to run prediction. Please try again.' };
  }
}
