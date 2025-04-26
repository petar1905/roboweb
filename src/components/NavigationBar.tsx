import NavigationLink from "./NavigationLink";
import { useTranslation } from "../hooks/useTranslation";

export default function NavigationBar() {
    const { t } = useTranslation();

    return (
        <div className="z-0">
            <nav className="navbar navbar-expand-lg bg-secondary-subtle">
                <div className="container-fluid">
                    <NavigationLink href="/" className="nav-link">
                        <h5 className="text-center">🏠</h5>
                        <small>{t("dashboard")}</small>
                    </NavigationLink>
                    <NavigationLink href="/store" className="nav-link text-center">
                        <h5 className="text-center">🏬</h5>
                        <small>{t("extensionStore")}</small>
                    </NavigationLink>
                    <NavigationLink href="/settings" className="nav-link text-center">
                        <h5>⚙️</h5>
                        <small>{t("settings")}</small>
                    </NavigationLink>
                </div>
            </nav>
        </div>
    );
}