import * as React from "react";
import {Input, Button, Modal,message} from "antd"
import axios from "../../plugin/ajax"
import tool from "../../plugin/tools"
import "./index.less"
class Login extends React.Component<any, any>{
    public props:any
    public state:any = {
        code:""
    }
    constructor(props:any) {
        super(props);
        this.props = props;
    }
    componentDidMount() {
        tool.setCookie("key","");
    }

    onLogin = ()=>{
        let {code } = this.state;
        if (!code)
        return Modal.warning({
            title:"提示",
            content:"请输入验证码!",
            centered:true,
            maskClosable:true
        });

        tool.setCookie("key",code);
        axios("check",{},'GET').then(res=>{
            if (res === "error"){
                message.error("登录失败!")
                tool.setCookie("key","");
            }else if(res === "ok"){
                message.success("登录成功");
                axios("extend",{},'GET').then(res=>{
                    console.log(res);
                    tool.setCookie("city",res);
                    this.props.history.push("/");
                })

            }
        })
    }
    onInput = (e:any)=>{
        let val = e.target.value;
        this.setState({
            code : val
        })
    }
    render() {
        return (
            <div id={"Login"}>
                <div className="form">
                    <p>在手机端获取验证码</p>
                    <div className="input">
                        <Input onChange={this.onInput} placeholder={"请输入验证码登录"} />
                        <Button onClick={this.onLogin}>登录</Button>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;