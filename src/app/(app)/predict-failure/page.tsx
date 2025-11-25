import { PredictionForm } from './prediction-form';

export const metadata = {
  title: 'Predict Student Failure | ScholarSight',
  description: 'Use AI to predict students at risk of failing.',
};

export default function PredictFailurePage() {
  return <PredictionForm />;
}
