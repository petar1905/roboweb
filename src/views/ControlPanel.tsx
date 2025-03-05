import { useEffect, useState } from "react";
import { useParams } from "react-router";
import RobotInventory from "../classes/RobotInventory";

export default function ControlPanel() {
    const { robotId } = useParams();
    const robotInventory = new RobotInventory();
    const [controlComponent, setControlComponent] = useState<JSX.Element>();

    useEffect(() => {
        const fetchControlComponent = async () => {
            await robotInventory.openDatabase();
            // @ts-ignore
            const currentRobot = await robotInventory.getRobot(robotId);
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
            <h1>Robot {robotId}</h1>
            {controlComponent}
        </div>
    )
}