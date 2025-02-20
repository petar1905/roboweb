import { useState, useEffect } from "react";
import NavigationLink from "../components/NavigationLink";
import PlusButton from "../components/PlusButton";
import RobotCard from "../components/RobotCard";
import RobotInventory from "../classes/RobotInventory";
import { Robot } from "../classes/RobotInventory";

export default function Dashboard() {
    const [robots, setRobots] = useState<Robot[]>([]);

    useEffect(() => {
        const fetchRobots = async () => {
            const robotInventory = new RobotInventory();
            await robotInventory.openDatabase();
            const robots = await robotInventory.getAllRobots();
            setRobots(robots);
        };
        fetchRobots();
    }, []);

    return (
        <div className="p-2">
            <h1>Dashboard</h1>
            <div className="d-flex flex-wrap justify-content-start gap-2">
                {robots.map((robot) => (
                    <RobotCard key={robot.id} robot={robot} />
                ))}
            </div>
            <NavigationLink href={"/new"}>
                <PlusButton/>
            </NavigationLink>
        </div>
    );
}