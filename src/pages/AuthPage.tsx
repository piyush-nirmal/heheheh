import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, Sprout, Tractor } from 'lucide-react';
import { auth, googleProvider } from '@/config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regName, setRegName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      login(userCredential.user);
      toast.success('Welcome back, Farmer!');
      navigate('/');
    } catch (error: any) {
      toast.error('Login Failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      login(result.user);
      toast.success('Details verified with Google!');
      navigate('/');
    } catch (error: any) {
      toast.error('Google Login Failed: ' + error.message);
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
      toast.success('Registration Successful! Welcome to AAPLA 7/12.');
      navigate('/');
    } catch (error: any) {
      toast.error('Registration Failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans">
      {/* Left Side - Branding */}
      <div className="hidden md:flex flex-col justify-between bg-[#1b325f] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-orange-500 p-2 rounded-full">
              <span className="text-3xl">🌾</span>
            </div>
            <h1 className="text-3xl font-bold">AAPLA <span className="text-orange-400">७/१२</span></h1>
          </div>
          <div className="space-y-6 max-w-lg">
            <h2 className="text-4xl font-extrabold leading-tight">{t('auth.heroTitle')}</h2>
            <p className="text-lg opacity-80 leading-relaxed">{t('auth.heroDesc')}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-12">
            <div className="flex items-start gap-3">
              <div className="bg-white/10 p-2 rounded"><ShieldCheck className="h-6 w-6 text-green-400" /></div>
              <div>
                <h3 className="font-bold text-sm">{t('auth.secureRecords')}</h3>
                <p className="text-xs opacity-70">{t('auth.secureRecordsDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/10 p-2 rounded"><Sprout className="h-6 w-6 text-green-400" /></div>
              <div>
                <h3 className="font-bold text-sm">{t('nav.cropAdvisory')}</h3>
                <p className="text-xs opacity-70">AI-powered recommendations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/10 p-2 rounded"><Tractor className="h-6 w-6 text-orange-300" /></div>
              <div>
                <h3 className="font-bold text-sm">{t('nav.schemes')}</h3>
                <p className="text-xs opacity-70">PM-KISAN, PM-KUSUM & more</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-xs opacity-50 mt-auto pt-8">
          {t('footer.allRightsReserved')}
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-orange-500">
          <CardHeader className="text-center pb-2">
            <div className="md:hidden flex justify-center mb-4"><span className="text-4xl">🌾</span></div>
            <CardTitle className="text-2xl font-bold text-[#1b325f]">{t('auth.welcomeBack')}</CardTitle>
            <CardDescription>{t('auth.loginDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">{t('auth.loginTab')}</TabsTrigger>
                <TabsTrigger value="register">{t('auth.registerTab')}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.emailAddress')}</Label>
                    <Input id="email" type="email" placeholder="farmer@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.passwordLabel')}</Label>
                    <Input id="password" type="password" placeholder="••••••" required value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full bg-[#1b325f] hover:bg-[#2c4a87] h-11" disabled={isLoading}>
                    {isLoading ? t('auth.verifying') : t('auth.loginSecurely')}
                  </Button>

                  <div className="relative text-center text-sm py-2">
                    <span className="bg-white px-2 text-gray-500 relative z-10">{t('auth.orLoginWith')}</span>
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  </div>

                  <Button variant="outline" type="button" onClick={handleGoogleLogin} className="w-full gap-2 border-gray-300 h-11" disabled={isLoading}>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                    {t('auth.continueGoogle')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">{t('auth.fullName')}</Label>
                    <Input id="reg-name" placeholder="Rajesh Patil" value={regName} onChange={e => setRegName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">{t('auth.emailAddress')}</Label>
                    <Input id="reg-email" type="email" placeholder="rajesh@example.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-pass">{t('auth.createPassword')}</Label>
                    <Input id="reg-pass" type="password" placeholder="Strong password" value={regPass} onChange={e => setRegPass(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 h-11" disabled={isLoading}>
                    {isLoading ? t('auth.creatingAccount') : t('auth.registerFarmer')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t flex flex-col gap-2 text-center text-xs text-muted-foreground p-4">
            <p>{t('auth.terms')}</p>
            <p className="flex items-center justify-center gap-1"><ShieldCheck className="h-3 w-3 text-green-600" /> {t('auth.secured')}</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
