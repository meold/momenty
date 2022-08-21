import { ethers } from 'ethers';
import { web3 } from '@/useMetamask';
import momentABI from '@/artifacts/MomentContract.json';
import marketplaceABI from '@/artifacts/MomentMarketplace.json';

export function getMomentContract() {
  if (!web3.instance) {
    return null;
  }
  const provider = new ethers.providers.Web3Provider(web3.instance);
  const signer = provider.getSigner();

  return new ethers.Contract(import.meta.env.VITE_MOMENT_CONTRACT, momentABI, signer);
}
export function getMarketplaceContract() {
  if (!web3.instance) {
    return null;
  }
  const provider = new ethers.providers.Web3Provider(web3.instance);
  const signer = provider.getSigner();

  return new ethers.Contract(import.meta.env.VITE_MOMENT_MARKETPLACE, marketplaceABI, signer);
}

export function mintNft(address, metadataUri) {
  const contract = getMomentContract();
  if (!contract) {
    throw new Error("Can't get contract");
  }
  return contract.mint(address, metadataUri);
}

export async function isApproved(tokenId) {
  const contract = getMomentContract();
  if (!contract) {
    throw new Error("Can't get contract");
  }
  return (await contract.getApproved(tokenId)) == import.meta.env.VITE_MOMENT_MARKETPLACE;
}

export function approveSellNft(tokenId) {
  const contract = getMomentContract();
  if (!contract) {
    throw new Error("Can't get contract");
  }
  return contract.approve(import.meta.env.VITE_MOMENT_MARKETPLACE, tokenId);
}

export function sellNft(tokenId, price) {
  const contract = getMarketplaceContract();
  if (!contract) {
    throw new Error("Can't get contract");
  }
  return contract.listMoment(import.meta.env.VITE_MOMENT_CONTRACT, tokenId, price);
}

export function buyNft(tokenId, price) {
  const contract = getMarketplaceContract();
  if (!contract) {
    throw new Error("Can't get contract");
  }
  return contract.buyMoment(import.meta.env.VITE_MOMENT_CONTRACT, tokenId, { value: price });
}

export function getNftListing(tokenId) {
  const contract = getMarketplaceContract();
  if (!contract) {
    throw new Error("Can't get contract");
  }
  return contract.getListing(import.meta.env.VITE_MOMENT_CONTRACT, tokenId);
}

export const parseEther = ethers.utils.parseEther;