export default abstract class Robot {
    id: number;
    name: string;
    activity: boolean;
    creationDate: number;
    accessDate: number;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        this.activity = false;
        this.creationDate = Date.now();
        this.accessDate = Date.now();
    }

    abstract checkActivity(): Promise<boolean>;
}