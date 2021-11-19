/**
 * @desc 设置storage
 * @param {string} key
 * @param {any} value
 */
function setStorage(key:string,value:any){
    if (!value) value = "";
    else if (typeof value === 'object') value = JSON.stringify(value);
    localStorage.setItem(key,value);
}
/**
 * @desc 获取storage的内容
 * @param {string} key
 */
function getStorage(key:string){
    let value:any = localStorage.getItem(key);
    try{
        return JSON.parse(value);
    }catch (e){
        return value;
    }
}
/**
 * @desc 格式化时间
 * @Author Training
 * @param date
 * @param {string} fmt
 * @return {string}
 */
function formatDate(date:Date , fmt:string) :string{ // author: meizz
    let o:any = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "S": date.getMilliseconds() // 毫秒
    };
    let str:string = "";
    if (/(y+)/.test(fmt))
        str = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(str)) {
            str = str.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
                "00" + o[k]).substr(("" + o[k]).length)));
        }
    return str;
}

/**
 * @desc 获取随机字符串
 * @param format 格式
 * @param options 参数
 * @returns {string} 随机字符串
 * @constructor
 */
function GUID(format="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",options:any){
    options = Object.assign({},{
        type: 0, // 0 全大写, 1: 全小写 2 : 大写小写混合
        hasNum:true, // 是否包含数字
        maxCHAR:'F', // 最大的大写字母,
        maxChar:'z'  // 最大的小写字母
    },options);
    let char =  "abcdefghijklmnopqrstuvwxyz";
    let num = '1234567890';
    let str:any = [];
    // ------------------
    let getChar = (charKey:any)=>{
        let s = "";
        for (let i = 0 ; i < char.length;i++){
            let w = char[i];
            s+= w;
            if (w === options[charKey].toLowerCase()) break;
        }
        return s;
    }
    if (options.type === 0) str.push(getChar('maxCHAR').toUpperCase());
    else if(options.type === 1) str.push(getChar('maxChar'));
    else {
        str.push(getChar('maxCHAR').toUpperCase());
        str.push(getChar('maxChar'));
    }
    if (options.hasNum) str.push(num);
    str = str.join('');
    // ----------------------
    let random = ()=>{
        let i = parseInt((Math.random()*(str.length-1)+""));
        return str[i];
    };
    return format.replace(/x/g,res=>random())
}

/**
 * 
 * @param {string}cName cookie 名
 * @param {string|number}cValue cookie 值
 * @param {number|boolean}exDays 有效期(天) 
 */
function setCookie(cName:string,cValue:string|number,exDays?:number|boolean)
{
    let d:Date = new Date();
    let expires:string;
    if (exDays && typeof exDays === "number"){
        d.setTime(d.getTime()+(exDays*24*60*60*1000));
        expires = "expires="+d.toUTCString();
    }else expires = "";
    document.cookie = cName + "=" + cValue + "; " + expires;
}

/**
 * 
 * @param {string}cName
 */
function getCookie(cName:string)
{
    let name = cName + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++)
    {
        let c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}
export default {
    GUID,
    getStorage,
    setStorage,
    setCookie,
    getCookie,
    formatDate
}