import axios from "axios";


const api=axios.create({
    baseURL:`http://172.16.0.135:8080`,
    withCredentials:true,
})

export const LoginData=(UserName,Password)=>{
    const user=new FormData();
    user.append('UserName',UserName);
    user.append('Password',Password);
   return api.post("/Login",user);
}

export const retriveData=()=>{
    return api.get("/GetUser",{withCredentials:true});
}

export const inserimage=(file,imagename,userName)=>{
    const userdata=new FormData();
    userdata.append("file",file);
    userdata.append("name",imagename);
    userdata.append("username",userName);
    return api.post("/uploadsImage",userdata,{
        headers:{"content-type":"multipart/form-data"},
    });
}

export const inservideo=(file,imagename,userName)=>{
    const userdata=new FormData();
    userdata.append("file",file);
    userdata.append("name",imagename);
    userdata.append("username",userName);
    return api.post("/uploadsvideo",userdata,{
        headers:{"content-type":"multipart/form-data"},
    });
}
export const inserdocument=(file,imagename,userName)=>{
    const userdata=new FormData();
    userdata.append("file",file);
    userdata.append("name",imagename);
    userdata.append("username",userName);
    return api.post("/uploadsDocument",userdata,{
        headers:{"content-type":"multipart/form-data"},
    });
}
export const inseraudio=(file,imagename,userName)=>{
    const userdata=new FormData();
    userdata.append("file",file);
    userdata.append("name",imagename);
    userdata.append("username",userName);
    return api.post("/uploadsAudio",userdata,{
        headers:{"content-type":"multipart/form-data"},
    });
}

export const GetImg=()=>{
    return api.get("/GetImage")
}

export const GetVid=()=>{
    return api.get("/Getvideo")
}

export const GetDocu=()=>{
    return api.get("/Getdocument")
}

export const GetAud=()=>{
    return api.get("/GetAdio")
}
