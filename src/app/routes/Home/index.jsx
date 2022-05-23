import React, { useEffect, useState } from "react";
import ConnectBtn from "../../components/Header/ConnectBtn";
import "./home.css";

export default function Home() {

  return (
    <>
      <section className="header">
        <div className="header-container">
          <div className="logo">
            <a href="/"> <img src="./assets/img/logo.svg" /></a>
          </div>

          <div className="right-side">

            <div className="menu">
              <span className="close dn"> &#x2715 </span>

              <ul>
                <li data-aos="fade-in" data-aos-duration="3000"><a href="#about">Home</a> </li>
                <li data-aos="fade-in" data-aos-duration="3000"><a href="#roadmap">Roadmap</a> </li>
                <li data-aos="fade-in" data-aos-duration="3000"><a href="#tokenomics">Tokenomics</a> </li>
                <li data-aos="fade-in" data-aos-duration="3000"><a href="https://poocoin.app/tokens/0xf6e497bd65dfb7c0556020dd68d007f0ac76bc6a" target="_blank">Charts</a> </li>
                <li className="mobile-visible" data-aos="fade-in" data-aos-duration="3000"><a href="/staking">Begin Staking</a> </li>
              </ul>
            </div>

            <div className="connect">
              <a href="./staking" target="_blank">
                <div className="button animation animated fadeInUp"><h5>Begin Staking</h5> </div>
              </a>
            </div>
            <div className="connect">
              <a href="https://medium.com/@valuablecoin/valuable-coins-project-details-aae6d7b069ef" target="_blank">
                <div className="button animation animated fadeInUp"><h5>Project Details</h5> </div>
              </a>
            </div>

            <div className="connect-mobile">
              <a href="https://medium.com/@valuablecoin/valuable-coins-project-details-aae6d7b069ef">
                <div className="button animation animated fadeInUp"><h5>Project Details</h5> </div>
              </a>
            </div>
            <div className="hamburger">
              <img src="./assets/img/hamburger.svg" />
            </div>
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="hero-container">

          <div className="left">
            <img className="mobile-visible hero-logo" src="assets/img/hero-logo.svg" />

            <h1>Valuable Coins!</h1>

            <p>ValuableCoins is a low supply deflationary BEP20 token on the BNB Chain (A.K.A Binance Smart Chain). ValuableCoins is a fair-launched project with no presale, venture capitalist funding, or any type of private investors that would have any advantage over new investors. The initial and max supply of ValuableCoins is 60,100 coins. Over time as users buy, sell, make transfers, and stake VC (ValuableCoins) the supply will be taken out of circulation which in theory can attribute to price appreciation.</p>

            <div className="button-group">
              <a href="https://pancakeswap.finance/info/token/0xF6e497Bd65DfB7c0556020DD68d007f0AC76bc6a" target="_blank"><div className="buy"> <span>Buy VC Now </span> <span><img src="./assets/img/arror-right.svg" alt="" /></span> </div></a>
              <a href="https://solidity.finance/audits/ValuableCoins/" target="_blank"><div className="buy"> <span>Audit</span> <span><img src="./assets/img/arror-right.svg" alt="" /></span> </div></a>
              <a href="https://t.me/valuablecoins" target="_blank"> <div className="staking">   <span>Join Our Group chat</span>  <span><img src="./assets/img/arror-right.svg" alt="" /></span>   </div></a>
            </div>
          </div>
          <div className="right"   >
            <img src="assets/img/hero-logo.svg" />
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-container">
          <div className="left" data-aos="fade-right">
            <img src="./assets/img/01.svg" alt="" />
            <h3 data-aos="fade-up" >ValuableCoins Staking Info</h3>
            <p data-aos="fade-up" > When a user stakes their VC tokens they will earn 1.5% a day with an APY of 265% (minus any token taxation). The 1.5% will be paid out in VC coins, meaning if the price of VC appreciates the overall payout in USD also increases. Users can not withdraw the initial deposit and will get their initial deposit in 67 days (1.5% x 67= 100%; 100%=initial deposit) and the rest of the 298 days will be pure profit.</p>
            <img className="bg-img" src="./assets/img/stake.png" alt="" />
          </div>
          <div className="right" data-aos="fade-left">
            <img src="./assets/img/02.svg" alt="" />
            <h3 data-aos="fade-up">Reflection Tokenomics</h3>
            <p data-aos="fade-up"> VC has the ability to implement reflection tokenomics. However, because we are offering high apy staking initially to our users we will not turn on the reflection tokenomics until all our staking contracts can no longer pay out rewards to users. We believe since VC is a fair launch token, the majority of which is held by the community, reflections will benefit all users when no more rewards can no longer get paid out</p>
            <img className="bg-img" src="./assets/img/nft.png" alt="" />
          </div>
        </div>
      </section>

      <section className="tokenomics" id="tokenomics">
        <div className="tokenomics-container">
          <div className="top">
            <h1 data-aos="fade-up">Tokenomics</h1>
            <p data-aos="fade-up"> With a total of 60,100 VC tokens, the following amounts have been allotted for different purposes:</p>
          </div>

          <div className="bottom">
            <div className="nomics" data-aos="flip-up">
              <h3>2% Staking Fee</h3>
              <p>2% of all transactions will go to paying out all stakers.</p>
            </div>

            <div className="nomics" data-aos="fade-down">
              <h3>1% Burn</h3>
              <p>1% of all transactions will be burnt. This burn mechanism will reduce the total supply of VC over time.</p>
            </div>

            <div className="nomics" data-aos="flip-down">
              <h3>80% Tokens to PancakeSwap</h3>
              <p>48,080 tokens will be added to pancakeswap for users to trade.</p>
            </div>

            <div className="nomics" data-aos="flip-up" >
              <h3>10% Tokens To Initial Staking Pool</h3>
              <p>6,010 tokens will be palced in a smart contract to payout initial stakers who stake VC.</p>
            </div>

            <div className="nomics" data-aos="flip-down" >
              <h3>5% For Future Rewards</h3>
              <p>3,005 tokens will be placed in a token lock smart contract that will lock these tokens for 95 days.
                These tokens will be used in the future for staking rewards when 10% initial rewards run out. VC is not an inflationary token, no more can ever be minted,
                however we will think of a way to reward users long term throughout the years.</p>
            </div>

            <div className="nomics" data-aos="flip-up">
              <h3>1% To Marketing Wallet</h3>
              <p>601 tokens will be held by the developer for marketing and development purposes.</p>
              <br/>
              <a href="https://bscscan.com/address/0x8BdD8aa79b118BB007208B3496E0Ed53D76d35eF" target="_blank" className="dev-wallet-address">Dev Wallet</a>
            </div>

            <div className="nomics" data-aos="flip-down">
              <h3>4% To Developers</h3>
              <p>2,404 tokens will be locked away in a smart contract for two years and this will be the developers tokens for creating ValuableCoins.</p>
              <br/>
              <a href="https://bscscan.com/address/0x8BdD8aa79b118BB007208B3496E0Ed53D76d35eF" target="_blank" className="dev-wallet-address">Dev Wallet</a>
            </div>
          </div>
        </div>
      </section>

      <section className="roadmap" id="roadmap">
        <div className="roadmap-container">
          <div className="top">
            <h1>Roadmap</h1>
          </div>

          <div className="bottom">
            <div className="map" data-aos="fade-up-right" >
              <div className="one">
                <h3>Developement</h3>
                <ul>
                  <li>Create the ValuableCoins smart contract</li>
                  <li> Create a website for ValuableCoins</li>
                  <li> Get ValuableCoins audited</li>
                  <li> Do a fair launch for ValuableCoins</li>
                </ul>
                <img src="./assets/img/one.png" />
              </div>
              <div className="roadmap-line"><img src="./assets/img/roadmap-line.png" /></div>
            </div>

            <div className="map" data-aos="fade-up-left">
              <div className="roadmap-line"><img src="./assets/img/roadmap-line2.png" /></div>
              <div className="two">
                <h3>Marketing & Initial Community Building</h3>
                <ul>
                  <li>Once the fair launch happens marketing will be necessary to build the initial community for VC.</li>
                </ul>
                <img src="./assets/img/two.png" />
              </div>
            </div>

            <div className="map" data-aos="fade-up-right">
              <div className="three">
                <h3>Covering The Basics</h3>
                <ul>
                  <li>Apply for coinmarketcap</li>
                  <li>Apply for coingecko</li>
                  <li>Apply for blockfolio</li>
                  <li>Apply for DappRadar and similar sites</li>
                  <li>Continue Marketing Campaigns</li>
                </ul>
                <img src="./assets/img/three.png" />
              </div>
              <div className="roadmap-line"><img src="./assets/img/roadmap-line.png" /></div>
            </div>

            <div className="map" data-aos="fade-up-right"  >
              <div className="roadmap-line"><img src="./assets/img/roadmap-line2.png" /></div>
              <div className="four">
                <h3>Setting Up Treasury</h3>
                <ul>
                  <li>The treasury will play a key role in yield earnings that will keep our protocol sustainable (more info on our project details page).</li>
                </ul>
                <img src="./assets/img/four.png" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="footer">
        <div className="footer-container">
          <div className="description">
            <p>Our community grows stronger every day. Please follow our social platforms to get the most up-to-date, accurate information.</p>
            <p>Using the links below, you can join our various groups.</p>
          </div>
          <div className="socials">
            <a target="_blank" href="https://twitter.com/valuablecoin1"> <img src="./assets/img/social-icons/twitter.svg" alt="twitter" /></a>
            <a target="_blank" href="https://t.me/valuablecoins">  <img src="./assets/img/social-icons/telegramm.svg" alt="telegram" /></a>
          </div>

          <div className="partners">
            <a target="_blank" href="https://medium.com/@valuablecoin"><div>Medium</div></a>
            <a target="_blank" href="https://bscscan.com/token/0xF6e497Bd65DfB7c0556020DD68d007f0AC76bc6a"><div>BSCSCAN</div></a>
            {/* <a target="_blank" href="#"> <div>CoinMarketCap (Coming soon)</div></a>
            <a target="_blank" href="#">  <div>CoinGecko (Coming soon)</div></a> */}
          </div>
          <div className="copyright"><p> Copyright © 2022 — ValuableCoins . | ALL RIGHTS RESERVED </p></div>
        </div>
      </section>
    </>
  );
}
