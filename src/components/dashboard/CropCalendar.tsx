import { Calendar, Sprout, Combine, Droplets, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const CropCalendar = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    return (
        <Card>
            <CardHeader className="py-3 px-4 bg-gray-50 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" /> Season Timeline ({currentMonth})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-200"></div>

                    {/* Timeline Items */}
                    <div className="space-y-6">
                        <div className="relative flex items-start gap-4">
                            <div className="bg-green-100 text-green-600 p-2 rounded-full z-10 border-2 border-white shadow-sm shrink-0">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm">Sowing Completed</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">Wheat (Rabi Season)</p>
                                <span className="text-[10px] text-gray-400">Nov 15 - Dec 10</span>
                            </div>
                        </div>

                        <div className="relative flex items-start gap-4">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full z-10 border-2 border-white shadow-sm shrink-0 animate-pulse">
                                <Droplets className="h-5 w-5" />
                            </div>
                            <div className="flex-1 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-sm text-blue-800">Irrigation Due</h4>
                                    <span className="px-1.5 py-0.5 bg-blue-200 text-blue-800 text-[10px] rounded font-bold">TODAY</span>
                                </div>
                                <p className="text-xs text-blue-600 mt-1">2nd Irrigation (Vegetative Stage)</p>
                            </div>
                        </div>

                        <div className="relative flex items-start gap-4">
                            <div className="bg-orange-100 text-orange-600 p-2 rounded-full z-10 border-2 border-white shadow-sm shrink-0 opacity-60">
                                <Combine className="h-5 w-5" />
                            </div>
                            <div className="flex-1 opacity-70">
                                <h4 className="font-semibold text-sm">Harvesting</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">Expected April 1st Week</p>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                                    <div className="bg-orange-400 h-1.5 rounded-full w-[25%]"></div>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 block">65 days to go</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
