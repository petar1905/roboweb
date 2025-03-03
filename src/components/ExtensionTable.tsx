import { Extension } from "../classes/ExtensionInventory";
import NavigationLink from "./NavigationLink";

import { useMediaQuery } from'react-responsive';

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
    const isMobile = useMediaQuery({ maxWidth: 475 });
    return (
        <thead>
            <tr>
                <th>Manufacturer</th>
                <th>Model</th>
                {!isMobile && <th>Version</th>}
                {!isMobile && <th>Author</th>}
                {extensions.length > 0 ? <th></th> : null}
            </tr>
        </thead> 
    )
}

interface ExtensionTableBodyProps {
    extensions: Extension[]
}

function ExtensionTableBody({extensions}: ExtensionTableBodyProps) {
    const isMobile = useMediaQuery({ maxWidth: 475 });

    return (
        <tbody>
            {extensions.map((extension) => {
                return <tr key={extension.metadata.id}>
                    <td>{extension.metadata.manufacturer}</td>
                    <td>{extension.metadata.model}</td>
                    {!isMobile && <td>{extension.metadata.version}</td>}
                    {!isMobile && <td>{extension.metadata.author}</td>}
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