import * as React from "react"
import {Form,Input,Button,Progress} from "antd"
import "./index.less"
import {CheckCircleOutlined} from "@ant-design/icons"

class SubmitData extends React.Component<any,any>{
    public state = {
        submit:false
    }
    // 提交
    onFinish = (values: any) => {
        this.setState({
            submit:true
        })
    };

    onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    render(){
        console.log(this.props.history);
        return(
            <div id={"Submit"}>
                <div className="form" style={{display:this.state.submit?"none":"flex"}} >
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="验证码"
                            name="verify"
                            rules={[{ required: true, message: 'Please input your verify code!' }]}
                        >
                           <div className="verify">
                               <Input />
                               <Button style={{marginLeft:"10px"}} type="primary" htmlType="submit">
                                   提交
                               </Button>
                           </div>
                        </Form.Item>
                        <div className="process">
                            <Progress
                                type={"circle"}
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                percent={1}
                            />
                        </div>
                    </Form>
                </div>
                <div style={{display:this.state.submit?"flex":"none"}} className="success">
                    <div className="icon"><CheckCircleOutlined style={{fontSize:"100px",color:"#52c41a"}}/></div>
                    <div className="text">您已成功提交50条数据！</div>
                </div>
            </div>
        )
    }
}
export default SubmitData;
