import NavigationLink from "./NavigationLink";


export default function NavigationBar() {
    return (
        <div className="">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <NavigationLink href="/" className="nav-link">
                        Dashboard
                    </NavigationLink>
                    <NavigationLink href="/store" className="nav-link">
                        Extension Store
                    </NavigationLink>
                    <NavigationLink href="/settings" className="nav-link">
                        Settings
                    </NavigationLink>
                </div>
            </nav>
        </div>  
    )
}