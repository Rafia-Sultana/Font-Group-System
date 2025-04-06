import { useState, useEffect } from "react";

export default function FontGroup() {
    const [fonts, setFonts] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [selectedFonts, setSelectedFonts] = useState([]);

    useEffect(() => {
        fetch("http://localhost/Font Managment System/server/get_fonts.php")
            .then((res) => res.json())
            .then((data) => setFonts(data));
    }, []);

    const addFontToGroup = (fontId) => {
        if (!selectedFonts.includes(fontId)) {
            setSelectedFonts([...selectedFonts, fontId]);
        }
    };

    const createGroup = () => {
        if (selectedFonts.length < 2) {
            alert("You must select at least two fonts.");
            return;
        }

        fetch("http://localhost/Font Managment System/server/create_group.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ group_name: groupName, font_ids: selectedFonts }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    alert("Group Created!");
                    setSelectedFonts([]);
                    setGroupName("");
                } else {
                    alert(data.error);
                }
            });
    };

    return (
        <div>
            <h2>Create Font Group</h2>
            <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
            />
            <h3>Select Fonts</h3>
            <ul>
                {fonts.map((font) => (
                    <li key={font.id}>
                        <label>
                            <input
                                type="checkbox"
                                onChange={() => addFontToGroup(font.id)}
                                checked={selectedFonts.includes(font.id)}
                            />
                            {font.font_name}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={createGroup}>Create Group</button>
        </div>
    );
}
