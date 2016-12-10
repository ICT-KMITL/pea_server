import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'highcharts/css/highcharts.css'
import 'highcharts/js/highcharts.js'

import React from 'react'
import ReactDOM from "react-dom"
import axios from 'axios'

import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
//import DevTools from 'mobx-react-devtools';
import { observer } from "mobx-react"
import { get, post, defaults } from 'axios'
import { computed, observable, action, autorun } from "mobx"

import NotFoundPage from "./pages/NotFoundPage"
import HomePage from "./pages/HomePage"

import HeaderComponent from "./components/HeaderComponent"
import FooterComponent from "./components/FooterComponent"

@observer
class App extends React.Component {
	render() {
		//<DevTools position={{ top: 0, right: 100 }}/>
		return (
			<div>
				<HeaderComponent location={this.props.location}/>
					<br/><br/><br/>
					{this.props.children}
				<FooterComponent/>
			</div>
		)
	}
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
		<IndexRoute component={HomePage}/>
		<Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>
), document.getElementById("body"))

