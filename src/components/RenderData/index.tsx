import * as React from "react"
import {Button, Table,Modal} from "antd"
import {withRouter} from "react-router-dom";
import XLSX from "xlsx";

interface IProps{
    path:string
    data?:any
    history?:any
    columns?:any
    total:number
    onPageChange?:any
    onExportExcel?:any
    onDeleteData?:any
}
class RenderData extends React.Component<any,any>{
    public props:IProps;
    constructor(props:any) {
        super(props);
        this.props = props;
    }
    state = {
        selected:[],
        selectedKey:[]
    }
    rowSelection={
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            this.setState({
                selected:selectedRows,
                selectedKey:selectedRowKeys
            })
        },
    }
    componentDidMount=()=> {

    }

    /**
     * 表头部的操作栏
     * @param type 0: 导出excel 1 数据提交 2 删除
     */
    public onHandle(type:number){
        switch (type){
            case 0:
                this.props.onExportExcel()
                break;

            case 1:
                this.props.history.push("/submit")
                break;

            case 2:
                let cur = this.state.selected;
                if (cur.length === 0)
                    Modal.warning({
                        title:"提示",
                        content:"请选中数据!",
                        centered:true,
                        maskClosable:true
                    })
                else
                    Modal.confirm({
                        title:"警告",
                        content:"删除后无法恢复 , 请谨慎操作 , 继续?",
                        okText:"确定",
                        cancelText:"取消",
                        centered:true,
                        maskClosable:true,
                        onOk:(close)=>{
                            let {onDeleteData} = this.props;
                            if (typeof onDeleteData === "function")onDeleteData(this.state.selected);
                            this.setState({
                                selected:[],
                                selectedKey:[]
                            })
                            close();
                        }
                    })
                break;
        }
    }

    /**
     * @desc 页码更改触发事件
     * @param e
     */
    onPageChange = (e:number)=>{
        let {onPageChange} = this.props
        if(onPageChange) onPageChange(e);
    }
    render(){
        let {data,columns} = this.props;
        return(<div id={"Datas"}>
            <div className="handle">
                <Button className={"btn"} type={"primary"} onClick={()=>this.onHandle(0)}>导出Excel</Button>
                {(this.props.path === "/")?<Button className={"btn"} onClick={()=>this.onHandle(1)}>数据提交</Button>:""}
                <Button className={"btn"} danger={true} onClick={()=>this.onHandle(2)}>删除</Button>
            </div>
            <div style={{maxHeight:"calc(100vh - 152px - 94px)",overflowY:"auto"}}>
                <Table
                    rowSelection={{
                        type: "checkbox",
                        ...this.rowSelection,
                        selectedRowKeys:this.state.selectedKey
                    }}
                    columns={columns||[]}
                    dataSource={data}
                    pagination={{
                        total:this.props.total,
                        onChange:this.onPageChange,
                        showSizeChanger:false
                    }}
                />

            </div>

        </div>)
    }
}
export default withRouter(RenderData);