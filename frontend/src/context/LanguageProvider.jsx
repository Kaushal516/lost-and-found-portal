import React, { useState, useEffect } from 'react';
import { translations } from '../utils/translations';
import { LanguageContext } from './LanguageContext';

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    const availableLanguages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi (हिन्दी)' },
        { code: 'bn', name: 'Bengali (বাংলা)' },
        { code: 'te', name: 'Telugu (తెలుగు)' },
        { code: 'mr', name: 'Marathi (मराठी)' },
        { code: 'ta', name: 'Tamil (தமிழ்)' }
    ];

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (path) => {
        const keys = path.split('.');
        let result = translations[language];
        if (!result) result = translations['en']; // Final fallback to English if lang missing

        for (const key of keys) {
            if (result && result[key]) {
                result = result[key];
            } else {
                // Try fallback to English for the specific path
                let fallback = translations['en'];
                for (const fKey of keys) {
                    if (fallback && fallback[fKey]) fallback = fallback[fKey];
                    else return path;
                }
                return fallback;
            }
        }
        return result;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, availableLanguages, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
