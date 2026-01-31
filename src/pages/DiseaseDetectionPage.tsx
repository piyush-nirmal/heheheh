import { useState } from 'react';
import { Upload, Camera, Check, AlertTriangle, RefreshCw, Scan } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const DiseaseDetectionPage = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const { toast } = useToast();

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
        // Mock analysis delay
        setTimeout(() => {
            setIsAnalyzing(false);
            setResult({
                name: "Early Blight",
                prob: 92,
                symptoms: "Target-shaped brown spots with yellow halos on lower leaves.",
                treatment: "Apply fungicides containing chlorothalonil or copper. Rotate crops annually.",
                color: "text-red-600",
                severity: "Moderate"
            });
            toast({
                title: "Analysis Complete",
                description: "Disease detected: Early Blight",
            });
        }, 2500);
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <div className="bg-red-600 text-white py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Scan className="h-8 w-8" /> Plant Disease Detection
                    </h1>
                    <p className="opacity-90 mt-2">
                        Upload a photo of your affected crop leaf for instant AI diagnosis and remedies.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
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
                                        <img
                                            src={selectedImage}
                                            alt="Uploaded crop"
                                            className="w-full h-64 object-contain rounded-md"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                            Click to change
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="bg-blue-50 p-6 rounded-full">
                                            <Upload className="h-10 w-10 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-700">Upload Leaf Photo</h3>
                                            <p className="text-sm text-gray-400 mt-1">or drag and drop here</p>
                                        </div>
                                        <Button variant="outline" className="mt-2">
                                            <Camera className="mr-2 h-4 w-4" /> Open Camera
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
                                <>
                                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
                                </>
                            ) : (
                                <>
                                    <Scan className="mr-2 h-5 w-5" /> Diagnose Now
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Result Section */}
                    <div>
                        {isAnalyzing ? (
                            <Card className="h-full flex flex-col justify-center items-center p-8 text-center space-y-6">
                                <div className="w-full max-w-xs space-y-2">
                                    <Progress value={66} className="h-2 w-full animate-pulse" />
                                    <p className="text-sm font-medium text-gray-500">Scanning leaf patterns...</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full max-w-xs opacity-50">
                                    <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                                    <div className="h-20 bg-gray-100 rounded animate-pulse delay-100"></div>
                                    <div className="h-20 bg-gray-100 rounded animate-pulse delay-200"></div>
                                </div>
                            </Card>
                        ) : result ? (
                            <Card className="h-full border-t-8 border-t-red-600 shadow-lg">
                                <CardHeader className="bg-red-50/50 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className={`text-2xl font-bold ${result.color} flex items-center gap-2`}>
                                                <AlertTriangle className="h-6 w-6" /> {result.name}
                                            </CardTitle>
                                            <CardDescription className="font-medium mt-1 text-gray-600">
                                                Confidence: {result.prob}% • Severity: {result.severity}
                                            </CardDescription>
                                        </div>
                                        <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">{result.severity}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                            <Scan className="h-4 w-4 text-gray-400" /> Symptoms Detected
                                        </h3>
                                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm leading-relaxed border border-gray-100">
                                            {result.symptoms}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" /> Recommended Treatment
                                        </h3>
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                            <p className="text-green-800 font-medium text-sm leading-relaxed">
                                                {result.treatment}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Preventative Measures</h4>
                                        <ul className="text-sm space-y-2 text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 text-lg">•</span> Avoid overhead irrigation.
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 text-lg">•</span> Remove infected plant debris immediately.
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 text-lg">•</span> Use certified disease-free seeds.
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="h-full flex flex-col justify-center items-center p-8 text-center bg-gray-50/30 border-dashed">
                                <div className="bg-gray-100 p-4 rounded-full mb-4 opacity-50">
                                    <Scan className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-700">No Analysis Yet</h3>
                                <p className="text-gray-400 mt-2 max-w-xs mx-auto">
                                    Upload a clear image of a single leaf to get a detailed disease report and chemical recommendations.
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiseaseDetectionPage;
