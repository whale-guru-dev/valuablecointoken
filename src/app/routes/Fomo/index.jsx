import React, { useEffect, useContext, useState, useRef, useMemo, useCallback } from "react";
import axios from 'axios';
import { useWeb3React } from "@web3-react/core";
import useVCStaking from "../../hooks/useVCStaking";
import VCUiContext from "../../contexts/VCUiContext";
import ConnectBtn from "../../components/Header/ConnectBtn";
import "./fomo.css";
import useVCFomo from "../../hooks/useVCFomo";
import {
    BNtoNumber,
    getWeb3,
} from '../../util';
import { VCABI, VCFOMOABI } from "../../data-access/contracts";
import { FETCH_INTERVAL, VC_CONTRACT_ADDRESS, VC_FOMO_ADDRESS } from "../../consts/vc-stake-consts";

export default function Fomo() {
    const handler = useRef(null);
    useEffect(() => {
        const script1 = document.createElement('script');
        script1.src = 'assets/js/custom.js';
        script1.async = true;
        document.body.appendChild(script1);
    }, []);

    const {
        account,
        chainId,
        library
    } = useWeb3React();

    const web3 = getWeb3(library);
    const defaultDecimals = 1e18;

    const vcContractInstance = useMemo(() => new web3.eth.Contract(VCABI, VC_CONTRACT_ADDRESS), [web3]);
    const vcFomoContractInstance = useMemo(() => new web3.eth.Contract(VCFOMOABI, VC_FOMO_ADDRESS), [web3]);

    const { lastUpdatedTime } = useContext(VCUiContext);

    const {
        buySellTicketAmount,
        setBuySellTicketAmount,
        onBuyTicket,
        onSellTicket,
        onClaimDividends,
        onClaimPayout,
        getTicketsOwnedByAddress: _getTicketsOwnedByAddress
    } = useVCFomo();

    const [buyPrice, setBuyPrice] = useState(0);
    const [sellPrice, setSellPrice] = useState(0);
    const [totalVCContract, setTotalVCContract] = useState(0);
    const [roundCount, setRoundCount] = useState(0);
    const [vCPrice, setVCPrice] = useState(0);
    const [roundData, setRoundData] = useState({ ticketCount: 0, jackpot: 0, timer: 0, holderPool: 0, maxticketsholder: '0x0000000000000000000000000000000000000000', latestholders: [] });
    const [ticketsOwned, setTicketsOwned] = useState(0);
    const [claimData, setClaimData] = useState([]);
    const [latestHolders, setLatestHolders] = useState([]);
    const [latestHolderData, setLatestHolderData] = useState([]);

    useEffect(() => {
        axios
            .get('https://api.coingecko.com/api/v3/coins/valuablecoins')
            .then(async ({ data }) => {
                // console.log("data coins== ", data)
                const price = data.market_data.current_price.usd;
                setVCPrice(price.toFixed(2));
            })
            .catch((err) => {
                console.log({ err });
                console.error('Error during fetch coins growth-defi');
            });
    }, []);

    useEffect(() => {
        async function getBalance() {
            const promises = [];
            if (account && chainId === 97) {
                promises.push(
                    vcFomoContractInstance.methods.buyPrice(1).call(),
                    vcFomoContractInstance.methods.sellPrice(1).call(),
                    vcContractInstance.methods.balanceOf(VC_FOMO_ADDRESS).call(),
                    vcFomoContractInstance.methods.roundCount().call(),
                );
            } else {
                promises.push(0, 0, 0, 0)
            }

            const [buyPrice, sellPrice, totalVCContract, roundCount] = await Promise.all(promises);

            setBuyPrice(Number(BNtoNumber(buyPrice.toString(), defaultDecimals)));
            setSellPrice(Number(BNtoNumber(sellPrice.toString(), defaultDecimals)));
            setTotalVCContract(Number(BNtoNumber(totalVCContract.toString(), defaultDecimals)));
            setRoundCount(roundCount);
            return roundCount;
        }

        async function getRoundData(roundCount) {
            if (roundCount > 0) {
                const promises = [];

                if (account && chainId === 97) {
                    promises.push(
                        vcFomoContractInstance.methods.rounds(roundCount).call(),
                        vcFomoContractInstance.methods.getTicketsOwned(roundCount, account).call(),
                        vcFomoContractInstance.methods.getRoundLatestHolders(roundCount).call(),
                    );
                } else {
                    promises.push({ ticketCount: 0, jackpot: 0, timer: 0, holderPool: 0, maxticketsholder: '0x0000000000000000000000000000000000000000', latestholders: [] }, 0, [])
                }

                const [roundData, ticketsOwned, latestHolders] = await Promise.all(promises);
                setRoundData(roundData);
                setTicketsOwned(ticketsOwned);
                setLatestHolders(latestHolders);
            }
        }

        async function getClaimValues(roundCount) {
            if (roundCount > 0) {
                const promises = [];

                if (account && chainId === 97) {
                    for (let i = 0; i < roundCount; i++) {
                        const roundPromise = [];
                        roundPromise.push(
                            vcFomoContractInstance.methods.calcDividends(i+1, account).call(),
                            vcFomoContractInstance.methods.calcPayout(i+1, account).call(),
                            vcFomoContractInstance.methods.getReclaim(i+1, account).call(),
                        );
                        promises.push({
                            round: i,
                            roundPromise
                        })
                    }
                } else {
                    promises.push({ round: 0, roundPromise: [0, 0, 0] })
                }

                const claimData = [];
                for (let i = 0; i < roundCount; i++) {
                    const claimDataRound = await Promise.all(promises[i].roundPromise);
                    claimData.push({
                        round: i+1,
                        claimDataRound
                    });
                }
                setClaimData(claimData);
            }
        }

        handler.current = setInterval(() => {
            getBalance().then((roundCount) => {
                getRoundData(roundCount).then(() => {
                    getClaimValues(roundCount);
                });
            });
        }, FETCH_INTERVAL);

        return () => {
            if (handler.current) {
                clearInterval(handler.current);
            }
        };
    }, [account]);

    const [timeLeft, setTimeLeft] = useState({days: 0, hours: 0, minutes: 0, seconds: 0});

    const calculateTimeLeft = () => {
        if (roundData) {
            let difference = new Date(roundData?.timer * 1000) - new Date();

            let timeLeft = {};

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }

            return timeLeft;
        } else return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };
    }

    useEffect(() => {
        let isSubscribed = true;
        const getData = async () => {
            const latestHoldersData = [];
            for(let i = 0; i < latestHolders.length; i++) {
                const ticketsOwned = await vcFomoContractInstance.methods.getTicketsOwned(roundCount, latestHolders[i]).call();
                latestHoldersData.push({
                    address: latestHolders[i],
                    tickets: ticketsOwned
                })
            }

            if (isSubscribed) {
                setLatestHolderData(latestHoldersData);
            }
            
        }
        
        getData()
        return () => isSubscribed = false;
    }, [roundCount, latestHolders, vcFomoContractInstance]);

    useEffect(() => {
        const timer = setTimeout(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
      
        return () => clearTimeout(timer);
      });

    return (
        <>
            <section className="header">
                <div className="header-container">
                    <div className="left-header">
                        <div className="logo">
                            <a className="mobile-show" href="/"><img src="./assets/img/logo.svg" height="70px" width="70px" /></a>
                        </div>

                    </div>

                    <div className="right-header fomo-container">
                        <ConnectBtn />

                        <div className="hamburger">
                            <svg width="41" height="28" viewBox="0 0 41 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 2H39M8.37539 14H38.9846M14.1177 26H38.9846" stroke="#E57506" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            <section className="navigation">
                <div className="navigation-container">

                    <div className="logo">
                        <a className="web-sho" href="/"><img src="./assets/img/logo.svg" height="70px" width="70px" /></a>
                    </div>

                    <div className="navigations">
                        <span className="close dn">  ✕  </span>

                        <a href="/" clas="mobile-hide">
                            <div className="navigations-item active"> 
                                <span className="icon-bg">
                                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.593634" d="M14.4166 3.19958L12.6666 0.282916C12.5611 0.107414 12.3714 0 12.1667 0H2.83334C2.6286 0 2.43886 0.107414 2.33342 0.282916L0.583424 3.19958C0.528876 3.29029 0.500004 3.39414 0.500004 3.49999C0.497749 4.78572 1.5377 5.8301 2.82342 5.83332H2.82809C3.40427 5.83479 3.96035 5.62164 4.38792 5.23541C5.27106 6.0336 6.6151 6.0336 7.49824 5.23541C8.38183 6.03536 9.7279 6.03536 10.6115 5.23541C11.2955 5.85251 12.2791 6.00833 13.1204 5.63287C13.9617 5.2574 14.5025 4.42126 14.5 3.49999C14.5 3.39414 14.4711 3.29029 14.4166 3.19958Z" fill="#67748E" />
                                        <path d="M12.176 6.69949C11.6337 6.69995 11.0988 6.5576 10.6132 6.28363L10.6045 6.28827C9.77663 6.75684 8.81822 6.83074 7.94216 6.49355C7.79043 6.43564 7.64231 6.36617 7.49882 6.28562L7.49241 6.28893C6.66481 6.75783 5.70639 6.8315 4.83066 6.49355C4.67912 6.43563 4.5312 6.36617 4.38791 6.28562C3.90322 6.55883 3.36924 6.70051 2.82808 6.69949C2.63429 6.69739 2.44096 6.67746 2.25 6.63989V13.3214C2.25 13.6871 2.51117 13.9836 2.83333 13.9836H6.33333V10.0105H8.66666V13.9836H12.1666C12.4888 13.9836 12.75 13.6871 12.75 13.3214V6.63724C12.5605 6.67578 12.3685 6.69659 12.176 6.69949Z" fill="#67748E" />
                                    </svg>
                                </span> 
                                Home
                            </div>
                        </a>
                        <a href="/staking" clas="mobile-hide">
                            <div className="navigations-item"> 
                                <span className="icon-bg active"> 
                                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.593634" d="M16 3.55556V1.18538C16 0.530459 15.4033 0 14.6667 0H1.33333C0.596667 0 0 0.530459 0 1.18538V3.55556H16Z" fill="white" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M0 6.22223V12.0404C0 12.7548 0.596667 13.3333 1.33333 13.3333H14.6667C15.4033 13.3333 16 12.7548 16 12.0404V6.22223H0ZM7.33333 10.101H2.66667V8.80809H7.33333V10.101ZM10.6667 10.101H13.3333V8.80809H10.6667V10.101Z" fill="white" />
                                    </svg>
                                </span>
                                Stake (1.5% Daily) 
                            </div>
                        </a>
                        <a href="/staking-gold" clas="mobile-hide">
                            <div className="navigations-item"> 
                                <span className="icon-bg"> 
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.6" d="M4.00078 5.6H2.80078V0.56C2.80078 0.25032 3.06898 0 3.40078 0H10.6008C10.9326 0 11.2008 0.25032 11.2008 0.56V3.92H10.0008V1.12H4.00078V5.6Z" fill="#67748E" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.16667 4.90002H13.4167C13.7393 4.90002 14 5.15426 14 5.46877V13.4313C14 13.7458 13.7393 14 13.4167 14H0.583333C0.26075 14 0 13.7458 0 13.4313V7.74377C0 7.42926 0.26075 7.17502 0.583333 7.17502H5.83333C6.15592 7.17502 6.41667 7.42926 6.41667 7.74377V12.8625H7.58333V5.46877C7.58333 5.15426 7.84408 4.90002 8.16667 4.90002ZM2.33333 12.2938H4.08333V11.1563H2.33333V12.2938ZM4.08333 10.0188H2.33333V8.88127H4.08333V10.0188ZM9.91667 12.2938H11.6667V11.1563H9.91667V12.2938ZM11.6667 10.0188H9.91667V8.88127H11.6667V10.0188ZM9.91667 7.74377H11.6667V6.60627H9.91667V7.74377Z" fill="#67748E" />
                                    </svg>
                                </span> 
                                Stake (5% Daily)
                            </div>
                        </a>
                        {/* <a href="#home">
                            <div className="navigations-item "> 
                                <span className="icon-bg">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.75 9.5V10.0833C10.75 10.7279 10.2279 11.25 9.58333 11.25H1.41667C0.772083 11.25 0.25 10.7279 0.25 10.0833V1.91667C0.25 1.27208 0.772083 0.75 1.41667 0.75H9.58333C10.2279 0.75 10.75 1.27208 10.75 1.91667V2.5H5.5C4.85542 2.5 4.33333 3.02208 4.33333 3.66667V8.33333C4.33333 8.97792 4.85542 9.5 5.5 9.5H10.75ZM5.5 8.33333H11.3333V3.66667H5.5V8.33333ZM7.83333 6.875C7.34917 6.875 6.95833 6.48417 6.95833 6C6.95833 5.51583 7.34917 5.125 7.83333 5.125C8.3175 5.125 8.70833 5.51583 8.70833 6C8.70833 6.48417 8.3175 6.875 7.83333 6.875Z" fill="#67748E" />
                                    </svg>
                                </span>
                                Audit
                            </div>
                        </a> */}
                    </div>
                </div>
            </section>

            <section className="ps-content">
                <div className="ps-content-container">
                    <div className="ps-content-container-wrapper">
                        <div className="widgets">
                            <div className="row1">
                                <div className="widget widget-1 liquidity-generation">
                                    <h4>Valuable coin activity</h4>

                                    <div className="icon-box">
                                        <div className="total-users">
                                            <div className="icon"> <img src="./assets/img/total-users.svg" height="60" /></div>
                                            <h6>Total VC in Contract</h6>
                                            <h5>{totalVCContract.toFixed(4)}</h5>
                                        </div>

                                        <div className="total-deposit">
                                            <div className="icon"> <img src="./assets/img/total-deposit.svg" height="60" /></div>
                                            <h6>Total VC in Jackpot</h6>
                                            <h5>{roundData && roundData?.jackpot && Number(BNtoNumber(roundData?.jackpot?.toString(), defaultDecimals)).toFixed(4)}</h5>
                                        </div>
                                    </div>
                                </div>

                                <div className="widget widget-2 valuable-coin">
                                    <div className="icon"> <img src="./assets/img/cv.svg" /></div>
                                    <h6></h6>
                                    <h5>1VC = ${vCPrice}</h5>
                                </div>

                                <div className="widget widget-3 token-sales">
                                    <div className="token-sales">
                                        <h4>Token Sales Ends In</h4>
                                        <div className="date-countdown">
                                            <div id="timer">
                                                <div>
                                                    <div id="days">{timeLeft.days} </div> <span>days</span>
                                                </div>
                                                <div>
                                                    <div id="hours">{timeLeft.hours}</div> <span>Hrs</span>
                                                </div>
                                                <div>
                                                    <div id="minutes">{timeLeft.minutes}</div> <span>Mins</span>
                                                </div>
                                                <div>
                                                    <div id="seconds">{timeLeft.seconds} </div> <span>Secs</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row2">
                                <div className="widget widget-4 buy-sell">
                                    <form action="" method="#">
                                        <input type="text" className="" placeholder="Buy / Sell Valueable coin here" value={buySellTicketAmount} onChange={(e) => setBuySellTicketAmount(e.currentTarget.value)} />
                                        {/* <div className="noti">Buy Price 1VC = $14</div> */}

                                        <div className="buysell">
                                            <div className="buy">

                                                <div className="stats">
                                                    <div className="symbol"><i className="fa fa-long-arrow-up" aria-hidden="true"></i></div>
                                                    <div className="bought"><span className="val">{buyPrice}</span> <br /><span className="tex">Buy Price</span> </div>
                                                </div>
                                                <div className="buy-ticket"  onClick={() => onBuyTicket()}>
                                                    <a href="#">
                                                        <div className="button">Buy Ticket With VC</div>
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="sell">
                                                <div className="stats">
                                                    <div className="symbol"><i className="fa fa-long-arrow-up" aria-hidden="true"></i></div>
                                                    <div className="bought"><span className="val">{sellPrice}</span> <br /><span className="tex">Sell Price</span> </div>
                                                </div>
                                                <div className="buy-ticket" onClick={() => onSellTicket()}>
                                                    <a href="#">
                                                        <div className="button">Sell Tickets For VC</div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="widget widget-5 balance">
                                    <div className="icon"> <img src="./assets/img/vc-bg-logo.svg" /></div>
                                    <div>
                                        <h6>Total Tickets :<span>{roundData?.ticketCount}</span> </h6>
                                        <h6>Your Tickets :<span>{ticketsOwned}</span> </h6>
                                    </div>
                                </div>

                                <div className="widget widget-6 documentation">
                                    <div className="icon"> <img src="./assets/img/doc-icon.svg" /></div>
                                    <h6>Click Here!</h6>
                                    <h6>To Read The Rules </h6>

                                    <div className="documentation">
                                        <a href="#">
                                            <div className="button">DOCUMENTATION</div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="list-view">
                            <div className="dashboard">
                                <h4>Dividends Dashboard</h4>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>Round</th>
                                            <th>Status</th>
                                            <th>Dividend</th>
                                            <th>Claimed</th>
                                            <th>Payouts</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            claimData && claimData.map((data) => 
                                                <tr>
                                                    <td>Round {data?.round + 1}</td>
                                                    {
                                                        data?.round == roundCount ?
                                                            <td className="pending"><i className="fa fa-circle " aria-hidden="true"></i>Processing</td> :
                                                            <td className=" draft"><i className="fa fa-circle" aria-hidden="true"></i>Finished</td>
                                                    }
                                                    <td>{Number(BNtoNumber(data?.claimDataRound[0].toString(), defaultDecimals)).toFixed(4)} VC</td>
                                                    <td>{Number(BNtoNumber(data?.claimDataRound[1].toString(), defaultDecimals)).toFixed(4)} VC</td>
                                                    <td>{Number(BNtoNumber(data?.claimDataRound[2].toString(), defaultDecimals)).toFixed(4)} VC</td>
                                                    <td>
                                                        {
                                                            data?.round == roundCount ?
                                                                <>
                                                                    <div className="button" onClick={() => onClaimDividends(data?.claimDataRound[0])}>Claim Div </div> <br />
                                                                    <div className="button" onClick={() => onClaimPayout(data?.round)}>Claim Payout </div>
                                                                </>
                                                                :
                                                                <div className="button" onClick={() => onClaimPayout(data?.round)}>Claim Payout </div>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div className="ticket-holder-buyer">
                                <div className="ticket-holder">
                                    <div className="text">
                                        <h4>Top Holder of Ticket</h4>
                                        <p>{roundData?.maxticketsholder}</p>
                                    </div>

                                    <div className="image"> <img src="./assets/img/holder.svg" /></div>
                                </div>

                                <div className="ticker-buyer">
                                    <h4>Last Six Ticket Buyer</h4>
                                    {latestHolderData && latestHolderData.map(each => 
                                        <div className="buyer">
                                            <span>{each?.address}</span> 
                                            <span className="val">{each?.tickets}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
