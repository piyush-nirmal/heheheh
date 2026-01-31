import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, HelpCircle, Check, FlaskConical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SoilStep {
  id: string;
  label: string;
  shortLabel: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  color: string;
  helpText: string;
}

const soilSteps: SoilStep[] = [
  {
    id: 'nitrogen',
    label: 'Nitrogen (N)',
    shortLabel: 'N',
    unit: 'kg/ha',
    min: 0,
    max: 200,
    step: 5,
    defaultValue: 80,
    color: 'bg-nitrogen',
    helpText: 'Nitrogen promotes leafy growth. Most crops need 80-120 kg/ha. Get this from a soil test or use approximate values based on your last fertilizer application.',
  },
  {
    id: 'phosphorus',
    label: 'Phosphorus (P)',
    shortLabel: 'P',
    unit: 'kg/ha',
    min: 0,
    max: 100,
    step: 2,
    defaultValue: 40,
    color: 'bg-phosphorus',
    helpText: 'Phosphorus aids root development and flowering. Optimal range is 30-60 kg/ha for most crops.',
  },
  {
    id: 'potassium',
    label: 'Potassium (K)',
    shortLabel: 'K',
    unit: 'kg/ha',
    min: 0,
    max: 150,
    step: 5,
    defaultValue: 50,
    color: 'bg-potassium',
    helpText: 'Potassium improves disease resistance and fruit quality. Most crops need 40-80 kg/ha.',
  },
  {
    id: 'ph',
    label: 'pH Level',
    shortLabel: 'pH',
    unit: '',
    min: 4,
    max: 10,
    step: 0.1,
    defaultValue: 6.5,
    color: 'bg-ph-neutral',
    helpText: 'pH affects nutrient availability. Most crops prefer 6.0-7.0. Below 6 is acidic, above 7 is alkaline.',
  },
];

const SoilPage = () => {
  const navigate = useNavigate();
  const { saveSoilReading } = useApp();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<Record<string, number>>({
    nitrogen: soilSteps[0].defaultValue,
    phosphorus: soilSteps[1].defaultValue,
    potassium: soilSteps[2].defaultValue,
    ph: soilSteps[3].defaultValue,
  });

  const step = soilSteps[currentStep];
  const progress = ((currentStep + 1) / soilSteps.length) * 100;
  const isLastStep = currentStep === soilSteps.length - 1;

  const handleValueChange = (newValue: number[]) => {
    setValues(prev => ({
      ...prev,
      [step.id]: newValue[0],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || step.min;
    const clampedValue = Math.min(Math.max(value, step.min), step.max);
    setValues(prev => ({
      ...prev,
      [step.id]: clampedValue,
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      // Save the soil reading
      saveSoilReading({
        nitrogen: values.nitrogen,
        phosphorus: values.phosphorus,
        potassium: values.potassium,
        ph: values.ph,
      });

      toast({
        title: 'Soil Data Saved!',
        description: 'Your soil readings have been recorded. View crop recommendations now.',
      });

      navigate('/crops');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-[#1b325f] text-white py-6 mb-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-orange-400" />
            Soil Health Card Entry
          </h1>
          <p className="opacity-80 text-sm mt-1">
            Digitize your soil test results to get AI-powered crop recommendations.
          </p>
        </div>
      </div>

      <div className="p-4 max-w-5xl mx-auto">

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {soilSteps.map((s, index) => (
              <div
                key={s.id}
                className={cn(
                  'flex flex-col items-center',
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all',
                  index < currentStep ? `${s.color} text-white` :
                    index === currentStep ? 'bg-primary text-primary-foreground ring-4 ring-primary/30' :
                      'bg-muted'
                )}>
                  {index < currentStep ? <Check className="h-4 w-4" /> : s.shortLabel}
                </div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current step card */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className={cn('w-3 h-3 rounded-full', step.color)} />
                {step.label}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-sm">{step.helpText}</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Current value display */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Input
                  type="number"
                  value={values[step.id]}
                  onChange={handleInputChange}
                  min={step.min}
                  max={step.max}
                  step={step.step}
                  className="text-3xl font-bold text-center w-32 h-16"
                />
                {step.unit && (
                  <span className="text-lg text-muted-foreground">{step.unit}</span>
                )}
              </div>
            </div>

            {/* Slider */}
            <div className="px-2">
              <Slider
                value={[values[step.id]]}
                onValueChange={handleValueChange}
                min={step.min}
                max={step.max}
                step={step.step}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{step.min}{step.unit && ` ${step.unit}`}</span>
                <span>{step.max}{step.unit && ` ${step.unit}`}</span>
              </div>
            </div>

            {/* Quick reference for pH */}
            {step.id === 'ph' && (
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="p-2 rounded bg-ph-acidic/20 text-ph-acidic">
                  <div className="font-bold">{'< 6.0'}</div>
                  <div>Acidic</div>
                </div>
                <div className="p-2 rounded bg-ph-neutral/20 text-success">
                  <div className="font-bold">6.0 - 7.0</div>
                  <div>Optimal</div>
                </div>
                <div className="p-2 rounded bg-ph-alkaline/20 text-ph-alkaline">
                  <div className="font-bold">{'> 7.0'}</div>
                  <div>Alkaline</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1"
          >
            {isLastStep ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Save & View Crops
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Summary of entered values */}
        {currentStep > 0 && (
          <Card className="mt-4">
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground mb-2">Values entered:</div>
              <div className="flex flex-wrap gap-2">
                {soilSteps.slice(0, currentStep).map(s => (
                  <div
                    key={s.id}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-sm"
                  >
                    <span className={cn('w-2 h-2 rounded-full', s.color)} />
                    <span className="font-medium">{s.shortLabel}:</span>
                    <span>{values[s.id]}{s.unit && ` ${s.unit}`}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SoilPage;
