import 'preact/devtools';
import { h, Component } from 'preact';
import { Provider } from 'mobx-preact'
//import { observable } from 'mobx'
import { Router, Route, Link } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'

import StateStore from './store/';
import StoreHeader from './container/StoreHeader';
import StoresList from './container/StoresList';

const history = createBrowserHistory();

const App = (props) => {
    const { json } = props;
    const stateStore = new StateStore(json);

    return(
        <Provider stateStore={stateStore}>
            <Router history={history}>
                <div>
                    <StoreHeader regions={json.regions}/>
                    <Route path="/" component={() => (<StoresList stores={json.stores}/>)}/>
                </div>
            </Router>
        </Provider>
    )
};

export default App;
