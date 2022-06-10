import {
    useState,
    useMemo,
    useContext
} from 'react';
import {
    useWeb3React
} from '@web3-react/core';

import {
    VCABI,
    VCFOMOABI
} from '../data-access/contracts';
import {
    getWeb3,
    BNtoNumber
} from '../util';

import useNotification from './useNotification';
import VCUiContext from '../contexts/VCUiContext';
import {
    VC_CONTRACT_ADDRESS,
    VC_FOMO_ADDRESS
} from '../consts/vc-stake-consts';

const MAX_LP = '1000000000000000000000000';

export default function useVCFomo() {
    const {
        addNotification
    } = useNotification();
    const {
        setLastUpdatedTime
    } = useContext(VCUiContext);

    const [buySellTicketAmount, setBuySellTicketAmount] = useState('');

    const {
        account,
        library,
        chainId
    } = useWeb3React();
    const address = account;
    const web3 = getWeb3(library);

    const VCContractInstance = useMemo(
        () => new web3.eth.Contract(VCABI, VC_CONTRACT_ADDRESS),
        [web3]
    );

    const VCFomoContractInstance = useMemo(
        () => new web3.eth.Contract(VCFOMOABI, VC_FOMO_ADDRESS),
        [web3]
    );

    const isConnected = () => {
        if(!address) {
            addNotification({
                title: 'Not Connected',
                message: 'Please connect your wallet to BSC network.',
                type: 'danger',
            });
            return false;
        }

        return true;
    }

    const isChainValid = () => {
        if (chainId !== 56 && chainId !== 97) {
            addNotification({
                title: 'Chain Error',
                message: 'Please check if BSC main network or test network is chosen.',
                type: 'danger',
            });
            return false;
        }
        return true;
    };

    const onBuyTicket = async () => {
        const buySellTicketAmountNumber = Number(buySellTicketAmount);
        if (buySellTicketAmountNumber <= 0 || !isConnected() || !isChainValid()) {
            return;
        }

        try {
            const allowance = await VCContractInstance.methods
                .allowance(address, VC_FOMO_ADDRESS)
                .call(); console.log({allowance})
            const buyPrice = await VCFomoContractInstance.methods
                .buyPrice(buySellTicketAmountNumber)
                .call(); console.log({buyPrice})
            if (allowance < buyPrice) {
                console.log("allowance < buyPrice")
                await VCContractInstance.methods.approve(VC_FOMO_ADDRESS, MAX_LP).send({
                    from: address,
                });
            }
            console.log("buyTicket")
            await VCFomoContractInstance.methods.buyTicket(buySellTicketAmountNumber).send({
                from: address,
            });
            addNotification({
                title: 'Success',
                message: `You have successfully bought ${buySellTicketAmountNumber} Ticket`,
                type: 'success',
            });
        } catch (err) {
            console.log(err)
            if(err.code && err.code === 4001) {
                addNotification({
                    title: 'Failed!',
                    message: 'You denied trasanction signature',
                    type: 'danger',
                });
            } else {
                addNotification({
                    title: 'Failed!',
                    message: 'Buy Ticket Failed. Please check if you have enough balance.',
                    type: 'danger',
                });
            }
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const onSellTicket = async () => {
        const buySellTicketAmountNumber = Number(buySellTicketAmount);
        if (buySellTicketAmountNumber <= 0 || !isConnected() || !isChainValid()) {
            return;
        }

        try {
            await VCFomoContractInstance.methods.sellTicket(buySellTicketAmountNumber).send({
                from: address,
            });
            addNotification({
                title: 'Success',
                message: `You have successfully sold ${buySellTicketAmountNumber} Ticket`,
                type: 'success',
            });
        } catch (err) {
            console.log(err)
            if(err.code && err.code === 4001) {
                addNotification({
                    title: 'Failed!',
                    message: 'You denied trasanction signature',
                    type: 'danger',
                });
            } else {
                addNotification({
                    title: 'Failed!',
                    message: 'Buy Ticket Failed. Please check if you have enough balance.',
                    type: 'danger',
                });
            }
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const onGetTicketsOwned = async (round) => {
        try {
            const ticketOwned = await VCFomoContractInstance.methods.getTicketsOwned(round, address).call();
            return ticketOwned;
        } catch (err) {
            console.log(err)
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const onGetClaimList = async (round) => {
        try {
            const claimed = await VCFomoContractInstance.methods.getClaimList(round, address).call();
            return claimed;
        } catch (err) {
            console.log(err)
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }
    const onGetReclaim = async (round) => {
        try {
            const reClaim = await VCFomoContractInstance.methods.getReclaim(round, address).call();
            return reClaim;
        } catch (err) {
            console.log(err)
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const onCalcDividends = async (round) => {
        try {
            const dividend = await VCFomoContractInstance.methods.calcDividends(round, address).call();
            return Number(BNtoNumber(dividend.toString(), 18));
        } catch (err) {
            console.log(err)
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const onCalcPayout = async (round) => {
        try {
            const payouts = await VCFomoContractInstance.methods.calcPayout(round, address).call();
            return Number(BNtoNumber(payouts.toString(), 18));
        } catch (err) {
            console.log(err)
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }
    
    const onGetBuyPrice = async () => {
        try {
            const buyPrice = await VCFomoContractInstance.methods.buyPrice(1).call();
            return Number(BNtoNumber(buyPrice.toString(), 18));
        } catch (err) {
            console.log(err)
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const onGetSellPrice = async () => {
        try {
            const sellPrice = await VCFomoContractInstance.methods.sellPrice(1).call();
            return Number(BNtoNumber(sellPrice.toString(), 18));
        } catch (err) {
            console.log(err)
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const onGetRoundCount = async () => {
        try {
            const roundCount = await VCFomoContractInstance.methods.roundCount().call();
            return roundCount;
        } catch (err) {
            console.log(err)
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const onClaimDividends = async (amount) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            await VCFomoContractInstance.methods.claimDividends(amount).send({
                from: address,
            });
            addNotification({
                title: 'Success',
                message: `You have successfully claimed`,
                type: 'success',
            });
        } catch (err) {
            if(err.code && err.code === 4001) {
                addNotification({
                    title: 'Failed!',
                    message: 'You denied trasanction signature',
                    type: 'danger',
                });
            } else {
                addNotification({
                    title: 'Failed!',
                    message: 'Claim Failed. Please check if you have enough balance.',
                    type: 'danger',
                });
            }
        } finally {
            setLastUpdatedTime(Date.now());
        }
    };

    const onClaimPayout = async (round) => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            await VCFomoContractInstance.methods.claimPayout(round).send({
                from: address,
            });
            addNotification({
                title: 'Success',
                message: `You have successfully claimed`,
                type: 'success',
            });
        } catch (err) {
            if(err.code && err.code === 4001) {
                addNotification({
                    title: 'Failed!',
                    message: 'You denied trasanction signature',
                    type: 'danger',
                });
            } else {
                addNotification({
                    title: 'Failed!',
                    message: 'Claim Failed. Please check if you have enough balance.',
                    type: 'danger',
                });
            }
        } finally {
            setLastUpdatedTime(Date.now());
        }
    };

    const onReinvest = async () => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            await VCFomoContractInstance.methods.reinvest().send({
                from: address,
            });
            addNotification({
                title: 'Success',
                message: `You have successfully compounded`,
                type: 'success',
            });
        } catch (err) {
            if(err.code && err.code === 4001) {
                addNotification({
                    title: 'Failed!',
                    message: 'You denied trasanction signature',
                    type: 'danger',
                });
            } else {
                addNotification({
                    title: 'Failed!',
                    message: 'Claim Failed. Please check if you have enough balance.',
                    type: 'danger',
                });
            }
        } finally {
            setLastUpdatedTime(Date.now());
        }
    };

    return {
        buySellTicketAmount,
        setBuySellTicketAmount,
        onBuyTicket,
        onSellTicket,
        onGetTicketsOwned,
        onGetClaimList,
        onGetReclaim,
        onCalcDividends,
        onCalcPayout,
        onGetBuyPrice,
        onGetSellPrice,
        onGetRoundCount,
        onClaimDividends,
        onClaimPayout,
        onReinvest
    };
}