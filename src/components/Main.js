import React, { Component } from "react"
import dai from "../dai.png"

class Main extends Component {
	render() {
		return (
			<div id='content' className='mt-3'>
				<table className='table table-borderless text-center'>
					<thead>
						<tr>
							<th scope='col'>You are Staking</th>
							<th scope='col'>Your RewardToken Balance</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								{window.web3.utils.fromWei(this.props.currentStakingBalance, "Ether")}

								<span className='text-muted'> STAKE</span>
							</td>
							<td>
								{window.web3.utils.fromWei(this.props.rewardTokenBalance, "Ether")}
								<span className='text-muted'> REWARD</span>
							</td>
						</tr>
					</tbody>
				</table>
				<div className='card mb-4'>
					<div className='card-body'>
						<form
							className='mb-3'
							onSubmit={(event) => {
								event.preventDefault()
							}}
						>
							<div>
								<label className='float-left'>
									<b>Stake Tokens</b>
								</label>
								<span className='float-right'>
									<span className='text-muted'>Max Amount:</span>
									{window.web3.utils.fromWei(this.props.stakingTokensBalance, "Ether")}
								</span>
							</div>
							<div className='input-group mb-4'>
								<input
									type='text'
									ref={(input) => {
										this.input = input
									}}
									className='form-control form-control-lg'
									placeholder='0'
									required
								/>
								<div className='input-group-append'>
									<div className='input-group-text'>
										<img src={dai} height='30' alt='' />
										&nbsp;&nbsp;&nbsp; REWARD
									</div>
								</div>
							</div>
						</form>

						<div className='row'>
							<div className='col'>
								<button
									className='btn btn-block btn-primary btn-lg'
									type='submit'
									onClick={(event) => {
										event.preventDefault()
										let amount
										amount = this.input.value.toString()
										amount = window.web3.utils.toWei(amount, "Ether")
										this.props.stakeTokens(amount)
									}}
								>
									STAKE
								</button>
							</div>
							<div className='col'>
								{" "}
								<button
									type='submit'
									className='btn btn-block btn-outline-secondary btn-lg'
									onClick={(event) => {
										event.preventDefault()
										this.props.unstakeTokens()
									}}
								>
									UN-STAKE
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className='card mt-4'>
					<div className='card-body'>
						<ul className='list-group list-group-flush font-weight-light'>
							<li className='list-group-item'>
								Staking Token Contract: {this.props.stakingContractAddress}
							</li>
							<li className='list-group-item'>
								Reward Token Contract: {this.props.rewardTokenContractAddress}
							</li>
							<li className='list-group-item'>Farm Contract: {this.props.farmContractAddress}</li>
						</ul>
					</div>
				</div>
			</div>
		)
	}
}

export default Main
