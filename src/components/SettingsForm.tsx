interface SettingsFormProps {
    settings: {},
    setSettings: React.Dispatch<React.SetStateAction<{}>>
}

export default function SettingsForm({settings, setSettings}: SettingsFormProps) {
        const handleSettingChange = (key: string, value: any) => {
            const updatedSettings = {...settings };
            /* @ts-ignore */
            updatedSettings[key] = value;
            setSettings(updatedSettings);
        };
    
        const renderSettingField = (key: string, value: any) => {
            const type = typeof value;
            switch (type) {
                case "string":
                    return (
                        <input
                            type="text"
                            value={value}
                            onChange={(event) => handleSettingChange(key, event.target.value)}
                        />
                    );
                case "number":
                    return (
                        <input
                            type="number"
                            value={value}
                            onChange={(event) => handleSettingChange(key, parseFloat(event.target.value))}
                        />
                    );
                case "boolean":
                    return (
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={(event) => handleSettingChange(key, event.target.checked)}
                        />
                    );
                default:
                    return <div>Unsupported type: {type}</div>;
            }
        };

        return (
            <div>
                {Object.keys(settings).map((key) => (
                    <div key={key}>
                        <label>
                            {key}:
                            {/* @ts-ignore */}
                            {renderSettingField(key, settings[key])}
                        </label>
                    </div>
                ))}
            </div>
        )
}