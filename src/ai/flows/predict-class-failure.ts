'use server';

/**
 * @fileOverview An AI agent for predicting student failure risk for an entire class.
 *
 * - predictClassFailure - A function that predicts which students in a class are at risk of failing.
 * - PredictClassFailureInput - The input type for the predictClassFailure function.
 * - PredictClassFailureOutput - The return type for the predictClassFailure function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StudentPredictionInputSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student.'),
  name: z.string().describe('The name of the student.'),
  grades: z.array(z.number()).describe('The historical grades of the student.'),
  attendanceRate: z.number().describe('The attendance rate of the student (0-1).'),
  studyHoursPerWeek: z.number().describe('The number of hours the student studies per week.'),
});

const PredictClassFailureInputSchema = z.object({
  classId: z.string().describe('The identifier for the class being analyzed.'),
  testDifficulty: z.string().describe('The difficulty level of the upcoming test (e.g., easy, medium, hard).'),
  classAverageGrade: z.number().describe('The average grade of the class.'),
  students: z.array(StudentPredictionInputSchema).describe('An array of student data for the class.'),
});
export type PredictClassFailureInput = z.infer<typeof PredictClassFailureInputSchema>;

const AtRiskStudentSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student.'),
  name: z.string().describe('The name of the student.'),
  riskScore: z.number().describe('A score from 0 to 1 indicating the level of risk. 1 is the highest risk.'),
  riskFactors: z.string().describe('A brief explanation of the key factors contributing to the risk.'),
  suggestedInterventions: z.string().describe('Brief, actionable suggestions to help the student.'),
});

const PredictClassFailureOutputSchema = z.object({
  atRiskStudents: z.array(AtRiskStudentSchema).describe('A list of students identified as being at risk, sorted from highest risk to lowest.'),
});
export type PredictClassFailureOutput = z.infer<typeof PredictClassFailureOutputSchema>;
export type AtRiskStudent = z.infer<typeof AtRiskStudentSchema>;


export async function predictClassFailure(input: PredictClassFailureInput): Promise<PredictClassFailureOutput> {
  return predictClassFailureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictClassFailurePrompt',
  input: { schema: PredictClassFailureInputSchema },
  output: { schema: PredictClassFailureOutputSchema },
  prompt: `You are an AI assistant designed to predict student failure risk for an entire class based on their academic data.

  Analyze the provided list of students for class {{classId}} who are about to take a test with a difficulty of '{{testDifficulty}}'. The class average grade is {{classAverageGrade}}.

  Student Data:
  {{{json students}}}

  Your task is to:
  1. Identify every student who is at risk of failing the upcoming test.
  2. For each at-risk student, provide a 'riskScore' from 0 (no risk) to 1 (highest risk).
  3. Briefly explain the primary 'riskFactors' for each identified student.
  4. Provide brief and actionable 'suggestedInterventions' for each at-risk student.
  5. Compile this information into a list named 'atRiskStudents'.
  6. **Sort the 'atRiskStudents' list in descending order based on the 'riskScore'**, so the student with the highest risk appears first.
  7. If no students are at risk, return an empty 'atRiskStudents' array.

  Ensure the final output is a valid JSON object.`,
});

const predictClassFailureFlow = ai.defineFlow(
  {
    name: 'predictClassFailureFlow',
    inputSchema: PredictClassFailureInputSchema,
    outputSchema: PredictClassFailureOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
