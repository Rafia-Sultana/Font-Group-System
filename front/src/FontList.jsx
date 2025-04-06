import { useState, useEffect } from "react"
import Swal from "sweetalert2"

const FontList = ({ refreshTrigger, onDeleteSuccess }) => {
  const [fonts, setFonts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    fetch("http://localhost/Font Managment System/server/get_fonts.php")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setFonts(data)
        setLoading(false)
        loadFonts(data)
      })
      .catch((error) => {
        console.error("Fetch Error:", error)
        setError("Failed to load fonts. Please try again later.")
        setLoading(false)
      })
  }, [refreshTrigger])

  const loadFonts = (fontData) => {
    const style = document.createElement("style")

    let fontFaces = ""

    fontData.forEach((font) => {
      fontFaces += `
        @font-face {
          font-family: 'font-${font.id}';
          src: url('http://localhost/Font Managment System/server/serve_font.php?id=${font.id}') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `
    })

    style.textContent = fontFaces
    document.head.appendChild(style)
    console.log("Font styles added to document head")
  }

  const handleDelete = (id, fontName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${fontName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#7f8c8d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting...",
          text: "Please wait while we delete the font",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        const params = new URLSearchParams()
        params.append("id", id)

        fetch("http://localhost/Font Managment System/server/delete_font.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        })
          .then((res) => {
           
            return res.text().then((text) => {
              console.log("Response text:", text)
              try {
             
                return JSON.parse(text)
              } catch (e) {
              
                console.error("JSON parse error:", e)
                return { success: false, message: "Invalid server response" }
              }
            })
          })
          .then((data) => {
            console.log("Processed data:", data)

            if (data.success) {
           
              setFonts(fonts.filter((font) => font.id !== id))

         
              if (typeof onDeleteSuccess === "function") {
                onDeleteSuccess()
              }

          
              Swal.fire({
                title: "Deleted!",
                text: "Font deleted successfully",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              })
            } else {
          
              Swal.fire({
                title: "Error!",
                text: data.message || "Error deleting font",
                icon: "error",
                footer: "The font might still be deleted. Try refreshing the page.",
              })
            }
          })
          .catch((error) => {
            console.error("Delete Error:", error)

           
            Swal.fire({
              title: "Error!",
              text: "Failed to delete font. The server might have processed the deletion but failed to respond properly.",
              icon: "error",
              footer: '<a href="javascript:location.reload()">Click here to refresh the page</a>',
            })
          })
      }
    })
  }

  if (loading) return <div className="loading">Loading fonts...</div>
  if (error) return <div className="error">{error}</div>
  if (fonts.length === 0) return <div className="empty-state">No fonts uploaded yet.</div>

  return (
    <div className="font-list">
      <table>
        <thead>
          <tr>
            <th>Font Name</th>
            <th>Preview</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fonts.map((font) => (
            <tr key={font.id}>
              <td>{`${font.font_name.replace(".ttf","")}`}</td>
              <td>
                <div
                  className="font-preview"
                  style={{
                    fontFamily: `font-${font.id}, Arial, sans-serif`,
                    fontSize: "16px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </div>
              </td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(font.id, font.font_name)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FontList

