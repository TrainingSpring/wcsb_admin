import * as React from "react";
import Filter from "../../components/Fillter";
import RenderData from "../../components/RenderData";
import axios from "../../plugin/ajax"
import {Link} from "react-router-dom";
import XLSX from "xlsx";
import tools from "../../plugin/tools";
import moment from "moment";
import {Debugger} from "inspector";
import {message} from "antd";

interface DataType {
    id:number|string,
    name:string
}
interface IState{
    path:string,
    tableData:DataType[]|any
    columns:any[]
    page:number
    tableName:string
    total:number
    query?:string
}
class ClientData extends React.Component<any, any>{
    public state:IState =  {
        path:"",
        tableData:[],
        columns:[],
        page:1,
        tableName:"phone_bill_consumer",
        total:0,
        query:""
    }
    public time:any;
    constructor(props:any) {
        super(props);
    }

    private CheckLogin = ()=>{
        let key = tools.getCookie("key");
        return !!key;
    }
    componentDidMount() {
        if (this.CheckLogin())
            this.getColumnsAndData();
    }
    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (prevProps.location.pathname !== this.props.location.pathname){
            setTimeout(()=>{
                this.setState({
                    page:1,
                    query:""
                })
                this.getColumnsAndData()
            })
        }
    }
    componentWillUnmount() {
        clearInterval(this.time);
    }
    formatData=(list:any = [])=>{
        let path = this.props.history.location.pathname;
        if (list!= null) {
            let data:any = list.map((item: any, index: number) => {
                try {
                    item = JSON.parse(item);
                    item["details"] = "详情";
                    item["key"] = index;
                    if (item.other) {
                        let other = this.getOtherData(item);
                        item["_otherDetails"] = other;
                        /*item["productOFFName"] = other.info.data[0].productOFFName;
                        item["useCallTime"] = other.info.data[0].useCallTime;
                        item["useNet"] = other.info.data[0].useNet;
                        item["consumerCost"] = other.info.data[0].consumerCost;
                        item["consumerNet"] = other.info.data[0].consumerNet;
                        item["ratableAmount"] = other.info.data[0].ratableAmount;*/
                        item["recentlyCost_0"] = other.sixCost.data[0].costNum; // 最近一个月的消费
                        item["recentlyCost_1"] = other.sixCost.data[1].costNum; // 最近第二个月的消费
                        item["recentlyCost_2"] = other.sixCost.data[2].costNum; //...
                        item["recentlyCost_3"] = other.sixCost.data[3].costNum;
                        item["recentlyCost_4"] = other.sixCost.data[4].costNum;
                        item["recentlyCost_5"] = other.sixCost.data[5].costNum;
                        // 近6个月的流量使用
                        item["recentlyFlow_0"] = other.sixCost.data[0].flowNum; // 最近一个月的流量
                        item["recentlyFlow_1"] = other.sixCost.data[1].flowNum; // 最近第二个月的流量
                        item["recentlyFlow_2"] = other.sixCost.data[2].flowNum; //...
                        item["recentlyFlow_3"] = other.sixCost.data[3].flowNum;
                        item["recentlyFlow_4"] = other.sixCost.data[4].flowNum;
                        item["recentlyFlow_5"] = other.sixCost.data[5].flowNum;
                        // 近6个月的通话分钟
                        item["recentlyCall_0"] = other.sixCost.data[0].callNum; // 最近一个月的流量
                        item["recentlyCall_1"] = other.sixCost.data[1].callNum; // 最近第二个月的流量
                        item["recentlyCall_2"] = other.sixCost.data[2].callNum; //...
                        item["recentlyCall_3"] = other.sixCost.data[3].callNum;
                        item["recentlyCall_4"] = other.sixCost.data[4].callNum;
                        item["recentlyCall_5"] = other.sixCost.data[5].callNum;
                        let getStr =  (idx:number,k:string)=> other.sixCost.data[idx][k]+":"+(other.sixCost.data[idx][(k+"Num")]||"");
                        item["sixCost"] = `${getStr(0,"cost")},${getStr(1,"cost")},${getStr(2,"cost")},${getStr(3,"cost")},${getStr(4,"cost")},${getStr(5,"cost")}`;
                        item["sixFlow"] = `${getStr(0,"flow")},${getStr(1,"flow")},${getStr(2,"flow")},${getStr(3,"flow")},${getStr(4,"flow")},${getStr(5,"flow")}`;
                        item["sixCall"] = `${getStr(0,"call")},${getStr(1,"call")},${getStr(2,"call")},${getStr(3,"call")},${getStr(4,"call")},${getStr(5,"call")}`;
                        item["_extraColumnsInfo"] = [
                            ...other.info.col,
                           /* {
                                title:other.sixCost.data[0].cost+"消费(元)" || "",
                                dataIndex:"recentlyCost_0"
                            },
                            {
                                title:other.sixCost.data[1].cost+"消费(元)" || "",
                                dataIndex:"recentlyCost_1"
                            },
                            {
                                title:other.sixCost.data[2].cost+"消费(元)" || "",
                                dataIndex:"recentlyCost_2"
                            },
                            {
                                title:other.sixCost.data[3].cost+"消费(元)" || "",
                                dataIndex:"recentlyCost_3"
                            },
                            {
                                title:other.sixCost.data[4].cost+"消费(元)" || "",
                                dataIndex:"recentlyCost_4"
                            },
                            {
                                title:other.sixCost.data[5].cost+"消费(元)" || "",
                                dataIndex:"recentlyCost_5"
                            },
                            {
                                title:other.sixCost.data[0].flow+"流量(GB)",
                                dataIndex:"recentlyFlow_0"
                            },
                            {
                                title:other.sixCost.data[1].flow+"流量(GB)",
                                dataIndex:"recentlyFlow_1"
                            },
                            {
                                title:other.sixCost.data[2].flow+"流量(GB)",
                                dataIndex:"recentlyFlow_2"
                            },
                            {
                                title:other.sixCost.data[3].flow+"流量(GB)",
                                dataIndex:"recentlyFlow_3"
                            },
                            {
                                title:other.sixCost.data[4].flow+"流量(GB)",
                                dataIndex:"recentlyFlow_4"
                            },
                            {
                                title:other.sixCost.data[5].flow+"流量(GB)",
                                dataIndex:"recentlyFlow_5"
                            },
                            {
                                title:other.sixCost.data[0].call+"通话(分钟)",
                                dataIndex:"recentlyCall_0"
                            },
                            {
                                title:other.sixCost.data[1].call+"通话(分钟)",
                                dataIndex:"recentlyCall_1"
                            },
                            {
                                title:other.sixCost.data[2].call+"通话(分钟)",
                                dataIndex:"recentlyCall_2"
                            },
                            {
                                title:other.sixCost.data[3].call+"通话(分钟)",
                                dataIndex:"recentlyCall_3"
                            },
                            {
                                title:other.sixCost.data[4].call+"通话(分钟)",
                                dataIndex:"recentlyCall_4"
                            },
                            {
                                title:other.sixCost.data[5].call+"通话(分钟)",
                                dataIndex:"recentlyCall_5"
                            },*/
                            {title:"近六个月消费(元)",dataIndex:"sixCost"},
                            {title:"近六个月流量(GB)",dataIndex:"sixFlow"},
                            {title:"近六个月通话(分钟)",dataIndex:"sixCall"},
                            {
                                title:"消费:六个月平均/六个月最大",
                                dataIndex:"sixCostAllStr"
                            },
                            {
                                title:"语音:六个月平均/六个月最大",
                                dataIndex:"sixYuyinStr"
                            },
                            {
                                title:"流量:六个月平均/六个月最大",
                                dataIndex:"sixLiuLiangStr"
                            },
                            {
                                title:"开通业务",
                                dataIndex:"other"
                            },
                        ]

                    }
                    if (path === "/") item["gps"] = `经度: ${item.station_lon} 纬度: ${item.station_lat} \n 地址: ${item.station_name}`

                    return item;
                }catch (err){

                }
            })

            return data;
        }
        return [];
    }
    getData = (table_name:string) => {

        return axios("query",{
            pageInfo: this.state.page + ",10",
            query_str: this.state.query,
            table_name: table_name
        }).then((res:any)=>{
            if (res === "key error"){
                message.warning("登录失效,请重新登录!");
                this.props.history.replace("/login");
                return ;
            }
            let data = this.formatData(res.data);
            this.setState({
                tableData: data,
                total:res.total_count
            })
            return res;
        })
    }
    getColumnsAndData=()=>{
        let path = this.props.history.location.pathname;
        this.setState({
            tableData :[],
            total:0
        })
        let colStr:any=[];
        let tableName = "";
        switch (path) {
            case "/":
                tableName = "phone_bill_consumer";
                colStr =  [
                    {text:"坐标",key:"gps", width:"200px",render:(text:string)=><div  style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>{text}</div>},
                    {text:"户主",key:"mainUser"},
                    {text: "查询账号",key:"queryPersonPhoneNum"},
                    {text: "运营商",key:"netType",render:(text:number)=><p>{text===0?"移动":text===1?"联通":text===2?"电信":""}</p>},
                    {text: "查询时间",key:"queryTime"},
                    {text: "查询人账号",key:"user"},
                    {text: "所属县公司",key:"queryPersonCompany"},
                    {text: "所属服务中心",key:"dataCentre"},
                    {text: "所属渠道/工程师类型",key:"channelType"},
                    {text: "查询人姓名",key:"queryPersonUserName"},
                    {text: "关联识别码",key:"connectPhones",width:"100px",render:(text:string)=><p style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>{text}</p>},
                    {text: "详情",key:"details",render:(text: string,record:any) => <Link to={{pathname:"/details",param:{record}}}>{text}</Link>},
                    {text: "指南针",key:""},
            ];
                break;
            case "/experience":
                tableName = "user_opinion"
                colStr =  [
                    {text:"所属分公司",key:"queryPersonCompany"},
                    {text:"所属服务中心",key:"dataCentre  "},
                    {text:"所属网点",key:"shopName"},
                    {text:"查询人账号",key:"userName"},
                    {text:"查询账号",key:"queryPersonPhoneNum"},
                    {text:"客户感知",key:"userOpinion"},
                    {text:"客户城乡标识",key:"isCityRemark"},
                    {text:"加锁业务类型",key:"lockType"},
                    {text:"加锁业务到期时间",key:"lockExpriseTime"},
                    {text:"关联场景",key:"connectStation"},
                    {text:"家庭人口数",key:"familyNum"},
                    {text:"成员号码1",key:"menberPhone1"},
                    {text:"成员号码2",key:"menberPhone2"},
                    {text:"成员号码3",key:"menberPhone3"},
                    {text:"主要槽点",key:"webDefect"},
                    {text:"潜在需求",key:"funcAdd"},
                    {text:"集团归属情况",key:"groupOwnership"},
                    {text:"商铺情况",key:"shopInfo"},
                    {text:"常住小区",key:"stationLive"},
                    {text:"楼栋队组",key:"stationLou"},
                    {text:"门牌号单元楼层",key:"stationMen"},
                    {text:"后续营销情况",key:"otherInfo"},
                    {text:"是否迎回",key:"isBack"},
                    {text:"提交时间",key:"add_time"},
               ];
                break;
            case "/shop":
                tableName = "street_shops"
                colStr = [
                    {text: "所属分公司", key: "company"},
                    {text: "所属服务中心", key: "dataCentre"},
                    {text: "所属网点", key: "shopName"},
                    {text: "查询人账号", key: "user_name"},
                    {text: "坐标", key: "gps"},
                    {text: "所属网格", key: "grid"},
                    {text: "社区", key: "community"},
                    {text: "街道", key: "street"},
                    {text: "门牌号码", key: "house_number"},
                    {text: "商铺名称", key: "shop_name"},
                    {text: "行业类别", key: "category"},
                    {text: "联系人", key: "contact_user"},
                    {text: "联系电话", key: "contact_phone"},
                    {text: "员工人数", key: "employee_count"},
                    {text: "是否安装宽带", key: "is_install_broadband",render:(text:any)=><p>{text==1?"是":"否"}</p>},
                    {text: "现有宽带商", key: "broadband_name"},
                    {text: "宽带到期时间", key: "broadband_expire_time"},
                    {text: "宽带209号码", key: "broadband_number "},
                    {text: "提交时间", key: "add_time"},
                ]

        }
        // 格式化表头
        let col:any[] = colStr.map((item:any,index:any)=>{
            let obj:any = {
                title:item.text,
                dataIndex:item.key,
                render:item.render,
                width:item.width
            }
            // if (!!item.render)obj['render'] = item.render;
            // if (item.text === "详情")obj["render"] = (text: string) => <Link to={"/details"}>{text}</Link>
            return obj;
        })

        this.setState({
            columns:col,
            tableName
        })
        // 格式化数据
        this.getData(tableName).then(res=>{

        })
    }
    /**
     * @desc 搜索按钮点击事件
     * @param cityInfo
     * @param server
     * @param range
     */
    onSearch = (cityInfo:any,server:any,range:any)=>{
        cityInfo = cityInfo||[];
        let tableName = this.state.tableName; // 表名
        let queryList = []; // 存放查询条件的数组
        let timeKey = "queryTime",  // 查询条件中 时间的key
            serverKey="dataCentre", // 服务中心的key
            countyKey = "queryPersonCompany"; // 地区的key
        let city = cityInfo[0],  // 城市
            county = cityInfo[1], // 县/区
            path = this.props.history.location.pathname;
        switch (path) {
            case "/":
                timeKey = "queryTime";
                serverKey="dataCentre";
                countyKey = "queryPersonCompany";
                break;
            case "/experience":
                timeKey = "add_time";
                serverKey="dataCentre";
                countyKey = "queryPersonCompany";
                break;
            case "/shop":
                timeKey = "add_time";
                serverKey="dataCentre";
                countyKey = "queryPersonCompany";
                break;
        }
        if (!!range && range.length > 0 ) { // 判断时间是否为空
            let format = "YYYY-MM-DD";
            // if(path === "/experience") format = "DD/MM/YYYY";
            let startTime = range[0].format(format),
                endTIme = range[1].format(format);
            queryList.push(`${timeKey}:datetime>=${startTime}`)
            queryList.push(`${timeKey}:datetime<=${endTIme}`)
        }
        // 地区的条件
        let queryCity = county ? `${countyKey}:string=${county}` : "";
        // 服务区条件
        let queryServer = server && server !== "全部" ? `${serverKey}:string=${server}` : "";
        if(!!queryCity)queryList.push(queryCity);
        if(!!queryServer)queryList.push(queryServer);
        // 合并查询条件
        let query = queryList.join("&");
        // 为了解决setState的异步调用, 用的setTimeout
        setTimeout(()=>{
            this.setState({
                query
            })
            this.getData(tableName);
        })
    }
    /**
     * @desc 分页事件
     * @param num
     */
    onPageChange = (num:number)=>{
        setTimeout(()=>{
            this.setState({
                page:num
            })
            let {tableName} = this.state;
            this.getData(tableName);
        })

    }
    /**
     * @desc 导出excel
     * @param excelName
     */
    onExportExcel = (excelName:string,selected:any)=>{
        let columns = this.state.columns;
        let excelTitle:any;
        axios("query_all",{
            table_name:this.state.tableName,
            query_str:this.state.query
        }).then(res=>{
            if (res === "key error"){
                message.warning("登录失效,请重新登录!");
                this.props.history.replace("/login");
                return ;
            }
            let data = this.formatData(res.data);
            let table:any = [];
            let extraColumns:any = data[0]["_extraColumnsInfo"] || [];
            excelTitle = columns.concat(extraColumns);
            table[0] = [];
            for (let i in excelTitle){
                let item:any = excelTitle[i];
                if (item.title !== "详情") table[0].push(item.title);
            }
            console.log(table[0]);
            data.forEach((item:any)=>{
                let arr:any = [];
                if (!!item) {
                    // excelTitle.forEach((i: any, index: number) => {
                    //
                    // })
                    for (let index = 0,len = excelTitle.length;index<len;index++){
                        let i = excelTitle[index];
                        if (i.title === "详情") {
                            continue;
                        }
                        let val: any;
                        try {
                            val = item[i.dataIndex];
                            if (typeof i.render === "function") {
                                let render = i.render(val);
                                if (typeof render.type === "string") {
                                    if (["p", "div", "span"].indexOf(render.type) > -1) {
                                        val = render.props.children;
                                    } else if (render.type.toLowerCase() === "link" || render.type === "a") {
                                        val = "the column is link!";
                                    }
                                }else{
                                    val = render.type.render.displayName.toLowerCase() === "link"?"the column is link!":""
                                }
                            }
                            // 为链接的情况下  不加入列
                            // if (val !== "the column is link!" && val != null)
                            arr.push(val);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    console.log(arr);
                    table.push(arr);
                }
            })
            let wb = XLSX.utils.book_new();
            let ws = XLSX.utils.aoa_to_sheet(table);
             XLSX.utils.book_append_sheet(wb,ws,"SheetJS");
            XLSX.writeFile(wb,excelName + ".xlsx");
        })
    }
    onDeleteData = (data:any=[])=>{
        let ids = data.map((item:any)=>{
            return item.id||item.uid
        })
        axios("delete_data",{
            table_name:this.state.tableName,
            id_str:ids.join(",")
        }).then(res=>{
            if (res === "key error"){
                message.warning("登录失效,请重新登录!");
                this.props.history.replace("/login");
                return ;
            }
            this.getData(this.state.tableName)
        })
    }

    getOtherData = (datas:any)=>{
        let data : any = {};
        let otherInfo:any;
        try {
            otherInfo = JSON.parse(datas.other);
            if (typeof otherInfo !== "object")throw "不是一个有效数据!"
        }catch (e){
            otherInfo = [];
        }
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
            d1[k] = datas[k];
        }
        let data1 = [d1];
        data.info = {
            col:col1,
            data:data1
        };
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
        let {sixNetStr,costAll,sixUseCallTime,queryTime,sixCostAllStr ,sixYuyinStr ,sixLiuLiangStr } = datas;
        let flow = sixNetStr.split(",");
        let call = sixUseCallTime.split(",");
        let cost = costAll.split(",");
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
                cost:m+"月",
                costNum:cost[i],
            })
        }
        data.sixCost={
            col:col2,
            data:data2
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
        data.sixAverageCost = {
            col:col3,
            data:data3
        }
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
        let data4 = otherInfo.map((item:any,index:number)=>{
            let obj:any = {key:index};
            col4.forEach((col:any)=>{
                let key = col.dataIndex;
                obj[key] = item[key];
            })
            return obj;
        })
        data.business = {
            col:col4,
            data:data4
        }
        return data;
    }
    render() {
        if(!this.CheckLogin())return false;
        let path = this.props.history.location.pathname;
        let excelName = path==="/"?"客户数据":path==="/experience"?"客户体验" : path==="/shop"?"临街商铺":"none"
        return (
            <div>
                <Filter onSearch={this.onSearch}></Filter>
                <RenderData
                    path={path}
                    columns={this.state.columns}
                    data={this.state.tableData}
                    total={this.state.total}
                    onPageChange={this.onPageChange}
                    onExportExcel={(selected:any)=>{this.onExportExcel(excelName,selected)}}
                    onDeleteData={this.onDeleteData}
                    currentPage={this.state.page}
                />
            </div>
        );
    }
}
export default ClientData;