import { useState, useEffect } from "react"
import Swal from "sweetalert2"

const FontGroupList = ({ refreshTrigger, onGroupDeleted, onGroupUpdated, fonts }) => {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingGroup, setEditingGroup] = useState(null)
  const [editName, setEditName] = useState("")
  const [editFontIds, setEditFontIds] = useState([])

  useEffect(() => {
    setLoading(true)

    fetch("http://localhost/Font Managment System/server/get_groups.php")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
        return res.json()
      })
      .then((groupsData) => {
        setGroups(groupsData)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Fetch Error:", error)
        setError("Failed to load groups. Please try again later.")
        setLoading(false)
      })
  }, [refreshTrigger])

  const handleDelete = (id, groupName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the group "${groupName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#7f8c8d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
     
        const loadingToast = Swal.fire({
          title: "Deleting...",
          text: "Please wait while we delete the group",
          icon: "info",
          toast: true,
          position: "top",
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        const params = new URLSearchParams()
        params.append("id", id)

        fetch("http://localhost/Font Managment System/server/delete_group.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        })
          .then((res) => res.json())
          .then((data) => {
            loadingToast.close()

            if (data.success) {
              setGroups(groups.filter((group) => group.id !== id))
              if (onGroupDeleted) onGroupDeleted()

              Swal.fire({
                title: "Deleted!",
                text: "Group deleted successfully",
                icon: "success",
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
              })
            } else {
              Swal.fire({
                title: "Error!",
                text: data.message || "Failed to delete group",
                icon: "error",
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
              })
            }
          })
          .catch((error) => {
            loadingToast.close()
            console.error("Delete Error:", error)
            Swal.fire({
              title: "Error!",
              text: "Failed to delete group. Please try again.",
              icon: "error",
              toast: true,
              position: "top",
              showConfirmButton: false,
              timer: 3000,
            })
          })
      }
    })
  }

  const startEditing = (group) => {
    setEditingGroup(group.id)
    setEditName(group.group_name)

    let fontIds
    try {
      fontIds = JSON.parse(group.font_ids)
    } catch (e) {
      console.error("Error parsing font_ids:", e)
      fontIds = []
    }

    setEditFontIds(fontIds)
  }

  const cancelEditing = () => {
    setEditingGroup(null)
    setEditName("")
    setEditFontIds([])
  }

  const getFontName = (fontId) => {
    const font = fonts.find((f) => f.id === fontId)
    return font ? font.font_name.replace(".ttf","") : `Font ID ${fontId} (Deleted)`
  }

  const fontExists = (fontId) => {
    return fonts.some((font) => font.id === fontId)
  }

  const updateGroup = () => {

    if (!editName.trim()) {
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

    
    const validFontIds = editFontIds.filter((id) => fontExists(id))

    if (validFontIds.length < 2) {
      Swal.fire({
        title: "Not Enough Fonts",
        text: "You must select at least two valid fonts for a group",
        icon: "warning",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
      })
      return
    }


    const loadingToast = Swal.fire({
      title: "Updating Group",
      text: "Please wait...",
      icon: "info",
      toast: true,
      position: "top",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    fetch("http://localhost/Font Managment System/server/update_group.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingGroup,
        group_name: editName,
        font_ids: validFontIds,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        loadingToast.close()

        if (data.success) {
          setGroups(
            groups.map((group) =>
              group.id === editingGroup
                ? {
                    ...group,
                    group_name: editName,
                    font_ids: JSON.stringify(validFontIds),
                  }
                : group,
            ),
          )

          cancelEditing()
          if (onGroupUpdated) onGroupUpdated()

          Swal.fire({
            title: "Updated!",
            text: "Group updated successfully",
            icon: "success",
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
          })
        } else {
          Swal.fire({
            title: "Error!",
            text: data.message || "Failed to update group",
            icon: "error",
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
          })
        }
      })
      .catch((error) => {
        loadingToast.close()
        console.error("Update Error:", error)
        Swal.fire({
          title: "Error!",
          text: "Failed to update group. Please try again.",
          icon: "error",
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
        })
      })
  }

  const handleFontToggle = (fontId) => {
    if (editFontIds.includes(fontId)) {
  
      setEditFontIds(editFontIds.filter((id) => id !== fontId))
    } else {
  
      setEditFontIds([...editFontIds, fontId])
    }
  }

  if (loading) return <div className="loading">Loading font groups...</div>
  if (error) return <div className="error">{error}</div>
  if (groups.length === 0) return <div className="empty-state">No font groups created yet.</div>

  return (
    <div className="group-list-table-container">
      <table className="group-list-table">
        <thead>
          <tr>
            <th>Group Name</th>
            <th>Font Names</th>
            <th>Preview</th>
            <th style={{textAlign:"center"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            
            let fontIds = []
            try {
              fontIds = JSON.parse(group.font_ids)
            } catch (e) {
              console.error(`Error parsing font_ids for group ${group.id}:`, e)
            }

            const validFontIds = fontIds.filter((fontId) => fontExists(fontId))

            if (editingGroup === group.id) {
   
              return (
                <tr key={group.id} className="edit-group-row">
                  <td colSpan="4" className="edit-group-cell">
                    <div className="edit-group">
                      <div className="form-group">
                        <label>Group Name:</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="form-control"
                          placeholder="Enter group name"
                        />
                      </div>

                      <div className="form-group">
                        <label>Select Fonts (minimum 2):</label>
                        <div className="font-checkboxes">
                          {fonts.map((font) => (
                            <label key={font.id} className="font-checkbox">
                              <input
                                type="checkbox"
                                checked={editFontIds.includes(font.id)}
                                onChange={() => handleFontToggle(font.id)}
                              />
                              {font.font_name.replace(".ttf","")}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="button-group">
                        <button onClick={cancelEditing} className="cancel-btn">
                          Cancel
                        </button>
                        <button onClick={updateGroup} className="save-btn">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            } else {
   
              return validFontIds.map((fontId, fontIndex) => (
                <tr
                  key={`${group.id}-${fontId}`}
                  className={fontIndex === 0 ? "group-start-row" : "group-continuation-row"}
                >
                  {fontIndex === 0 && (
                    <td rowSpan={validFontIds.length} className="group-name-cell">
                      {group.group_name}
                    </td>
                  )}
                  <td className="font-name-cell">{getFontName(fontId)}</td>
                  <td className="font-preview-cell">
                    <span
                      className="font-preview"
                      style={{
                        fontFamily: `font-${fontId}, Arial, sans-serif`,
                      }}
                    >
                      Aa
                    </span>
                  </td>
                  {fontIndex === 0 && (
                    <td rowSpan={validFontIds.length} className="group-actions-cell">
                      <button onClick={() => startEditing(group)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(group.id, group.group_name)} className="delete-btn">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            }
          })}
        </tbody>
      </table>
    </div>
  )
}

export default FontGroupList

