import { useState } from "react"
import Swal from "sweetalert2"

const FontUploader = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleUpload = (event) => {
    const file = event.target.files[0]

    if (!file) return

    if (!file.name.toLowerCase().endsWith(".ttf")) {
      setMessage("Only TTF files are allowed.")
      Swal.fire({
        title: "Invalid File",
        text: "Only TTF files are allowed.",
        icon: "error",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
      })
      return
    }

    setUploading(true)
    setMessage("Uploading...")

    const loadingToast = Swal.fire({
      title: "Uploading...",
      text: "Please wait while we upload your font",
      icon: "info",
      toast: true,
      position: "top",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const formData = new FormData()
    formData.append("font", file)

    fetch("http://localhost/Font Managment System/server/upload.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message)
        loadingToast.close()

        if (data.success) {
          event.target.value = "" 


          Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success",
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
          })

          if (onUploadSuccess) {

            setTimeout(() => {
              onUploadSuccess()
            }, 500)
          }
        } else {
       
          Swal.fire({
            title: "Upload Failed",
            text: data.message,
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
        setMessage("Upload failed: " + error.message)

        Swal.fire({
          title: "Upload Error",
          text: "Upload failed: " + error.message,
          icon: "error",
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
        })
      })
      .finally(() => {
        setUploading(false)
      })
  }

  return (
    <div className="uploader-container">
      <div className="upload-area">
        <input
          type="file"
          accept=".ttf"
          onChange={handleUpload}
          disabled={uploading}
          id="font-upload"
          className="file-input"
        />
        <label htmlFor="font-upload" className="upload-label">
          {uploading ? "Uploading..." : "Click to select TTF file"}
        </label>
      </div>

     
    </div>
  )
}

export default FontUploader

