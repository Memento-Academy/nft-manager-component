import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../CSS/MintNFT.css";
import abi from "../abis/contractABI.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export default function MintNFT({ account, saveImageUrl }) {
    const [contract, setContract] = useState(null);
    const [isMinting, setIsMinting] = useState(false);
    const [randomNumber, setRandomNumber] = useState(() => Math.floor(Math.random() * 1000));

    const imageURL = `https://picsum.photos/400/400?random=${randomNumber}`;

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

    const handleMintNftClick = async () => {
        if (!contract) {
            alert("Contract not initialized.");
            return;
        }
        if (!account) {
            alert("Account not connected.");
            return;
        }

        setIsMinting(true);
        try {
            const tx = await contract.mint(account);
            await tx.wait();
            saveImageUrl(imageURL);
            alert("NFT Minted!");
        } catch (error) {
            console.error("Error minting NFT", error);
            alert(`Error minting NFT: ${error.message}`);
        } finally {
            setIsMinting(false);
        }
    };

    if (!account) {
        return (
            <div className="connect-prompt">
                <div className="prompt-icon">🔗</div>
                <p>Connect your wallet to mint an NFT</p>
            </div>
        );
    }

    return (
        <div className="mint-page">
            <div className="mint-card">
                <h2>Mint NFT</h2>
                <div className="nft-preview-container">
                    <img src={imageURL} alt="NFT Preview" className="nft-image" />
                    <span className="preview-label">Preview</span>
                </div>
                <button
                    className="shuffle-link"
                    onClick={() => setRandomNumber(Math.floor(Math.random() * 10000))}
                    title="Shuffle image"
                >
                    ↻
                </button>
                <button
                    onClick={handleMintNftClick}
                    className="mint-button"
                    disabled={isMinting || !contract}
                >
                    {isMinting ? (
                        <>
                            <span className="spinner"></span>
                            Minting...
                        </>
                    ) : (
                        "⬡ Mint NFT"
                    )}
                </button>
                <p className="mint-legend">
                    Shuffle to randomize the image, then mint it on-chain. MetaMask will ask you to confirm the transaction.
                </p>
            </div>
        </div>
    );
}