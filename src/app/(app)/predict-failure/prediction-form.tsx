'use client';

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { runSinglePrediction, type SinglePredictionState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { students as staticStudents } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
  const [students, setStudents] = useState<Student[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Form field state
  const [studentId, setStudentId] = useState('');
  const [grades, setGrades] = useState('');
  const [attendanceRate, setAttendanceRate] = useState('');
  const [studyHoursPerWeek, setStudyHoursPerWeek] = useState('');
  const [classAverageGrade, setClassAverageGrade] = useState('');

  const initialState: SinglePredictionState = { data: null, error: null, timestamp: 0 };
  const [state, formAction] = useActionState(runSinglePrediction, initialState);

  useEffect(() => {
    setStudents(staticStudents);
    // Find a student in class 10 with a low grade to pre-fill
    const atRiskStudent = staticStudents.find(s => s.class === '10' && (s.grades.reduce((a,b)=>a+b,0)/s.grades.length) < 70);
    if(atRiskStudent) {
      onStudentChange(atRiskStudent.id);
    }
  }, []);

  useEffect(() => {
    if (state.error && state.timestamp > 0) { // Check timestamp to avoid firing on initial render
      toast({
        variant: 'destructive',
        title: 'Prediction Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  const onStudentChange = (selectedStudentId: string) => {
    const student = students.find((s) => s.id === selectedStudentId);
    if (student) {
      setStudentId(student.id);
      setGrades(student.grades.join(', '));
      setAttendanceRate(String(student.attendance));
      setStudyHoursPerWeek(String(student.studyHours));
      const classStudents = students.filter(s => s.class === student.class);
      const classAvg = classStudents.length > 0
        ? classStudents.reduce((acc, s) => acc + (s.grades.reduce((a, b) => a + b, 0) / (s.grades.length || 1)), 0) 
          / classStudents.length
        : 75;
      setClassAverageGrade(classAvg.toFixed(0));
    }
    setPopoverOpen(false);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <form action={formAction}>
            <CardHeader>
              <CardTitle>Predict Student Failure Risk</CardTitle>
              <CardDescription>
                Fill in the details for a single student to get an AI-powered prediction.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 flex flex-col">
                <Label>Student</Label>
                 <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !studentId && "text-muted-foreground"
                      )}
                    >
                      {studentId
                        ? students.find((student) => student.id === studentId)?.name
                        : "Select a student"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
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
                              onSelect={() => onStudentChange(student.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  student.id === studentId ? "opacity-100" : "opacity-0"
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
                <input type="hidden" name="studentId" value={studentId} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grades">Historical Grades</Label>
                <Input id="grades" name="grades" value={grades} onChange={(e) => setGrades(e.target.value)} placeholder="e.g., 85, 92, 78, 88" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendanceRate">Attendance Rate (%)</Label>
                <Input id="attendanceRate" name="attendanceRate" value={attendanceRate} onChange={(e) => setAttendanceRate(e.target.value)} type="number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studyHoursPerWeek">Study Hours Per Week</Label>
                <Input id="studyHoursPerWeek" name="studyHoursPerWeek" value={studyHoursPerWeek} onChange={(e) => setStudyHoursPerWeek(e.target.value)} type="number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testDifficulty">Upcoming Test Difficulty</Label>
                <Select name="testDifficulty" defaultValue="medium" required>
                    <SelectTrigger id="testDifficulty"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="classAverageGrade">Class Average Grade</Label>
                <Input id="classAverageGrade" name="classAverageGrade" value={classAverageGrade} onChange={(e) => setClassAverageGrade(e.target.value)} type="number" required />
              </div>
            </CardContent>
            <CardFooter>
             <SubmitButton />
            </CardFooter>
          </form>
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