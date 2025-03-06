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
            setRobotName(currentRobot?.name);
            // @ts-ignore
            const currentFileURL = URL.createObjectURL(currentRobot?.extension.file);
            
            import(currentFileURL).then(module => {
                const ControlComponent = module.ControlComponent || module.default;
                setControlComponent(<ControlComponent settings={currentRobot?.settings} />);
            });
            URL.revokeObjectURL(currentFileURL);
        };
        fetchControlComponent();
    }, []);


    return(
        <div className="p-2">
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
    )
}