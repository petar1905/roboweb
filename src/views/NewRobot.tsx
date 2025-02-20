import { useEffect, useState } from "react";
import { Extension } from "../classes/ExtensionInventory";
import ExtensionInventory from "../classes/ExtensionInventory";
import CheckboxButton from "../components/CheckboxButton";
import RobotInventory from "../classes/RobotInventory";
import { useNavigate } from "react-router";

function groupExtensionsByManufacturer(extensions: Extension[]): Record<string, string[]> {
    const manufacturerModelMapping: Record<string, Set<string>> = {};

    extensions.forEach(extension => {
        const manufacturer = extension.metadata.manufacturer;
        const model = extension.metadata.model;

        if (!manufacturerModelMapping[manufacturer]) {
            manufacturerModelMapping[manufacturer] = new Set();
        }

        manufacturerModelMapping[manufacturer].add(model);
    });

    return Object.fromEntries(
        Object.entries(manufacturerModelMapping).map(([manufacturer, models]) => {
            return [manufacturer, Array.from(models)];
        })
    );
}

export default function NewRobot() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [groupedExtensions, setGroupedExtensions] = useState({});
    const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);
    const [extensions, setExtensions] = useState<Extension[]>([]);
    const [settings, setSettings] = useState({});
    const extensionInventory = new ExtensionInventory();

    useEffect(() => {
        extensionInventory.openDatabase().then(() => {
            extensionInventory.getAllExtensions().then((extensions) => {
                setExtensions(extensions);
                const grouped = groupExtensionsByManufacturer(extensions);
                setGroupedExtensions(grouped);
            });
        });
    }, []);

    const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBrand(event.target.value);
        setSelectedModel("");
        setSelectedExtension(null);
        setSettings({});
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModel(event.target.value);
        const extension = extensions.find((ext) => ext.metadata.model === event.target.value && ext.metadata.manufacturer === selectedBrand);
        if (extension) {
            setSelectedExtension(extension);
            try {
                const settings = JSON.parse(extension.metadata.settings);
                setSettings(settings);
            } catch (error) {
                console.error("Error parsing settings:", error);
            }
        }
    };

    const handleSettingChange = (key: string, value: any) => {
        const updatedSettings = {...settings };
        /* @ts-ignore */
        updatedSettings[key] = value;
        setSettings(updatedSettings);
    };

    const renderSettingField = (key: string, value: any) => {
        const type = typeof value;
        switch (type) {
            case "string":
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(event) => handleSettingChange(key, event.target.value)}
                    />
                );
            case "number":
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(event) => handleSettingChange(key, parseFloat(event.target.value))}
                    />
                );
            case "boolean":
                return (
                    <input
                        type="checkbox"
                        checked={value}
                        onChange={(event) => handleSettingChange(key, event.target.checked)}
                    />
                );
            default:
                return <div>Unsupported type: {type}</div>;
        }
    };


    const handleFinish = () => {
        const robotInventory = new RobotInventory();
        robotInventory.openDatabase().then(
            () => {
                /* @ts-ignore */
                robotInventory.addRobot(name, selectedExtension.metadata.filename, settings);
                navigate("/");
            }
        );
    };
    return (
        <div className="p-2">
            <h1>New Robot</h1>
            <div>
                <label>
                    Name:
                    <input type="text" onChange={handleNameChange} />
                </label>
            </div>
            <div>
                <label>
                    Brand:
                    <select value={selectedBrand} onChange={handleBrandChange}>
                        <option value="">Select a brand</option>
                        {Object.keys(groupedExtensions).map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select> 
                </label>
            </div>
            {selectedBrand && (
                <div>
                    <label>
                        Model: 
                        <select value={selectedModel} onChange={handleModelChange}>
                            <option value="">Select a model</option>
                            {/* @ts-ignore */}
                            {groupedExtensions[selectedBrand].map((model) => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </label>
                </div>
            )}
            {selectedExtension && (
                <div>
                    {Object.keys(settings).map((key) => (
                        <div key={key}>
                            <label>
                                {key}:
                                {/* @ts-ignore */}
                                {renderSettingField(key, settings[key])}
                            </label>
                        </div>
                    ))}
                </div>
            )}
            <CheckboxButton onClick={handleFinish}/>
        </div>
    );
}