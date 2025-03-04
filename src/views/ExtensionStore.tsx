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

    const InstalledExtensions = () => {
        return (
            <>
                <h5>Installed Extensions</h5>
                <ExtensionTable extensions={installedExtensions}/>
            </>
        )
    };

    const AvailableExtensions = () => {
        return (
            <>
                <h5>Available Extensions</h5>
                <ExtensionTable extensions={availableExtensions}/>
            </>
        )
    };
    return (
        <div className="p-2">
            <h1>Extension Store</h1>
            {installedExtensions.length > 0 ? <InstalledExtensions/> : null}
            {availableExtensions.length > 0 ? <AvailableExtensions/> : null}
        </div>
    )
}