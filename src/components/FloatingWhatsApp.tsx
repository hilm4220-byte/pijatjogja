// src/components/WhatsAppFloat.tsx
import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function WhatsAppFloat() {
  const { settings, loading } = useSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show tooltip on first load (after 3 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !settings.wa_number) return null;

  const encodedMessage = encodeURIComponent(settings.auto_message);
  const waUrl = `https://wa.me/${settings.wa_number}?text=${encodedMessage}`;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-3 w-64 animate-bounce">
            <div className="bg-white rounded-lg shadow-2xl p-4 relative">
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700"
              >
                <X size={14} />
              </button>
              <p className="text-sm text-gray-800 font-medium">
                💬 Butuh bantuan? Chat kami di WhatsApp!
              </p>
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
            </div>
          </div>
        )}

        {/* WhatsApp Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 group relative"
          aria-label="Chat via WhatsApp"
        >
          {/* Ripple Effect */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
          
          {/* Icon */}
          <MessageCircle size={28} className="relative z-10" />

          {/* Hover Tooltip */}
          <span className="absolute right-full mr-3 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat WhatsApp
          </span>
        </a>

        {/* Online Indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
      </div>
    </>
  );
}