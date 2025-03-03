import { useEffect, useState } from "react";
import { Extension } from "../classes/ExtensionInventory";
import ExtensionInventory from "../classes/ExtensionInventory";
import CheckboxButton from "../components/CheckboxButton";
import RobotInventory, { Robot } from "../classes/RobotInventory";
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
    const [groupedExtensions, setGroupedExtensions]= useState<Record<string, string[]>>({}) ;
    const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);
    const [extensions, setExtensions] = useState<Extension[]>([]);
    const [settings, setSettings] = useState({});
    const extensionInventory = new ExtensionInventory();
    useEffect(() => {
        extensionInventory.openDatabase().then(() => {
            extensionInventory.getInstalledExtensions().then((extensions) => {
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
        const modelMatch = (ext: Extension) => ext.metadata.model === event.target.value;
        const manufacturerMatch = (ext: Extension) => ext.metadata.manufacturer === selectedBrand;
        const extension = extensions.find((ext) => modelMatch(ext) && manufacturerMatch(ext));
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
        const saveRobot = (robot: Robot) => robotInventory.saveRobot(robot);
        robotInventory.openDatabase().then(
            () => {
                /* @ts-ignore */
                const newRobot = robotInventory.createRobot(name, selectedExtension, settings).then(saveRobot);
                navigate("/");
            }
        );
    };
    const canCreateRobot = name && selectedBrand && selectedModel;
    const CreateRobotButton = () => {
        return (
            <button type="button" className="btn fs-3 p-0" onClick={handleFinish}>✅</button>
        )
    };

    return (
        <div className="p-2">
            <nav className="d-flex pb-2">
                <h1 className="w-100 my-auto">New Robot</h1>
                {canCreateRobot ? <CreateRobotButton/> : null}
            </nav>
            <div>
                <label>
                    Name:
                    <input type="text" onChange={handleNameChange} />
                </label>
            </div>
            <Dropdown label="Brand" 
            value={selectedBrand} 
            onChange={handleBrandChange} 
            valueArray={Object.keys(groupedExtensions)}
            />
            {selectedBrand && 
                <Dropdown label="Model" 
                value={selectedModel} 
                onChange={handleModelChange} 
                valueArray={groupedExtensions[selectedBrand]}/>
            }
            {selectedExtension && (
                <SettingsForm settings={settings} setSettings={setSettings}/>
            )}
        </div>
    );
}