interface NavigationBarButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    children?: React.ReactNode;
}

export default function NavigationBarButton({onClick, children}: NavigationBarButtonProps) {
    return (
        <button type="button" className="btn fs-3 p-0" onClick={onClick}>{children}</button>
    )
}