import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom"
import "./staking.css";

import useVCStaking from "../../hooks/useVCStaking";
import useBalance from "../../hooks/useBalance";
import VCUiContext from "../../contexts/VCUiContext";

import { numberWithCommas } from "../../util";
import ConnectBtn from "../../components/Header/ConnectBtn";
import { useWeb3React } from "@web3-react/core";

export default function Staking() {
    const {
        account,
    } = useWeb3React();

    const { lastUpdatedTime } = useContext(VCUiContext);
    const { vcBalance, totalDeposit, totalWithdrawn, dividends, bonus, totalSupply } =
        useBalance(lastUpdatedTime);

    const [searchParams, setSearchParams] = useSearchParams()
    const refAddress = searchParams.get("ref");

    const {
        depositVCAmount,
        setDepositVCAmount,
        onClaim,
        onStake,
        onReinvest
    } = useVCStaking();

    return (
        <>
            <section className="stake-house">
                <div className="stake-house-container">
                    <div className="intro">
                        <a href="/">
                            <img src="./assets/img/logo.svg" />
                        </a>
                        <div class="connect-disconnect staking-details active">
                            <a href="https://medium.com/@valuablecoin/valuablecoins-staking-details-4e72e6402dad" target="_blank">Staking Details</a>
                        </div>                        
                        <ConnectBtn />
                        <h2>ValuableCoins staking contract is designed to payout investors 1.5% a day with a 265% ROI. The more VC appreciates in value the higher your payout is in USD.
                            Please read our document page for full staking details.
                        </h2>
                    </div>

                    <div className="stake">
                        <div className="stake-stat">
                            <div className="item">
                                <span className="property">Wallet Balance</span>
                                <span className="value"> <span id="contract">{vcBalance.toFixed(6)}</span> VC</span>
                            </div>

                            <div className="item">
                                <span className="property">Your Total Deposit</span>
                                <span className="value"> <span id="contract">{totalDeposit.toFixed(6)}</span> VC</span>
                            </div>
                            <div className="item">
                                <span className="property">Total Claimed</span>
                                <span className="value"> <span id="contract">{totalWithdrawn.toFixed(6)}</span> VC</span>
                            </div>
                        </div>

                        <div className="stake-value">
                            <input id="amount" type="text" className="" value={depositVCAmount} onChange={(e) => setDepositVCAmount(e.currentTarget.value)} />
                            <span>VC</span>
                        </div>

                        <div className="stake-button active">
                            <div className="" onClick={() => onStake(refAddress)}>
                                DEPOSIT
                            </div>
                        </div>

                        <div className="stake-rewards">
                            <span className="property">Your Rewards</span>
                            <span className="value"> <span id="contract">{dividends.toFixed(6)}</span> VC</span>
                        </div>

                        <div className="stake-rewards">
                            <span className="property">Your Referral Bonus</span>
                            <span className="value"> <span id="contract">{bonus.toFixed(6)}</span> VC</span>
                        </div>

                        <div className="stake-action-buttons">
                            <div className="active" onClick={() => onReinvest()}>
                                COMPOUND
                            </div>

                            <div className="active" onClick={() => onClaim()}>
                                WITHDRAW
                            </div>
                        </div>



                    </div>

                    <div className="nutrition">
                        <h2>Token Facts</h2>
                        <div className="nutrition-stat">
                            <div className="item">
                                <span className="property">Initial Supply</span>
                                <span className="value"> 60,100</span>
                            </div>

                            <div className="item">
                                <span className="property">Current Supply</span>
                                <span className="value"> {numberWithCommas(totalSupply.toFixed(6))}</span>
                            </div>
                        </div>
                    </div>

                    <div className="referral">
                        <h2> Referral Link</h2>
                        <input className="referral-link" id="ref-address" value={`https://valuablecointoken.com/staking?ref=${account?account:''}`} readOnly/>
                        <p>Earn 15% of the VC used to stake VC from anyone who uses your referral link</p>
                    </div>

                    <div className="social-handles">
                        <div>
                            <a href="https://bscscan.com/address/0x224c1edfeF5BB75567049aD70A4D91737D9128C4" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADWElEQVRo3u2av3HbMBSHPycunDsXcsWU4gSmJzA9ge0FaHkCyRPEnkDSBOJxActVSjFVylBdOsglOzYq0qUg7FAQSIkU+Cd3/t2pEIgD34cH4AEPhA91S0d1NWzZngP0lOIoFkHSaRBp+A1wCbgFVVdABLwAYSyCVesglu31gQFwB/QrNhMBU2B+iLcqgUiAbxLClBIJNKkCVBrEsr1HYMj2+DelFXAfiyCsBUTOgRng1ASgahKL4MEoiGV7LvBMfV7IUwRc7TPUPu0BMQAWLUBA6v2FZXs7310IkhlObcoh7chCfS6A6AM/gZOWQQC+np6d99fJ8iWvQpFHZrQznPI0sGzvphSInBduA8b5gB2L4OjtB9ySxhSdZnnzZWtoyYrfaWBIxSK4WCfLDaPXyfL36dn5F/QdeQL8WSfLUH2g88iIbg0pVUOdV3Qgd21bukM90s7OB5GTqW/wpREQyl9isN2hWnCs/L82CLAVkS3bGwFjA+33LNtzs/sxdWjdGAKZ6rYVsQgmhtrf0jtIzomuqlZ1GZxRpAWhmbhhSk+qx7Nz5HzPRhJgDrzK/5ekC0S/IQg/FsGjWpgF2deQq1gEkVpo2d6C+r3qxyK41z3YuY1XFOogpH40CWHZ3kCeViuBtCUVwkFZxv8HkIkC0UOzMz8u12ajSoCHWAS+Uv6MJm+QBVm1bXlGIelw2rDJsr0ZmwtKqAN5pSPSpYIkxEApjnQgIWnSrVOSc2KsgVhlg+L7ZC+bEDOgaE+IBfqM5oa96qo1bxBkugPCAX6RnxDciFsqSG6WwqAeSM/pfgHESEL0c6okKJ2+sfzGIvAt2xtT41G3aCsvU1DqyqTTVuZeFxCnHKaECkt5xgu7IACe1AJdQJxQLdseSoBS9xwyrzxm/+S4r7sc0iax5URT870J+khbSRLgG+V2zAnp/NrqqMJsvHwZpGv2CgOSCY5hSYA33cYimOse1HYZqhjfI40FQ6ofwArvS+q81e2RJjOuOTypkXugqgVEzi1XGu8aajaMRXC1q9Kht7ou6WrzdiXdM9kx7OGJSiByuIzYfZduQk+6JEOeSp0QM8ueUyNABFyUgYDu3bNXjlOd+fLh0EBr+lsUl38JO0dTLZGGR8ASg9+ifKhr+gvf9S3/pZ723AAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAASdEVYdEVYSUY6T3JpZW50YXRpb24AMYRY7O8AAAAASUVORK5CYII=" alt="" width="48" height="48" /></a>
                        </div>

                        <div>
                            <a href="https://t.me/valuablecoins" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADW0lEQVRo3u2aP3KbQBSHvyQuPRNUqTScQOQG+ARWLkCsE0Tp0sU6QewTWOYCQSewbmB0AnBJtylUpEuxawVhFnYRCM3EvxmPR+Lt4316+/cBvOm09K5rh2Mv9AEfcDUmGZDkaZScFMjYCx1gClyp/6YSwBpYAXGeRmIQkLEXusAPFbxz4O8hgBhY5GmUHQVEZWCuIPrQAri1zZAViOr/v9D3/66UAbM8jdamDd5bQFwDT0eAQN3jUd3TSEYZGXvhPWDstGMt8zSaNRl9OHEIAP98NHG3YrNqDTL2wjnwfUCIIszzVmwSnYG2a429MAAehyYo6ZNuIa0EUVPssQa2jTIFI8oXdLPW/AQhUDHNqy68yohasdOhI26QV94BVGWkrxW7SWsL21cx7oEUNoDHUgZ8A0Z5Gl0Ct4btpirWnc7KBhy+ATRRDNxVbEF+G7Z3VKxLHchVj8EL4A65Umcam48W/q7qQKY9AKyBhzyNlga2voXfoPhhB6J2tl1J8K/7JMULqm87mqy4Fvdwxl7ov/gvDvYuQDJghpweZxUQN8ip/VrT3gZkz/7sACdFLZHdZ111UWX7Xv1YCRWzk9oS2cpHZv7VGLFRBjzQcJpTWXiZ9xPgUmPvHBBLK5AY+evHdUalLDRBQLuufdEGJAE+mxQHSlkwgQCYtADZyQbEBMBFZiGwhIB2Xeu5DcgUuTVIkGMjLmZHHcJ+lAIyOqYqBYZ2lSqCZIZtfPX3U0EJ5IznluyMIVQm22gXcxEkaeHI13wfW2QC2k/9u5h3C2LHtVi3vDttUNDmJsWYy+eRuCMQH1mX8g3tLwzttLGWQVbmfoxh5ga2bgv/e7FWZUR0COMgJ4XHhgEdWPoV1GVEzfWxqTcLBcBTVXYsx9KLluV1qerMvugBBPTZCSz9COQBbU+6utYN/RchlsiV+St2q/oiT6Ob8pe6lf0W+EK/ta3rFm0yNAWKupKpj6w2npK0JVPt8xHVwGZ17luzukW7thq/FZvkfDRx6eYYfIiWeRrVTkKNz0e2YrMaGMZo82n8DFE9Brs/MsTMsIxk/TA0UDBuzwAZ8jSamDZo7FpFbcUmOx9NHoA/HHgQqtECmYnMptH/+8JABZBDu1c4UMEP+wpHDZjPAC/VvOnU9BdAxzlbow3rDQAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAASdEVYdEVYSUY6T3JpZW50YXRpb24AMYRY7O8AAAAASUVORK5CYII=" alt="" width="48" height="48" /></a>
                        </div>

                        <div>
                            <a href="https://twitter.com/valuablecoin1" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAD0UlEQVRo3u2aMVbjOBjHf7BTbMF761Ru4247zAnGdNMRLuBJTsBwgiEnAE4A+AKEE+DpttvkBPJ0484UKbbbQjKjcaRYsmNIMf/3eM/Ykvz9pE9fPkmG39ovHey6wTBKAyBWf4GhSA4UpciKvQMJo3QCfAQmwNixWqWgnoBFKbLqXUBUz0+BCw/jt0HdA7ddR6oTSBilU+Aas+v01Ry48R0hL5AwSsfAHZAMAKCrAGalyHLXCn94QCTAM/D3wBAgR3p6NDp+WVerf3YGolzpEfjzDSB0fToaHY/X1eqpN4iCuHtjAF2xC8xWEOVOj+8IocMcrKtVbitgnewqvAqGiUxddWoLAIdbKj3uGQTAo+pgNxA1L5KBjCmAGRCVIjsAToEbQ7nKcC9A/n5tyOhaYZQK7L/WeQ/Iy1JkJqMJozRGhvcCeFBGf7W0EzUzgENDg9MtEEUpslNkOuGrmQ0CoBTZshTZqBTZieqsiy1tbQAeuhTStFAvnWF2B5vmpcic4FX28FV1VmEpNlXlzCBqeMfY9aL14CVwjtmXm3KCUO0WpcjOge8ttkysIMDnlvecNV66AKIWQ73XHmGUXmOZ1DZbmyBJS+VYjZoOUylXi5CZq5fRFn1xKBProfhD86FDA3fASfOm6vUr4Er5b+zYXh/FyMDwM/xq2e02VciweK9GYedytKPWvBTZFfzqWoFDxQXShR6GgPCwo9Zf9YXuWrFDxUSNRDEgiIsdG2UPPSoBjNXQD6mzLpV8QUAmbnGHeq3SgsSbgATA80AjM+laUQcpOsBY0+qOuvAsX9UX+mT3AQFDBtpHYZRe4b8/tqov9BFZejays3W8mhu+owFa57+CqA2xwqORZIeu1XU1mm+ANB84agKIMEqvu07+MErv6BapfklGmyCt+0cGBcgk78J3dBTEtEsHoNZGtTaWui3LXJNyZM6TewAEyDk26QgBcFKKbFn/88FQ4AH7KnGJDHnfkPMp77DWSBSET2c1lesQNpAbZAQJDM/GwC0y+/UFmKh2kx4AtebNG7ZdlC+0r9CWyDmVm9xKpTEx8gAoof8ZSq1cbYC0gyhD/mX4hZGvKuTcKJoPtuVaM9w2Ft5SlzaXtm5ir6vVj6PRcUm/yLJL3Zcim9sebt2NX1er5dHo+PsewLQurVvPR/YAxml/wOnE6h1hnDc5fA9DY2SCNx4YoEJO7HvXCs6HofAaAB6A/xju2GEBnPukPNDvg4ExMpWZ7hDg1hegN4gGFCiYM/xHaYnM7RZ9V5s7/ahG+6CmBvpoMPwFmTEv+35/8lv7rP8Bk+NXaD4vbEEAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAEnRFWHRFWElGOk9yaWVudGF0aW9uADGEWOzvAAAAAElFTkSuQmCC" alt="" width="48" height="48" /></a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
