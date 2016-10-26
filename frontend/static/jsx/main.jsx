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
	}.bind(this);
    axios.get('/api/users/', {
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFToken',
    })
    .then((response) => {
      this.setState({
        users: response.data,
      })
    })
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
		socket.send(document.getElementById("new_price").value);
		document.getElementById("new_price").value = "";
	}
  },
  render() {
	return (
		<div>
			<h1>Change current price</h1>
			<form>
				<input type="text" id="new_price" name="new_price" placeholder="New Price"/>
				<input type="submit" onClick={this.broadcastPrice.bind(this)} name="submit" value="Submit"/>
			</form>
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
