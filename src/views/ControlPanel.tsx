import { useEffect, useState } from "react";
import { useParams } from "react-router";
import RobotInventory from "../classes/RobotInventory";
import NavigationBarButton from "../components/NavigationBarButton";
import NavigationLink from "../components/NavigationLink";

export default function ControlPanel() {
    const { robotId } = useParams();
    const robotInventory = new RobotInventory();
    const [controlComponent, setControlComponent] = useState<JSX.Element>();
    const [robotName, setRobotName] = useState<string>();

    useEffect(() => {
        const fetchControlComponent = async () => {
            await robotInventory.openDatabase();
            // @ts-ignore
            const currentRobot = await robotInventory.getRobot(robotId);
            localStorage.setItem("settings", JSON.stringify(currentRobot?.settings));
            setRobotName(currentRobot?.name);
            // @ts-ignore
            const currentFileURL = URL.createObjectURL(currentRobot?.extension.file);

            /* create iframe element that loads file which is html and set it as control component */
            const iframe = (
                <iframe
                    src={currentFileURL}
                    className="w-100"
                    style={{height: "100%"}}
                />
            );
            setControlComponent(iframe);

            // Clean up
            return () => {
                URL.revokeObjectURL(currentFileURL);
            };
        };
        fetchControlComponent();
    }, []);

    return (
        <div className="p-2" style={{height: "100vh"}}>
            <nav className="d-flex pb-2">
                <NavigationLink href={`/`}>
                    <NavigationBarButton>⬅</NavigationBarButton>
                </NavigationLink>
                <h1 className="w-100 my-auto">Robot {robotName}</h1>
                <NavigationLink href={`/robot/${robotId}/edit`}>
                    <NavigationBarButton>⚙️</NavigationBarButton>
                </NavigationLink>
            </nav>
            {controlComponent}
        </div>
    );
}