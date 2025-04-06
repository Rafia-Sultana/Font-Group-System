
import { useState, useEffect } from "react"
import Swal from "sweetalert2"

const FontGroupCreator = ({ onGroupCreated, fonts, loading }) => {
  const [groupName, setGroupName] = useState("")
  const [selectedFonts, setSelectedFonts] = useState([{ fontId: "" }])
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)


  useEffect(() => {
    setSelectedFonts([{ fontId: "" }])
  }, [fonts])

  const addRow = () => {
    setSelectedFonts([...selectedFonts, { fontId: "" }])
  }

  const removeRow = (index) => {
    if (selectedFonts.length > 1) {
      const newSelectedFonts = [...selectedFonts]
      newSelectedFonts.splice(index, 1)
      setSelectedFonts(newSelectedFonts)
    }
  }

  const handleFontChange = (index, fontId) => {
    const newSelectedFonts = [...selectedFonts]
    newSelectedFonts[index].fontId = fontId
    setSelectedFonts(newSelectedFonts)
  }

  const createGroup = () => {
 
    if (!groupName.trim()) {
      Swal.fire({
        title: "Missing Information",
        text: "Please enter a group name",
        icon: "warning",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
      })
      return
    }

 
    const fontIds = selectedFonts.map((item) => item.fontId).filter((id) => id !== "")

    
    if (fontIds.length < 2) {
      Swal.fire({
        title: "Not Enough Fonts",
        text: "You must select at least two fonts to create a group.",
        icon: "warning",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
      })
      return
    }

    if (new Set(fontIds).size !== fontIds.length) {
      Swal.fire({
        title: "Duplicate Fonts",
        text: "Please avoid selecting the same font multiple times.",
        icon: "warning",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
      })
      return
    }

    setCreating(true)

    const loadingToast = Swal.fire({
      title: "Creating Group",
      text: "Please wait...",
      icon: "info",
      toast: true,
      position: "top",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    fetch("http://localhost/Font Managment System/server/create_group.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group_name: groupName, font_ids: fontIds }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCreating(false)
        loadingToast.close()

        if (data.success) {
          Swal.fire({
            title: "Success!",
            text: "Group created successfully!",
            icon: "success",
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
          })
          setGroupName("")
          setSelectedFonts([{ fontId: "" }])
          if (onGroupCreated) onGroupCreated()
        } else {
          Swal.fire({
            title: "Error!",
            text: data.error || "Failed to create group",
            icon: "error",
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
          })
        }
      })
      .catch((error) => {
        setCreating(false)
        loadingToast.close()
        console.error("Create Group Error:", error)
        Swal.fire({
          title: "Error!",
          text: "Failed to create group. Please try again.",
          icon: "error",
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
        })
      })
  }

  if (loading) return <div className="loading">Loading fonts...</div>
  if (error) return <div className="error">{error}</div>
  if (fonts.length < 2)
    return <div className="empty-state">You need at least two fonts to create a group. Please upload more fonts.</div>

  return (
    <div className="group-creator">
      <div className="form-group">
        <label htmlFor="group-name">Group Name:</label>
        <input
          type="text"
          id="group-name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          className="form-control"
        />
      </div>

      <div className="font-rows">
        {selectedFonts.map((item, index) => (
          <div key={index} className="font-row">
            <select
              value={item.fontId}
              onChange={(e) => handleFontChange(index, e.target.value)}
              className="font-select"
            >
              <option value="">Select a font</option>
              {fonts.map((font) => (
                <option key={font.id} value={font.id}>
              {`${font.font_name.replace(".ttf","")}`}
                </option>
              ))}
            </select>

            {index > 0 && (
              <button type="button" onClick={() => removeRow(index)} className="remove-row-btn">
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="button-group">
        <button type="button" onClick={addRow} className="add-row-btn">
          Add Row
        </button>
        <button type="button" onClick={createGroup} className="create-group-btn" disabled={creating}>
          {creating ? "Creating..." : "Create Group"}
        </button>
      </div>
    </div>
  )
}

export default FontGroupCreator

