import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";

export default function LanguageSelector() {
    const { language, setLanguage } = useContext(LanguageContext);
    const { t } = useTranslation();

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    };

    return (
        <div className="input-group input-group-sm">
            <span className="input-group-text" id="language-selector-label">{t("language")}</span>
            <select
                value={language}
                onChange={handleLanguageChange}
                className="form-select"
                aria-label="Language Selector"
                aria-describedby="language-selector-label"
            >
                <option value="en">English</option>
                <option value="bg">Български</option>
            </select>
        </div>
    );
}