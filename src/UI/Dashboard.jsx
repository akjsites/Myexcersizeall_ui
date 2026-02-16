import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { inseraudio, inserdocument, inserimage, inservideo, retriveData } from "../FileApiSystem/api";

// Reusable UploadCard component
const UploadCard = ({
  title,
  accept,
  file,
  setFile,
  fileName,
  setFileName,
  onUpload,
  buttonText,
  color
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const cardStyle = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "20px",
    transition: "transform 0.2s",
  };

  const inputStyle = {
    padding: "10px",
    margin: "10px 0",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: color || "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: isUploading ? "not-allowed" : "pointer",
    transition: "background-color 0.2s, transform 0.2s",
    opacity: isUploading ? 0.7 : 1,
    fontWeight: "bold",
  };

  const handleButtonHover = (e) => {
    if (!isUploading) {
      e.target.style.backgroundColor = adjustColor(color || "#007bff", -20);
      e.target.style.transform = "scale(1.02)";
    }
  };

  const handleButtonLeave = (e) => {
    e.target.style.backgroundColor = color || "#007bff";
    e.target.style.transform = "scale(1)";
  };

  const handleUpload = async () => {
    if (!file || !fileName.trim()) {
      alert(`Please select a file and enter a ${title.toLowerCase()} name`);
      return;
    }
    setIsUploading(true);
    try {
      await onUpload();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ color: color || "#007bff", marginBottom: "20px" }}>
        {title}
      </h2>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Select File
        </label>
        <input
          type="file"
          accept={accept}
          onChange={(e) => setFile(e.target.files[0])}
          style={inputStyle}
          disabled={isUploading}
        />
        {file && (
          <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </div>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          File Name
        </label>
        <input
          type="text"
          placeholder={`Enter ${title.toLowerCase()} name`}
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          style={inputStyle}
          disabled={isUploading}
        />
      </div>

      <button
        style={buttonStyle}
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : buttonText}
      </button>
    </div>
  );
};

// Helper to adjust color brightness
const adjustColor = (color, amount) => {
  let usePound = false;
  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.min(Math.max(0, r), 255);
  g = Math.min(Math.max(0, g), 255);
  b = Math.min(Math.max(0, b), 255);

  return (usePound ? "#" : "") + (b | (g << 8) | (r << 16)).toString(16).padStart(6, "0");
};

// Button link style
const buttonLinkStyle = (bgColor, textColor) => ({
  display: "inline-block",
  padding: "10px 20px",
  backgroundColor: bgColor,
  color: textColor,
  borderRadius: "5px",
  textDecoration: "none",
  fontWeight: "bold",
  textAlign: "center",
  minWidth: "100px",
  transition: "background-color 0.2s, transform 0.2s",
  cursor: "pointer",
});

