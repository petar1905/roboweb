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
        };
        try {
            fetchExtension();
        } catch (error) {
            console.error("Error fetching extension: ", error);
        }
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
            {extension && <ExtensionDetailsTable extension={extension}/>}
            {isInstalled? 
            <button className="btn btn-danger" onClick={handleDeleteButtonPress}>Delete</button> :
            <button className="btn btn-success" onClick={handleInstallButtonPress}>Install</button>}
        </div>
    )
}

function ExtensionDetailsTable({extension}: {extension: Extension}) {
    return (
        <table className="table table-striped-columns">
            <ExtensionDetailsTableHead />
            <ExtensionDetailsTableBody extension={extension} />
        </table>
    )
}

function ExtensionDetailsTableHead() {
    return (
        <thead>
            <tr>
                <th>Property</th>
                <th>Value</th>
            </tr>
        </thead> 
    )
}

function ExtensionDetailsTableBody({ extension }: { extension: Extension }) {
    const [repositoryName, setRepositoryName] = useState<string | null>(null);

    useEffect(() => {
        if (extension.metadata.repository) {
            const url = new URL(extension.metadata.repository);
            const hostname = url.hostname;
            const domain = hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
            setRepositoryName(domain);
        }
    }, [extension]);

    return (
        <tbody>
            <tr>
                <td>ID</td>
                <td>{extension.metadata.id}</td>
            </tr>
            <tr>
                <td>Manufacturer</td>
                <td>{extension.metadata.manufacturer}</td>
            </tr>
            <tr>
                <td>Model</td>
                <td>{extension.metadata.model}</td>
            </tr>
            <tr>
                <td>Author</td>
                <td>{extension.metadata.author}</td>
            </tr>
            <tr>
                <td>Version</td>
                <td>{extension.metadata.version}</td>
            </tr>
            <tr>
                <td>License</td>
                <td>{extension.metadata.license? extension.metadata.license : "Proprietary/Unknown"}</td>
            </tr>
            {extension.metadata.repository && (
                <tr>
                    <td>Repository</td>
                    <td>
                        <a href={extension.metadata.repository} target="_blank" rel="noopener noreferrer">
                            {repositoryName || extension.metadata.repository}
                        </a>
                    </td>
                </tr>
            )}
        </tbody>
    )
}