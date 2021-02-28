import React, { Component } from "react"
import Web3 from "web3"
import ERC20ABI from "../abis/ERC20ABI.json"
import TokenFarmABI from "../abis/TokenFarm.json"
import Navbar from "./Navbar"
import Main from "./Main"
import "./App.css"
import {
	ChainID,
	StakingDecimals,
	RewardContractAddress,
	StakingContractAddresss,
	TokenFarmContractAddress,
} from "./constants"

class App extends Component {
	async componentWillMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
	}

	async loadBlockchainData() {
		const web3 = window.web3

		const accounts = await web3.eth.getAccounts()
		this.setState({ account: accounts[0] })

		const networkId = await web3.eth.net.getId()
		if (networkId !== ChainID) {
			window.alert("please conenct to the correct network")
			return
		}

		const rewardToken = new web3.eth.Contract(ERC20ABI, RewardContractAddress)
		this.setState({ rewardToken })
		this.setState({ rewardTokenContractAddress: RewardContractAddress })
		let rewardTokenBalance = await rewardToken.methods.balanceOf(this.state.account).call()
		this.setState({ rewardTokenBalance: rewardTokenBalance.toString() })

		const stakingToken = new web3.eth.Contract(ERC20ABI, StakingContractAddresss)
		this.setState({ stakingContractAddress: StakingContractAddresss })
		this.setState({ stakingToken })

		const tokenFarm = new web3.eth.Contract(TokenFarmABI, TokenFarmContractAddress)
		this.setState({ farmContractAddress: TokenFarmContractAddress })
		this.setState({ tokenFarm })
		let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
		this.setState({ stakingBalance: stakingBalance.toString() })

		this.setState({ loading: false })
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		} else {
			window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!")
		}
	}

	stakeTokens = (amount) => {
		this.setState({ loading: true })
		this.state.stakingToken.methods
			.approve(this.state.tokenFarm._address, amount * 10 * StakingDecimals)
			.send({ from: this.state.account })
			.on("transactionHash", (hash) => {
				this.state.tokenFarm.methods
					.stakeTokens(amount)
					.send({ from: this.state.account })
					.on("transactionHash", (hash) => {
						this.setState({ loading: false })
					})
			})
	}

	unstakeTokens = (amount) => {
		this.setState({ loading: true })
		this.state.tokenFarm.methods
			.unstakeTokens()
			.send({ from: this.state.account })
			.on("transactionHash", (hash) => {
				this.setState({ loading: false })
			})
	}

	constructor(props) {
		super(props)
		this.state = {
			account: "0x0",
			rewardToken: {},
			stakingToken: {},
			tokenFarm: {},
			rewardTokenContractAddress: RewardContractAddress,
			stakingContractAddress: StakingContractAddresss,
			rewardTokenBalance: "0",
			stakingTokenBalance: "0",
			stakingBalance: "0",
			loading: true,
		}
	}

	render() {
		let content
		if (this.state.loading) {
			content = (
				<p id='loader' className='text-center'>
					Loading... Metamask should show you a popup!
				</p>
			)
		} else {
			content = (
				<Main
					farmContractAddress={this.state.farmContractAddress}
					rewardTokenContractAddress={this.state.rewardTokenContractAddress}
					stakingContractAddress={this.state.stakingContractAddress}
					rewardTokenBalance={this.state.rewardTokenBalance}
					stakingBalance={this.state.stakingBalance}
					stakeTokens={this.stakeTokens}
					unstakeTokens={this.unstakeTokens}
				/>
			)
		}

		return (
			<div>
				<Navbar account={this.state.account} />
				<div className='container-fluid mt-5'>
					<div className='row'>
						<main role='main' className='col-lg-12 ml-auto mr-auto' style={{ maxWidth: "600px" }}>
							<div className='content mr-auto ml-auto'>{content}</div>
						</main>
					</div>
				</div>
			</div>
		)
	}
}

export default App
