import { h, Component } from 'preact';

export default class Autocomplete extends Component {

    constructor(props, context) {
        super();
        //this.autocompBounds = new this.props.google.maps.LatLngBounds(
        //    new this.context.google.maps.LatLng(this.context.sw[0], this.context.sw[1]),
        //    new this.context.google.maps.LatLng(this.context.ne[0], this.context.ne[1]));

    }

    //componentDidUpdate(prevProps) {
    //    if ((this.props.map !== prevProps.map) ||
    //        (this.props.position !== prevProps.position) ||
    //        (this.props.points !== prevProps.points)) {
    //        this.renderDirections();
    //    }
    //}
    //
    //renderDirections() {
    //
    //    if (this.directionsService === null || this.directionsDisplay === null) {
    //        this.directionsService = new this.props.google.maps.DirectionsService();
    //        this.directionsDisplay = new this.props.google.maps.DirectionsRenderer();
    //    }
    //
    //    this.directionsDisplay.setMap(this.props.map);
    //    const request = {
    //        origin: this.props.points.start,
    //        destination: this.props.points.stop,
    //        travelMode: this.props.points.mode
    //    };
    //
    //    if (request.destination && request.origin) {
    //        this.directionsService.route(request, (result, status) => {
    //            if (status == 'OK') {
    //                this.directionsDisplay.setDirections(result);
    //                console.log('result', result);
    //            }
    //        });
    //    }
    //}

    render() {
        console.log('bounds', this.autocompBounds);
        return null;
    }

}
