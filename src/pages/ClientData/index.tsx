import * as React from "react";
import Filter from "../../components/Fillter";
import RenderData from "../../components/RenderData";
import axios from "../../plugin/ajax"
import {Link} from "react-router-dom";
import XLSX from "xlsx";
import tools from "../../plugin/tools";

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
        console.log(key,"key");
        if (!key) {
            this.props.history.replace("/login");
            return false;
        }
        return true
    }
    componentDidMount() {
        this.time = setInterval(this.CheckLogin,1000);
        if (this.CheckLogin())
            this.getColumnsAndData();
    }
    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (prevProps.location.pathname !== this.props.location.pathname){
            this.setState({
                page:1,
                query:""
            })
            this.getColumnsAndData()
        }
    }
    componentWillUnmount() {
        clearInterval(this.time);
    }
    formatData=(list:any = [])=>{
        let path = this.props.history.location.pathname;
        if (list!= null) {
            let data:any = list.map((item: any, index: number) => {
                item = JSON.parse(item);
                item["details"] = "详情";
                item["key"] = index
                if (path === "/") item["gps"] = `经度: ${item.station_lon} 纬度: ${item.station_lat} \n 地址: ${item.station_name}`
                console.log(item);
                return item;
            })
            return data;
        }
        return [];
    }
    getData = (table_name:string) => {
        console.log(this.state.query);
        return axios("query",{
            pageInfo: this.state.page + ",10",
            query_str: this.state.query,
            table_name: table_name
        }).then((res:any)=>{
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
            console.log(res);
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
    onExportExcel = (excelName:string)=>{
        let columns = this.state.columns;
        axios("query_all",{
            table_name:this.state.tableName,
            query_str:this.state.query
        }).then(res=>{
            let data = this.formatData(res.data);
            let table:any = []
            table[0] = columns.map(item=>item.title);
            data.forEach((item:any)=>{
                let arr:any = [];
                columns.forEach((i:any,index:number)=>{
                    let val = item[i.dataIndex];
                    if (typeof i.render === "function"){
                        let render = i.render(val);
                        if (["p","div","span"].indexOf(render.type)>-1){
                            val = render.props.children;
                        }else if(render.type.toLowerCase() === "Link" || render.type === "a"){
                            val = "the column is link!";
                        }
                    }
                    // 为链接的情况下  不加入列
                    if (val !=="the column is link!")
                        arr[index] = val;
                })
                table.push(arr);
            })
            let wb = XLSX.utils.book_new();
            let ws = XLSX.utils.aoa_to_sheet(table);
             XLSX.utils.book_append_sheet(wb,ws,"SheetJS");
            XLSX.writeFile(wb,excelName + ".xlsx");
        })
    }
    onDeleteData = (data:any=[])=>{
        let ids = data.map((item:any)=>{
            return item.id
        })
        axios("delete_data",{
            table_name:this.state.tableName,
            id_str:ids.join(",")
        }).then(res=>{
            this.getData(this.state.tableName)
        })
    }
    render() {
        console.log(this.CheckLogin());
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
                    onExportExcel={()=>{this.onExportExcel(excelName)}}
                    onDeleteData={this.onDeleteData}
                />
            </div>
        );
    }
}
export default ClientData;