import { useState, useEffect } from "react";
import NavigationLink from "../components/NavigationLink";
import PlusButton from "../components/PlusButton";
import DeleteButton from "../components/DeleteButton";
import RobotCard from "../components/RobotCard";
import RobotInventory from "../classes/RobotInventory";
import { Robot } from "../classes/RobotInventory";
import { useMediaQuery } from "react-responsive";

export default function Dashboard() {
    const [deleteMode, setDeleteMode] = useState(false);
    const [robots, setRobots] = useState<Robot[]>([]);
    const [selectedRobots, setSelectedRobots] = useState<Robot[]>([]);
    const [refreshRobots, setRefreshRobots] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 600 });

    const handleToggleDeleteButton = () => {
        setDeleteMode(!deleteMode);
        if (!deleteMode) setSelectedRobots([]);
    };

    const handleDeleteButton = () => {
        const inventory = new RobotInventory();
        inventory.openDatabase().then(() => {
            selectedRobots.forEach(robot => {
                inventory.deleteRobot(robot.id);
            });
            setRefreshRobots((prev) => !prev);
        });
        handleToggleDeleteButton();
    };

    const handleRobotSelect = (robot: Robot, isChecked: boolean) => {
        if (isChecked) {
            setSelectedRobots((prev) => [...prev, robot]);
        } else {
            setSelectedRobots((prev) => prev.filter((r) => r.id !== robot.id));
        }
    };

    useEffect(() => {
        const fetchRobots = async () => {
            const robotInventory = new RobotInventory();
            await robotInventory.openDatabase();
            const robots = await robotInventory.getAllRobots();
            setRobots(robots);
        };
        fetchRobots();
    }, [refreshRobots]);

    return (
        <div className="p-2">
            <nav className="d-flex">
                <h1 className="w-100">Dashboard</h1>
                <button type="button" className="btn fs-3" onClick={handleToggleDeleteButton}>🚮</button>
            </nav>
            {deleteMode ? <p><em>Please select the robot you would like to delete!</em></p> : null}
            <div className="d-flex flex-wrap justify-content-start gap-2" 
            style={{ flexDirection: isMobile? 'column' : 'row' }}>
                {robots.map((robot) => {
                    const localHandle = () => handleRobotSelect(robot, deleteMode);
                    return <RobotCard key={robot.id} robot={robot} onChange={localHandle} 
                    deleteMode={deleteMode} style={{ width: isMobile ? "100%" : "18rem" }} />
                })}
            </div>
            {!deleteMode ? 
            <NavigationLink href={"/new"}><PlusButton/></NavigationLink> : 
            <DeleteButton onClick={handleDeleteButton}/> }
        </div>
    );
}
