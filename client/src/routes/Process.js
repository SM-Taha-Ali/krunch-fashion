import Serachcomponent from "../components/Serachcomponent";
import React, { useState } from 'react';
import axios from "axios";
import LoaderImg from "../assets/loader.gif";

function ImageGrid({ images }) {
  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div className="image-grid-item" key={index}>
          <img src={`data:image/png;base64,${image}`} alt={`Generated Sample ${index}`} />
        </div>
      ))}
    </div>
  );
}

function Process() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setloading] = useState(false)
  const [encodedImages, setencodedImages] = useState([])

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setloading(true); // Assuming you have a state variable named 'loading' to manage loading state

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post("http://127.0.0.1:5000/upload", formData);

      let result_images = JSON.parse(response.data.images)

      setencodedImages(result_images)
      // Handle the response as needed
      console.log("API response:", response.data);
    } catch (error) {
      // Handle error
      console.error("API error:", error);
    } finally {
      setloading(false); // Reset loading state regardless of success or failure
    }
  };

  const handleSubmitWithImage = async () => {
    try {
      setloading(true); // Assuming you have a state variable named 'loading' to manage loading state

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post("http://127.0.0.1:5000/upload_with_image", formData);

      let result_images = JSON.parse(response.data.images)

      setencodedImages(result_images)
      // Handle the response as needed
      console.log("API response:", response.data);
    } catch (error) {
      // Handle error
      console.error("API error:", error);
    } finally {
      setloading(false); // Reset loading state regardless of success or failure
    }
  };



  return (
    <div>
      <div className="container" style={{ marginTop: "200px", width: "90%", height: "100%", backgroundColor: "#F8F8FF", position: "relative", marginLeft: "70px", borderRadius: "10px" }}>
        <div className="top-section" style={{ width: "100%", height: "5px", backgroundColor: "yellow", position: "absolute", top: 0, left: 0 }}></div>
        <div className="content" style={{ padding: "40px" }}>
          <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", position:"relative"}}>
            <span style={{position:"absolute", left:"50%", top:"50", transform:"translate(-50%, -50%)", fontSize:"16px", fontWeight:"bold"}}>OR</span>
            <div className="col-md-6">
            <div style={{ zIndex: "9999" }}>
            <h3>Upload image to generate Design.</h3>
            <div style={{ padding: "20px 0px" }}>
              <label for="upload_img" style={{ cursor: "pointer", border: "1px solid #d8d8d8", padding: "10px", borderRadius: "5px" }}><i class="fas fa-cloud-upload-alt"></i> Upload Image</label>
              <input
                id="upload_img"
                type="file"
                style={{ position: "absolute", left: "-9999px" }}
                onChange={handleFileChange}
              />
              {selectedFile && (
                <div style={{ marginTop: "30px" }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: '256px', maxHeight: '256px' }}
                  />
                </div>
              )}
            </div>
            <div>
              <button style={{
                padding: "10px 20px", border: "none", outline: "none",
                borderRadius: "5px", backgroundColor: "#3880FF", cursor: "pointer", color: "white"
              }} onClick={handleSubmitWithImage} disabled={!selectedFile}>Generate</button>
            </div>
          </div>
            </div>
            <div className="col-md-6">
            <div>
            <h3>Click the button below to generate designs.</h3>
            <button style={{
              padding: "10px 20px", border: "none", outline: "none",
              borderRadius: "5px", backgroundColor: "#3880FF", cursor: "pointer", color: "white"
            }} onClick={handleSubmit}>Generate</button>
          </div>
            </div>
          </div>
        

     

          <div style={{ padding: "20px 0px" }}>
            <hr />
          </div>
          {
            loading ? <div style={{ minHeight: "300px", height: "100%", padding: "10px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <img src={LoaderImg} style={{ height: "150px", width: "150px " }} />
              <span style={{ display: "block" }}>Generating Images...</span>
            </div> :
              <div>
                <ImageGrid images={encodedImages} />
              </div>
          }
        </div>
      </div>
    </div>

  );
}

export default Process;

