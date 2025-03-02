import { Extension } from "../classes/ExtensionInventory";
import NavigationLink from "./NavigationLink";

interface ExtensionTableProps {
    extensions: Extension[],
}

export default function ExtensionTable({extensions}: ExtensionTableProps) {
    return (
        <table className="table table-striped-columns">
            <ExtensionTableHead extensions={extensions}/>
            <ExtensionTableBody extensions={extensions}/>
        </table>
    )
}

function ExtensionTableHead({extensions}: ExtensionTableProps) {
    return (
        <thead>
            <tr>
                <th>Manufactuer</th>
                <th>Model</th>
                <th>Version</th>
                <th>Author</th>
                {extensions.length > 0 ? <th></th> : null}
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
                    {extensions.length > 0 ? <ExtensionDetailsButton id={extension.metadata.id}/> : null}
                </tr>
            })}
        </tbody>
    )
}

interface ExtensionDetailsButtonProps {
    id: string
}

function ExtensionDetailsButton({id}: ExtensionDetailsButtonProps) {
    return (
        <td className="text-center">                    
            <NavigationLink href={`/store/${id}`}>
                <button className="btn btn-info">Details</button>
            </NavigationLink>
        </td>
    )
}