import { useEffect, useState } from "react";
import { Extension } from "../classes/ExtensionInventory";
import ExtensionInventory from "../classes/ExtensionInventory";
import CheckboxButton from "../components/CheckboxButton";
import RobotInventory from "../classes/RobotInventory";
import { useNavigate } from "react-router";
import Dropdown from "../components/Dropdown";
import SettingsForm from "../components/SettingsForm";

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
    const [groupedExtensions, setGroupedExtensions]: [Record<string, string[]>, React.Dispatch<React.SetStateAction<Record<string, string[]>>>]   = useState({}) ;
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
            <Dropdown label="Brand" value={selectedBrand} onChange={handleBrandChange} valueArray={Object.keys(groupedExtensions)}/>
            {selectedBrand && 
                <Dropdown label="Model" 
                value={selectedModel} 
                onChange={handleModelChange} 
                valueArray={groupedExtensions[selectedBrand]}/>
            }
            {selectedExtension && (
                <SettingsForm settings={settings} setSettings={setSettings}/>
            )}
            <CheckboxButton onClick={handleFinish}/>
        </div>
    );
}