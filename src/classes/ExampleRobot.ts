import Robot from "./Robot";

export default class ExampleRobot extends Robot {
    checkActivity(): Promise<boolean> {
        return Promise.resolve(true);
    }
}
