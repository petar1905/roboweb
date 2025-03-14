import { useEffect, useState } from "react";
import RobotInventory from "../classes/RobotInventory";
import { useNavigate, useParams } from "react-router";
import SettingsForm from "../components/SettingsForm";
import NavigationBarButton from "../components/NavigationBarButton";
import NavigationLink from "../components/NavigationLink";
import { Extension } from "../classes/ExtensionInventory";

export default function NewRobot() {
    localStorage.clear();
    const { robotId } = useParams();
    const navigate = useNavigate();
    const robotInventory = new RobotInventory();
    const [name, setName] = useState<string>();
    const [settings, setSettings] = useState<object>();
    const [extension, setExtension] = useState<Extension>();
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
        setName(event.target.value);
    };
    useEffect(() => {
        const fetchSettings = async () => {
            await robotInventory.openDatabase();
            // @ts-ignore
            const currentRobot = await robotInventory.getRobot(robotId);
            if (currentRobot !== null) {
                setName(currentRobot.name);
                setSettings(currentRobot.settings);
                setExtension(currentRobot.extension);
            }
        };
        fetchSettings();
    }, []);

    const handleFinish = () => {
        const robotInventory = new RobotInventory();
        robotInventory.openDatabase().then(
            () => {
                /* @ts-ignore */
                robotInventory.updateRobot(robotId, name, extension, settings);
                navigate(`/robot/${robotId}`);
            }
        );
    };
    return (
        <div className="p-2">
            <nav className="d-flex pb-2">
                <NavigationLink href={`/robot/${robotId}`}>
                    <NavigationBarButton>⬅</NavigationBarButton>
                </NavigationLink>
                <h1 className="w-100 my-auto">Robot {name}</h1>
                {name !== "" ? <NavigationBarButton onClick={handleFinish}>✅</NavigationBarButton> : null}
            </nav>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Name</span>
                <input type="text" 
                className="form-control" 
                placeholder="Robot Name" 
                aria-label="Robot Name" 
                aria-describedby="basic-addon1"
                value={name}
                onChange={handleNameChange} />
            </div>
            {settings ? <SettingsForm settings={settings} setSettings={setSettings}/> : null}
        </div>
    );
}