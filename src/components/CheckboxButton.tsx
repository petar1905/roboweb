interface CheckboxButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}


export default function CheckboxButton({onClick}: CheckboxButtonProps) {
    return (
        <button onClick={onClick} className="btn btn-primary position-fixed bottom-0 end-0 px-3 m-2 mb-5 rounded-circle fs-1">✓</button>
    )
}