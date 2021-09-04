import React, { Component } from 'react';
import 'react-dates/initialize';
import moment from 'moment';
import ru from 'moment/locale/ru';
import uk from 'moment/locale/uk';
import DatesPeriod from './components/DatesPeriod';
import DatePickerMobile from './components/DatePickerMobile';
import 'react-dates/lib/css/_datepicker.css';

if (window.shopSettings.lang == 'ua') {
	moment.locale('uk', uk);
} else if (window.shopSettings.lang == 'ru') {
	moment.locale('ru', ru);
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
    		calendarFocused: false,
			days: null,
			init: false,
			minDate: moment(),
            startDate: null,
            endDate: null,
			isShowMobileDatepicker: false,
			car_availability: null,
			datesBlocked: null,
			car_prices: null,
			timeStart: null,
			timeEnd: null,
			bookingData: {
				start: "",
				end: "",
				start_t: "",
				end_t: ""
			},
			timeArray: [],
			error_message: null,
			prices: null,
			sum: null
		}
	}

	onChangeStartTime = (event) => {
		let bookingData = {
			start: this.state.bookingData.start,
			end: this.state.bookingData.end,
			start_t: event.target.value,
			end_t: this.state.bookingData.end_t
		}

		this.setState({ timeStart: event.target.value, bookingData: bookingData });
		setTimeout(() => {
			this.fetchData();
		}, 0)
	}

	onChangeEndTime = (event) => {
		let bookingData = {
			start: this.state.bookingData.start,
			end: this.state.bookingData.end,
			start_t: this.state.bookingData.start_t,
			end_t: event.target.value
		}

		this.setState({ timeEnd: event.target.value, bookingData: bookingData });
		setTimeout(() => {
			this.fetchData();
		}, 0)
	}

	onDatesChangeMobile = (startDate, endDate) => {
		this.setState({startDate, endDate})
		const start_date = startDate.format('DD.MM.YYYY');
		const end_date = endDate.format('DD.MM.YYYY');
		let bookingData = {
			start: start_date,
			end: end_date,
			start_t: this.state.bookingData.start_t,
			end_t: this.state.bookingData.end_t
		}

		this.setState({ startDate, endDate, bookingData: bookingData, isShowMobileDatepicker: false });
		setTimeout(() => {
			this.fetchData();
		}, 0)
	}

	onDatesChange = ({ startDate, endDate }) => {
		this.setState({ startDate, endDate });

		if (startDate !== null && endDate !== null) {
			const start_date = startDate.format('DD.MM.YYYY');
			const end_date = endDate.format('DD.MM.YYYY');
			let bookingData = {
				start: start_date,
				end: end_date,
				start_t: this.state.bookingData.start_t,
				end_t: this.state.bookingData.end_t
			}

			this.setState({ startDate, endDate, bookingData: bookingData });
			setTimeout(() => {
				this.fetchData();
			}, 0)
		}		
    }

	fetchData() {
		const _this = this;

		$('.js-booking-button').addClass('is-loading');
		$('.js-booking-button').attr('disabled', 'disabled');
		$('.js-product-data').attr('data-product', JSON.stringify(_this.state.bookingData));
		BX.ajax.runAction('winter:main.api.Car.calculateBooking',{
			mode: 'ajax',
			data : {
				lang: window.shopSettings.lang,
				carId: window.shopSettings.carId,
				filter: _this.state.bookingData
			}
		}).then(function(res) {
			console.log(res.data)
			if (res.data.isSuccess) {
				_this.setState({prices: res.data.prices, sum: res.data.sum, error_message: null});
				$('.js-booking-button').removeAttr('disabled').removeClass('is-loading');
				$('.price.font-bold.font_mxs').html(res.data.formatted_rate);
			} else {
				_this.setState({prices: null, sum: null, error_message: res.data.messages[0]});
				$('.js-booking-button').removeClass('is-loading');
			}
		}).catch(function (res) {
			console.log(res);
			$('.js-booking-button').removeAttr('disabled').removeClass('is-loading');;
		});
	}

	initTimeSelect() {
		let timeArray = [];

		for (let index = 0; index < 24; index++) {
			if (index < 10) {
				timeArray.push(`0${index}:00`);
			} else {
				timeArray.push(`${index}:00`);
			}
        }

		this.setState({timeArray})
	}

	onClickDate = () => {
		this.setState({isShowMobileDatepicker: true})
	}

	onReset = () => {
		this.setState({isShowMobileDatepicker: false})
	}

	getCountDays(today_day, select_day) {
        today_day = today_day.split('-');
        select_day = select_day.split('-');
        today_day = new Date(today_day[0], today_day[1], today_day[2]);
        select_day = new Date(select_day[0], select_day[1], select_day[2]);

        let date_unixtime = parseInt(today_day.getTime() / 1000);
        let select_date_unixtime = parseInt(select_day.getTime() / 1000);
        let timeDifference = select_date_unixtime - date_unixtime;
        let timeDifferenceInHours = timeDifference / 60 / 60;
        let timeDifferenceInDays = timeDifferenceInHours / 24;

        return timeDifferenceInDays;
    }

	getCarsData() {
		const _this = this;

		// fetch('https://tachki.wvdev.com.ua/dev/calendar/init_product.php')
		// 	.then((res) => {
		// 		return res.json()
		// 	})
		// 	.then((data) => {
		// 		const filter = data.data.filter;

		// 		$('.js-product-data').attr('data-product', JSON.stringify({
		// 			start: filter.date_s,
		// 			end: filter.date_e,
		// 			start_t: filter.time_s,
		// 			end_t: filter.time_e
		// 		}));
		// 		_this.setState({
		// 			timeStart: filter.time_s,
		// 			timeEnd: filter.time_e,
		// 			startDate: moment(filter.date_s, 'DD.MM.YYYY'),
		// 			endDate: moment(filter.date_e, 'DD.MM.YYYY'),
		// 			bookingData: {
		// 				start: filter.date_s,
		// 				end: filter.date_e,
		// 				start_t: filter.time_s,
		// 				end_t: filter.time_e
		// 			}
		// 		})
		// 	});

		// fetch('https://tachki.wvdev.com.ua/dev/calendar/product.php')
		// 	.then((res) => {
		// 		return res.json()
		// 	})
		// 	.then((data) => {
		// 		const result = data.data.data;
		// 		const result_day = result.availability;
		// 		const start_day = Object.keys(result.availability)[0];
		// 		const count = _this.getCountDays(start_day, _this.state.minDate.format('YYYY-MM-DD'));
		// 		let new_obj = {};

		// 		for (let i = count; i < Object.keys(result_day).length; i++) {
		// 			new_obj[Object.keys(result_day)[i]] = Object.values(result_day)[i]
		// 		}

		// 		_this.setState({
		// 			car_availability: new_obj,
		// 			datesBlocked: new_obj,
		// 			car_prices: result.prices
		// 		});
		// 	});
		
			BX.ajax.runAction('winter:main.api.Client.getFilter',{
				mode: 'ajax',
				data : {
					lang: 'ua'
				}
			}).then(function(res) {
				const filter = res.data.filter;

				$('.js-product-data').attr('data-product', JSON.stringify({
					start: filter.date_s,
					end: filter.date_e,
					start_t: filter.time_s,
					end_t: filter.time_e
				}));
				_this.setState({
					timeStart: filter.time_s,
					timeEnd: filter.time_e,
					startDate: moment(filter.date_s, 'DD.MM.YYYY'),
					endDate: moment(filter.date_e, 'DD.MM.YYYY'),
					bookingData: {
						start: filter.date_s,
						end: filter.date_e,
						start_t: filter.time_s,
						end_t: filter.time_e
					}
				})

				setTimeout(() => {
					_this.fetchData();
				}, 0)
				console.log(res);
			}).catch(function (res) {
				console.log(res);
			});

			BX.ajax.runAction('winter:main.api.Car.getPublicCalendar',{
                mode: 'ajax',
                data: {
                    lang: window.shopSettings.lang,
                    carId: window.shopSettings.carId,
                    startDate: moment().format('YYYY-MM-DD')
                }
            }).then(function(res) {
				const result = res.data.data;
				const result_day = result.availability;
				const start_day = Object.keys(result.availability)[0];
				const count = _this.getCountDays(start_day, _this.state.minDate.format('YYYY-MM-DD'));
				let new_obj = {};

				for (let i = count; i < Object.keys(result_day).length; i++) {
					new_obj[Object.keys(result_day)[i]] = Object.values(result_day)[i]
				}

				_this.setState({
					car_availability: new_obj,
					datesBlocked: new_obj,
					car_prices: result.prices
				});
                console.log(res.data);
            }).catch(function (res) {
                console.log(res);
            });
	}

	componentDidMount() {
		this.getCarsData();
		this.initTimeSelect();
	}

	render() {
		return (
			<div className="product__card_start">
				{this.state.datesBlocked && this.state.timeStart &&
					<DatesPeriod 
						label="Начало поездки"
						startDateId="start-date"
						endDateId="end-date"
						mode="start"
						onClickDate={this.onClickDate}
						datesBlocked={this.state.datesBlocked}
                        car_prices={this.state.car_prices}
						timeArray={this.state.timeArray}
						startDate={this.state.startDate}
						endDate={this.state.endDate}
						timeStart={this.state.timeStart}
						onChangeTime={this.onChangeStartTime}
						onDatesChange={this.onDatesChange}
					/>
				}
				{this.state.datesBlocked && this.state.timeEnd &&
					<DatesPeriod 
						label="Конец поездки"
						startDateId="start-date-2"
						endDateId="end-date-2"
						mode="end"
						onClickDate={this.onClickDate}
						datesBlocked={this.state.datesBlocked}
						car_prices={this.state.car_prices}
						timeArray={this.state.timeArray}
						startDate={this.state.startDate}
						endDate={this.state.endDate}
						onChangeTime={this.onChangeEndTime}
						timeEnd={this.state.timeEnd}
						onDatesChange={this.onDatesChange}
					/>
				}

				{this.state.datesBlocked && this.state.startDate && this.state.isShowMobileDatepicker &&
					<DatePickerMobile
						onReset={this.onReset}
						startDate={this.state.startDate}
						endDate={this.state.endDate}
						datesBlocked={this.state.datesBlocked}
						onDatesChangeMobile={this.onDatesChangeMobile}
					/>
				}

				{this.state.prices && this.state.prices.map((item, key) => {
					return (
						<div key={key} className="product-booking-info mt-2">
							<b>{item.name}</b> - &nbsp;
							{item.formatted_price}
						</div>
					);
				})}

				{this.state.sum &&
					<div className="product-booking-info mt-2">
						<b>{this.state.sum.name}</b> - &nbsp;
						{this.state.sum.formatted_price}
					</div>
				}

				{this.state.error_message &&
					<div className="control-error mt-2">{this.state.error_message}</div>
				}
			</div>
		);
	}
}

export default App;