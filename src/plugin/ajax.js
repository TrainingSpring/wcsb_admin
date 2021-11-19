import axios from "axios";
import tools from "./tools"
// const defaultHost = "http://192.168.86.12:9900/"; // 测试时需要
const defaultHost = ""; // 测试时需要
class packageAxios {
    constructor(url="",data,method = "POST"){
        this.host = defaultHost||"./";
        let key = tools.getCookie('key');
        if (key) key = "?key="+key
        // else throw new Error("未登录");
        if (url.indexOf("http") >-1)this.host = "";
        return axios(this.host+url+key,{
            data,
            method
        })
    }
}
export default (url,data,method = "POST")=>new Promise((resolve,reject)=>{
    new packageAxios(url,data,method).then(res=>{
        resolve(res.data);
    }).catch(error=>{
        reject(error);
    })
})