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
    VCStakeABI
} from '../data-access/contracts';
import {
    getWeb3,
    numberToBN
} from '../util';

import useNotification from './useNotification';
import VCUiContext from '../contexts/VCUiContext';
import {
    VC_CONTRACT_ADDRESS,
    VC_STAKE_ADDRESS
} from '../consts/vc-stake-consts';

const MAX_LP = '1000000000000000000000000';

export default function usePDStaking() {
    const {
        addNotification
    } = useNotification();
    const {
        setLastUpdatedTime
    } = useContext(VCUiContext);

    const [depositVCAmount, setDepositVCAmount] = useState('');

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

    const VCStakingContractInstance = useMemo(
        () => new web3.eth.Contract(VCStakeABI, VC_STAKE_ADDRESS),
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

    const onStake = async (refAddress) => {
        const depositAmountNumber = Number(depositVCAmount);
        if (depositVCAmount <= 0 || !isConnected() || !isChainValid()) {
            return;
        }

        if(!refAddress)
            refAddress = '0x0000000000000000000000000000000000000000';


        const depositAmountInWei = numberToBN(depositAmountNumber, 1e18); console.log(depositAmountInWei)
        // check allowance

        try {
            const allowance = await VCContractInstance.methods
                .allowance(address, VC_STAKE_ADDRESS)
                .call();
            if (allowance < depositAmountInWei) {
                await VCContractInstance.methods.approve(VC_STAKE_ADDRESS, MAX_LP).send({
                    from: address,
                });
            }
            await VCStakingContractInstance.methods.invest(refAddress, depositAmountInWei).send({
                from: address,
            });
            addNotification({
                title: 'Success',
                message: `You have successfully staked ${depositAmountNumber} VC`,
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
                    message: 'Stake Failed. Please check if you have enough balance.',
                    type: 'danger',
                });
            }
        } finally {
            setLastUpdatedTime(Date.now());
        }
    }

    const onClaim = async () => {
        if (!isConnected() || !isChainValid()) {
            return;
        }

        try {
            await VCStakingContractInstance.methods.withdraw().send({
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
            await VCStakingContractInstance.methods.reinvest().send({
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
        depositVCAmount,
        setDepositVCAmount,
        onStake,
        onClaim,
        onReinvest
    };
}