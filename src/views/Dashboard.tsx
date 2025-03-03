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

    const ToggleDeleteButton = () => {
        return (
            <button type="button" className="btn fs-3 p-0" onClick={handleToggleDeleteButton}>
                {!deleteMode ? "🗑️" : "❎"}
            </button>
        )
    };

    const ToggleSearchButton = () => {
        return (
            <button type="button" className="btn fs-3 p-0" onClick={handleToggleDeleteButton}>🔍</button>
        )
    };

    const NoRobotsMessage = () => {
        return (
            <div className="w-100 h-100 text-center m-auto">
                <h1>🤖</h1>
                <p>You do not have any robots yet.</p>
                <p>Create a new robot by pressing the ➕ button!</p>
            </div>
        )
    };

    return (
        <div className="p-2">
            <nav className="d-flex pb-2">
                <h1 className="w-100 my-auto">Dashboard</h1>
                {robots.length > 0 ? <ToggleSearchButton/> : null}
                {robots.length > 0 ? <ToggleDeleteButton/> : null}
                {!deleteMode ? 
                <NavigationLink href={"/new"}>
                    <button type="button" className="btn fs-3 p-0">➕</button>
                </NavigationLink> : 
                <button type="button" className="btn fs-3 p-0" onClick={handleDeleteButton}>✅</button>}
            </nav>
            {deleteMode ? <p><em>Please select the robots you would like to delete!</em></p> : null}
            {robots.length == 0 ? <NoRobotsMessage/> : null}
            <div className="d-flex flex-wrap justify-content-start gap-2" 
            style={{ flexDirection: isMobile? 'column' : 'row' }}>
                {robots.map((robot) => {
                    const localHandle = () => handleRobotSelect(robot, deleteMode);
                    return <RobotCard key={robot.id} robot={robot} onChange={localHandle} 
                    deleteMode={deleteMode} style={{ width: isMobile ? "100%" : "18rem" }} />
                })}
            </div>
        </div>
    );
}
