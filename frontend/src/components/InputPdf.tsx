
const InputPdf = () => {
  return (
    <input
                    type="file"
                    accept=".pdf"
                    id="fileUpload"
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0]
                        if (file) {
                          const formdata = new FormData()
                          formdata.append("pdf", file)
                          await fetch("http://localhost:8000/upload/pdf", {
                            method: "POST",
                            body: formdata,
                          })
                          console.log("file uploaded")
                        }
                      }
                    }}
                  />
  )
}

export default InputPdf