import { useEffect, useRef, useState } from "react";
import { Extension } from "../classes/ExtensionInventory";
import NavigationLink from "./NavigationLink";
import { useMediaQuery } from'react-responsive';
import NavigationBarButton from "./NavigationBarButton";
import { useTranslation } from "../hooks/useTranslation";

interface ExtensionTableProps {
    extensions: Extension[],
    title?: string
}

export default function ExtensionTable({extensions, title}: ExtensionTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedExtensions, setSearchedExtensions] = useState(extensions);
    const [searchMode, setSearchMode] = useState(false);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        const searchedExtensions = extensions.filter((extension) => {
            return (
                extension.metadata.manufacturer.toLowerCase().includes(searchTerm) ||
                extension.metadata.model.toLowerCase().includes(searchTerm) ||
                extension.metadata.version.toLowerCase().includes(searchTerm) ||
                extension.metadata.author.toLowerCase().includes(searchTerm)
            );
        });
        setSearchedExtensions(searchedExtensions);
    };

    const handleToggleSearchButton = () => {
        setSearchMode(!searchMode);
        if (!searchMode) {
            setSearchTerm("");
            setSearchedExtensions(extensions);
        }
    };

    const searchInputRef = useRef<HTMLInputElement>(null);
    
        useEffect(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, [searchedExtensions]);

    const SearchBar = () => {
        const { t } = useTranslation();
        return (
          <div className="input-group input-group-sm">
            <span className="input-group-text" id="inputGroup-sizing-sm">{t("search")}</span>
            <input
              ref={searchInputRef}
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        );
    };

    const Title = () => {
        return (
            <h5 className="w-100 my-auto">{title}</h5>
        )
    };

    const tableStyle: React.CSSProperties = {
        captionSide: "top"
    };

    return (
        <>
            <nav className="d-flex">
                {searchMode? <SearchBar/> : <Title/>}
                <NavigationBarButton onClick={handleToggleSearchButton}>{searchMode ? "🔍" : "🔎"}</NavigationBarButton>
            </nav>
            <table className="table table-striped-columns" style={tableStyle}>
                <ExtensionTableHead extensions={searchMode ? searchedExtensions : extensions}/>
                <ExtensionTableBody extensions={searchMode ? searchedExtensions : extensions}/>
            </table>
        </>
    )
}

interface ExtensionTableHeadProps {
    extensions: Extension[]
}

function ExtensionTableHead({extensions}: ExtensionTableHeadProps) {
    const isMobile = useMediaQuery({ maxWidth: 475 });
    const { t } = useTranslation();
    return (
        <thead>
            <tr>
                <th>{t("brand")}</th>
                <th>{t("model")}</th>
                {!isMobile && <th>{t("version")}</th>}
                {!isMobile && <th>{t("author")}</th>}
                {extensions.length > 0? <th></th> : null}
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
                    {extensions.length > 0? <ExtensionDetailsButton id={extension.metadata.id}/> : null}
                </tr>
            })}
        </tbody>
    )
}

interface ExtensionDetailsButtonProps {
    id: string
}

function ExtensionDetailsButton({id}: ExtensionDetailsButtonProps) {
    const { t } = useTranslation();
    return (
        <td className="text-center">                    
            <NavigationLink href={`/store/${id}`}>
                <button className="btn btn-info">{t("details")}</button>
            </NavigationLink>
        </td>
    )
}