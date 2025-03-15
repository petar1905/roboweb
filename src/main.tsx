import './scss/styles.scss';
import React from'react';
import { createContext } from'react';
import ReactDOM from'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from './views/Dashboard.tsx';
import NavigationBar from './components/NavigationBar.tsx';
import ExtensionStore from './views/ExtensionStore.tsx';
import Settings from './views/Settings.tsx';
import Robot from './classes/RobotInventory.ts';
import NewRobot from "./views/NewRobot.tsx";
import ExtensionDetails from './views/ExtensionDetails.tsx';
import ControlPanel from './views/ControlPanel.tsx';
import EditRobot from './views/EditRobot.tsx';
import NewExtension from './views/NewExtension.tsx';

interface RobotInventoryContextValue {
    robotInventory: Robot[];
    setRobotInventory: (robots: Robot[]) => void;
}

export const RobotInventoryContext = createContext<RobotInventoryContextValue>({
    robotInventory: [],
    setRobotInventory: () => {}
});

function App() {
    return (
        <BrowserRouter>
            <div className="position-fixed w-100 bottom-0 left-0 z-3">
                <NavigationBar/>
            </div>
            <div className="overflow-y-scroll mb-5">
                <Routes>
                    <Route path="/" element={<Dashboard/>} />
                    <Route path="/store" element={<ExtensionStore />} />
                    <Route path="/store/:extensionId" element={<ExtensionDetails />} />
                    <Route path="/new" element={<NewRobot />} />
                    <Route path="/robot/:robotId" element={<ControlPanel />} />
                    <Route path="/robot/:robotId/edit" element={<EditRobot />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/new-extension" element={<NewExtension />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);