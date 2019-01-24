import React from "react"
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import { observer } from "mobx-react"
import { autorun } from "mobx"
import { computed, observable, action } from "mobx"

// <li className={ this.props.location.pathname.substring(0, 11) == '/firmware' ? "active" : ""}><a href="/api/firmware/?format=admin">Firmware Version</a></li>

@observer
export default class HeaderComponent extends React.Component {
	render() {
		return (
			<nav className="navbar navbar-static-top navbar-inverse" role="navigation">
					<div className="container">
						<span>
							<a className='navbar-brand' rel="nofollow" href='/'>
							  PEA Server
							</a>
						</span>
						<ul className="nav navbar-nav">
							<li className={ this.props.location.pathname == '/' ? "active" : ""}><Link to="/">Home</Link></li>
							<li className={ this.props.location.pathname.substring(0, 11) == '/households' ? "active" : ""}><a href="/api/households/?format=admin">Households</a></li>
							<li className={ this.props.location.pathname.substring(0, 11) == '/news' ? "active" : ""}><a href="/api/news/?format=admin">News</a></li>
							
						</ul>
					</div>
			</nav>
		)
	}
}
