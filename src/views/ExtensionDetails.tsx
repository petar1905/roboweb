import { useNavigate, useParams } from "react-router";
import ExtensionInventory, { Extension } from "../classes/ExtensionInventory";
import { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

export default function ExtensionDetails() {
    localStorage.clear();
    const { t } = useTranslation();
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
            <button className="btn btn-danger" onClick={handleDeleteButtonPress}>{t("delete")}</button> :
            <button className="btn btn-success" onClick={handleInstallButtonPress}>{t("install")}</button>}
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
    const { t } = useTranslation();
    return (
        <thead>
            <tr>
                <th>{t("property")}</th>
                <th>{t("value")}</th>
            </tr>
        </thead> 
    )
}

function ExtensionDetailsTableBody({ extension }: { extension: Extension }) {
    const { t } = useTranslation();
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
                <td>{t("id")}</td>
                <td>{extension.metadata.id}</td>
            </tr>
            <tr>
                <td>{t("vendor")}</td>
                <td>{extension.metadata.manufacturer}</td>
            </tr>
            <tr>
                <td>{t("model")}</td>
                <td>{extension.metadata.model}</td>
            </tr>
            <tr>
                <td>{t("author")}</td>
                <td>{extension.metadata.author}</td>
            </tr>
            <tr>
                <td>{t("version")}</td>
                <td>{extension.metadata.version}</td>
            </tr>
            <tr>
                <td>{t("license")}</td>
                <td>{extension.metadata.license? extension.metadata.license : t("proprietary")}</td>
            </tr>
            {extension.metadata.repository && 
                <RepositoryRow 
                repositoryLink={extension.metadata.repository} 
                /* @ts-ignore */
                repositoryName={repositoryName}
                />
            }
        </tbody>
    )
}

function RepositoryRow({repositoryLink, repositoryName}: {repositoryLink: string, repositoryName: string}) {
    const { t } = useTranslation();
    return (
        <tr>
            <td>{t("repository")}</td>
            <td>
                <a href={repositoryLink} target="_blank" rel="noopener noreferrer">
                    {repositoryName || repositoryLink}
                </a>
            </td>
        </tr>
    )
}