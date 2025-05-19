import { Web3Auth } from "@web3auth/modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";

import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    chainId: "0x2", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
    rpcTarget: "https://api.testnet.solana.com",
    displayName: "Solana Testnet",
    blockExplorerUrl: "https://explorer.solana.com",
    ticker: "SOL",
    tickerName: "Solana",
    logo: "https://images.toruswallet.io/solana.svg"
};

// instantiate a SolanaPrivateKey
const privateKeyProvider = new SolanaPrivateKeyProvider({
    config: { chainConfig: chainConfig },
});

const web3auth = new Web3Auth({
    // Get it from Web3Auth Dashboard
    clientId: '', // this must be defined
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    privateKeyProvider: privateKeyProvider,
});

// Get Account and balance
const solanaWallet = new SolanaWallet(web3auth.provider);


const connectionConfig = await solanaWallet.request({
    method: "solana_provider_config",
    params: [],
});

const connection = new Connection(connectionConfig.rpcTarget);

// Get user's Solana public address
const accounts = await solanaWallet.requestAccounts();
const block = await connection.getLatestBlockhash("finalized");


// Fetch the balance for the specified public key
const balance = await connection.getBalance(new PublicKey(accounts[0]));


// sign a transaction

const pubKey = accounts[0];
const { blockhash } = await connection.getLatestBlockhash("finalized");

const TransactionInstruction = SystemProgram.transfer({
    fromPubkey: new PublicKey(pubKey[0]),
    toPubkey: new PublicKey(pubKey[0]),
    lamports: 0.01 * LAMPORTS_PER_SOL,
});

const TransactionInstruction2 = SystemProgram.transfer({
    fromPubkey: new PublicKey(pubKey[0]),
    toPubkey: new PublicKey(pubKey[0]),
    lamports: 0.02 * LAMPORTS_PER_SOL,
});

const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: new PublicKey(pubKey[0]),
}).add(TransactionInstruction);

const transaction2 = new Transaction({
    recentBlockhash: blockhash,
    feePayer: new PublicKey(pubKey[0]),
}).add(TransactionInstruction2);

const signedTx = await solanaWallet.signTransaction(transaction);

const { signature } = await solanaWallet.signAndSendTransaction(transaction);

console.log(signedTx.signature);
console.log(signature);

// solanaWallet is from above
const msg = Buffer.from("Test Signing Message", "utf8");
const result = await solanaWallet.signMessage(msg);
console.log(result.toString());

// Assuming user is already logged in.
async function getPrivateKey() {
    const privateKey = await web3auth.provider.request({
        method: "solanaPrivateKey"
    });

    // Do something with privateKey
};