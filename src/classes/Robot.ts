export default class Robot {
    id: number;
    name: string;
    activity: boolean;
    creationDate: number;
    accessDate: number;
    componentFile: string;
    settings: object;

    constructor(id: number, name: string, componentFile: string, settings: object) {
        this.id = id;
        this.name = name;
        this.activity = false;
        this.creationDate = Date.now();
        this.accessDate = Date.now();
        this.componentFile = componentFile;
        this.settings = settings;
    }
}