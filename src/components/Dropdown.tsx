interface DropdownProps {
    label: string,
    value: string | number | readonly string[] | undefined,
    onChange: React.ChangeEventHandler<HTMLSelectElement> | undefined,
    valueArray: string[]
}

export default function Dropdown({label, value, onChange, valueArray}: DropdownProps) {
    return (
        <div>
            <label>
                {label}: 
                <select value={value} onChange={onChange}>
                    <option value="">Select a model</option>
                    {valueArray.map((model) => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>
            </label>
        </div>
    )
}