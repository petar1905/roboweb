import { useState, useEffect } from "react";
import ExtensionInventory, { Extension } from "../classes/ExtensionInventory";
import ExtensionTable from "../components/ExtensionTable";

export default function ExtensionStore() {
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
            <h1>Extension Store</h1>
            {installedExtensions.length > 0 ? <ExtensionTable title="Installed Extensions" extensions={installedExtensions}/> : null}
            {availableExtensions.length > 0 ? <ExtensionTable title="Available Extensions" extensions={availableExtensions}/> : null}
        </div>
    )
}