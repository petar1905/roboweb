import { useContext, useEffect, useState } from "react";
import AddRobotButton from "../components/AddRobotButton";
import { RobotInventoryContext } from "../main";
import RobotCard from "../components/RobotCard";

export default function Dashboard() {
    const {robotInventory, setRobotInventory} = useContext(RobotInventoryContext);
    return (
        <div>
            <h1>Dashboard</h1>
            <div className="d-flex flex-wrap justify-content-start gap-2">
            {robotInventory && robotInventory.map((robot) => (
                <RobotCard key={robot.id} robot={robot} />
            ))}
            </div>
            <AddRobotButton/>
        </div>
    )
}