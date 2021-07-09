import Web3 from 'web3';

window.ethereum.request({ method: 'eth_requestAccounts' }); //Need to request for permissions
const web3 = new Web3(window.ethereum);

export default web3;
/*
if (window.ethereum) {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccounts(accounts);
    } catch (error) {
        if (error.code === 4001) {
            // User rejected request
        }

        setError(error);
    }
}
*/