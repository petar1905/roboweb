import NavigationLink from "./NavigationLink";


export default function NavigationBar() {
    return (
        <div className="z-0">
            <nav className="navbar navbar-expand-lg bg-secondary-subtle">
                <div className="container-fluid">
                    <NavigationLink href="/" className="nav-link">
                        <h5 className="text-center">🏠</h5>
                        <small>Dashboard</small>
                    </NavigationLink>
                    <NavigationLink href="/store" className="nav-link text-center">
                        <h5 className="text-center">🏬</h5>
                        <small>Extension Store</small>
                    </NavigationLink>
                    <NavigationLink href="/settings" className="nav-link text-center">
                        <h5>⚙️</h5>
                        <small>Settings</small>
                    </NavigationLink>
                </div>
            </nav>
        </div>  
    )
}