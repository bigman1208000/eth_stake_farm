import React, { Component } from "react"
import farmer from "../farmer.png"

class Navbar extends Component {
	render() {
		return (
			<nav className='navbar navbar-dark fixed-top navbar-dark bg-primary flex-md-nowrap p-0 shadow'>
				<a
					className='navbar-brand col-sm-3 col-md-2 mr-0'
					href='http://www.your_project.com/bootcamp'
					target='_blank'
					rel='noopener noreferrer'
				>
					<img src={farmer} width='30' height='30' className='d-inline-block align-top' alt='' />
					&nbsp; DApp Token Farm
				</a>

				<ul className='navbar-nav px-3'>
					<li className='nav-item d-none d-sm-none d-sm-block'>
						<div className='text-muted'>
							<span id='account'>
								connected account:{" "}
								<span className='text-white'>
									{this.props.account.slice(0, 7)}...
									{this.props.account.slice(37, 42)}
								</span>
							</span>
						</div>
					</li>
				</ul>
			</nav>
		)
	}
}

export default Navbar
