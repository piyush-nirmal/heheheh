import { useState } from 'react';
import { Upload, Camera, Check, AlertTriangle, RefreshCw, Scan } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const diseaseResults = [
  {
    name: 'Early Blight',
    prob: 92,
    symptoms: 'Target-shaped brown spots with yellow halos on lower leaves.',
    treatment: 'Apply fungicides containing chlorothalonil or copper. Rotate crops annually.',
    color: 'text-red-600',
    severity: 'Moderate',
    borderColor: 'border-t-red-600',
  },
  {
    name: 'Powdery Mildew',
    prob: 87,
    symptoms: 'White powdery coating on leaf surfaces, causing leaf curl and yellowing.',
    treatment: 'Spray sulfur-based fungicide. Avoid overhead irrigation. Improve air circulation.',
    color: 'text-orange-600',
    severity: 'Mild',
    borderColor: 'border-t-orange-500',
  },
  {
    name: 'Leaf Rust',
    prob: 78,
    symptoms: 'Orange-brown pustules on the underside of leaves with yellowing around them.',
    treatment: 'Apply triazole fungicides. Remove infected debris. Use rust-resistant varieties.',
    color: 'text-amber-700',
    severity: 'Moderate',
    borderColor: 'border-t-amber-600',
  },
  {
    name: 'Bacterial Blight',
    prob: 95,
    symptoms: 'Water-soaked angular lesions that turn brown, surrounded by yellow halos.',
    treatment: 'Copper-based bactericides. Avoid working in fields when wet. Destroy infected plants.',
    color: 'text-red-800',
    severity: 'Severe',
    borderColor: 'border-t-red-800',
  },
];

const DiseaseDetectionPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<typeof diseaseResults[0] | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeDisease = () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 20, 90));
    }, 400);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      const randomResult = diseaseResults[Math.floor(Math.random() * diseaseResults.length)];
      setResult(randomResult);
      setIsAnalyzing(false);
      toast({
        title: t('disease.analysisComplete'),
        description: `${t('disease.diseaseDetected')} ${randomResult.name}`,
      });
    }, 2500);
  };

  const preventMeasures = [
    'Avoid overhead irrigation.',
    'Remove infected plant debris immediately.',
    'Use certified disease-free seeds.',
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-red-600 text-white py-8">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Scan className="h-8 w-8" /> {t('disease.title')}
          </h1>
          <p className="opacity-90 mt-2">{t('disease.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="border-2 border-dashed border-gray-300 bg-white/50 hover:bg-white transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center cursor-pointer relative min-h-[300px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                {selectedImage ? (
                  <div className="relative w-full h-full z-10">
                    <img src={selectedImage} alt="Uploaded crop" className="w-full h-64 object-contain rounded-md" />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {t('disease.clickToChange')}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-blue-50 p-6 rounded-full">
                      <Upload className="h-10 w-10 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-700">{t('disease.uploadTitle')}</h3>
                      <p className="text-sm text-gray-400 mt-1">{t('disease.uploadSubtitle')}</p>
                    </div>
                    <Button variant="outline" className="mt-2">
                      <Camera className="mr-2 h-4 w-4" /> {t('disease.openCamera')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              className="w-full h-12 text-lg bg-red-600 hover:bg-red-700"
              disabled={!selectedImage || isAnalyzing}
              onClick={analyzeDisease}
            >
              {isAnalyzing ? (
                <><RefreshCw className="mr-2 h-5 w-5 animate-spin" /> {t('disease.analyzing')}</>
              ) : (
                <><Scan className="mr-2 h-5 w-5" /> {t('disease.diagnoseNow')}</>
              )}
            </Button>
          </div>

          {/* Result Section */}
          <div>
            {isAnalyzing ? (
              <Card className="h-full flex flex-col justify-center items-center p-8 text-center space-y-6">
                <div className="w-full max-w-xs space-y-3">
                  <Progress value={progress} className="h-2 w-full" />
                  <p className="text-sm font-medium text-gray-500">{t('disease.scanning')}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full max-w-xs opacity-50">
                  <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-20 bg-gray-100 rounded animate-pulse delay-100"></div>
                  <div className="h-20 bg-gray-100 rounded animate-pulse delay-200"></div>
                </div>
              </Card>
            ) : result ? (
              <Card className={`h-full border-t-8 ${result.borderColor} shadow-lg`}>
                <CardHeader className="bg-red-50/50 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className={`text-2xl font-bold ${result.color} flex items-center gap-2`}>
                        <AlertTriangle className="h-6 w-6" /> {result.name}
                      </CardTitle>
                      <CardDescription className="font-medium mt-1 text-gray-600">
                        {t('disease.confidence')} {result.prob}% • {t('disease.severity')} {result.severity}
                      </CardDescription>
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">{result.severity}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Scan className="h-4 w-4 text-gray-400" /> {t('disease.symptomsDetected')}
                    </h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm leading-relaxed border border-gray-100">
                      {result.symptoms}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" /> {t('disease.treatment')}
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="text-green-800 font-medium text-sm leading-relaxed">{result.treatment}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('disease.preventative')}</h4>
                    <ul className="text-sm space-y-2 text-gray-600">
                      {preventMeasures.map((m, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 text-lg">•</span> {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex flex-col justify-center items-center p-8 text-center bg-gray-50/30 border-dashed">
                <div className="bg-gray-100 p-4 rounded-full mb-4 opacity-50">
                  <Scan className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700">{t('disease.noAnalysis')}</h3>
                <p className="text-gray-400 mt-2 max-w-xs mx-auto">{t('disease.noAnalysisDesc')}</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetectionPage;
