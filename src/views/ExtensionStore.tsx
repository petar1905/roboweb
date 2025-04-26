import { useState, useEffect } from "react";
import ExtensionInventory, { Extension } from "../classes/ExtensionInventory";
import ExtensionTable from "../components/ExtensionTable";
import { useTranslation } from "../hooks/useTranslation";

export default function ExtensionStore() {
    localStorage.clear();
    const { t } = useTranslation();
    const [installedExtensions, setInstalledExtensions] = useState<Extension[]>([]);
    const [availableExtensions, setAvailableExtensions] = useState<Extension[]>([]);
    const extensionInventory = new ExtensionInventory();
    useEffect(() => {
        const completeProcess = (extensions: Extension[]) => setInstalledExtensions(extensions);
        const fetchInstalledExtensions = async () => {
            await extensionInventory.openDatabase();
            extensionInventory.getInstalledExtensions().then(completeProcess);
        };
        fetchInstalledExtensions();
    }, []);

    useEffect(() => {
        const completeProcess = (extensions: Extension[]) => setAvailableExtensions(extensions);
        extensionInventory.getAvailableExtensions().then(completeProcess);
    }, []);

    return (
        <div className="p-2">
            <h1>{t("extensionStore")}</h1>
            {installedExtensions.length > 0 ? <ExtensionTable title={t("installedExtensions")} extensions={installedExtensions}/> : null}
            {availableExtensions.length > 0 ? <ExtensionTable title={t("availableExtensions")} extensions={availableExtensions}/> : null}
        </div>
    )
}