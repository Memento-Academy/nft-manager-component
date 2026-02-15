import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../CSS/ViewNFT.css";
import abi from "../abis/contractABI.json";
import nfticon from "../images/nft-icon-non-fungible-token-vector.jpg";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export default function ViewNFTs({ account, imageURLs }) {
    const [loading, setLoading] = useState(true);
    const [nfts, setNfts] = useState([]);
    const [contract, setContract] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initContract = async () => {
            if (!window.ethereum || !account) return;

            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const tempContract = new ethers.Contract(contractAddress, abi, signer);
                setContract(tempContract);
            } catch (error) {
                console.error("Error creating contract instance:", error);
            }
        };

        if (account) {
            initContract();
        }
    }, [account]);

    useEffect(() => {
        const fetchNFTs = async () => {
            try {
                const balance = await contract.balanceOf(account);
                const nftData = [];

                for (let i = 0; i < balance; i++) {
                    try {
                        const tokenId = await contract.tokenOfOwnerByIndex(account, i);
                        nftData.push({ tokenId: tokenId.toString() });
                    } catch (innerError) {
                        console.error(`Error fetching token data for index ${i}:`, innerError);
                    }
                }

                setNfts(nftData);
            } catch (error) {
                console.error("Error fetching NFTs", error);
                setError(error.message);
            }
        };

        if (contract && account) {
            fetchNFTs().finally(() => setLoading(false));
        }
    }, [contract, account]);

    if (!account) {
        return (
            <div className="connect-prompt">
                <div className="prompt-icon">👁️</div>
                <p>Connect your wallet to view your NFTs</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state">
                <div className="error-icon">⚠️</div>
                <p>{error}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="view-page">
                <h2>Your Collection</h2>
                <div className="skeleton-grid">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="skeleton-card">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-info">
                                <div className="skeleton-text medium"></div>
                                <div className="skeleton-text short"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="view-page">
            <h2>Your Collection</h2>
            {nfts.length > 0 ? (
                <div className="nft-grid">
                    {nfts.map((nft, index) => {
                        const imageUrl = imageURLs[index] ?? nfticon;
                        return (
                            <div key={nft.tokenId} className="nft-card">
                                <div className="nft-card-image-wrapper">
                                    <img
                                        src={imageUrl}
                                        alt={`NFT #${nft.tokenId}`}
                                        className="nft-card-image"
                                    />
                                </div>
                                <div className="nft-card-info">
                                    <span className="nft-card-label">Token ID</span>
                                    <span className="nft-card-id">#{nft.tokenId}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">🖼️</div>
                    <p>No NFTs found</p>
                    <span className="empty-hint">Mint your first NFT to see it here</span>
                </div>
            )}
        </div>
    );
}