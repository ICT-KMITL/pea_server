import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'highcharts/css/highcharts.css'
import 'highcharts/js/highcharts.js'

import React from 'react'
import axios from 'axios'

var Users = React.createClass({
  getInitialState() {
    return {
      users: [],
	  prices: [],
    }
  },
  componentWillMount() {
	socket.onmessage = function(e) {
		var prices = this.state.prices.slice()
		prices.unshift(e.data)
		this.setState({
			prices: prices,
		})
		this.hchart.series[0].addPoint([new Date(JSON.parse(e.data)[0]).getTime(), Number(JSON.parse(e.data)[1])], true, this.hchart.series[0].data.length > 10);
	}.bind(this);
    /*
	axios.get('/api/users/', {
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFToken',
    })
    .then((response) => {
      this.setState({
        users: response.data,
      })
    })*/
  },
  renderUser(user) {
    return (
      <div key={user.id} className="user">
        <h2>{user.username}</h2>
        {user.email}
      </div>
    )
  },
  renderPrice(price) {
    return (
      <div>
        <h2>{price}</h2>
      </div>
    )
  },
  componentDidMount() {
	  var self = this;
	  
	  var startDay = new Date();
	  var endDay = new Date();
	  
	  startDay.setHours(0);
	  startDay.setMinutes(0);
	  startDay.setSeconds(0);
	  
	  endDay.setDate(endDay.getDate() + 1);
	  endDay.setHours(0);
	  endDay.setMinutes(0);
	  endDay.setSeconds(0);
	  
	  /*Highcharts.setOptions({
		global: {
			timezoneOffset: 7 * 60
		}
	  });*/
	  
	  $('#container').highcharts({
        chart: {
            type: 'spline',
			events: {
				load: function () {
					self.hchart = this;
				}
			}
        },
		credits: {
			enabled: false
		},
        title: {
            text: 'Real-time Prices'
        },
        xAxis: {
			type: 'datetime'
        },
        yAxis: {
			min: 0,
			max: 5,
            title: {
                text: 'Price per kWh'
            },
            labels: {
                formatter: function () {
                    return this.value + '฿';
                }
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Price',
            marker: {
                symbol: 'diamond'
            },
            data: []
        }]
    });
	var d = new Date();
	d.setMinutes(0);
	d.setSeconds(0);
	document.getElementById('date').defaultValue = d.toISOString().slice(0, 19);
  },
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
  },
  updateFlatRate(event) {
	  event.preventDefault()
	  
	  socket.send(JSON.stringify({type: "flatRate", r1: $("#r0").val(), r2:$("#r1").val(), r3:$("#r2").val()}));
  },
  updateTOU(event) {
	  event.preventDefault()
	  
	  socket.send(JSON.stringify({type: "tou", peak: $("#peak").val(), offPeak:$("#offPeak").val(), monthly:$("#monthly").val()}));
  },
  render() {
	return (
		<div className="container">
			<h1>Broadcast Realtime Price</h1>
			<br/>
			<form className="form-inline">
				<div className="form-group">
					<label htmlFor="date">Date</label>&nbsp;
					<input className="form-control" type="datetime-local" id="date" name="date"/>
				</div>
				&nbsp;
				<div className="form-group">
					<label htmlFor="new_price">New price</label>&nbsp;
					<input className="form-control" type="number" defaultValue="1.5" id="new_price" name="new_price" placeholder="New Price"/>
				</div>
				<input className="btn btn-default" type="submit" onClick={this.broadcastPrice.bind(this)} name="submit" value="Submit"/>
			</form>
			<div id="container" style={{minWidth: "310px", height: "400px", margin: "0 auto"}}></div>
			
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
    /*
	return (
      <div className="users">
        <h1>Users</h1>
        {this.state.users.map(this.renderUser)}
      </div>
    )
	*/
  },
})

React.render(<Users />, document.body)
