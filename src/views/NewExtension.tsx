import { useState } from "react";
import { useNavigate } from "react-router";
import ExtensionInventory, { Extension } from "../classes/ExtensionInventory";
import NavigationBarButton from "../components/NavigationBarButton";

export default function NewExtension() {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState({
        id: "",
        filename: "",
        model: "",
        manufacturer: "",
        author: "",
        version: "",
        license: "",
        repository: "",
        settings: "{}",
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
        if (selectedFile) {
            setMetadata((prev) => ({
                ...prev,
                filename: selectedFile.name,
            }));
        }
    };

    const handleMetadataChange = (key: string, value: string) => {
        setMetadata((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        if (!file) {
            alert("Please select a file.");
            return;
        }

        const extensionInventory = new ExtensionInventory();
        await extensionInventory.openDatabase();

        const newExtension: Extension = {
            metadata: {
                ...metadata,
                id: crypto.randomUUID(),
                contentType: file.type,
            },
            file: new Blob([file], { type: file.type }),
        };

        await extensionInventory.saveExtension(newExtension);
        navigate("/store");
    };

    const canSave = file && metadata.model && metadata.manufacturer;

    return (
        <div className="p-2">
            <nav className="d-flex pb-2">
                <h1 className="w-100 my-auto">New Extension</h1>
                {canSave ? <NavigationBarButton onClick={handleSave}>✅</NavigationBarButton> : null}
            </nav>
            <div className="mb-3">
                <label className="form-label">Extension File</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Model</label>
                <input
                    type="text"
                    className="form-control"
                    value={metadata.model}
                    onChange={(e) => handleMetadataChange("model", e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Manufacturer</label>
                <input
                    type="text"
                    className="form-control"
                    value={metadata.manufacturer}
                    onChange={(e) => handleMetadataChange("manufacturer", e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Author</label>
                <input
                    type="text"
                    className="form-control"
                    value={metadata.author}
                    onChange={(e) => handleMetadataChange("author", e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Version</label>
                <input
                    type="text"
                    className="form-control"
                    value={metadata.version}
                    onChange={(e) => handleMetadataChange("version", e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">License</label>
                <input
                    type="text"
                    className="form-control"
                    value={metadata.license}
                    onChange={(e) => handleMetadataChange("license", e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Repository</label>
                <input
                    type="text"
                    className="form-control"
                    value={metadata.repository}
                    onChange={(e) => handleMetadataChange("repository", e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Settings (JSON)</label>
                <textarea
                    className="form-control"
                    rows={3}
                    value={metadata.settings}
                    onChange={(e) => handleMetadataChange("settings", e.target.value)}
                />
            </div>
        </div>
    );
}