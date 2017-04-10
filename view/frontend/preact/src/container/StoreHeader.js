import { h, Component } from 'preact';
import { connect } from 'mobx-preact';

import GoogleApiComponent from './../component/GoogleApiComponent';
import Maps from './Maps';
import RegionFilter from './../component/RegionFilter';


@connect(['stateStore'])
class StoreHeader extends Component {

    constructor() {
        super();
        this.postcodeInput = null;
        this.geocode = null;
        this.applyFilter = this.applyFilter.bind(this);
        this.resetFilters = this.resetFilters.bind(this);
        this.searchPostcode = this.searchPostcode.bind(this);
    }

    resetFilters() {
        this.props.stateStore.clearFilters();
    }

    searchPostcode() {
        if(!this.geocode) {
            this.geocode = new this.props.google.maps.Geocoder();
        }
        this.geocode.geocode({
            componentRestrictions: {
                country: 'AU',
                postalCode: this.postcodeInput.value
            }
        }, (results, status) => {
            const newGeo = {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};
            this.props.stateStore.changeMap(newGeo);
        });
    }

    isActiveFilter(region) {
        return this.props.stateStore.filters.indexOf(region) > -1
            ? 'storelocator-header__filter storelocator-header__filter__active'
            : 'storelocator-header__filter';
    }

    applyFilter(region) {
        this.props.stateStore.addFilters(region);
    }

    render() {
        const { regions } = this.props;
        return(
            <header className="storelocator-header">
                <h1 className="storelocator-header__title">Find nearest shop</h1>
                <section className="storelocator-header__row">
                    <article className="storelocator-header__filters">
                        {regions.map((region) => (
                            <RegionFilter className={this.isActiveFilter(region.name)} region={region.name}
                                          onFilterClick={this.applyFilter}/>
                        ))}
                    </article>
                    <article>
                        <a className="storelocator-header__reset" onClick={this.resetFilters}>Reset</a>
                        <input className="storelocator-header__input"
                               ref={(input) => { this.postcodeInput = input; }}
                               placeholder="Postcode"
                               type="text"
                               name="postcode"
                        />
                        <button className="storelocator-header__search" onClick={this.searchPostcode}>Search</button>
                    </article>
                </section>
                <Maps google={this.props.google}/>
            </header>
        )
    }
}


export default GoogleApiComponent({
    apiKey: 'AIzaSyBu3pjyCmHyMo8h98fCZv32QVbBf8bNqSY'
})(StoreHeader);