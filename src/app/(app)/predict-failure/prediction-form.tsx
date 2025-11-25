'use client';

import { useEffect } from 'react';
import { useFormState, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { runPrediction, PredictionState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { students } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, BrainCircuit, CheckCircle, Info, TrendingUp, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const FormSchema = z.object({
  studentId: z.string({ required_error: 'Please select a student.' }),
  grades: z.string(),
  attendanceRate: z.string(),
  studyHoursPerWeek: z.string(),
  testDifficulty: z.enum(['easy', 'medium', 'hard']),
  classAverageGrade: z.string(),
});

type FormValues = z.infer<typeof FormSchema>;

const initialState: PredictionState = {
  data: null,
  error: null,
};

export function PredictionForm() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(runPrediction, initialState);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      studentId: '',
      grades: '',
      attendanceRate: '',
      studyHoursPerWeek: '',
      testDifficulty: 'medium',
      classAverageGrade: '75',
    },
  });

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Prediction Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  const onStudentChange = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      form.setValue('studentId', student.id);
      form.setValue('grades', student.grades.join(', '));
      form.setValue('attendanceRate', String(student.attendance));
      form.setValue('studyHoursPerWeek', String(student.studyHours));
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Predict Student Failure Risk</CardTitle>
          <CardDescription>
            Fill in the details to get an AI-powered prediction.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-6">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select onValueChange={onStudentChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="grades" render={({ field }) => ( <FormItem><FormLabel>Historical Grades</FormLabel><FormControl><Input {...field} placeholder="e.g., 85, 92, 78, 88" /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="attendanceRate" render={({ field }) => ( <FormItem><FormLabel>Attendance Rate (%)</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="studyHoursPerWeek" render={({ field }) => ( <FormItem><FormLabel>Study Hours Per Week</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="testDifficulty" render={({ field }) => ( <FormItem><FormLabel>Upcoming Test Difficulty</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="classAverageGrade" render={({ field }) => ( <FormItem><FormLabel>Class Average Grade</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem> )} />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Zap className="mr-2" />
                Run Prediction
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Prediction Result</CardTitle>
          <CardDescription>The AI analysis will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {form.formState.isSubmitting ? (
             <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                    <BrainCircuit className="w-10 h-10 animate-pulse text-primary" />
                    <p className="text-muted-foreground">Analyzing data...</p>
                </div>
            </div>
          ) : state.data ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Overall Assessment</h3>
                {state.data.isAtRisk ? (
                  <Badge variant="destructive" className="text-base gap-2"><AlertCircle className="h-4 w-4" />At Risk of Failure</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-600 text-base gap-2"><CheckCircle className="h-4 w-4" />Not at Risk</Badge>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Confidence Score</h3>
                <div className="flex items-center gap-4">
                  <Progress value={state.data.confidenceScore * 100} className="w-full" />
                  <span className="font-bold text-lg text-primary">{(state.data.confidenceScore * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Info className="h-4 w-4 text-primary" /> Key Risk Factors</h3>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{state.data.riskFactors}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-600" /> Suggested Interventions</h3>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{state.data.suggestedInterventions}</p>
              </div>
            </div>
          ) : (
             <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2 text-center">
                    <BrainCircuit className="w-10 h-10 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Your prediction results will be displayed here once generated.</p>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
