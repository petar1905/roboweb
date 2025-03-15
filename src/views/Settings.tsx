import NavigationLink from "../components/NavigationLink";

export default function Settings() {
    localStorage.clear();
    return (
        <div className="p-2">
            <h1>Settings</h1>
            <p>^^</p>
            <NavigationLink href="/new-extension">
                <button className="btn btn-info w-100">Sideload extension</button>
            </NavigationLink>
        </div>
    );
}