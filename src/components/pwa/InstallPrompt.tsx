import { useState, useEffect } from 'react';
import { Download, X, Share, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if device is iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(ios);

        // Listen for install prompt on Android/Desktop
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show prompt after a small delay to not annoy immediately
            setTimeout(() => setIsOpen(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // For iOS, straightforward detection isn't available for "installability", 
        // but we can check if it's running standalone.
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        if (ios && !isStandalone) {
            // Show instructions for iOS users after delay
            setTimeout(() => setIsOpen(true), 5000);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;

        if (result.outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsOpen(false);
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <div className="flex justify-center mb-4">
                            <div className="bg-orange-100 p-4 rounded-full">
                                <Smartphone className="h-10 w-10 text-orange-600" />
                            </div>
                        </div>
                        <DrawerTitle className="text-center text-xl font-bold text-[#1b325f]">Install AAPLA 7/12 App</DrawerTitle>
                        <DrawerDescription className="text-center">
                            Get faster access, offline improvements, and instant notifications by installing our app.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        {isIOS ? (
                            <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-3 border border-gray-200">
                                <p className="font-semibold text-gray-700 flex items-center gap-2">
                                    <Share className="h-4 w-4" /> Step 1: Tap the Share button
                                </p>
                                <p className="font-semibold text-gray-700 flex items-center gap-2">
                                    <Download className="h-4 w-4" /> Step 2: Select "Add to Home Screen"
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <ul className="text-sm space-y-2 text-gray-600 mb-4">
                                    <li className="flex items-center gap-2">🚀 Faster loading speed</li>
                                    <li className="flex items-center gap-2">📡 Works offline</li>
                                    <li className="flex items-center gap-2">📱 Native app experience</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <DrawerFooter>
                        {!isIOS && (
                            <Button onClick={handleInstallClick} className="w-full bg-[#1b325f] text-white font-bold h-12 text-lg">
                                <Download className="mr-2 h-5 w-5" /> Install Now
                            </Button>
                        )}
                        <DrawerClose asChild>
                            <Button variant="outline">Maybe Later</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
