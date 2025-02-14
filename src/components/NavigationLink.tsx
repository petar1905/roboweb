import { useNavigate } from "react-router";

interface NavigationLinkProps {
    href: string;
    className: string;
    children?: React.ReactNode;
}

export default function NavigationLink({ href, className, children }: NavigationLinkProps) {
    let navigate = useNavigate();
    let navFunction = () => { navigate(href); }; 

    return (
        <a className={className} href="#" onClick={navFunction}>
            {children}
        </a>    
    );
}