export function Dashboard() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [uploadHistory, setUploadHistory] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoName, setVideoName] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [audioName, setAudioName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await retriveData();
        if (data) setUsername(data.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        alert("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();

    const savedHistory = localStorage.getItem("uploadHistory");
    if (savedHistory) setUploadHistory(JSON.parse(savedHistory));
  }, []);

  const handleUpload = async (file, name, type, uploadFunc) => {
    if (!file || !name.trim()) {
      alert(`Please select a file and enter a ${type} name`);
      return false;
    }

    try {
      const response = await uploadFunc(file, name, username);
      if (response.status === 200) {
        const newRecord = {
          type,
          name,
          filename: file.name,
          date: new Date().toISOString(),
          size: file.size,
          status: "success",
        };
        const updatedHistory = [newRecord, ...uploadHistory.slice(0, 9)];
        setUploadHistory(updatedHistory);
        localStorage.setItem("uploadHistory", JSON.stringify(updatedHistory));

        if (type === "Image") { setImageFile(null); setImageName(""); }
        else if (type === "Video") { setVideoFile(null); setVideoName(""); }
        else if (type === "Document") { setDocumentFile(null); setDocumentName(""); }
        else if (type === "Audio") { setAudioFile(null); setAudioName(""); }

        alert(`${type} uploaded successfully!`);
        return true;
      } else {
        alert(`Failed to upload ${type}`);
        return false;
      }
    } catch (error) {
      console.error(`${type} upload error:`, error);
      alert(`Upload error: ${error.response?.data?.message || error.message}`);
      return false;
    }
  };

  const containerStyle = {
    padding: "30px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const headerStyle = {
    color: "#333",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #eaeaea",
  };

  const uploadsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  };

  const historyStyle = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  if (isLoading) {
    return (
      <div style={{ ...containerStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>
        Welcome, <span style={{ color: "#007bff" }}>{username}</span>
      </h1>

      <div style={uploadsContainerStyle}>
        <UploadCard
          title="Upload Image"
          accept="image/*"
          file={imageFile}
          setFile={setImageFile}
          fileName={imageName}
          setFileName={setImageName}
          onUpload={() => handleUpload(imageFile, imageName, "Image", inserimage)}
          buttonText="Upload Image"
          color="#007bff"
        />

        <UploadCard
          title="Upload Video"
          accept="video/*"
          file={videoFile}
          setFile={setVideoFile}
          fileName={videoName}
          setFileName={setVideoName}
          onUpload={() => handleUpload(videoFile, videoName, "Video", inservideo)}
          buttonText="Upload Video"
          color="#28a745"
        />

        <UploadCard
          title="Upload Document"
          accept=".pdf,.doc,.docx,.txt"
          file={documentFile}
          setFile={setDocumentFile}
          fileName={documentName}
          setFileName={setDocumentName}
          onUpload={() => handleUpload(documentFile, documentName, "Document", inserdocument)}
          buttonText="Upload Document"
          color="#ffc107"
        />

        <UploadCard
          title="Upload Audio"
          accept="audio/*"
          file={audioFile}
          setFile={setAudioFile}
          fileName={audioName}
          setFileName={setAudioName}
          onUpload={() => handleUpload(audioFile, audioName, "Audio", inseraudio)}
          buttonText="Upload Audio"
          color="#6f42c1"
        />
      </div>

      {uploadHistory.length > 0 && (
        <div style={historyStyle}>
          <h2 style={{ color: "#333", marginBottom: "20px" }}>Recent Uploads</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Type</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Name</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Filename</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Size</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Date</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {uploadHistory.map((record, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #dee2e6" }}>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor:
                          record.type === "Image" ? "#d1ecf1" :
                          record.type === "Video" ? "#d4edda" :
                          record.type === "Document" ? "#fff3cd" : "#e2d9f3",
                        color:
                          record.type === "Image" ? "#0c5460" :
                          record.type === "Video" ? "#155724" :
                          record.type === "Document" ? "#856404" : "#6f42c1",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}>
                        {record.type}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>{record.name}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{record.filename}</td>
                    <td style={{ padding: "12px" }}>{(record.size / 1024).toFixed(2)} KB</td>
                    <td style={{ padding: "12px", color: "#666" }}>{new Date(record.date).toLocaleDateString()}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        color: record.status === "success" ? "#28a745" : "#dc3545",
                        fontWeight: "bold",
                      }}>
                        {record.status === "success" ? "✓ Success" : "✗ Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom button links */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        marginTop: "30px",
        justifyContent: "center"
      }}>
        <Link to="/showImage" style={buttonLinkStyle("#007bff", "#fff")}>Images</Link>
        <Link to="/showVideo" style={buttonLinkStyle("#28a745", "#fff")}>Videos</Link>
        <Link to="/showDocument" style={buttonLinkStyle("#ffc107", "#000")}>Documents</Link>
        <Link to="/showAudio" style={buttonLinkStyle("#6f42c1", "#fff")}>Audios</Link>
      </div>
    </div>
  );
}
