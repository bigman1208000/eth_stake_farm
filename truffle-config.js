require("dotenv").config()

const HDWalletProvider = require("@truffle/hdwallet-provider")
const infuraProjectId = process.env.INFURA_PROJECT_ID

require("babel-register")
require("babel-polyfill")

module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",
			port: 7545,
			network_id: "*", // Match any network id
		},
		testnet_binance: {
			provider: () =>
				new HDWalletProvider(
					process.env.DEV_PRIVATE_KEY,
					"https://data-seed-prebsc-1-s1.binance.org:8545/"
				),
			network_id: 97,
			gas: 5500000,
			gasPrice: 20000000000, // 20 gwei
			confirmations: 2, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
		rinkeby: {
			provider: () =>
				new HDWalletProvider(
					process.env.DEV_PRIVATE_KEY,
					"https://rinkeby.infura.io/v3/" + infuraProjectId
				),
			network_id: 4, // Rinkeby's id
			gas: 5500000,
			gasPrice: 20000000000, // 20 gwei
			confirmations: 2, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
	},
	contracts_directory: "./src/contracts/",
	contracts_build_directory: "./src/abis/",
	compilers: {
		solc: {
			version: "0.5.0", // Fetch exact version from solc-bin (default: truffle's version)
			docker: false,
			parser: "solcjs", // Use "0.5.1" you've installed locally with docker (default: false)
			settings: {
				// See the solidity docs for advice about optimization and evmVersion
				optimizer: {
					enabled: true,
					runs: 200,
				},
				evmVersion: "",
			},
		},
	},
}
