import { Phone, Mail, MapPin, Clock, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ContactSection = () => {
    return (
        <div className="bg-gradient-to-br from-[#1b325f] to-[#2a4a7f] text-white py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Need Help?</h2>
                    <p className="text-blue-100">We're here to assist you 24/7</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Kisan Call Center */}
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Kisan Call Center</h3>
                            <a href="tel:18001801551" className="text-2xl font-bold text-green-300 hover:text-green-200">
                                1800-180-1551
                            </a>
                            <p className="text-sm text-blue-100 mt-2">Toll-Free Helpline</p>
                        </CardContent>
                    </Card>

                    {/* Email Support */}
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Email Support</h3>
                            <a href="mailto:support@farminsights.gov.in" className="text-sm text-orange-300 hover:text-orange-200 break-all">
                                support@farminsights.gov.in
                            </a>
                            <p className="text-sm text-blue-100 mt-2">24-48 hrs response</p>
                        </CardContent>
                    </Card>

                    {/* Office Hours */}
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Office Hours</h3>
                            <p className="text-blue-100 text-sm">Monday - Saturday</p>
                            <p className="text-xl font-bold text-blue-300 mt-1">9:00 AM - 6:00 PM</p>
                            <p className="text-sm text-blue-100 mt-2">IST</p>
                        </CardContent>
                    </Card>

                    {/* Live Chat */}
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Headphones className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">AI Assistant</h3>
                            <p className="text-sm text-blue-100 mb-3">Chat with Kisan AI</p>
                            <Button
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                                onClick={() => {
                                    // This will trigger the chatbot to open
                                    const chatButton = document.querySelector('[class*="fixed bottom"]') as HTMLElement;
                                    chatButton?.click();
                                }}
                            >
                                Start Chat
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Emergency Contact */}
                <div className="mt-8 bg-red-500/20 border-2 border-red-400 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Phone className="h-5 w-5 text-red-300 animate-pulse" />
                        <h4 className="font-bold text-lg">Emergency Agricultural Helpline</h4>
                    </div>
                    <p className="text-sm text-blue-100 mb-2">For urgent crop disease outbreaks or pest attacks</p>
                    <a href="tel:1800115526" className="text-2xl font-bold text-red-300 hover:text-red-200">
                        1800-11-5526
                    </a>
                </div>

                {/* Address */}
                <div className="mt-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-100">
                        <MapPin className="h-4 w-4" />
                        <p className="text-sm">
                            Ministry of Agriculture & Farmers Welfare, Krishi Bhawan, New Delhi - 110001
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
