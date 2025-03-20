import { useState, useEffect, useRef } from "react";
import NavigationLink from "../components/NavigationLink";
import RobotCard from "../components/RobotCard";
import RobotInventory from "../classes/RobotInventory";
import { Robot } from "../classes/RobotInventory";
import { useMediaQuery } from "react-responsive";
import NavigationBarButton from "../components/NavigationBarButton";

export default function Dashboard() {
    localStorage.clear();
    const [deleteMode, setDeleteMode] = useState(false);
    const [searchMode, setSearchMode] = useState(false);
    const [robots, setRobots] = useState<Robot[]>([]);
    const [selectedRobots, setSelectedRobots] = useState<Robot[]>([]);
    const [refreshRobots, setRefreshRobots] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedRobots, setSearchedRobots] = useState<Robot[]>([]);

    const handleToggleDeleteButton = () => {
        setDeleteMode(!deleteMode);
        if (!deleteMode) setSelectedRobots([]);
    };

    const handleToggleSearchButton = () => {
        setSearchTerm("");
        setSearchedRobots(robots);
        setSearchMode(!searchMode);
    };

    const handleDeleteButton = () => {
        const inventory = new RobotInventory();
        inventory.openDatabase().then(() => {
            selectedRobots.forEach(robot => {
                inventory.deleteRobot(robot.id);
            });
            setRefreshRobots((prev) =>!prev);
        });
        handleToggleDeleteButton();
    };

    const handleRobotSelect = (robot: Robot, isChecked: boolean) => {
        if (isChecked) {
            setSelectedRobots((prev) => [...prev, robot]);
        } else {
            setSelectedRobots((prev) => prev.filter((r) => r.id!== robot.id));
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        const searchedRobots = robots.filter((robot) => robot.name.toLowerCase().includes(searchTerm));
        setSearchedRobots(searchedRobots);
    };

    useEffect(() => {
        const fetchRobots = async () => {
            const robotInventory = new RobotInventory();
            await robotInventory.openDatabase();
            const robots = await robotInventory.getAllRobots();
            setRobots(robots);
            setSearchedRobots(robots);
        };
        fetchRobots();
    }, [refreshRobots]);

    const Title = () => {
        return (
            <h1 className="w-100 my-auto">Dashboard</h1>
        )
    };

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [searchedRobots]);

    const SearchBar = () => {
        return (
          <div className="input-group input-group-sm">
            <span className="input-group-text" id="inputGroup-sizing-sm">Search</span>
            <input
              ref={searchInputRef}
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        );
      };

    return (
        <div className="p-2" style={{height: "100vh"}}>
            <nav className="d-flex pb-2">
                {searchMode? <SearchBar/> : <Title/>}
                {robots.length > 0? <NavigationBarButton onClick={handleToggleSearchButton}>{searchMode? "🔍" : "🔎"}</NavigationBarButton> : null}
                {robots.length > 0? <NavigationBarButton onClick={handleToggleDeleteButton}>{!deleteMode? "🗑️" : "❎"}</NavigationBarButton> : null}
                {!deleteMode? 
                <NavigationLink href={"/new"}>
                    <NavigationBarButton>➕</NavigationBarButton>
                </NavigationLink> : 
                <button type="button" className="btn fs-3 p-0" onClick={handleDeleteButton}>✅</button>}
            </nav>

            {deleteMode? <p><em>Please select the robots you would like to delete!</em></p> : null}
            <RobotList 
            robots={searchMode? searchedRobots : robots} 
            deleteMode={deleteMode} 
            searchMode={searchMode}
            handleRobotSelect={handleRobotSelect}
            />
        </div>
    );
}

interface RobotListProps {
    robots: Robot[],
    deleteMode: boolean,
    searchMode: boolean, 
    handleRobotSelect: (robot: Robot, isChecked: boolean) => void
}

function RobotList({robots, deleteMode, searchMode, handleRobotSelect}: RobotListProps) {
    const isMobile = useMediaQuery({ maxWidth: 600 });
    return (
        <>
            {robots.length == 0? <NoRobotsMessage isSearchMode={searchMode}/> : null}
            <div className="d-flex flex-wrap justify-content-start gap-2" 
            style={{ flexDirection: isMobile? 'column' : 'row' }}>
                {robots.map((robot) => {
                    const localHandle = () => handleRobotSelect(robot, deleteMode);
                    return <RobotCard key={robot.id} robot={robot} onChange={localHandle} 
                    deleteMode={deleteMode} style={{ width: isMobile? "100%" : "18rem" }} />
                })}
            </div>
        </>
    )
}

interface NoRobotsMessageProps {
    isSearchMode: boolean
}

function NoRobotsMessage({isSearchMode}: NoRobotsMessageProps) {
    const NormalModeMessage = () => (
        <div>
            <p>You do not have any robots yet.</p>
            <p>Create a new robot by pressing the ➕ button!</p>
        </div>
    );

    const SearchModeMessage =  () => (
        <div>
            <p>No robots were found!</p>
        </div>
    );
    return (
        <div className="w-100 h-100 text-center m-auto">
            <h1>🤖</h1>
            {isSearchMode ? <SearchModeMessage/> : <NormalModeMessage/>}
        </div>
    )
}