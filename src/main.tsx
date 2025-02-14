import React, { useState } from'react';
import { createContext } from'react';
import ReactDOM from'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import './scss/styles.scss';
import Dashboard from './views/Dashboard.tsx';
import NavigationBar from './components/NavigationBar.tsx';
import ExtensionStore from './views/ExtensionStore.tsx';
import Settings from './views/Settings.tsx';
import ExampleRobot from './classes/ExampleRobot.ts';
import Robot from './classes/Robot.ts';

interface RobotInventoryContextValue {
    robotInventory: Robot[];
    setRobotInventory: (robots: Robot[]) => void;
}

export const RobotInventoryContext = createContext<RobotInventoryContextValue>({
    robotInventory: [],
    setRobotInventory: () => {}
});

function App() {
    let starterInventory: Robot[] = [
    ];
    const [robotInventory, setRobotInventory] = useState<Robot[]>(starterInventory);

    return (
        <RobotInventoryContext.Provider value={{ robotInventory, setRobotInventory }}>
            <BrowserRouter>
                <div className="position-fixed w-100 bottom-0 left-0 z-3">
                    <NavigationBar/>
                </div>
                <div className="overflow-y-scroll mb-5">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/store" element={<ExtensionStore />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </RobotInventoryContext.Provider>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);