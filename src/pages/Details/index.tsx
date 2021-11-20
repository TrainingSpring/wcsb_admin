import * as React from "react";
import { Table } from 'antd';
import "./index.less";
import {CloseOutlined,LeftOutlined} from  '@ant-design/icons';
import moment from 'moment';
interface IProps{
    location?:any
    data?:any
}
class Details extends React.Component{
    public props: IProps | any;
    private readonly record:any ;
    private readonly otherInfo:any;
    constructor(props:any) {
        super(props);
        this.props = props;
        this.record = this.props.location.param.record;
        try {
            this.otherInfo = this.record._otherDetails;
        }catch (e){
            this.otherInfo = null;
        }
    }

    componentDidMount() {

    }
    render(){
        let {info,sixCost,sixAverageCost,business} = this.otherInfo;

        return(
            <div id={"Details"}>
                <div className="header">
                    <div className={"close"} onClick={this.props.history.goBack}><LeftOutlined style={{marginLeft:"20px"}} /></div>
                    <div className={"text"}>详情</div>
                    <div className={"close"} onClick={this.props.history.goBack}><CloseOutlined style={{marginRight:"20px"}} /></div>
                </div>
                <div className="title">
                    套餐信息
                </div>
                <Table
                    columns={info.col}
                    pagination={false}
                    size={"small"}
                    dataSource={info.data}
                />
                <div className="title">
                    近6个月实际消费
                </div>
                <Table
                    columns={sixCost.col}
                    pagination={false}
                    size={"small"}
                    dataSource={sixCost.data}
                />
                <div className="title">
                    近6个月平均消费
                </div>
                <Table
                    columns={sixAverageCost.col}
                    pagination={false}
                    size={"small"}
                    dataSource={sixAverageCost.data}
                />
                <div className="title">
                    开通业务
                </div>
                <Table
                    columns={business.col}
                    pagination={false}
                    size={"small"}
                    dataSource={business.data}
                />
            </div>
        )
    }
}
export default Details;