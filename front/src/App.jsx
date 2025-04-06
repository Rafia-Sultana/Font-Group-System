
import { useState, useEffect } from "react"
import FontUploader from "./FontUploader"
import FontList from "./FontList"
import FontGroupCreator from "./FontGroupCreator"
import FontGroupList from "./FontGroupList"
import "./styles.css"

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [fonts, setFonts] = useState([])
  const [loading, setLoading] = useState(true)

 
  useEffect(() => {
    fetchFonts()
  }, [refreshTrigger])

  const fetchFonts = () => {
    setLoading(true)
    fetch("http://localhost/Font Managment System/server/get_fonts.php")
      .then((res) => res.json())
      .then((data) => {
        setFonts(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Fetch Error:", error)
        setLoading(false)
      })
  }

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="app-container">
      <h1>Font Group System</h1>

      <div className="section">
        <h2>Upload Fonts</h2>
        <FontUploader onUploadSuccess={refreshData} />
      </div>

      <div className="section">
        <h2>Font List</h2>
        <FontList refreshTrigger={refreshTrigger} onDeleteSuccess={refreshData} />
      </div>

      <div className="section">
        <h2>Create Font Group</h2>
        <FontGroupCreator onGroupCreated={refreshData} fonts={fonts} loading={loading} />
      </div>

      <div className="section">
        <h2>Font Groups</h2>
        <FontGroupList
          refreshTrigger={refreshTrigger}
          onGroupDeleted={refreshData}
          onGroupUpdated={refreshData}
          fonts={fonts}
        />
      </div>
    </div>
  )
}

export default App

