import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import { ethers } from "ethers";
import MintNFT from "./components/MintNFT";
import ViewNFTs from "./components/ViewNFTs";
import "./App.css";

function truncateAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function App() {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
        } catch (error) {
          console.error("Error initializing provider", error);
        }
      } else {
        console.error("window.ethereum is not defined");
      }
    };

    initializeProvider();
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0].address || accounts[0]);
      } else {
        setAccount(null);
      }
    };

    const handleChainChanged = async () => {
      if (provider) {
        const network = await provider.getNetwork();
        setNetwork(network);
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [provider]);

  const connectWallet = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0].address || accounts[0]);
        }
        const network = await provider.getNetwork();
        setNetwork(network);
      } catch (err) {
        console.error("Error connecting to wallet:", err);
      } finally {
        setIsConnecting(false);
      }
    } else {
      console.error("MetaMask is not installed");
      setIsConnecting(false);
    }
  };

  const switchToSepolia = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia Test Network",
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "SEP",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
        const network = await provider.getNetwork();
        setNetwork(network);
      } catch (error) {
        console.error("Error switching to Sepolia", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      setIsConnecting(false);
    }
  };

  const handleConnectOrSwitch = async () => {
    if (!account) {
      await connectWallet();
    }
    if (network && network.chainId !== 11155111n) {
      await switchToSepolia();
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setNetwork(null);
  };

  const saveImageUrl = (imageURL) => {
    setImageURLs((prev) => [...prev, imageURL]);
  };

  const getNetworkName = () => {
    if (!network) return null;
    const id = Number(network.chainId);
    const names = {
      1: "Mainnet",
      11155111: "Sepolia",
      137: "Polygon",
      80001: "Mumbai",
    };
    return names[id] || `Chain ${id}`;
  };

  return (
    <Router>
      <div className="App">
        <nav className="App-nav">
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span className="nav-brand">⬡ NFT Manager</span>
            <ul>
              <li>
                <NavLink to="/" end>Mint</NavLink>
              </li>
              <li>
                <NavLink to="/view-nfts">Collection</NavLink>
              </li>
            </ul>
          </div>
          <div className="wallet-area">
            {account && network && (
              <span className="network-badge">{getNetworkName()}</span>
            )}
            {account ? (
              <>
                <button
                  onClick={handleConnectOrSwitch}
                  className="connect-button connected"
                >
                  <span className="status-dot"></span>
                  {truncateAddress(account)}
                </button>
                <button
                  onClick={disconnectWallet}
                  className="disconnect-button"
                  title="Disconnect wallet"
                >
                  ✕
                </button>
              </>
            ) : (
              <button
                onClick={handleConnectOrSwitch}
                className="connect-button"
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </nav>
        <div className="page-container">
          <Routes>
            <Route path="/" element={<MintNFT account={account} saveImageUrl={saveImageUrl} />} />
            <Route path="/view-nfts" element={<ViewNFTs account={account} imageURLs={imageURLs} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
