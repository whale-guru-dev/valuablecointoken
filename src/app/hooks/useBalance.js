import {
    useRef,
    useState,
    useEffect,
    useMemo
} from 'react';
import {
    useWeb3React
} from '@web3-react/core';

import {
    BNtoNumber,
    getWeb3,
} from '../util';
import {
    VCABI,
    VCStakeABI
} from '../data-access/contracts';
import {
    FETCH_INTERVAL,
    VC_CONTRACT_ADDRESS,
    VC_STAKE_ADDRESS,
} from '../consts/vc-stake-consts';

export default function useBalance(lastUpdatedTime) {
    const handler = useRef(null);
    const [bnbBalance, setBnbBalance] = useState(0);
    const [vcBalance, setVcBalance] = useState(0);
    const [totalDeposit, setTotalDeposit] = useState(0);
    const [totalWithdrawn, setTotalWithdrawn] = useState(0);
    const [dividends, setDividends] = useState(0);
    const [bonus, setBonus] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);

    const defaultDecimals = 1e18;

    const {
        account,
        library,
        chainId
    } = useWeb3React();
    const address = account;
    const web3 = getWeb3(library);

    const vcContractInstance = useMemo(() => new web3.eth.Contract(VCABI, VC_CONTRACT_ADDRESS), [web3]);
    const vcStakingContractInstance = useMemo(() => new web3.eth.Contract(VCStakeABI, VC_STAKE_ADDRESS), [web3]);


    useEffect(() => {
        async function getBalance() {
            const promises = [];

            if (address && chainId === 56) {
                promises.push(
                    web3.eth.getBalance(address),
                    vcContractInstance.methods.balanceOf(address).call(),
                    vcStakingContractInstance.methods.getUserTotalDeposits(address).call(),
                    vcStakingContractInstance.methods.getUserTotalWithdrawn(address).call(),
                    vcStakingContractInstance.methods.getUserDividends(address).call(),
                    vcStakingContractInstance.methods.getUserReferralBonus(address).call(),
                    vcContractInstance.methods.totalSupply().call(),
                );
            } else {
                promises.push(0, 0, 0, 0, 0, 0, 0)
            }

            const [bnbBalance, vcBalance, totalDeposit, totalWithdrawn, dividends, bonus, totalSupply] = await Promise.all(promises);

            setBnbBalance(Number(BNtoNumber(bnbBalance.toString(), defaultDecimals)));
            setVcBalance(Number(BNtoNumber(vcBalance.toString(), defaultDecimals)));
            setTotalDeposit(Number(BNtoNumber(totalDeposit.toString(), defaultDecimals)));
            setTotalWithdrawn(Number(BNtoNumber(totalWithdrawn.toString(), defaultDecimals)));
            setDividends(Number(BNtoNumber(dividends.toString(), defaultDecimals)));
            setBonus(Number(BNtoNumber(bonus.toString(), defaultDecimals)));
            setTotalSupply(Number(BNtoNumber(totalSupply.toString(), defaultDecimals)))
        }

        handler.current = setInterval(() => {
            getBalance();
        }, FETCH_INTERVAL);

        return () => {
            if (handler.current) {
                clearInterval(handler.current);
            }
        };
    }, [web3, address, chainId, vcContractInstance, vcStakingContractInstance, lastUpdatedTime]);

    return {
        bnbBalance,
        vcBalance,
        totalDeposit,
        totalWithdrawn,
        dividends,
        bonus,
        totalSupply
    };
}
