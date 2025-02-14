import Robot from "../classes/Robot";

interface RobotCardProps {
    robot: Robot
}

export default function RobotCard({ robot }: RobotCardProps) {
    return (
        <a href={`/robot/${robot.id}`} className="text-decoration-none">
            <div className="card" style={{ width: "18rem" }}>
                <img src={undefined} className="card-img-top" alt={robot.name} />
                <div className="card-body text-center">
                    <h5 className="card-title">{robot.name}</h5>
                    <p className="card-text">{robot.activity}</p>
                </div>
            </div>
        </a>
    );
}
