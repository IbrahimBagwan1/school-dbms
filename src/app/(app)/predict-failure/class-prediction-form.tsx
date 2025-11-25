'use client';

import { useEffect, useMemo, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStatus } from 'react-dom';
import { runClassPrediction, type ClassPredictionState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrainCircuit, CheckCircle, Info, TrendingUp, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const FormSchema = z.object({
  classId: z.string().min(1, { message: 'Please select a class.' }),
  testDifficulty: z.enum(['easy', 'medium', 'hard']),
});

type FormValues = z.infer<typeof FormSchema>;

const initialState: ClassPredictionState = {
  type: 'class',
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Analyzing...' : <><Zap className="mr-2" /> Run Class Prediction</>}
    </Button>
  );
}

export function ClassPredictionForm() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(runClassPrediction, initialState);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      classId: '',
      testDifficulty: 'medium',
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

  const classOptions = useMemo(() => {
    return [...Array.from({ length: 10 }, (_, i) => String(i + 1))];
  }, []);
  
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Class-wide Failure Risk</CardTitle>
          <CardDescription>
            Select a class to identify students at risk of failing.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            action={formAction}
            className="space-y-6"
          >
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classOptions.map((classId) => (
                          <SelectItem key={classId} value={classId}>
                            Standard {classId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="testDifficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upcoming Test Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader>
          <CardTitle>Prediction Result</CardTitle>
          <CardDescription>A list of at-risk students will appear here, sorted by highest risk.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {state.data && state.data.atRiskStudents && state.data.atRiskStudents.length > 0 ? (
             <ScrollArea className="h-full max-h-[60vh] pr-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead className="text-center">Risk Score</TableHead>
                            <TableHead>Risk Factors & Interventions</TableHead>
                        </TableRow>
                    </TableHeader>
                     <TableBody>
                        {state.data.atRiskStudents.map((student) => (
                            <TableRow key={student.studentId}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{student.name}</span>
                                        <span className="text-xs text-muted-foreground">{student.studentId}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="destructive" className="text-base">
                                        {(student.riskScore * 100).toFixed(0)}%
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                     <div className="space-y-2">
                                        <div className="space-y-1">
                                            <h4 className="font-semibold flex items-center gap-2 text-sm"><Info className="h-4 w-4 text-primary" /> Risk Factors</h4>
                                            <p className="text-xs text-muted-foreground">{student.riskFactors}</p>
                                        </div>
                                        <Separator />
                                        <div className="space-y-1">
                                            <h4 className="font-semibold flex items-center gap-2 text-sm"><TrendingUp className="h-4 w-4 text-green-600" /> Interventions</h4>
                                            <p className="text-xs text-muted-foreground">{student.suggestedInterventions}</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2 text-center">
                {state.data && state.data.atRiskStudents && state.data.atRiskStudents.length === 0 ? (
                    <>
                        <CheckCircle className="w-10 h-10 text-green-600" />
                        <p className="text-muted-foreground">No students were identified as being at risk in this class.</p>
                    </>
                ) : (
                    <>
                        <BrainCircuit className="w-10 h-10 text-muted-foreground/50" />
                        <p className="text-muted-foreground">Class prediction results will be displayed here.</p>
                    </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
