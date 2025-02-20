import './scss/styles.scss';
import React, { useState } from'react';
import { createContext } from'react';
import ReactDOM from'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from './views/Dashboard.tsx';
import NavigationBar from './components/NavigationBar.tsx';
import ExtensionStore from './views/ExtensionStore.tsx';
import Settings from './views/Settings.tsx';
import Robot from './classes/RobotInventory.ts';
import NewRobot from "./views/NewRobot.tsx";

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
                    <Route path="/new" element={<NewRobot />} />
                    {/* <Route path="/robot" element={<ControlPanel />} /> */}
                    <Route path="/settings" element={<Settings />} />
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