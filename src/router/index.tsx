import * as React from 'react';
import {HashRouter, Route,Switch} from "react-router-dom";
import Main from "../pages/"
import App from "../App"
class Routers extends React.Component{


    public render() {
        return <HashRouter>
            <Main>
                <Switch>
                    <Route path={"/"} component={App} />
                </Switch>
            </Main>
        </HashRouter>;
    }
}
export default Routers;