import React from "react"
import { observer } from "mobx-react"
import { computed, observable, action, autorun } from "mobx"
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import moment from 'moment'

import { get, put, post, defaults } from 'axios'

@observer
export default class HomePage extends React.Component {
	@observable settings = {}
	@observable households = []
	
	componentWillMount() {
		var nav = $("nav");
		if(nav.find(".collapse").hasClass("in")) {
			nav.find(".navbar-toggle").click();
		}
		
		this.fetch();
	}
	
	fetch() {
		get('/api/settingsKV/?format=json').then((response) => {
			this.settings = response.data
			console.log(this.settings)
			$('#r0').val(this.settings.price_flat_0_to_150)
			$('#r1').val(this.settings.price_flat_151_to_400)
			$('#r2').val(this.settings.price_flat_400_up)
			$('#peak').val(this.settings.price_tou_peak)
			$('#offPeak').val(this.settings.price_tou_off_peak)
			$('#monthly').val(this.settings.price_tou_monthly_fee)
		})
		
		get('/api/households/?format=json').then((response) => {
			this.households.replace(response.data.results)
		})
	}
	
	changeDRMode(val) {
		var house = $("#house").val()
		socket.send(JSON.stringify({type: "dr", id: house, value: val}));
		alert("DR Command Sended")
	}

	broadcastPrice(e) {
		e.preventDefault();
		if(document.getElementById("new_price").value != "") {
			socket.send(JSON.stringify({type: "realtime", date: document.getElementById("date").value, price: document.getElementById("new_price").value}));

			var d = new Date(document.getElementById("date").value);
			d.setHours(d.getHours() + 1);

			var newNum = (Math.random() * 3.3) + 0.7;
			newNum = Math.round(newNum * 100) / 100;
			document.getElementById("new_price").value = newNum;
			document.getElementById("date").value = d.toISOString().slice(0, 19);
		}
	}
	
	updateFlatRate(event) {
		event.preventDefault()

		socket.send(JSON.stringify({type: "flatRate", r1: $("#r0").val(), r2:$("#r1").val(), r3:$("#r2").val()}));
		
		var update = {}
		update['price_flat_0_to_150'] = $("#r0").val()
		update['price_flat_151_to_400'] = $("#r1").val()
		update['price_flat_400_up'] = $("#r2").val()
		
		put('/api/settingsKV/?format=json', update).then((response) => {
			alert('Update Flat Rate Successful')
		}).catch((error) => {
			console.log(error)
		})
	}
	
	updateTOU(event) {
		event.preventDefault()

		socket.send(JSON.stringify({type: "tou", peak: $("#peak").val(), offPeak:$("#offPeak").val(), monthly:$("#monthly").val()}));
		
		var update = {}
		update['price_tou_peak'] = $("#peak").val()
		update['price_tou_off_peak'] = $("#offPeak").val()
		update['price_tou_monthly_fee'] = $("#monthly").val()
		
		put('/api/settingsKV/?format=json', update).then((response) => {
			alert('Update TOU Rate Successful')
		}).catch((error) => {
			console.log(error)
		})
	}
	
	render() {
		var d = new Date();
		d.setMinutes(0);
		d.setSeconds(0);
		
		return (
			<div className="container">
				<h1>Change DR Mode</h1>
				<br/>
				<form className="form-inline">
					<div className="form-group">
						<label>House</label>
						&nbsp;
						<select className="form-control" name="house" id="house">
							{
							  this.households.filter((house) => {return house.dr_allowed}).map((house) => {
								return (
									<option key={house.id} value={house.id}>{house.name} (id={house.id})</option>
								)
							  })
							}
						</select>
					</div>
					&nbsp;
					<div onClick={this.changeDRMode.bind(this, "1")} className="btn btn-primary">Enable</div>
					&nbsp;
					<div onClick={this.changeDRMode.bind(this, "0")} className="btn btn-success">Disable</div>
				</form>
				<br/>
				
				<h1>Broadcast Realtime Price</h1>
				<br/>
				
				<form className="form-inline">
					<div className="form-group">
						<label htmlFor="date">Date</label>&nbsp;
						<input className="form-control" type="datetime-local" defaultValue={d.toISOString().slice(0, 19)} id="date" name="date"/>
					</div>
					&nbsp;
					<div className="form-group">
						<label htmlFor="new_price">New price</label>&nbsp;
						<input className="form-control" type="number" defaultValue="1.5" id="new_price" name="new_price" placeholder="New Price"/>
					</div>
					&nbsp;
					<input className="btn btn-default" type="submit" onClick={this.broadcastPrice.bind(this)} name="submit" value="Submit"/>
				</form>
				
				<br/>
				<h1>Update Flat Rate Price</h1>
				<br/>
				<form onSubmit={this.updateFlatRate}>
				<table className="table table-bordered">
					<thead>
						<tr>
							<th>Unit</th>
							<th>Price</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">0-150</th>
							<td><input id="r0" type="number" required/></td>
						</tr>
						<tr>
							<th scope="row">151-400</th>
							<td><input id="r1" type="number" required/></td>
						</tr>
						<tr>
							<th scope="row">400+</th>
							<td><input id="r2" type="number" required/></td>
						</tr>
					</tbody>
				</table>
				<input className="btn btn-default" type="submit" name="submit" value="Update"/>
				</form>
				
				<br/>
				<h1>Update TOU Price</h1>
				<br/>
				<form onSubmit={this.updateTOU}>
				<table className="table table-bordered">
					<thead>
						<tr>
							<th colSpan="2">Price</th>
							<th rowSpan="2">Monthly Fee</th>
						</tr>
						<tr>
							<th>Peak</th>
							<th>Off Peak</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><input id="peak" type="number" required/></td>
							<td><input id="offPeak" type="number" required/></td>
							<td><input id="monthly" type="number" required/></td>
						</tr>
					</tbody>
				</table>
				<input className="btn btn-default" type="submit" name="submit" value="Update"/>
				</form>
				
				<br/>
				<br/>
				<br/>
			</div>
		)
	}
}
