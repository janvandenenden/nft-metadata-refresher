**What is NFT Metadata Refresher?**

NFT Metadata Refresher is a web application that updates the metadata of your whole ERC-721 collection on Opensea. It is built using Alchemy, Ethers and the Opensea API.

**How do I use it?**

Enter the smart contract address of an ERC-721 collection on the Ethereum blockchain and hit the "Refresh Metadata" button. Make sure to keep the browser tab open while you're refreshing metadata.

**How does it work?**

The app looks at the mint events of the contract (tokens sent from the 0x0000... address) to obtain the tokenIds of the NFT collection. This set of tokenIds is then used to make a call to the Opensea API to update the metadata.

This app is free to use and works on custom smart contracts (not created by OpenSea) deployed on the Ethereum network.
