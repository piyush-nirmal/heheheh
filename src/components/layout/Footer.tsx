import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-[#1a1a1a] text-white pt-12 pb-6">
            <div className="max-w-screen-2xl mx-auto px-4">
                {/* Main Footer Links */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: About */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-l-4 border-orange-500 pl-3">{t('footer.aboutUs')}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            {t('footer.aboutDesc')}
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube className="h-5 w-5" /></a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-l-4 border-orange-500 pl-3">{t('footer.quickLinks')}</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-orange-500 transition-colors">{t('footer.home')}</Link></li>
                            <li><Link to="/map" className="hover:text-orange-500 transition-colors">{t('nav.mapView')}</Link></li>
                            <li><Link to="/crops" className="hover:text-orange-500 transition-colors">{t('footer.myCrops')}</Link></li>
                            <li><Link to="/soil" className="hover:text-orange-500 transition-colors">{t('footer.soilHealthCard')}</Link></li>
                            <li><Link to="/contact" className="hover:text-orange-500 transition-colors">{t('footer.contactUs')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Important Websites */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-l-4 border-orange-500 pl-3">{t('footer.relatedSites')}</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="https://icar.org.in/" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors">ICAR Official Website</a></li>
                            <li><a href="https://agricoop.nic.in/" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors">Ministry of Agriculture</a></li>
                            <li><a href="https://pmkisan.gov.in/" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors">PM Kisan Samman Nidhi</a></li>
                            <li><a href="https://enam.gov.in/" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors">e-NAM Portal</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-l-4 border-orange-500 pl-3">{t('footer.contactUs')}</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-orange-500 shrink-0" />
                                <span>Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-orange-500 shrink-0" />
                                <span>1800-180-1551 (Toll Free)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-orange-500 shrink-0" />
                                <span>helpdesk@kisan.gov.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <div className="flex flex-wrap gap-4 mb-4 md:mb-0 justify-center">
                        <a href="#" className="hover:text-white">{t('footer.websitePolicy')}</a>
                        <span className="hidden md:inline">|</span>
                        <a href="#" className="hover:text-white">{t('footer.help')}</a>
                        <span className="hidden md:inline">|</span>
                        <a href="#" className="hover:text-white">{t('footer.disclaimer')}</a>
                        <span className="hidden md:inline">|</span>
                        <a href="#" className="hover:text-white">{t('footer.feedback')}</a>
                        <span className="hidden md:inline">|</span>
                        <a href="#" className="hover:text-white">{t('footer.accessibilityStatement')}</a>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="mb-1">{t('footer.allRightsReserved')}</p>
                        <p>{t('footer.lastUpdated')} {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
