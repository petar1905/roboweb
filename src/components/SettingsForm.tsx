import { capitalCase } from "change-case";

interface SettingsFormProps {
    settings: { [key: string]: any },
    setSettings: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}

export default function SettingsForm({settings, setSettings}: SettingsFormProps) {
    const handleSettingChange = (key: string, value: any) => {
        const updatedSettings = {...settings };
        // Use the original key (in lowercase) to update the setting
        const originalKey = Object.keys(settings).find(k => capitalCase(k) === key);
        if (originalKey) {
            updatedSettings[originalKey] = value;
            setSettings(updatedSettings);
        }
    };

    const renderSettingField = (key: string, value: any) => {
        const type = typeof value;

        const checkboxStyle: React.CSSProperties = {
            transform: "scale(1.6)"
        };

        switch (type) {
            case "string":
                return (
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">{key}</span>
                        <input type="text" 
                        className="form-control" 
                        placeholder="Robot Name" 
                        aria-label="Robot Name" 
                        aria-describedby="basic-addon1"
                        value={value}
                        onChange={(event) => handleSettingChange(key, event.target.value)} />
                    </div>
                );
            case "number":
                return (
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">{key}</span>
                        <input type="number"
                        className="form-control" 
                        placeholder="Robot Name" 
                        aria-label="Robot Name" 
                        aria-describedby="basic-addon1"
                        value={value}
                        onChange={(event) => handleSettingChange(key, parseFloat(event.target.value))}/>
                    </div>

                );
            case "boolean":
                return (
                    <label className="d-flex">
                        <span className="w-100">{key}</span>
                        <input
                        style={checkboxStyle}
                        type="checkbox"
                        checked={value}
                        onChange={(event) => handleSettingChange(key, event.target.checked)}
                        />
                    </label>
                );
            default:
                return <div>Unsupported type: {type}</div>;
        }
    };

    return (
        <div>
            {Object.keys(settings).map((key) => (
                <div key={key}>
                    {renderSettingField(capitalCase(key), settings[key as keyof typeof settings])}
                </div>
            ))}
        </div>
    )
}