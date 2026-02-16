import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import { Dashboard } from "./Dashboard"
import { FileSystemApp } from "./Login"
import { ShowImage } from "./Image"
import { ShowVideo } from "./video"
import { ShowDocument } from "./document"
import { ShowAudio } from "./audio"
export function MainIndex1()
{
    return<>
       <Router>
        <Routes>
            <Route path="/" element={<FileSystemApp/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>

            <Route path="/showImage" element={<ShowImage/>}/>
            <Route path="/showVideo" element={<ShowVideo/>}/>
            <Route path="/showDocument" element={<ShowDocument/>}/>
            <Route path="/showAudio" element={<ShowAudio/>}/>
        </Routes>
       </Router>
    </>
}