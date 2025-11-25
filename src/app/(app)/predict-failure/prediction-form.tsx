'use client';

import { useEffect, useState, useMemo, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStatus } from 'react-dom';
import { runSinglePrediction, type SinglePredictionState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { students as staticStudents } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, BrainCircuit, Check, CheckCircle, ChevronsUpDown, Info, TrendingUp, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Student } from '@/lib/types';


const FormSchema = z.object({
  studentId: z.string().min(1, { message: 'Please select a student.' }),
  grades: z.string().min(1, { message: 'Grades cannot be empty.' }),
  attendanceRate: z.string().min(1, { message: 'Attendance rate cannot be empty.' }),
  studyHoursPerWeek: z.string().min(1, { message: 'Study hours cannot be empty.' }),
  testDifficulty: z.enum(['easy', 'medium', 'hard']),
  classAverageGrade: z.string().min(1, { message: 'Class average grade cannot be empty.' }),
});

type FormValues = z.infer<typeof FormSchema>;

const initialState: SinglePredictionState = {
  type: 'single',
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Analyzing...' : <> <Zap className="mr-2" /> Run Prediction</>}
    </Button>
  );
}

export function PredictionForm() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(runSinglePrediction, initialState);
  const [students, setStudents] = useState<Student[]>([]);
  
  useEffect(() => {
    setStudents(staticStudents);
  }, []);

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
      form.setValue('studentId', student.id, { shouldValidate: true });
      form.setValue('grades', student.grades.join(', '));
      form.setValue('attendanceRate', String(student.attendance));
      form.setValue('studyHoursPerWeek', String(student.studyHours));
      const classStudents = students.filter(s => s.class === student.class);
      const classAvg = classStudents.length > 0
        ? classStudents.reduce((acc, s) => acc + (s.grades.reduce((a, b) => a + b, 0) / s.grades.length), 0) 
          / classStudents.length
        : 75;
      form.setValue('classAverageGrade', classAvg.toFixed(0));
    }
  };

  const onFormSubmit = (data: FormValues) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        formData.append(key, (data as any)[key]);
    });
    formAction(formData);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Predict Student Failure Risk</CardTitle>
          <CardDescription>
            Fill in the details for a single student to get an AI-powered prediction.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
          >
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Student</FormLabel>
                     <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? students.find(
                                  (student) => student.id === field.value
                                )?.name
                              : "Select a student"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search student..." />
                          <CommandEmpty>No student found.</CommandEmpty>
                          <CommandGroup>
                            <ScrollArea className="h-72">
                              {students.map((student) => (
                                <CommandItem
                                  value={student.name}
                                  key={student.id}
                                  onSelect={() => {
                                    onStudentChange(student.id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      student.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {student.name} (Std: {student.class}, ID: {student.id})
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="grades" render={({ field }) => ( <FormItem><FormLabel>Historical Grades</FormLabel><FormControl><Input {...field} placeholder="e.g., 85, 92, 78, 88" /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="attendanceRate" render={({ field }) => ( <FormItem><FormLabel>Attendance Rate (%)</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="studyHoursPerWeek" render={({ field }) => ( <FormItem><FormLabel>Study Hours Per Week</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="testDifficulty" render={({ field }) => ( <FormItem><FormLabel>Upcoming Test Difficulty</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="classAverageGrade" render={({ field }) => ( <FormItem><FormLabel>Class Average Grade</FormLabel><FormControl><Input {...field} type="number" /></FormControl><FormMessage /></FormItem> )} />
            </CardContent>
            <CardFooter>
             <SubmitButton />
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Prediction Result</CardTitle>
          <CardDescription>The AI analysis for the student will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {state.data ? (
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
