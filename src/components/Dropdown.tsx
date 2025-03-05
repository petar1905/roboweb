interface DropdownProps {
    label: string,
    value: string | number | readonly string[] | undefined,
    onChange: React.ChangeEventHandler<HTMLSelectElement> | undefined,
    valueArray: string[]
}

export default function Dropdown({label, value, onChange, valueArray}: DropdownProps) {
    return (
        <div>
            <select className="form-select" aria-label="Default select example" value={value} onChange={onChange}>
                <option value="">{label}</option>
                {valueArray.map((model) => (
                    <option key={model} value={model}>{model}</option>
                ))}
            </select>
        </div>
    )
}