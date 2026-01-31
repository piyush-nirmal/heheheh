import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, AlertCircle, CheckCircle2, Globe, Headphones } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const ContactPage = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            toast({
                title: 'Message Sent Successfully!',
                description: 'Our team will get back to you within 24-48 hours.',
            });
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                category: '',
                message: '',
            });
            setIsSubmitting(false);
        }, 1500);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#1b325f] to-[#2a4a7f] text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                            We're here to help! Reach out to us for any queries, technical support, or feedback.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Contact Information */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Quick Contact Cards */}
                        <Card className="border-t-4 border-t-green-600 shadow-lg">
                            <CardHeader className="bg-green-50">
                                <CardTitle className="flex items-center gap-2 text-green-800">
                                    <Phone className="h-5 w-5" />
                                    Kisan Call Center
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <a href="tel:18001801551" className="text-2xl font-bold text-green-600 hover:text-green-700 block mb-2">
                                    1800-180-1551
                                </a>
                                <p className="text-sm text-gray-600 mb-3">Toll-Free Helpline (24/7)</p>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Available in 22 Languages
                                </Badge>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-red-600 shadow-lg">
                            <CardHeader className="bg-red-50">
                                <CardTitle className="flex items-center gap-2 text-red-800">
                                    <AlertCircle className="h-5 w-5 animate-pulse" />
                                    Emergency Helpline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <a href="tel:18001155526" className="text-2xl font-bold text-red-600 hover:text-red-700 block mb-2">
                                    1800-11-5526
                                </a>
                                <p className="text-sm text-gray-600">For urgent crop disease/pest attacks</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <Mail className="h-5 w-5 text-orange-600" />
                                    Email Support
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <a href="mailto:support@farminsights.gov.in" className="text-orange-600 hover:text-orange-700 break-all">
                                    support@farminsights.gov.in
                                </a>
                                <p className="text-sm text-gray-500 mt-2">Response within 24-48 hours</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    Office Hours
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Monday - Friday:</span>
                                        <span className="font-medium">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Saturday:</span>
                                        <span className="font-medium">9:00 AM - 2:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sunday:</span>
                                        <span className="font-medium text-red-600">Closed</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-purple-800">
                                    <Headphones className="h-5 w-5" />
                                    AI Assistant
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-700 mb-3">
                                    Get instant answers from our Kisan AI chatbot
                                </p>
                                <Button
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                    onClick={() => {
                                        const chatButton = document.querySelector('[class*="fixed bottom"]') as HTMLElement;
                                        chatButton?.click();
                                    }}
                                >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Start Chat
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
                                <CardTitle className="text-2xl text-gray-800">Send Us a Message</CardTitle>
                                <CardDescription>
                                    Fill out the form below and our team will respond as soon as possible
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                placeholder="Enter your full name"
                                                value={formData.name}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="10-digit mobile number"
                                                value={formData.phone}
                                                onChange={(e) => handleChange('phone', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your.email@example.com"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Query Category *</Label>
                                        <Select value={formData.category} onValueChange={(value) => handleChange('category', value)} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="technical">Technical Support</SelectItem>
                                                <SelectItem value="crop">Crop Advisory</SelectItem>
                                                <SelectItem value="soil">Soil Testing</SelectItem>
                                                <SelectItem value="disease">Disease Detection</SelectItem>
                                                <SelectItem value="market">Market Prices</SelectItem>
                                                <SelectItem value="scheme">Government Schemes</SelectItem>
                                                <SelectItem value="feedback">Feedback/Suggestions</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input
                                            id="subject"
                                            placeholder="Brief subject of your query"
                                            value={formData.subject}
                                            onChange={(e) => handleChange('subject', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Describe your query in detail..."
                                            rows={6}
                                            value={formData.message}
                                            onChange={(e) => handleChange('message', e.target.value)}
                                            required
                                            className="resize-none"
                                        />
                                        <p className="text-xs text-gray-500">Minimum 20 characters</p>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                            <div className="text-sm text-blue-800">
                                                <p className="font-medium mb-1">Privacy Notice</p>
                                                <p className="text-blue-700">
                                                    Your information is secure and will only be used to respond to your query.
                                                    We never share your data with third parties.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg bg-[#1b325f] hover:bg-[#15274a]"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-5 w-5" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Office Address */}
                        <Card className="mt-6 shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <MapPin className="h-5 w-5 text-red-600" />
                                    Head Office Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-semibold text-gray-800">Ministry of Agriculture & Farmers Welfare</p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Krishi Bhawan, Dr. Rajendra Prasad Road<br />
                                            New Delhi - 110001, India
                                        </p>
                                    </div>
                                    <div className="pt-3 border-t">
                                        <Button variant="outline" className="w-full" asChild>
                                            <a
                                                href="https://www.google.com/maps/place/Krishi+Bhawan"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MapPin className="mr-2 h-4 w-4" />
                                                View on Google Maps
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12">
                    <Card className="shadow-lg border-t-4 border-t-orange-500">
                        <CardHeader className="bg-orange-50">
                            <CardTitle className="text-2xl text-gray-800">Frequently Asked Questions</CardTitle>
                            <CardDescription>Quick answers to common queries</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">How do I get my Soil Health Card?</h4>
                                    <p className="text-sm text-gray-600">
                                        Visit your nearest Soil Testing Laboratory or contact your local agriculture office.
                                        You can also register online through the Soil Health Card portal.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Is the AI crop advisory accurate?</h4>
                                    <p className="text-sm text-gray-600">
                                        Our AI uses scientific data from ICAR and real-time weather. However, always consult
                                        local agricultural experts for final decisions.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">How can I report a technical issue?</h4>
                                    <p className="text-sm text-gray-600">
                                        Use the contact form above and select "Technical Support" as the category.
                                        Include screenshots if possible for faster resolution.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Can I use this service offline?</h4>
                                    <p className="text-sm text-gray-600">
                                        Yes! Our app works offline with cached data. The AI chatbot has offline knowledge
                                        for common crops like Wheat, Rice, and Maize.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
