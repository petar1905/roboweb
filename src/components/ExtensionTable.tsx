import { Extension } from "../classes/ExtensionInventory";
import NavigationLink from "./NavigationLink";

interface ExtensionTableProps {
    extensions: Extension[],
}

export default function ExtensionTable({extensions}: ExtensionTableProps) {
    return (
        <table className="table table-striped-columns">
            <ExtensionTableHead/>
            <ExtensionTableBody extensions={extensions}/>
        </table>
    )
}

function ExtensionTableHead() {
    return (
        <thead>
            <tr>
                <th>Manufactuer</th>
                <th>Model</th>
                <th>Version</th>
                <th>Author</th>
                <th></th>
            </tr>
        </thead> 
    )
}

interface ExtensionTableBodyProps {
    extensions: Extension[]
}

function ExtensionTableBody({extensions}: ExtensionTableBodyProps) {
    return (
        <tbody>
            {extensions.map((extension) => {
                return <tr key={extension.metadata.id}>
                    <td>{extension.metadata.manufacturer}</td>
                    <td>{extension.metadata.model}</td>
                    <td>{extension.metadata.version}</td>
                    <td>{extension.metadata.author}</td>
                    <td className="text-center">                    
                        <NavigationLink href={`/store/${extension.metadata.id}`}>
                            <button className="btn btn-info">Details</button>
                        </NavigationLink>
                    </td>
                </tr>
            })}
        </tbody>
    )
}