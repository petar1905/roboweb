import NavigationLink from "../components/NavigationLink";
import LanguageSelector from "../components/LanguageSelector";
import { useTranslation } from "../hooks/useTranslation";

export default function Settings() {
    localStorage.clear();
    const { t } = useTranslation();
    return (
        <div className="p-2">
            <h1>{t("settings")}</h1>
            <div className="mb-3">
                <LanguageSelector />
            </div>
            <NavigationLink href="/new-extension">
                <button className="btn btn-info w-100">{t("sideloadExtension")}</button>
            </NavigationLink>
        </div>
    );
}