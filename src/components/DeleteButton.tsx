interface DeleteButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function DeleteButton({onClick}: DeleteButtonProps) {
    return (
        <button onClick={onClick} className="btn btn-primary position-fixed bottom-0 end-0 px-3 m-2 rounded-circle fs-1">🚮</button>
    )
}