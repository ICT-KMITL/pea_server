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
		var series = this.hchart.series[0];
		series.addPoint([new Date(JSON.parse(e.data)[0]).getTime(), Number(JSON.parse(e.data)[1])]);
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
  broadcastPrice(e) {
	e.preventDefault();
	if(document.getElementById("new_price").value != "") {
		socket.send(JSON.stringify([document.getElementById("date").value, document.getElementById("new_price").value]));
		
		var d = new Date(document.getElementById("date").value);
		d.setHours(d.getHours() + 1);
		
		var newNum = (Math.random() * 3.3) + 0.7;
		newNum = Math.round(newNum * 100) / 100;
		document.getElementById("new_price").value = newNum;
		document.getElementById("date").value = d.toISOString().slice(0, 19);
	}
  },
  componentDidMount() {
	  var self = this;
	  $('#container').highcharts({
        chart: {
            type: 'spline',
			events: {
				load: function () {
					self.hchart = this;
				}
			}
        },
        title: {
            text: 'Real-time Prices'
        },
        xAxis: {
			type: 'datetime'
        },
        yAxis: {
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
  render() {
	return (
		<div className="container">
			<h1>Broadcast price</h1>
			<form className="form-inline">
				<div className="form-group">
					<label htmlFor="date">Date</label>&nbsp;
					<input className="form-control" type="datetime-local" id="date" name="date"/>
				</div>
				<div className="form-group">
					<label htmlFor="new_price">New price</label>&nbsp;
					<input className="form-control" type="number" defaultValue="1.5" id="new_price" name="new_price" placeholder="New Price"/>
				</div>
				<input className="btn btn-default" type="submit" onClick={this.broadcastPrice.bind(this)} name="submit" value="Submit"/>
			</form>
			<div id="container" style={{minWidth: "310px", height: "400px", margin: "0 auto"}}></div>
			{this.state.prices.map(this.renderPrice)}
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
