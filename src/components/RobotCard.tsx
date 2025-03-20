import { ChangeEventHandler, useState } from "react";
import { Robot } from "../classes/RobotInventory";

interface RobotCardProps {
    robot: Robot,
    deleteMode?: boolean,
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined,
    style?: React.CSSProperties | undefined
}

export default function RobotCard({ robot, deleteMode, onChange, style }: RobotCardProps) {
    return (
        <>
        {deleteMode? <RobotCardInDeleteMode robot={robot} deleteMode={deleteMode} 
        onChange={onChange} style={style}/> : 
        <RobotCardInNormalMode robot={robot} style={style}/>}
        </>
    );
}

function RobotCardInNormalMode({ robot, style }: RobotCardProps) {
    return (
        <a href={`/robot/${robot.id}`} className="text-decoration-none">
            <div className="card" style={{...style}}>
                <img src="/robot.jpg" height={"10%"} className="card-img-top" alt={robot.name} />
                <div className="d-flex">
                    <div className="card-body text-center w-100">
                        <h5 className="card-title">{robot.name}</h5>
                        <p className="card-text">{robot.activity? "Active" : "Inactive"}</p>
                    </div>
                </div>
            </div>
        </a>
    );
}

function RobotCardInDeleteMode({ robot, onChange, style }: RobotCardProps) {
    const checkboxStyle: React.CSSProperties = {
        transform: "scale(1.6) translate(.2rem, -15.7rem)"
    };

    const [checked, setChecked] = useState(false);

    const handleCardClick = () => {
        setChecked(!checked);
        if (onChange) {
            const event = { target: { checked:!checked } } as any;
            onChange(event as React.ChangeEvent<HTMLInputElement>);
        }
    };

    return (
        <div className="card" style={{...style, cursor: 'pointer' }} onClick={handleCardClick}>
            <img src="/robot.jpg" className="card-img-top" alt={robot.name} />
            <div className="d-flex">
                <div className="card-body text-center w-100">
                    <h5 className="card-title">{robot.name}</h5>
                    <p className="card-text">{robot.activity? "Active" : "Inactive"}</p>
                </div>
                <input type="checkbox" style={checkboxStyle} checked={checked} onChange={() => setChecked(!checked)}/>
            </div>
        </div>
    )
}