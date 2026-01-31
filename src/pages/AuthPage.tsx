import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Sprout, Tractor, ShieldCheck } from 'lucide-react';
import { auth, googleProvider } from '@/config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

const AuthPage = () => {
    const navigate = useNavigate();
    const { login } = useApp();
    const [isLoading, setIsLoading] = useState(false);

    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Register State
    const [regEmail, setRegEmail] = useState('');
    const [regPass, setRegPass] = useState('');
    const [regName, setRegName] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            login(userCredential.user);
            toast.success("Welcome back, Farmer!");
            navigate('/');
        } catch (error: any) {
            console.error(error);
            toast.error("Login Failed: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            login(result.user);
            toast.success("Details verified with Google!");
            navigate('/');
        } catch (error: any) {
            console.error(error);
            toast.error("Google Login Failed: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPass);
            login(userCredential.user);
            toast.success("Registration Successful! Welcome to AAPLA 7/12.");
            navigate('/');
        } catch (error: any) {
            console.error(error);
            toast.error("Registration Failed: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Hero / Branding (Unchanged) */}
            <div className="hidden md:flex flex-col justify-between bg-[#1b325f] text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-orange-500 p-2 rounded-full">
                            <span className="text-3xl">🌾</span>
                        </div>
                        <h1 className="text-3xl font-bold">AAPLA <span className="text-orange-400">७/१२</span></h1>
                    </div>
                    <div className="space-y-6 max-w-lg">
                        <h2 className="text-4xl font-extrabold leading-tight">
                            Empowering Farmers with <br /> Digital Agriculture
                        </h2>
                        <p className="text-lg opacity-80 leading-relaxed">
                            Access your 7/12 records, get real-time crop advisory, and apply for government schemes - all in one secure portal.
                        </p>
                    </div>
                </div>
                <div className="relative z-10 grid grid-cols-2 gap-6 mt-12">
                    <div className="flex items-start gap-3">
                        <div className="bg-white/10 p-2 rounded"><ShieldCheck className="h-6 w-6 text-green-400" /></div>
                        <div><h3 className="font-bold text-sm">Secure Records</h3><p className="text-xs opacity-70">Digitally signed documents</p></div>
                    </div>
                    {/* ... other items ... */}
                </div>
                <div className="relative z-10 text-xs opacity-50 mt-auto pt-8">
                    © 2024 Ministry of Agriculture. All Rights Reserved.
                </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="flex items-center justify-center p-4 bg-gray-50">
                <Card className="w-full max-w-md shadow-xl border-t-4 border-orange-500">
                    <CardHeader className="text-center pb-2">
                        <div className="md:hidden flex justify-center mb-4"><span className="text-4xl">🌾</span></div>
                        <CardTitle className="text-2xl font-bold text-[#1b325f]">Welcome Back</CardTitle>
                        <CardDescription>Login to access your dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="farmer@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full bg-[#1b325f] hover:bg-[#2c4a87] h-11 text-md" disabled={isLoading}>
                                        {isLoading ? 'Verifying...' : 'Login Securely'}
                                    </Button>

                                    <div className="relative text-center text-sm py-2">
                                        <span className="bg-white px-2 text-gray-500 relative z-10">Or login with</span>
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                    </div>

                                    <Button variant="outline" type="button" onClick={handleGoogleLogin} className="w-full gap-2 border-gray-300 h-11" disabled={isLoading}>
                                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                                        Continue with Google
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-name">Full Name</Label>
                                        <Input id="reg-name" placeholder="Rajesh Patil" value={regName} onChange={e => setRegName(e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-email">Email Address</Label>
                                        <Input id="reg-email" type="email" placeholder="rajesh@example.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-pass">Create Password</Label>
                                        <Input id="reg-pass" type="password" placeholder="Strong password" value={regPass} onChange={e => setRegPass(e.target.value)} required />
                                    </div>
                                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 h-11 text-md" disabled={isLoading}>
                                        {isLoading ? 'Creating Account...' : 'Register as New Farmer'}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t flex flex-col gap-2 text-center text-xs text-muted-foreground p-4">
                        <p>By continuing, you agree to our Terms of Service.</p>
                        <p className="flex items-center justify-center gap-1"><ShieldCheck className="h-3 w-3 text-green-600" /> Secured by Government Standards.</p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default AuthPage;
