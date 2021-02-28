import React, { Component } from "react"
import Web3 from "web3"
import ERC20ABI from "../abis/ERC20ABI.json"
import TokenFarmABI from "../abis/TokenFarm.json"
import Navbar from "./Navbar"
import Main from "./Main"
import "./App.css"
import {
	ChainID,
	RewardContractAddress,
	StakingContractAddresss,
	TokenFarmContractAddress,
} from "./constants"

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

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

		//Stake Token
		const stakingToken = new web3.eth.Contract(ERC20ABI, StakingContractAddresss)
		this.setState({ stakingContractAddress: StakingContractAddresss })
		this.setState({ stakingToken })
		let stakingTokensBalance = await stakingToken.methods.balanceOf(this.state.account).call()
		this.setState({ stakingTokensBalance: stakingTokensBalance.toString() })

		//Reward Token
		const rewardToken = new web3.eth.Contract(ERC20ABI, RewardContractAddress)
		this.setState({ rewardToken })
		this.setState({ rewardTokenContractAddress: RewardContractAddress })
		let rewardTokenBalance = await rewardToken.methods.balanceOf(this.state.account).call()
		this.setState({ rewardTokenBalance: rewardTokenBalance.toString() })

		//Token Farm
		const tokenFarm = new web3.eth.Contract(TokenFarmABI, TokenFarmContractAddress)
		this.setState({ farmContractAddress: TokenFarmContractAddress })
		this.setState({ tokenFarm })
		let currentStakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
		this.setState({ currentStakingBalance: currentStakingBalance.toString() })

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

	stakeTokens = async (amount) => {
		this.setState({ loading: true })
		let txHash = await this.state.stakingToken.methods
			.approve(this.state.tokenFarm._address, amount)
			.send({ from: this.state.account })
		console.log("approval tx hash " + txHash)
		await sleep(5000)
		txHash = await this.state.tokenFarm.methods
			.stakeTokens(amount)
			.send({ from: this.state.account })
		console.log("staking tx hash " + txHash)
		// .on("transactionHash", (hash) => {
		// 	console.log("approval finished...")
		// 	this.state.tokenFarm.methods
		// 		.stakeTokens(amount)
		// 		.send({ from: this.state.account })
		// 		.on("transactionHash", (hash) => {
		// 			console.log("staking finished...")
		// 			this.setState({ loading: false })
		// 		})
		// })
	}

	unstakeTokens = (amount) => {
		this.setState({ loading: true })
		this.state.tokenFarm.methods
			.unstakeTokens()
			.send({ from: this.state.account })
			.on("transactionHash", (hash) => {
				console.log("unstaking finished...")
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
			currentStakingBalance: "0",
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
					currentStakingBalance={this.state.currentStakingBalance}
					stakingTokensBalance={this.state.stakingTokensBalance} //for max available
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
