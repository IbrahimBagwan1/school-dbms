'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PredictionForm } from './prediction-form';
import { ClassPredictionForm } from './class-prediction-form';

export function PredictionTabs() {
  return (
    <Tabs defaultValue="class-wide">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="class-wide">Class-wide Prediction</TabsTrigger>
          <TabsTrigger value="single-student">Single Student (Manual)</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="class-wide" className="mt-4">
        <ClassPredictionForm />
      </TabsContent>
      <TabsContent value="single-student" className="mt-4">
        <PredictionForm />
      </TabsContent>
    </Tabs>
  );
}
