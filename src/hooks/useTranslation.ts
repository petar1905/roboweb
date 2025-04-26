import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import en from "../i18n/en.json";
import bg from "../i18n/bg.json";

const translations: Record<string, Record<string, string>> = { en, bg };

export const useTranslation = () => {
    const { language } = useContext(LanguageContext);

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return { t };
};