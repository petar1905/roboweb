import { v4 } from "uuid";
import { Extension } from "./ExtensionInventory";

export class Robot {
    id: string;
    name: string;
    activity: boolean;
    creationDate: number;
    accessDate: number;
    extension: Extension;
    settings: object;

    constructor(id: string, name: string, extension: Extension, settings: object) {
        this.id = id;
        this.name = name;
        this.activity = false;
        this.creationDate = Date.now();
        this.accessDate = Date.now();
        this.extension = extension;
        this.settings = settings;
    }
}

export default class RobotInventory {
    private db!: IDBDatabase;
    private dbVersion: number = 1;
    private dbStoreName: string = 'robots';
    name: string | undefined;

    async openDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('robotInventory', this.dbVersion);
            request.onupgradeneeded = () => {
                const db = request.result;
                db.createObjectStore(this.dbStoreName, { keyPath: 'id', autoIncrement: true });
            };
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    async getRobot(id: string): Promise<Robot | null> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.dbStoreName,'readonly');
            const objectStore = transaction.objectStore(this.dbStoreName);
            const request = objectStore.get(id);
            request.onsuccess = (event) => {
                // @ts-ignore
                const robot = event.target.result as Robot;
                resolve(robot);
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    async deleteRobot(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.dbStoreName,'readwrite');
            const objectStore = transaction.objectStore(this.dbStoreName);
            const request = objectStore.delete(id);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    async saveRobot(robot: Robot): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.dbStoreName,'readwrite');
            const objectStore = transaction.objectStore(this.dbStoreName);
            const request = objectStore.put(robot);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    async getAllRobots(): Promise<Robot[]> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.dbStoreName,'readonly');
            const objectStore = transaction.objectStore(this.dbStoreName);
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                // @ts-ignore
                const robots = event.target.result as Robot[];
                resolve(robots);
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    async createRobot(name: string, extension: Extension, settings: object): Promise<Robot> {
        let newId: string = v4();
        const robot = new Robot(newId, name, extension, settings);
        //await this.saveRobot(robot);
        return robot;
    }

    async updateRobot(id: string, name: string, extension: Extension, settings: object): Promise<void> {
        const robot = await this.getRobot(id);
        if (robot) {
            robot.name = name;
            robot.extension = extension;
            robot.settings = settings;
            await this.saveRobot(robot);
        }
    }
}