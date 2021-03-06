import React from "react"
import { observer } from "mobx-react"
import { computed, observable, action, autorun } from "mobx"
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import DatePicker from "react-datepicker";
import moment from 'moment'

import { get, put, post, defaults } from 'axios'

@observer
class RuleCard extends React.Component {
	renderOperator(operator) {
		if(operator == "gt") {
			return (
				<span>&gt;</span>
			)
		} else if(operator == "ge") {
			return (
				<span>&gt;=</span>
			)
		} else if(operator == "ne") {
			return (
				<span>!=</span>
			)
		} else if(operator == "eq") {
			return (
				<span>=</span>
			)
		} else if(operator == "nt") {
			return (
				<span>&lt;</span>
			)
		} else if(operator == "le") {
			return (
				<span>&lt;=</span>
			)
		} else {
			return null
		}
	}
	
	renderCondition(condition, i) {
		if(condition.type == "app") {
			return (
				<li key={i}><b>{this.props.rulespage.getAppliance(condition.id) ? this.props.rulespage.getAppliance(condition.id).name : "-"}</b>'s {condition.status_name} {this.renderOperator(condition.operator)} {condition.value}</li>
			)
		} else if(condition.type == "sensor") {
			return (
				<li key={i}><b>Sensor id {condition.id}</b>'s {condition.status_name} {this.renderOperator(condition.operator)} {condition.value}</li>
			)
		} else if(condition.type == "time") {
			return (
				<li key={i}><b>Time</b> is between {condition.start_time} - {condition.end_time}</li>
			)
		} else if(condition.type == "mode") {
			return (
				<li key={i}><b>Mode</b> is <b>{condition.value == 0 ? "Normal" : (condition.value == 1 ? "Savings" : "Comfort")}</b></li>
			)
		} else if(condition.type == "drmode") {
			return (
				<li key={i}><b>DR Mode</b> is <b>{condition.value == 0 ? "Normal" : (condition.value == 1 ? "Savings" : "Extreme Savings")}</b></li>
			)
		} else if(condition.type == "pricing") {
			return (
				<li key={i}>Pricing {this.renderOperator(condition.operator)} {condition.value}</li>
			)
		}  else {
			return null
		}
	}
	
	renderAction(action, i) {
		if (action.app_id == "action"){
			return ( 
				<li key={i}><b>{action.cmd_name}</b> This Rule</li>
			)
		} else if (action.app_id == "waiting"){
			var waitTime = action.parameters.setTo.split(':',2)
			return ( 
				<li key={i}>Wait for <b>{parseInt(waitTime[0])}</b> hour(s) <b>{parseInt(waitTime[1])}</b> minute(s)</li>
			)
		} else if (action.app_id == "alarm"){
			return ( 
				<li key={i}>Send Alarm Message <b>{action.parameters.setTo}</b></li>
			) 
		} else {
			return (
				<li key={i}>Execute <b>{action.cmd_name}</b> on <b>{this.props.rulespage.getAppliance(action.app_id) ? this.props.rulespage.getAppliance(action.app_id).name : "-"}</b> to {action.parameters.setTo}</li>
			)
		}
	}
	
	deleteRule() {
		if(confirm("Are you sure you want to delete this rule?")) {
			socket.send(JSON.stringify({type: "delete", id: this.props.rulespage.house, url: '/api/rules/'+this.props.rule.id+'/'}));
			
			var newData = []
			
			this.props.rulespage.houseData.rules.forEach((rule) => {
				if(rule.id != this.props.rule.id) {
					newData.push(rule)
				}
			})
			
			this.props.rulespage.houseData.rules = newData
			
			put('/api/households/'+this.props.rulespage.house+'/?format=json', this.props.rulespage.houseData)
			.then(action("Update Rule Fulfilled", (res) => {
				this.edit = false
				$("#addRuleModal").modal("hide")
				this.clearRuleForm()
				//this.fetchRules()
				this.changeHouse()
			  })
			).catch(action("Update Rule Rejected", (err) => {
				
			  })
			)
		}
	}

	activeRule() {
        var data = {params: { format: 'json', active: 1	}}
		if(confirm("Are you sure you want to active this rule?")) {
                        socket.send(JSON.stringify({type: "post", id: this.props.rulespage.house, url: '/api/rules/'+this.props.rule.id+'/active/', data: data}));

			var newData = []
			
			console.log("houseData")
			//console.log(this.props.houseData)
			console.log(this.props.rulespage.houseData.rules)
			//console.log(this.houseData)
			console.log(this.props.rule)
			
			this.props.rulespage.houseData.rules.forEach((rule) => {
				if(rule.id != this.props.rule.id) {
					newData.push(rule)
				} else {
                    rule.active = 1
					newData.push(rule)
                    }
			})

			this.props.rulespage.houseData.rules = newData

			put('/api/households/'+this.props.rulespage.house+'/?format=json', this.props.rulespage.houseData)
			.then(action("Update Rule Fulfilled", (res) => {
				this.edit = false
				$("#addRuleModal").modal("hide")
				this.clearRuleForm()
				//this.fetchRules()
				this.changeHouse()
			  })
			).catch(action("Update Rule Rejected", (err) => {
				
			  })
			)

		}
	}

