import { useState, useEffect } from "react";
import ExtensionInventory, { Extension } from "../classes/ExtensionInventory";
import ExtensionTable from "../components/ExtensionTable";

export default function ExtensionStore() {
    const [installedExtensions, setInstalledExtensions] = useState<Extension[]>([]);
    const [availableExtensions, setAvailableExtensions] = useState<Extension[]>([]);
    const extensionInventory = new ExtensionInventory();
    useEffect(() => {
        extensionInventory.openDatabase().then(() => {
            extensionInventory.getInstalledExtensions().then((installedExtensions) => {
                setInstalledExtensions(installedExtensions);
            });
        });
    }, []);

    useEffect(() => {
        extensionInventory.getAvailableExtensions().then((availableExtensions) => {
            setAvailableExtensions(availableExtensions);
        });
    }, []);
    return (
        <div className="p-2">
            <h1>Extension Store</h1>
            <h2>Installed Extensions</h2>
            <ExtensionTable extensions={installedExtensions}/>
            <h2>Available Extensions</h2>
            <ExtensionTable extensions={availableExtensions}/>
        </div>
    )
}