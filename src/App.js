import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import { Grid, Card, CardActions, CardContent,CardMedia, Button, Typography } from "@mui/material";
import "./App.css";
import { CONTRACT_ADDRESS } from "./constants";
import AnimeVote from "./utils/AnimeVote.json";
import { ethers } from "ethers";

// Constants
const TWITTER_HANDLE = "tknkaz";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
  const [currentAccount, setCurrentAccount] = useState(null);
  const [animeContract, setAnimeContract] = useState(null);

  const vote = (animeId) => async () => {
    try {
      if (animeContract) {
        console.log("Minting character in progress...");
        const txn = await animeContract.beCitizen();
        await txn.wait();
        const mintTxn = await animeContract.vote(animeId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
    }
  };

  // ユーザーがMetaMaskを持っているか確認します。
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        // accountsにWEBサイトを訪れたユーザーのウォレットアカウントを格納します。
        // （複数持っている場合も加味、よって account's' と変数を定義している）
        const accounts = await ethereum.request({ method: "eth_accounts" });
        // もしアカウントが一つでも存在したら、以下を実行。
        if (accounts.length !== 0) {
          // accountという変数にユーザーの1つ目（=Javascriptでいう0番目）のアドレスを格納
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          // currentAccountにユーザーのアカウントアドレスを格納
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      // ウォレットアドレスに対してアクセスをリクエストしています。
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      // ウォレットアドレスを currentAccount に紐付けます。
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // ページがロードされたときに useEffect()内の関数が呼び出されます。
  useEffect(() => {
    checkIfWalletIsConnected();
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const animeVoteContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        AnimeVote.abi,
        signer
      );

      // gameContract の状態を更新します。
      setAnimeContract(animeVoteContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚡️ Animation Vote ⚡️</p>
          <p className="sub-text">
            面白いアニメに投票して投票の証をgetしよう✨
          </p>
          <div className="connect-wallet-container">
            <Grid container spacing={2}>
              <Grid xs={4}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image= "https://4.bp.blogspot.com/-umyHNhFFBS0/XAY6L7ZTSVI/AAAAAAABQh4/rzaW9oJ72tslOOHlsy4Tq2dXCFpvAI_WwCLcBGAs/s800/pose_pistol_woman.png"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      リコリスリコイル
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      sakana tinanago
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={vote(0)}>投票する</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid xs={4}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://isekaiojisan.com/core_sys/images/contents/00000020/block/00000030/00000030.jpg?1662691200"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      異世界おじさん
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      SEGA最高
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={vote(1)}>投票する</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </div>
        </div>
        <div className="footer-container">
        <button
              className="cta-button connect-wallet-button"
              onClick={connectWalletAction}
            >
              Connect Wallet To Get Started
            </button>
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
