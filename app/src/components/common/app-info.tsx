import { useState } from 'react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import Assets from '@/assets';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function AppInfo() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  return (
    <div className="relative bg-gray-100 flex flex-col items-center justify-center z-[9999]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition">
        {t('appInfo.showInfo')}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#00000080] bg-opacity-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Popup (Bottom to Top Animation with Tailwind) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-500 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <div className="max-w-md mx-auto bg-gray-800 rounded-t-3xl overflow-hidden shadow-2xl relative">
          {/* Header Section */}
          <div>
            <img src={Assets.bannerbeasy} alt="Banner bEASY" className="w-full" />
          </div>

          {/* Logo Floating Between */}
          <div className="absolute top-[calc(100vw*0.39)] left-1/2 transform -translate-x-1/2">
            <div className="w-[54px] h-[54px] rounded-full flex items-center justify-center shadow-lg border-3 border-[#FFF]">
              <img
                src={Assets.beasylogo}
                alt="bEASY Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* Bottom Section with Company Info */}
          <div className="bg-gray-900 px-4 pt-12 pb-8">
            {/* Company Name and Description */}
            <div className="text-center mb-8">
              <h2 className="text-white text-[16px] font-bold mb-3">{t('appInfo.appName')}</h2>
              <p className="text-gray-300 text-[14px] leading-relaxed">
                {t('appInfo.appDescription')}
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 mr-4 text-white" />
                <a href="tel:+85510957098" className="text-sm">
                  +855 10 957 098
                </a>
              </div>

              <div className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 mr-4 text-white" />
                <a href="mailto:support@beasy.info" className="text-sm">
                  support@beasy.info
                </a>
              </div>

              <div className="flex items-center text-gray-300">
                <Globe className="w-5 h-5 mr-4 text-white" />
                <a
                  href="https://beasy.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm">
                  beasy.info
                </a>
              </div>

              <div className="flex items-start text-gray-300">
                <MapPin className="w-5 h-5 mr-4 text-white mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t('appInfo.address')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