	deactiveRule() {
        var data = {params: { format: 'json', active: 0	}}
		if(confirm("Are you sure you want to de-active this rule?")) {
                        socket.send(JSON.stringify({type: "post", id: this.props.rulespage.house, url: '/api/rules/'+this.props.rule.id+'/active/', data: data}));

			var newData = []
			
			console.log("houseData")
			//console.log(this.props.houseData)
			console.log(this.props.rulespage.houseData.rules)
			//console.log(this.houseData)
			console.log(this.props.rule)
			
			this.props.rulespage.houseData.rules.forEach((rule) => {
				if(rule.id != this.props.rule.id) {
					newData.push(rule)
				} else {
                    rule.active = 0
					newData.push(rule)
                    }
			})

			this.props.rulespage.houseData.rules = newData

			put('/api/households/'+this.props.rulespage.house+'/?format=json', this.props.rulespage.houseData)
			.then(action("Update Rule Fulfilled", (res) => {
				this.edit = false
				$("#addRuleModal").modal("hide")
				this.clearRuleForm()
				//this.fetchRules()
				this.changeHouse()
			  })
			).catch(action("Update Rule Rejected", (err) => {
				
			  })
			)

		}
	}
	
	editRule() {
		this.props.rulespage.addAction.replace(this.props.rule.action)
		this.props.rulespage.addCondition.replace(this.props.rule.conditions)
		this.props.rulespage.edit = true
		this.props.rulespage.editId = this.props.rule.id
	}
	
