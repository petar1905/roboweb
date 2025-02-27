import { useNavigate, useParams } from "react-router";
import ExtensionInventory, { Extension } from "../classes/ExtensionInventory";
import { useEffect, useState } from "react";

export default function ExtensionDetails() {
    let { extensionId } = useParams();
    const [extension, setExtension] = useState<Extension | null>();
    const [isInstalled, setIsInstalled] = useState<boolean>(false);
    const extensionInventory = new ExtensionInventory();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchExtension = async () => {
            try {
                await extensionInventory.openDatabase();
                // @ts-ignore
                const installedExtension = await extensionInventory.getInstalledExtension(extensionId);
                if (installedExtension) {
                    setIsInstalled(true);
                    setExtension(installedExtension);
                } else {
                    setIsInstalled(false);
                    // @ts-ignore
                    const downloadedExtension = await extensionInventory.downloadExtension(extensionId);
                    setExtension(downloadedExtension);
                }
            } catch (error) {
                console.error('Error fetching extension:', error);
            }
        };
        fetchExtension();
    }, [extensionId, extensionInventory]);

    const handleInstallButtonPress = () => {
        extensionInventory.openDatabase().then(() => {
            // @ts-ignore
            extensionInventory.saveExtension(extension);
        });
        navigate("/store");
    };

    const handleDeleteButtonPress = () => {
        extensionInventory.openDatabase().then(() => {
            // @ts-ignore
            extensionInventory.deleteExtension(extension?.metadata.id);
        });
        navigate("/store");
    };

    return (
        <div className="p-2">
            <h1>Details</h1>
            <p>ID: {extension?.metadata.id}</p>
            <p>Manufacturer: {extension?.metadata.manufacturer}</p>
            <p>Model: {extension?.metadata.model}</p>
            <p>Author: {extension?.metadata.author}</p>
            <p>License: {extension?.metadata.license ? extension.metadata.license : "Proprietary/Unknown"}</p>
            {extension?.metadata.repository ? <p>Repository: {extension.metadata.repository}</p> : null}

            {isInstalled ? 
            <button className="btn btn-danger" onClick={handleDeleteButtonPress}>Delete</button> :
            <button className="btn btn-success" onClick={handleInstallButtonPress}>Install</button>}
        </div>
    )
}