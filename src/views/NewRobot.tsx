import { useEffect, useState } from "react";
import { Extension } from "../classes/ExtensionInventory";
import ExtensionInventory from "../classes/ExtensionInventory";
import RobotInventory, { Robot } from "../classes/RobotInventory";
import { useNavigate } from "react-router";
import Dropdown from "../components/Dropdown";
import SettingsForm from "../components/SettingsForm";
import NavigationBarButton from "../components/NavigationBarButton";
import { useTranslation } from "../hooks/useTranslation";

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
    localStorage.clear();
    const { t } = useTranslation();
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
        const completeProcess = (extensions: Extension[]) => {
            setExtensions(extensions);
            const grouped = groupExtensionsByManufacturer(extensions);
            setGroupedExtensions(grouped);
        };
        const fetchExtensions = async () => {
            await extensionInventory.openDatabase();
            extensionInventory.getInstalledExtensions().then(completeProcess);
        };
        fetchExtensions();
    });
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
    return (
        <div className="p-2">
            <nav className="d-flex pb-2">
                <h1 className="w-100 my-auto">{t("newRobot")}</h1>
                {canCreateRobot ? <NavigationBarButton onClick={handleFinish}>✅</NavigationBarButton> : null}
            </nav>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">{t("name")}</span>
                <input type="text" 
                className="form-control" 
                placeholder={t("robotName")} 
                aria-label="Robot Name" 
                aria-describedby="basic-addon1"
                onChange={handleNameChange} />
            </div>

            <p>
                <Dropdown label={t("brand")} 
                value={selectedBrand} 
                onChange={handleBrandChange} 
                valueArray={Object.keys(groupedExtensions)}
                />
            </p>
            {selectedBrand && 
                <p>
                    <Dropdown label={t("model")}
                    value={selectedModel} 
                    onChange={handleModelChange} 
                    valueArray={groupedExtensions[selectedBrand]}
                    />
                </p>

            }
            {selectedExtension && (
                <SettingsForm settings={settings} setSettings={setSettings}/>
            )}
        </div>
    );
}