	render() {
		return (
			<div className="card" style={{marginBottom: 20, borderLeft: "7px solid #4caf50"}}>
				<div className="content" style={{padding: "15px"}}>
					<div className="media">
						<div className="media-body">
							<li style={{float: "right"}}><b>{"Owner: "+this.props.rule.owner}</b></li>
							<h3>If</h3>
							<ul>
								{this.props.rule.conditions.map((condition, i) => {
									return this.renderCondition(condition, i)
								})}
							</ul>
							<h3>Do</h3>
							<ul>
								{this.props.rule.action.map((action, i) => {
									return this.renderAction(action, i)
								})}
							</ul>

						</div>
						
						<div className="media-left" style={{display: "inline-block"}}>
                                                        <hr	style={{
								color: "#000000",
								backgroundColor: "#000000",
								height: 1
							}} />
							<a className="btn btn-warning btn-sm" data-toggle="modal" data-target="#addRuleModal" onClick={this.editRule.bind(this)}>Edit</a>
							&nbsp;
							<a className="btn btn-danger btn-sm" onClick={this.deleteRule.bind(this)}>Delete</a>
							&nbsp;
							{ 
								(this.props.rule.active == 0) ? 
								<a className="btn btn-info btn-sm" onClick={this.activeRule.bind(this)}>Active</a> :
								<a className="btn btn-primary btn-sm" onClick={this.deactiveRule.bind(this)}>Deactive</a>
							}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

@observer
export default class HomePage extends React.Component {
	@observable settings = {}
	@observable households = []
	
	@observable house = 0
	@observable houseData = {}
	@observable rules = []
	@observable appliances = []
	@observable currentApplianceInfo = []
	
	@observable addAction = []
	@observable addCondition = []
	@observable edit = false
	@observable editId = 0
	
	@observable ruleHouseSelected = false
	
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
			$('#rr0').val(this.settings.price_flat_0_to_15)
			$('#rr1').val(this.settings.price_flat_16_to_25)
			$('#rr2').val(this.settings.price_flat_26_to_35)
			$('#rr3').val(this.settings.price_flat_36_to_100)
			$('#rr4').val(this.settings.price_flat_101_to_150)
			$('#rr5').val(this.settings.price_flat_151_to_400)
			$('#rr6').val(this.settings.price_flat_400_up)
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
		if(house) {
			socket.send(JSON.stringify({type: "dr", id: house, value: val}));
			alert("DR Command Sended")
		}
	}

	broadcastFV(e) {
		e.preventDefault();
		if(document.getElementById("FT_Value").value != "") {
			var pr = {FT: $("#FT_Value").val() , VAT: $("#VAT_Value").val()}
			console.log("data");
			console.log(pr);
			socket.send(JSON.stringify({type: "FTnVAT", price: pr}))
		}
	}

	broadcastPrice(e) {
		e.preventDefault();
		if(document.getElementById("rtp23").value != "") {
			var item = [ "rtp0",  "rtp1",  "rtp2",  "rtp3",  "rtp4",  "rtp5",  "rtp6",  "rtp7",  "rtp8",  "rtp9",
						"rtp10", "rtp11", "rtp12", "rtp13", "rtp14", "rtp15", "rtp16", "rtp17", "rtp18", "rtp19",
						"rtp20", "rtp21", "rtp22", "rtp23"]
                        console.log("data");
			console.log(item);
			var pr = {rtpF: $("#rtpF").val()};
			item.map((i) => {	console.log("data");
								console.log(i);
								pr[i] = $("#"+i).val()});
			console.log("data");
			console.log(pr);
			socket.send(JSON.stringify({type: "realtime", date: document.getElementById("date").value, price: pr})); //document.getElementById("new_price").value}));

			//var d = new Date(document.getElementById("date").value);
			//d.setHours(d.getHours() + 1);

			//var newNum = (Math.random() * 3.3) + 0.7;
			//newNum = Math.round(newNum * 100) / 100;
			//document.getElementById("new_price").value = newNum;
			//document.getElementById("date").value = d.toISOString().slice(0, 10);
		}
	}

	updateFlatRate1(event) {
	    console.log("after click update");
		console.log($("#rr0").val());
		event.preventDefault()

		socket.send(JSON.stringify({type: "flatRate", rF:$("#rrF").val(), r1: $("#rr0").val(), r2:$("#rr1").val(), r3:$("#rr2").val()
                                           , r4: $("#rr3").val(), r5:$("#rr4").val(), r6:$("#rr5").val(), r7:$("#rr6").val()}));
		
		var update = {}
		update['price_flat_0_to_15'] = $("#rr0").val()
		update['price_flat_16_to_25'] = $("#rr1").val()
		update['price_flat_26_to_35'] = $("#rr2").val()
		update['price_flat_36_to_100'] = $("#rr3").val()
		update['price_flat_101_to_150'] = $("#rr4").val()
		update['price_flat_151_to_400'] = $("#rr5").val()
		update['price_flat_400_up'] = $("#rr6").val()
		
		put('/api/settingsKV/?format=json', update).then((response) => {
			alert('Update Flat Rate Successful')
		}).catch((error) => {
			console.log(error)
		})
	}
	
	updateFlatRate(event) {
	    console.log("after click update");
		console.log($("#r0").val());
		event.preventDefault()

		socket.send(JSON.stringify({type: "flatRate", r1: $("#r0").val(), r2:$("#r1").val(), r3:$("#r2").val(), rF:$("#rF").val()}));
		
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
	
	changeHouse() {
		var house = $("#houseRules").val()
		if(house) {
			this.ruleHouseSelected = true
			get('/api/households/'+house+'/?format=json').then((response) => {
				this.houseData = response.data
				this.house = house
				if(response.data.rules instanceof Array)
					this.rules.replace(response.data.rules)
				else
					this.rules.replace([])
				
				if(response.data.appliances_info instanceof Array)
					this.appliances.replace(response.data.appliances_info)
				else
					this.appliances.replace([])
			})
		} else {
			this.ruleHouseSelected = false
		}
	}
	
	getAppliance(id) {
		var result = null
		this.appliances.forEach((appliance) => {
			if(appliance.id == id)
				result = appliance
		})
		return result
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
					<div onClick={this.changeDRMode.bind(this, "2")} className="btn btn-danger">Extreme Saving</div>
					&nbsp;
					<div onClick={this.changeDRMode.bind(this, "1")} className="btn btn-warning">Saving</div>
					&nbsp;
					<div onClick={this.changeDRMode.bind(this, "0")} className="btn btn-success">Normal</div>
				</form>

                                <hr	style={{
					color: "#FF0000",
					backgroundColor: "#FF0000",
					height: 2
				}} />
				
				<h1>Float Time (FT) & VAT</h1>
				<br/>

				<form className="form-inline">
					<div className="form-group">
						<label htmlFor="FT_Value">FT :</label>&nbsp;
						<input className="form-control" type="number" defaultValue={0.52} id="FT_Value" name="FT_Value"/>
					</div>
					<br/>
					<div className="form-group">
						<label htmlFor="VAT_Value">VAT :</label>&nbsp;
						<input className="form-control" type="number" defaultValue={7.0} id="VAT_Value" name="VAT_Value"/>&nbsp;
						<label htmlFor="VAT_Value_end"> % </label>
					</div>
					<div><br/></div>
					<input className="btn btn-default" type="submit" onClick={this.broadcastFV.bind(this)} name="submitFV" value="Update"/>
				</form>

                                <hr	style={{
					color: "#000000",
					backgroundColor: "#000000",
					height: 1
				}} />
				
				<h1>24 Hours Realtime Price</h1>
				<br/>
				
				<form className="form-inline">
					<div className="form-group">
						<label htmlFor="date">Date</label>&nbsp;
                                                
						<input className="form-control" type="date" defaultValue={d.toISOString().slice(0, 19)} id="date" name="date"/>
					</div>
					<div><br/></div>
					<table className="table table-bordered">
						<thead>
							<tr>
								<th>Time</th>
								<th>Price</th>
								<th>Time</th>
								<th>Price</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th scope="row">12:00 AM</th>
								<td><input id="rtp0" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
								<th scope="row">12:00 PM</th>
								<td><input id="rtp12" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
							</tr>
							<tr>
								<th scope="row">01:00 AM</th>
								<td><input id="rtp1" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
								<th scope="row">01:00 PM</th>
								<td><input id="rtp13" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
							</tr>
							<tr>
								<th scope="row">02:00 AM</th>
								<td><input id="rtp2" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
								<th scope="row">02:00 PM</th>
								<td><input id="rtp14" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
							</tr>
							<tr>
								<th scope="row">03:00 AM</th>
								<td><input id="rtp3" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
								<th scope="row">03:00 PM</th>
								<td><input id="rtp15" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
							</tr>
							<tr>
								<th scope="row">04:00 AM</th>
								<td><input id="rtp4" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
								<th scope="row">04:00 PM</th>
								<td><input id="rtp16" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
							</tr>
							<tr>
								<th scope="row">05:00 AM</th>
								<td><input id="rtp5" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
								<th scope="row">05:00 PM</th>
								<td><input id="rtp17" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
							</tr>
							<tr>
								<th scope="row">06:00 AM</th>
								<td><input id="rtp6" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
								<th scope="row">06:00 PM</th>
								<td><input id="rtp18" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
							</tr>
							<tr>
								<th scope="row">07:00 AM</th>
								<td><input id="rtp7" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
								<th scope="row">07:00 PM</th>
								<td><input id="rtp19" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
							</tr>
							<tr>
								<th scope="row">08:00 AM</th>
								<td><input id="rtp8" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
								<th scope="row">08:00 PM</th>
								<td><input id="rtp20" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
							</tr>
							<tr>
								<th scope="row">09:00 AM</th>
								<td><input id="rtp9" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
								<th scope="row">09:00 PM</th>
								<td><input id="rtp21" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
							</tr>
							<tr>
								<th scope="row">10:00 AM</th>
								<td><input id="rtp10" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
								<th scope="row">10:00 PM</th>
								<td><input id="rtp22" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
							</tr>
							<tr>
								<th scope="row">11:00 AM</th>
								<td><input id="rtp11" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
								<th scope="row">11:00 PM</th>
								<td><input id="rtp23" type="number" defaultValue={2.5} step="any" required/> Bahts/Unit</td>
							</tr>
						</tbody>
					</table>
					<br/>
					<div className="form-group">
						<label htmlFor="realtime_fee">Service Fee :</label>&nbsp;
						<input id="rtpF" type="number" defaultValue={55.5} step="any" required/>&nbsp;
						<label htmlFor="realtime_fee_after"> Bahts/Month</label>
					</div>
					<div><br/></div>
					<input className="btn btn-default" type="submit" onClick={this.broadcastPrice.bind(this)} name="submit" value="Update"/>
				</form>

                                <hr	style={{
					color: "#000000",
					backgroundColor: "#000000",
					height: 1
				}} />

				<h1>Flat Rate Price</h1>
				<br/>
                                <Tabs>
                                    <TabList>
                                        <Tab>Home User 1.1.1</Tab>
                                        <Tab>Home User 1.1.2</Tab>
                                    </TabList>

                                <TabPanel>
				<form onSubmit={this.updateFlatRate1}>
				<table className="table table-bordered">
					<thead>
						<tr>
							<th>Unit</th>
							<th>Price</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">0-15</th>
							<td><input id="rr0" type="number" step="any" required/> Bahts/Unit</td>
						</tr>
						<tr>
							<th scope="row">16-25</th>
							<td><input id="rr1" type="number" step="any" required/> Bahts/Unit</td>
						</tr>
						<tr>
							<th scope="row">26-35</th>
							<td><input id="rr2" type="number" step="any" required/> Bahts/Unit</td>
						</tr>
						<tr>
							<th scope="row">36-100</th>
							<td><input id="rr3" type="number" step="any" required/> Bahts/Unit</td>
						</tr>
						<tr>
							<th scope="row">101-150</th>
							<td><input id="rr4" type="number" step="any" required/> Bahts/Unit</td>
						</tr>
						<tr>
							<th scope="row">151-400</th>
							<td><input id="rr5" type="number" step="any" required/> Bahts/Unit</td>
						</tr>
						<tr>
							<th scope="row">400+</th>
							<td><input id="rr6" type="number" step="any" required/> Bahts/Unit</td>
						</tr>
					</tbody>
				</table>
				<br/>
				<div className="form-group">
					<label htmlFor="rr_fee">Service Fee :</label>&nbsp;
					<input id="rrF" type="number" step="any" required/>&nbsp;
					<label htmlFor="rr_fee_after"> Bahts/Month</label>
				</div>
				<br/>
				<input className="btn btn-default" type="submit" name="submit" value="Update"/>
				</form>
                                </TabPanel>

                                <TabPanel>
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
							<td><input id="r0" type="number" step="any" required/> Bahts/Unit</td>
						</tr>
						<tr>
							<th scope="row">151-400</th>
							<td><input id="r1" type="number" step="any" required/> Bahts/Unit</td>
						</tr>
						<tr>
							<th scope="row">400+</th>
							<td><input id="r2" type="number" step="any" required/> Bahts/Unit</td>
						</tr>
					</tbody>
				</table>
				<br/>
				<div className="form-group">
					<label htmlFor="r_fee">Service Fee :</label>&nbsp;
					<input id="rF" type="number" step="any" required/>&nbsp;
					<label htmlFor="r_fee_after"> Bahts/Month</label>
				</div>
				<br/>
				<input className="btn btn-default" type="submit" name="submit" value="Update"/>
				</form>
                                </TabPanel>
                                </Tabs>

                                <hr	style={{
					color: "#000000",
					backgroundColor: "#000000",
					height: 1
				}} />

				<h1>TOU Price</h1>
				<br/>
				<form onSubmit={this.updateTOU}>
				<table className="table table-bordered">
					<thead>
						<tr>
							<th colSpan="2">Price</th>
						</tr>
						<tr>
							<th>Peak</th>
							<th>Off Peak</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><input id="peak" type="number" step="any" required/> Bahts/Unit</td>
							<td><input id="offPeak" type="number" step="any" required/> Bahts/Unit</td>
						</tr>
					</tbody>
				</table>
				<br/>
				<div className="form-group">
					<label htmlFor="monthly_fee">Service Fee :</label>&nbsp;
					<input id="monthly" type="number" step="any" required/>&nbsp;
					<label htmlFor="monthly_after"> Bahts/Month</label>
				</div>
				<br/>
				<input className="btn btn-default" type="submit" name="submit" value="Update"/>
				</form>
				
				<br/>
                                <hr	style={{
					color: "#FF0000",
					backgroundColor: "#FF0000",
					height: 2
				}} />
				
				<h1>Rules</h1>
				
				<form className="form-inline">
					<div className="form-group">
						<label>House</label>
						&nbsp;
						<select className="form-control" name="houseRules" onChange={this.changeHouse.bind(this)} id="houseRules">
							<option disabled selected>Please select</option>
							{
							  this.households.map((house) => {
								return (
									<option key={house.id} value={house.id}>{house.name} (id={house.id})</option>
								)
							  })
							}
						</select>
					</div>
				</form>
				
				<h3>
					Rules {this.ruleHouseSelected ? <button type="button" className="btn btn-success" data-toggle="modal" data-target="#addRuleModal" onClick={() => {this.clearRuleForm();this.edit=false;}}>Add</button>
                                                                      : null}
					
					<div className="modal fade" id="addRuleModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
					  <div className="modal-dialog" role="document">
						<div className="modal-content" style={{color: "black"}}>
						  <div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 className="modal-title" id="myModalLabel">Add Rule</h4>
						  </div>
						  <div className="modal-body" style={{fontSize: "20px"}}>
							<h3>If</h3>
							<ul>
								{this.addCondition.map((obj, i) => {
									return this.renderCondition(obj, i)
								})}
							</ul>
							<button type="button" className="btn btn-success" data-toggle="modal" data-target="#addConditionModal">Add</button>
							<h3>Do</h3>
							<ul>
								{this.addAction.map((obj, i) => {
									return this.renderAction(obj, i)
								})}
							</ul>
							<button type="button" className="btn btn-success" data-toggle="modal" data-target="#addDoModal">Add</button>
						  </div>
						  <div className="modal-footer">
							<button type="button" className="btn btn-default" onClick={this.clearRuleForm.bind(this)}  data-dismiss="modal">Cancel</button>
							<button type="button" className="btn btn-primary" onClick={this.addRuleForm.bind(this)}>{this.edit ? "Update" : "Add"}</button>
						  </div>
						</div>
					  </div>
					</div>
					
					<div className="modal fade" id="addDoModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
					  <div className="modal-dialog" role="document">
						<div className="modal-content" style={{color: "black"}}>
						  <div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 className="modal-title" id="myModalLabel">Add Do Rule</h4>
						  </div>
						  <div className="modal-body" style={{fontSize: "20px"}}>
							<div className="form-group">
								<label>Appliance</label>
								<select onChange={this.selectDoApplaince.bind(this)} className="form-control" id="doAppliance">
									<option disabled selected value> -- select an option -- </option>
									{this.appliances.map((obj)=> {
										return <option value={obj.id} key={obj.id}>{obj.name}</option>
									})}
								</select>
							</div>
							<div className="form-group">
								<label>Command</label>
								<select onChange={this.selectConditionType.bind(this)} className="form-control" id="doCommand">
									<option disabled selected value> -- select an option -- </option>
									{this.currentApplianceInfo ? (
										this.currentApplianceInfo.map((cmd) => {
											if(cmd.cmd)
												return (<option value={cmd.cmd.name} key={cmd.cmd.name}>{cmd.cmd.name}</option>)
											else
												return null
										})
									): null}
								</select>
							</div>
							<div className="form-group">
								<label>Value</label>
								<input type="text" className="form-control" id="doValue" placeholder="Value"/>
							</div>
						  </div>
						  <div className="modal-footer">
							<button type="button" className="btn btn-default" onClick={this.clearForm.bind(this)} data-dismiss="modal">Cancel</button>
							<button type="button" className="btn btn-primary" onClick={this.addActionForm.bind(this)}>Add</button>
						  </div>
						</div>
					  </div>
					</div>
					
					<div className="modal fade" id="addConditionModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
					  <div className="modal-dialog" role="document">
						<div className="modal-content" style={{color: "black"}}>
						  <div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 className="modal-title" id="myModalLabel">Add If Rule</h4>
						  </div>
						  <div className="modal-body" style={{fontSize: "20px"}}>
							<div className="form-group">
								<label>Type</label>
								<select onChange={this.selectConditionType.bind(this)} className="form-control" id="conditionType">
									<option disabled selected value> -- select an option -- </option>
									<option value="app">Appliance</option>
									<option value="sensor" style={{display: "none"}}>Sensor</option>
									<option value="time">Time</option>
									<option value="mode">Mode</option>
									<option value="drmode">DR Mode</option>
									<option value="pricing">Pricing</option>
								</select>
							</div>
							<div className="form-group condition conditionTime">
								<label>Start Time</label>
								<input type="time" className="form-control" id="conditionStartTime"/>
							</div>
							<div className="form-group condition conditionPricing">
								<label>Pricing</label>
							</div>
							<div className="form-group condition conditionTime">
								<label>End Time</label>
								<input type="time" className="form-control" id="conditionEndTime"/>
							</div>
							<div className="form-group condition conditionApp">
								<label>Appliance</label>
								<select onChange={this.selectConditionApplaince.bind(this)} className="form-control" id="conditionAppliance">
									<option disabled selected value> -- select an option -- </option>
									{this.appliances.map((obj)=> {
										return <option value={obj.id} key={obj.id}>{obj.name}</option>
									})}
								</select>
							</div>
							<div className="form-group condition conditionSensor">
								<label>Sensor</label>
								<select onChange={this.selectConditionType.bind(this)} className="form-control" id="conditionSensor">
									<option disabled selected value> -- select an option -- </option>
									<option value="app">Appliance</option>
									<option value="sensor">Sensor</option>
									<option value="time">Time</option>
								</select>
							</div>
							<div className="form-group condition conditionApp conditionSensor">
								<label>Data</label>
								<select onChange={this.selectConditionType.bind(this)} className="form-control" id="conditionData">
									<option disabled selected value> -- select an option -- </option>
									{this.currentApplianceInfo ? (
										this.currentApplianceInfo.map((cmd) => {
											return (<option value={cmd.name} key={cmd.name}>{cmd.name}</option>)
										})
									): null}
								</select>
							</div>
							<div className="form-group condition conditionPricing conditionApp conditionSensor">
								<label>Operator</label>
								<select className="form-control" id="conditionOperator">
									<option disabled selected value> -- select an option -- </option>
									<option value="gt">&gt;</option>
									<option value="ge">&gt;=</option>
									<option value="ne">!=</option>
									<option value="eq">=</option>
									<option value="nt">&lt;</option>
									<option value="le">&lt;=</option>
								</select>
							</div>
							<div className="form-group condition conditionPricing conditionApp conditionSensor">
								<label>Value</label>
								<input type="text" className="form-control" id="conditionValue" placeholder="Value"/>
							</div>
							<div className="form-group condition conditionMode">
								<label>Mode</label>
								<select className="form-control" id="conditionMode">
									<option disabled selected value> -- select an option -- </option>
									<option value="0">Normal</option>
									<option value="1">Savings</option>
									<option value="2">Comfort</option>
								</select>
							</div>
							<div className="form-group condition conditionDRmode">
								<label>DR Mode</label>
								<select className="form-control" id="conditionDRmode">
									<option disabled selected value> -- select an option -- </option>
									<option value="0">Normal</option>
									<option value="1">Savings</option>
									<option value="2">Extreme Savings</option>
								</select>
							</div>
						  </div>
						  <div className="modal-footer">
							<button type="button" className="btn btn-default" onClick={this.clearForm.bind(this)} data-dismiss="modal">Cancel</button>
							<button type="button" className="btn btn-primary" onClick={this.addConditionForm.bind(this)}>Add</button>
						  </div>
						</div>
					  </div>
					</div>
				</h3>
				{
					this.rules.map((rule) => {
						return <RuleCard key={rule.id} rulespage={this} rule={rule}/>
					})
				}
				
				<br/><br/><br/>
			</div>
		)
	}
	
	selectConditionType() {
		$(".condition").hide()
		if($("#conditionType").val() == "app") {
			$(".conditionApp").show()
		}
		else if($("#conditionType").val() == "sensor") {
			$(".conditionSensor").show()
		}
		else if($("#conditionType").val() == "time") {
			$(".conditionTime").show()
		}
		else if($("#conditionType").val() == "mode") {
			$(".conditionMode").show()
		}
		else if($("#conditionType").val() == "drmode") {
			$(".conditionDRmode").show()
		}
		else if($("#conditionType").val() == "pricing") {
			$(".conditionPricing").show()
		}
	}
	
	selectDoApplaince() {
		/*ApplianceStore.currentApplianceInfo.replace([])
		if($("#doAppliance").val()) {
			ApplianceStore.currentApplianceId = parseInt($("#doAppliance").val())
			ApplianceStore.fetchApplianceInfo()
		}*/
		this.currentApplianceInfo.replace([])
		if($("#doAppliance").val()) {
			this.appliances.forEach((appliance) => {
				if(appliance.id == $("#doAppliance").val()) {
					this.currentApplianceInfo.replace(appliance.info)
				}
			})
		}
	}
	
	selectConditionApplaince() {
		/*ApplianceStore.currentApplianceInfo.replace([])
		if($("#conditionAppliance").val()) {
			ApplianceStore.currentApplianceId = parseInt($("#conditionAppliance").val())
			ApplianceStore.fetchApplianceInfo()
		}*/
		this.currentApplianceInfo.replace([])
		if($("#conditionAppliance").val()) {
			this.appliances.forEach((appliance) => {
				if(appliance.id == $("#conditionAppliance").val()) {
					this.currentApplianceInfo.replace(appliance.info)
				}
			})
		}
	}
	
	addActionForm() {
		var applianceId = $("#doAppliance").val()
		var command = $("#doCommand").val()
		var value = $("#doValue").val()
		
		if(applianceId && command && value) {
			this.addAction.push({app_id: applianceId, cmd_name: command, parameters: {setTo: parseInt(value)}})
			$("#addDoModal").modal("hide")
			this.clearForm()
		} else {
			alert("Please fill in all fields")
		}
	}
	
	addConditionForm() {
		var type = $("#conditionType").val()
		if(type == "app") {
			var applianceId = $("#conditionAppliance").val()
			var data = $("#conditionData").val()
			var operator = $("#conditionOperator").val()
			var value = $("#conditionValue").val()
			
			if(applianceId && data && operator && value) {
				this.addCondition.push({type: type, id: applianceId, status_name: data, operator: operator, value: value})
				$("#addConditionModal").modal("hide")
				this.clearForm()
			} else {
				alert("Please fill in all fields")
			}
		} else if(type == "pricing") {
			var operator = $("#conditionOperator").val()
			var value = $("#conditionValue").val()
			
			if(operator && value) {
				this.addCondition.push({type: type, operator: operator, value: value})
				$("#addConditionModal").modal("hide")
				this.clearForm()
			} else {
				alert("Please fill in all fields")
			}

		} else if(type == "sensor") {
			
		} else if(type == "time") {
			var start_time = $("#conditionStartTime").val()
			var end_time = $("#conditionEndTime").val()
			
			if(start_time && end_time) {
				this.addCondition.push({type: type, start_time: start_time, end_time: end_time})
				$("#addConditionModal").modal("hide")
				this.clearForm()
			} else {
				alert("Please fill in all fields")
			}
		} else if(type == "mode") {
			var mode = $("#conditionMode").val()
			
			if(mode) {
				this.addCondition.push({type: type, value: mode})
				$("#addConditionModal").modal("hide")
				this.clearForm()
			} else {
				alert("Please fill in all fields")
			}
		} else if(type == "drmode") {
			var mode = $("#conditionDRmode").val()
			
			if(mode) {
				this.addCondition.push({type: type, value: mode})
				$("#addConditionModal").modal("hide")
				this.clearForm()
			} else {
				alert("Please fill in all fields")
			}
		} else {
			alert("Please fill in all fields")
		}
	}
	
	clearForm() {
		$("#doAppliance")[0].selectedIndex = 0
		this.selectDoApplaince()
		$("#doCommand")[0].selectedIndex = 0
		$("#doValue").val("")
		
		$("#conditionType")[0].selectedIndex = 0
		this.selectConditionType()
		$("#conditionAppliance")[0].selectedIndex = 0
		this.selectConditionApplaince()
		$("#conditionSensor")[0].selectedIndex = 0
		//this.selectConditionSensor()
		$("#conditionData")[0].selectedIndex = 0
		$("#conditionOperator")[0].selectedIndex = 0
		$("#conditionValue").val("")
	}
	
	clearRuleForm() {
		this.addAction.replace([])
		this.addCondition.replace([])
	}
	
	addRuleForm() {
		if(this.addAction.length == 0 || this.addCondition.length == 0) {
			alert("Rule must have at least one action and condition!")
		} else {
			var data = {action: this.addAction, conditions: this.addCondition}
			if(this.edit) {
				socket.send(JSON.stringify({type: "put", id: this.house, url: '/api/rules/'+this.editId+'/', data: data}));
				
				data["id"] = this.editId
				
				var newData = []
				
				this.houseData.rules.forEach((rule) => {
					if(rule.id != this.editId) {
						newData.push(rule)
					} else {
						newData.push(data)
					}
				})
				
				
				this.houseData.rules = newData
				
				put('/api/households/'+this.house+'/?format=json', this.houseData)
				.then(action("Update Rule Fulfilled", (res) => {
					this.edit = false
					$("#addRuleModal").modal("hide")
					this.clearRuleForm()
					//this.fetchRules()
					this.changeHouse()
				  })
				).catch(action("Update Rule Rejected", (err) => {
					
				  })
				)
			} else {
                                data = {action: this.addAction, conditions: this.addCondition, owner: "pea", active: 0}
				socket.send(JSON.stringify({type: "post", id: this.house, url: '/api/rules/', data: data}));
				
				data["id"] = Math.floor((Math.random() * 1000000000) + 100000000);
				
				this.houseData.rules.push(data)
				
				put('/api/households/'+this.house+'/?format=json', this.houseData)
				.then(action("Add Rule Fulfilled", (res) => {
					$("#addRuleModal").modal("hide")
					this.clearRuleForm()
					//this.fetchRules()
					this.changeHouse()
				  })
				).catch(action("Add Rule Rejected", (err) => {
					
				  })
				)
			}
		}
	}
	
	removeAddDo(index) {
		this.addAction.splice(index, 1)
	}
	
	removeAddCondition(index) {
		this.addCondition.splice(index, 1)
	}
	
	renderOperator(operator) {
		if(operator == "gt") {
			return (
				<span>&gt;</span>
			)
		} else if(operator == "ge") {
			return (
				<span>&gt;=</span>
			)
		} else if(operator == "ne") {
			return (
				<span>!=</span>
			)
		} else if(operator == "eq") {
			return (
				<span>=</span>
			)
		} else if(operator == "nt") {
			return (
				<span>&lt;</span>
			)
		} else if(operator == "le") {
			return (
				<span>&lt;=</span>
			)
		} else {
			return null
		}
	}
	
	renderCondition(condition, i) {
		if(condition.type == "app") {
			return (
				<li style={{height: "25px"}} key={i}><b>{this.getAppliance(condition.id) ? this.getAppliance(condition.id).name : "-"}</b>'s {condition.status_name} {this.renderOperator(condition.operator)} {condition.value} <button type="button" className="close" style={{color: "black", marginTop: "3px"}}><span onClick={this.removeAddCondition.bind(this, i)}>&times;</span></button></li>
			)
		} else if(condition.type == "sensor") {
			return (
				<li style={{height: "25px"}} key={i}><b>Sensor id {condition.id}</b>'s {condition.status_name} {this.renderOperator(condition.operator)} {condition.value} <button type="button" className="close" style={{color: "black", marginTop: "3px"}}><span onClick={this.removeAddCondition.bind(this, i)}>&times;</span></button></li>
			)
		} else if(condition.type == "time") {
			return (
				<li style={{height: "25px"}} key={i}><b>Time</b> is between {condition.start_time} - {condition.end_time} <button type="button" className="close" style={{color: "black", marginTop: "3px"}}><span onClick={this.removeAddCondition.bind(this, i)}>&times;</span></button></li>
			)
		} else if(condition.type == "mode") {
			return (
				<li style={{height: "25px"}} key={i}><b>Mode</b> is <b>{condition.value == 0 ? "Normal" : (condition.value == 1 ? "Savings" : "Comfort")}</b> <button type="button" className="close" style={{color: "black", marginTop: "3px"}}><span onClick={this.removeAddCondition.bind(this, i)}>&times;</span></button></li>
			)
		} else if(condition.type == "drmode") {
			return (
				<li style={{height: "25px"}} key={i}><b>DR Mode</b> is <b>{condition.value == 0 ? "Normal" : (condition.value == 1 ? "Savings" : "Extreme Savings")}</b> <button type="button" className="close" style={{color: "black", marginTop: "3px"}}><span onClick={this.removeAddCondition.bind(this, i)}>&times;</span></button></li>
			)
		} else if(condition.type == "pricing") {
			return (
				<li style={{height: "25px"}} key={i}>Pricing {this.renderOperator(condition.operator)} {condition.value} <button type="button" className="close" style={{color: "black", marginTop: "3px"}}><span onClick={this.removeAddCondition.bind(this, i)}>&times;</span></button></li>
			)
		} else {
			return null
		}
	}
	
	renderAction(action, i) {
		return (
			<li style={{height: "25px"}} key={i}>Execute <b>{action.cmd_name}</b> on <b>{this.getAppliance(action.app_id) ? this.getAppliance(action.app_id).name : "-"}</b> to {action.parameters.setTo} <button type="button" className="close" style={{color: "black", marginTop: "7px"}}><span onClick={this.removeAddDo.bind(this, i)}>&times;</span></button></li>
		)
	}
	
	fetchRules() {
		get('/api/rules/', {
			params: {
				format: 'json',
				username: UserStore.username,
				api_key: UserStore.token
			}
		})
		.then(action("Fetch Rules Fulfilled", (res) => {
			this.rules.replace(res.data)
		  })
		).catch(action("Fetch Rules Rejected", (err) => {
			
		  })
		)
	}
}
