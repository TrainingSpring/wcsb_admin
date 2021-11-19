import * as React from "react";
import { Table } from 'antd';
import "./index.less";
import {CloseOutlined,LeftOutlined} from  '@ant-design/icons';
import moment from 'moment';
interface IProps{
    location?:any
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
            this.otherInfo = JSON.parse(this.record.other);
        }catch (e){
            this.otherInfo = [];
        }
    }

    componentDidMount() {
        console.log(this.record);
        console.log(this.otherInfo);
    }

    render(){
        // 第一个表的数据
        let col1:any = [
            {
                title:"套餐名称",
                dataIndex:"productOFFName",
                align:'center',
                
            },
            {
                title:"使用分钟数",
                dataIndex:"useCallTime",
                align:'center',
                
            },
            {
                title:"使用流量",
                dataIndex:"useNet",
                align:'center',
                
            },
            {
                title:"套餐费用",
                dataIndex:"consumerCost",
                align:'center',
                
            },
            {
                title:"套餐分钟数",
                dataIndex:"consumerCallTime",
                align:'center',
                
            },
            {
                title:"套餐内流量",
                dataIndex:"consumerNet",
                align:'center',
                
            },
            {
                title:"当前套餐流量",
                dataIndex:"ratableAmount",
                align:'center',
                
            },
        ]
        let d1:any = {key:0};
        for (let i in col1){
            let item = col1[i];
            let k = item.dataIndex;
            d1[k] = this.record[k];

        }
        let data1 = [d1]
        // 第二个表的数据
        let col2:any = [
            {
                title:"资费（元）",
                dataIndex:"cost",
                align:'center',
                colSpan:2,
            },
            {
                title:"资费",
                dataIndex:"costNum",
                align:'center',
                colSpan:0,
            },
            {
                title:"流量（GB）",
                dataIndex:"flow",
                align:'center',
                colSpan:2,
            
            },
            {
                title:"流量",
                dataIndex:"flowNum",
                align:'center',
                colSpan:0,

            },
            {
                title:"通话分钟数（min）",
                dataIndex:"call",
                align:'center',
                colSpan:2,
            },
            {
                title:"通话分钟数",
                dataIndex:"callNum",
                align:'center',
                colSpan:0,
            }
        ]

        let {sixNetStr,sixUseCallTime,queryTime,sixCostAllStr ,sixYuyinStr ,sixLiuLiangStr } = this.record;
        let flow = sixNetStr.split(",");
        let call = sixUseCallTime.split(",");
        queryTime = moment(new Date(queryTime));
        let data2 = [];
        for (let i = 0 ;i < 6 ; i ++) {
            let m = queryTime.subtract(1, 'months').month() + 1
            data2.push({
                key:i,
                flow:m+"月",
                flowNum:flow[i],
                call:m+"月",
                callNum:call[i],

            })
        }
        // 第三张表的数据
        let col3:any = Object.assign([],col2);
        sixCostAllStr = sixCostAllStr.split("/");
        sixYuyinStr = sixYuyinStr.split("/");
        sixLiuLiangStr = sixLiuLiangStr.split("/");
        let data3 = [
            {
                key:0,
                cost:"平均值",
                costNum:"最大值",
                flow:"平均值",
                flowNum:"最大值",
                call:"平均值",
                callNum:"最大值",
            },
            {
                key:1,
                cost:sixCostAllStr[0],
                costNum:sixCostAllStr[1],
                flow:sixYuyinStr[0],
                flowNum:sixYuyinStr[1],
                call:sixLiuLiangStr[0],
                callNum:sixLiuLiangStr[1]
            }
        ];
        // 第四张表
        let col4:any = [
            {
                title:"业务名称",
                dataIndex:"name",
                align:'center',
            },
            {
                title:"费用",
                dataIndex:"money",
                align:'center',
            },
            {
                title:"开通时间",
                dataIndex:"startTime",
                align:'center',
            },
            {
                title:"结束时间",
                dataIndex:"deadTime",
                align:'center',
            },
        ]
        let data4 = this.otherInfo.map((item:any,index:number)=>{
            let obj:any = {key:index};
            col4.forEach((col:any)=>{
                let key = col.dataIndex;
                obj[key] = item[key];
            })
            return obj;
        })
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
                    columns={col1}
                    pagination={false}
                    size={"small"}
                    dataSource={data1}
                />
                <div className="title">
                    近6个月实际消费
                </div>
                <Table
                    columns={col2}
                    pagination={false}
                    size={"small"}
                    dataSource={data2}
                />
                <div className="title">
                    近6个月平均消费
                </div>
                <Table
                    columns={col3}
                    pagination={false}
                    size={"small"}
                    dataSource={data3}
                />
                <div className="title">
                    开通业务
                </div>
                <Table
                    columns={col4}
                    pagination={false}
                    size={"small"}
                    dataSource={data4}
                />
            </div>
        )
    }
}
export default Details;