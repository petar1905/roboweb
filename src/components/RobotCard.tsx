import { ChangeEventHandler } from "react";
import {Robot} from "../classes/RobotInventory";

interface RobotCardProps {
    robot: Robot,
    deleteMode: boolean,
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined
}

export default function RobotCard({ robot, deleteMode, onChange }: RobotCardProps) {
    return (
        <a href={`/robot/${robot.id}`} className="text-decoration-none">
            <div className="card" style={{ width: "18rem" }}>
                <img src={undefined} className="card-img-top" alt={robot.name} />
                <div className="d-flex">
                    <div className="card-body text-center w-100">
                        <h5 className="card-title">{robot.name}</h5>
                        <p className="card-text">{robot.activity ? "Active" : "Inactive"}</p>
                    </div>
                    {deleteMode ? <div className="text-center w-50 m-auto"><input type="checkbox" onChange={onChange}/></div> : null}
                </div>

            </div>
        </a>
    );
}
