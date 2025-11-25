'use server';

/**
 * @fileOverview An AI agent for predicting student failure risk.
 *
 * - predictStudentFailure - A function that predicts whether a student is at risk of failing.
 * - PredictStudentFailureInput - The input type for the predictStudentFailure function.
 * - PredictStudentFailureOutput - The return type for the predictStudentFailure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictStudentFailureInputSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student.'),
  grades: z.array(z.number()).describe('The historical grades of the student.'),
  attendanceRate: z.number().describe('The attendance rate of the student (0-1).'),
  studyHoursPerWeek: z.number().describe('The number of hours the student studies per week.'),
  testDifficulty: z.string().describe('The difficulty level of the upcoming test (e.g., easy, medium, hard).'),
  classAverageGrade: z.number().describe('The average grade of the class.'),
});
export type PredictStudentFailureInput = z.infer<typeof PredictStudentFailureInputSchema>;

const PredictStudentFailureOutputSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student.'),
  isAtRisk: z.boolean().describe('Whether the student is predicted to be at risk of failing.'),
  riskFactors: z.string().describe('The key factors contributing to the student being at risk.'),
  suggestedInterventions: z.string().describe('Suggested interventions to help the student succeed.'),
  confidenceScore: z.number().describe('The confidence score of the prediction (0-1).'),
});
export type PredictStudentFailureOutput = z.infer<typeof PredictStudentFailureOutputSchema>;

export async function predictStudentFailure(input: PredictStudentFailureInput): Promise<PredictStudentFailureOutput> {
  return predictStudentFailureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictStudentFailurePrompt',
  input: {schema: PredictStudentFailureInputSchema},
  output: {schema: PredictStudentFailureOutputSchema},
  prompt: `You are an AI assistant designed to predict whether a student is at risk of failing an upcoming test and suggest interventions.

  Analyze the following student data to determine if the student is likely to fail the upcoming test:

  Student ID: {{{studentId}}}
  Historical Grades: {{{grades}}}
  Attendance Rate: {{{attendanceRate}}}
  Study Hours Per Week: {{{studyHoursPerWeek}}}
  Test Difficulty: {{{testDifficulty}}}
  Class Average Grade: {{{classAverageGrade}}}

  Based on your analysis, determine if the student is at risk of failing. Provide a confidence score (0-1) for your prediction.
  Also, identify the key risk factors contributing to the student being at risk and suggest specific interventions to help the student succeed.
  Be brief and concise.

  Ensure the output is a valid JSON object with the following keys:
  - studentId: The student's ID.
  - isAtRisk: true if the student is at risk, false otherwise.
  - riskFactors: A string explaining the risk factors.
  - suggestedInterventions: A string with suggested interventions.
  - confidenceScore: A number between 0 and 1 representing the confidence.
  `,
});

const predictStudentFailureFlow = ai.defineFlow(
  {
    name: 'predictStudentFailureFlow',
    inputSchema: PredictStudentFailureInputSchema,
    outputSchema: PredictStudentFailureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
