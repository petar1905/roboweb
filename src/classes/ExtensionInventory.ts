interface ExtensionMetadata {
    id: string;
    filename: string;
    contentType: string;
    model: string;
    manufacturer: string;
    author: string;
    version: string;
    license: string;
    repository: string;
    settings: string;
}

export interface Extension {
    metadata: ExtensionMetadata;
    file: Blob;

}

export default class ExtensionInventory {
    private db!: IDBDatabase;
    private dbVersion: number = 1;
    private dbStoreName: string = 'extensions';
    private backendUrl: string = import.meta.env.VITE_EXTENSION_STORE_URL as string;


    async openDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('extensionInventory', this.dbVersion);
            request.onupgradeneeded = () => {
                const db = request.result;
                db.createObjectStore(this.dbStoreName, { keyPath:'metadata.id' });
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

    async getInstalledExtension(id: string): Promise<Extension | null> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.dbStoreName,'readonly');
            const objectStore = transaction.objectStore(this.dbStoreName);
            const request = objectStore.get(id);
            request.onsuccess = (event) => {
                //@ts-ignore
                const extension = event.target.result as Extension;
                resolve(extension);
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    async deleteExtension(id: string): Promise<void> {
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

    async downloadExtension(id: string): Promise<Extension> {
        const response = await fetch(`${this.backendUrl}/${id}`, {
            // temp
            mode: 'cors',
            headers: {
              'Access-Control-Allow-Origin':'*'
            }
            // temp
        });
        
        const data = await response.json();
        const metadata: ExtensionMetadata = {
            id: data._id,
            filename: data.filename,
            contentType: data.content_type,
            model: data.metadata.model,
            manufacturer: data.metadata.manufacturer,
            author: data.metadata.author,
            version: data.metadata.version,
            license: data.metadata.license,
            repository: data.metadata.repository,
            settings: data.metadata.settings,
        };
        const file = new Blob([data.file], { type: metadata.contentType });
        const extension: Extension = { metadata, file };
        return extension;
    }

    async saveExtension(extension: Extension): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.dbStoreName,'readwrite');
            const objectStore = transaction.objectStore(this.dbStoreName);
            const request = objectStore.put(extension);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    async getInstalledExtensions(): Promise<Extension[]> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.dbStoreName,'readonly');
            const objectStore = transaction.objectStore(this.dbStoreName);
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                //@ts-ignore
                const extensions = event.target.result as Extension[];
                resolve(extensions);
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    async getAvailableExtensions(): Promise<Extension[]> {
        const response = await fetch(`${this.backendUrl}`, {
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    
        const data = await response.json();
    
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch extensions');
        }
    
        const extensions: Extension[] = data.extensions.map((ext: any) => {
            const metadata: ExtensionMetadata = {
                id: ext._id,
                filename: ext.filename,
                contentType: ext.content_type,
                model: ext.metadata.model,
                manufacturer: ext.metadata.manufacturer,
                author: ext.metadata.author,
                version: ext.metadata.version,
                license: ext.metadata.license,
                repository: ext.metadata.repository,
                settings: ext.metadata.settings,
            };
            const file = new Blob([ext.file], { type: metadata.contentType });
            return { metadata, file };
        });
    
        return extensions;
    }
}   