import * as React from "react"
import "./index.less"
import { Cascader,Select ,DatePicker,Button} from 'antd';
import moment from "moment"
import tools from "../../plugin/tools"
import axios from "../../plugin/ajax";
import {withRouter} from "react-router-dom";
import locale from "antd/lib/date-picker/locale/zh_CN";
const {Option} = Select;
const { RangePicker } = DatePicker;
interface IState{
    rangeDate:any
    cityInfo?:any
    cityOption:any
    cityServer:[]|any
    selectedCity?:any
    selectedServer?:any
    reserveDate?:any
}
interface IProps{
    onSearch?:any
    location?:any
}
const format = "YYYY-MM-DD";
let date = new Date();
class Filter extends React.Component{
    public state:IState = {
        rangeDate:null,
        cityOption:[],
        cityServer:[]
    };
    public props:IProps = {
        onSearch:function(){}
    }
    constructor(props:any) {
        super(props);
        this.props = props;
    }

    public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (prevProps.location.pathname !== this.props.location.pathname){
            this.setState({
                rangeDate:null,
                selectedCity:[],
                selectedServer:"全部",
                reserveDate:null
            })
            this.areaChange([]);
        }
    }
    componentDidMount() {
        let cityInfo:any = {};
        let currentCity = tools.getCookie("city");
        axios("https://cmccbill.700t.com/api/offline/getcountrys").then(res=>{
            res.forEach((item:any)=>{
                let cityName:any = item.cityName;
                let countyName:any = item.countyName;
                let dataCentre:any = item.dataCentre;
                let work:any = item.work;
                let setCity = function () {

                    if (cityInfo[cityName] == null)
                        cityInfo[cityName] = {
                            "全部": ""
                        }
                    if (cityInfo[cityName][countyName] == null)
                        cityInfo[cityName][countyName] = {}
                    if (cityInfo[cityName][countyName][dataCentre] == null)
                        cityInfo[cityName][countyName][dataCentre] = {}
                    cityInfo[cityName][countyName][dataCentre][work] = true;
                }

                if(cityName === currentCity){
                    setCity();
                }else if(currentCity === "全部"){
                    setCity();
                }
            })
            let cityOption = [];
            for (let c in cityInfo){
                let children = [];
                for (let x in cityInfo[c])
                {
                    children.push({
                        value:x,
                        label:x
                    })
                }
                cityOption.push({
                    value:c,
                    label:c,
                    children
                })
            }
            this.setState({
                cityInfo,
                cityOption
            })
            tools.setStorage("cityInfo",cityInfo);
        })
    }

    /**
     * @desc 地区选择更改事件
     * @param e
     */
    areaChange=(e:any)=>{
        let cityInfo = this.state.cityInfo;
        let list = [];
        if (e.length >0) {
            let server = cityInfo[e[0]][e[1]];
            for (let k in server) {
                list.push(k);
            }
        }
        this.setState({
            cityServer:list,
            selectedCity:e,
            selectedServer:"全部"
        })
    }
    /**
     * @desc 服务中心选择更改事件
     * @param e
     */
    onServeChange=(e:any)=>{
        this.setState({
            selectedServer:e
        })
    }
    /**
     *
     * @param e
     */
    onDateReserveChange=(e:any)=>{
        let date = new Date();
        this.setState({
            reserveDate:e
        })
        switch (e){
            case 1:
                date.setTime(date.getTime() - 24*60*60*1000*3);
                break;
            case 2: // 近三天
                let week = date.getUTCDay();
                week = week===0?7:week;
                date.setTime(date.getTime() - 24*60*60*1000*(week-1));
                break;
            case 3:
                let day = date.getDate();
                date.setTime(date.getTime() - 24*60*60*1000*(day-1));
                break;
        }
        this.setState({
            rangeDate:[moment(date,format),moment(new Date(),format)]
        })
    }
    onSearch=()=>{
        let city = this.state.selectedCity;
        if (city[1] === "全部")city[1] = "";
        this.props.onSearch(this.state.selectedCity,this.state.selectedServer,this.state.rangeDate)
    }
    onDateChange= (e:any)=>{
        this.setState({
            rangeDate:e
        })
    }
    render(){
        return(
            <div id={"Filter"}>
                <div><span className={'key'}>地区: </span><Cascader options={this.state.cityOption} value={this.state.selectedCity} placeholder={"请选择地区"} onChange={this.areaChange}></Cascader></div>
                <div><span className={'key'}>服务中心: </span>
                    <div>
                        <Select style={{width:"150px"}} defaultValue={"全部"} value={this.state.selectedServer} onChange={this.onServeChange}>
                            <Option value={"全部"}>全部</Option>
                            {
                                this.state.cityServer.map((item:string,index:number)=>{
                                    return <Option value={item} key={index}>{item}</Option>
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div>
                    <div>
                        <Select style={{width:"150px"}} value={this.state.reserveDate} placeholder={"预置时间"} onChange={this.onDateReserveChange}>
                            <Option value={0}>今天</Option>
                            <Option value={1}>最近三天</Option>
                            <Option value={2}>本周</Option>
                            <Option value={3}>本月</Option>
                            <Option value={4}>自定义</Option>
                        </Select>
                    </div>
                </div>
                <div>
                    <span className={'key'}>从 </span>
                    <RangePicker
                         locale={locale}
                        format="YYYY-MM-DD"
                        value={this.state.rangeDate}
                        onChange={this.onDateChange}
                    />
                </div>
                <div>
                    <Button type={"primary"} onClick={this.onSearch}>查询</Button>
                </div>
            </div>
        )
    }
}
export default withRouter(Filter);