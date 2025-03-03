export default function PlusButton() {
    const customStyle: React.CSSProperties = {
        marginBottom: "5rem !important"
    }
    return (
        <button style={customStyle} className="btn btn-primary position-fixed bottom-0 end-0 px-3 m-2 rounded-circle fs-1">+</button>
    )
}