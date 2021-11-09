import React, { Component } from 'react';
import Autocomplete from "react-google-autocomplete";

class Pickup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            selectedRadio: '',
            activeDelivery: null
        };
    }

    handleRadioChange = (event) => {
        const { deliveries } = this.props;
        const activeDelivery = deliveries.filter(item => String(item.id) == String(event.currentTarget.value));

        this.setState({
          selectedRadio: event.currentTarget.value,
          visible: false,
          activeDelivery: activeDelivery[0]
        })

        this.props.onChangeDelivery(activeDelivery[0].id);
        setTimeout(() => {
            $(".pac-container").appendTo(".search-form__location-block");
        }, 1000);
    };

    componentDidMount() {
        const { deliveries } = this.props;

        this.setState({
            selectedRadio: deliveries[0].id,
            activeDelivery: deliveries[0]
        });
        setTimeout(() => {
            $(".pac-container").appendTo(".search-form__location-block");
        }, 1000);
    }

    render() {
        return (
            <div className="mb-4">
                <b className="date-label">Доставка и возврат авто</b>
                <div className="search-form__field search-form__field-dropdown">
                    {this.state.activeDelivery && this.state.activeDelivery.is_address &&
                        <div className="search-form__location-block">
                            <Autocomplete
                                apiKey="AIzaSyCJdsrMbiEfniNMLZMTws46sz9XiE_Y0nY"
                                type="text"
                                id="location"
                                className="search-form__location-field"
                                placeholder="Введите местоположение"
                                options={{
                                    types: ['geocode'],
                                    componentRestrictions: { country: 'ua' }
                                }}
                                onPlaceSelected={(place) => {
                                    const $input = document.getElementById("location");
                                    var lat = place.geometry.location.lat();
                                    var lng = place.geometry.location.lng();

                                    this.props.onChangeAddress({
                                        id: this.state.activeDelivery.id,
                                        address: $input.value,
                                        coordinates: lat+':'+lng
                                    });
                                }}
                            />
                        </div>
                    }
                    <div className={`t-dropdown ${this.state.visible ? 'js-active' : ''}`}>
                        <div className="t-dropdown-value" onClick={() => this.setState({visible: !this.state.visible})}>
                            <div className="returnPlace">
                                <div className="returnPlace-icon">
                                    <div className="svg-image-icon-marker"></div>
                                </div>
                                {this.state.activeDelivery &&
                                    <span>{this.state.activeDelivery.name}</span>
                                }
                            </div>
                        </div>
                        <div className="t-dropdown-content">
                            <div className="reservationBox">
                                {this.props.deliveries && this.props.deliveries.map((item, key) => {
                                    return (
                                        <div key={key}>
                                            <input type="radio" id={item.id} value={item.id} checked={this.state.selectedRadio === item.id}
                                            onChange={this.handleRadioChange} name="delivery" className="delivery-radio" />
                                            <label htmlFor={item.id}>
                                                <div className="reservationBox__option">
                                                    <div className="reservationBox__option-icon">
                                                        <svg width="17.454545456px" height="17.454545456px" fill="none" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.56 20.82l.43.49.46-.44a.716.716 0 01.009-.009c.095-.091.88-.849 2.321-2.681.22-.27.17-.67-.1-.88a.622.622 0 00-.88.1 33.94 33.94 0 01-1.74 2.08C9.65 17.77 5.34 12.26 5.34 9c0-2.5 1.99-5.15 5.66-5.15 3.57 0 5.56 2.29 5.69 4.55l.04.85c.01.35.25.62.65.6.35-.01.61-.31.6-.65l-.04-.86c-.15-2.85-2.59-5.74-6.93-5.74C6.52 2.6 4.1 5.9 4.1 9c0 4.34 6.2 11.52 6.46 11.82zm.54-12.85c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm0-1.25c-1.52 0-2.75 1.23-2.75 2.75s1.23 2.75 2.75 2.75 2.75-1.23 2.75-2.75-1.23-2.75-2.75-2.75zm8.47 8.56a.628.628 0 00.07-.94l-2.48-2.48a.628.628 0 00-.88 0c-.24.24-.24.64 0 .88l1.42 1.42H9.88c-.34 0-.62.28-.62.62 0 .34.28.62.62.62h7.81l-1.42 1.42a.619.619 0 00.44 1.06c.16 0 .32-.06.44-.18l2.42-2.42z" fill="#231F20"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="reservationBox__option-info">
                                                        <div className="reservationBox__option-title">
                                                            {item.name}
                                                        </div>
                                                        <div className="reservationBox__option-type">
                                                            {item.description}
                                                        </div>
                                                        <div className="reservationBox__option-fee">
                                                            {item.formatted_price}
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Pickup;