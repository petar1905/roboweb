import { useEffect, useState } from "react";
import { useParams } from "react-router";
import RobotInventory from "../classes/RobotInventory";
import NavigationBarButton from "../components/NavigationBarButton";
import NavigationLink from "../components/NavigationLink";
import { useTranslation } from "../hooks/useTranslation";

export default function ControlPanel() {
    const { t } = useTranslation();
    const { robotId } = useParams();
    const robotInventory = new RobotInventory();
    const [controlComponent, setControlComponent] = useState<JSX.Element>();
    const [robot, setrobot] = useState<string>();

    useEffect(() => {
        const fetchControlComponent = async () => {
            await robotInventory.openDatabase();
            // @ts-ignore
            const currentRobot = await robotInventory.getRobot(robotId);
            localStorage.setItem("settings", JSON.stringify(currentRobot?.settings));
            setrobot(currentRobot?.name);
            // @ts-ignore
            const currentFileURL = URL.createObjectURL(currentRobot?.extension.file);

            const iframe = (
                <iframe
                    src={currentFileURL}
                    className="w-100"
                    style={{height: "100%"}}
                />
            );
            setControlComponent(iframe);

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
                <h1 className="w-100 my-auto">{t("robot")} {robot}</h1>
                <NavigationLink href={`/robot/${robotId}/edit`}>
                    <NavigationBarButton>⚙️</NavigationBarButton>
                </NavigationLink>
            </nav>
            {controlComponent}
        </div>
    );
}