import { h, Component } from 'preact';
import { connect } from 'mobx-preact';

import DirectionsTab from './../container/DirectionsTab';
import HoursSpanFill from './../component/HoursSpanFill';

@connect(['stateStore'])
export default class StoreView extends Component {
    constructor(props, {router}) {
        super(props);
        this.state = {
            tab: 'directions'
        };
        this.routeId = router.route.match.params.id;
        this.store = props.stores.find(this.findStore, this.routeId);
    }

    componentDidUpdate() {
        const currentRoute = this.context.router.route.match.params.id;
        if (this.routeId !== currentRoute) {
            this.routeId = currentRoute;
            this.store = this.props.stores.find(this.findStore, this.routeId);
            this.props.stateStore.changeMap(this.store.geo, this.store.zoom);
        }
    }

    findStore(q) {
        return q.id == this;
    }

    showTab(active, set) {
        return (active == set) ? 'display: block' : 'display: none';
    }


    setTab(selected) {
        this.setState({tab: selected});
    }

    setTabClass(selected) {
        return (this.state.tab == selected) ? "tabs__tab tabs__tab--active" : "tabs__tab";
    }

    render () {
        const tab1 = 'hours';
        const tab2 = 'directions';
        return (
            <div className="store-view">
                <div className="store-view__store-card">
                    <h1 className="store-view__name">{this.store.name}</h1>
                    <ul className="store-view__credentials">
                        <li><span class="store-view__label">Address:</span>{this.store.addr_strt} {this.store.addr_cty} {this.store.zipcode}</li>
                        <li><span class="store-view__label">Phone:</span><a href={'tel:'+this.store.phone}>{this.store.phone}</a></li>
                        <li><span class="store-view__label">Email:</span><a href={'mailto:'+this.store.email}>{this.store.email}</a></li>
                    </ul>
                </div>
                <div className="store-view__tabs tabs">
                    <div className="tabs__tab-bar">
                        <div className={this.setTabClass(tab1)} onClick={() => this.setTab(tab1)}>Store Information</div>
                        <div className={this.setTabClass(tab2)} onClick={() => this.setTab(tab2)}>Directions</div>
                    </div>
                    <div className="tabs__tab-body">
                        <div className="tabs__hours" style={this.showTab(this.state.tab, tab1)}>
                            <h2 className="tabs__h2">Opening Hours</h2>
                            <HoursSpanFill day={this.store.hours}/>
                        </div>
                        <div className="tabs__directions" style={this.showTab(this.state.tab, tab2)}>
                            <DirectionsTab initStop={this.store.addr_strt + ' ' + this.store.addr_cty} />
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

