import { Extension } from "../classes/ExtensionInventory";
import ExtensionInventory from "../classes/ExtensionInventory";

function groupExtensionsByManufacturer(extensions: Extension[]): Record<string, string[]> {
    const manufacturerModelMapping: Record<string, Set<string>> = {};

    extensions.forEach(extension => {
        const manufacturer = extension.metadata.manufacturer;
        const model = extension.metadata.model;

        if (!manufacturerModelMapping[manufacturer]) {
            manufacturerModelMapping[manufacturer] = new Set();
        }

        manufacturerModelMapping[manufacturer].add(model);
    });

    return Object.fromEntries(
        Object.entries(manufacturerModelMapping).map(([manufacturer, models]) => {
            return [manufacturer, Array.from(models)];
        })
    );
}

export default function NewRobot() {

    /* const extensionInventory = new ExtensionInventory();

    extensionInventory.openDatabase().then(() => {
        extensionInventory.downloadExtension('67b2da549c02f6546589f249').then((extension) => {
            extensionInventory.saveExtension(extension);
        });
    });

    extensionInventory.openDatabase().then(() => {
        extensionInventory.getAllExtensions().then((extensions) => {
            console.log(extensions);
        });
    }); */
}