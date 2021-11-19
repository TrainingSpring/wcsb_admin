import * as React from 'react';
import {HashRouter, Route,Switch} from "react-router-dom";
import Main from "../pages/"
import Login from "../pages/Login"
import ClientData from "../pages/ClientData"
import submit from "../pages/SubmitData"
import details from "../pages/Details"
class Routers extends React.Component{


    public render() {
        return <HashRouter>
            <Switch>
                <Route path={"/Login"} component={Login} />
                <Main>
                    <Switch>
                        <Route path={"/experience"} component={ClientData} />
                        <Route path={"/shop"} component={ClientData} />
                        <Route path={"/submit"} component={submit} />
                        <Route path={"/details"} component={details} />
                        <Route path={"/"} component={ClientData} />
                    </Switch>
                </Main>
            </Switch>
        </HashRouter>;
    }
}
export default Routers;