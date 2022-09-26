import Head from "next/head";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";
import ProgressBar from "../components/ProgressBar";

export default function Home() {
  const [collectionSize, setCollectionSize] = useState(0);
  const [contractAddres, setContractAddres] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState("0%");
  const [confetti, setConfetti] = useState(false);

  //TOAST MESSAGES
  const updateMetadataMessage = (projectName) =>
    toast(`Started refreshing metadata of ${projectName} on Opensea.`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
    });

  const successMessage = () =>
    toast.success(`Finished refreshing metadata on Opensea.`, {
      position: "top-right",
      autoClose: false,
    });

  const errorMessage = (error) => toast.error(error);

  //GET COLLECTION SIZE USING ETHERS
  const getCollectionSizeFromContract = async () => {
    try {
      const provider = new ethers.providers.AlchemyProvider(
        "homestead",
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      );

      const abi = [
        "function name() view returns (string)",
        "event Transfer(address indexed src, address indexed dst, uint val)",
      ];

      const contract = new ethers.Contract(contractAddres, abi, provider);

      const transferEvents = await contract.queryFilter(
        contract.filters.Transfer(ethers.constants.AddressZero)
      );

      const _tokenIds = transferEvents.map((transfer) => {
        return parseInt(transfer.topics[3]);
      });

      const name = await contract.name();

      return { totalSupply: _tokenIds.length, name: name, tokenIds: _tokenIds };
    } catch (error) {
      console.log(error.toString());
      errorMessage("Please enter a valid Ethereum contract address");
    }
  };

  const updateMetaData = async () => {
    const result = await getCollectionSizeFromContract();
    setLoading(true);
    if (result == undefined) {
      setLoading(false);
    } else {
      setCollectionSize(result?.totalSupply);
      try {
        updateMetadataMessage(result?.name);
        let _progress = 0;
        for (let i = 0; i <= result?.totalSupply; i++) {
          const url = `https://api.opensea.io/api/v1/asset/${contractAddres}/${result.tokenIds[i]}/?force_update=true`;
          const response = await fetch(url);
          if (response.status == 200) {
            _progress++;
            setProgress(_progress);
          }
          setTimeout(() => {}, 250);
        }
        successMessage();
        setConfetti(true);
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
    setContractAddres("");
  };

  useEffect(() => {
    const _progressPercentage =
      collectionSize == 0
        ? "0"
        : ((progress / collectionSize) * 100).toFixed(0).toString();
    setProgressPercentage(_progressPercentage + "%");
  }, [collectionSize, progress]);

  return (
    <div
      className={`bg-gradient-to-r from-blue-50 via-indigo-50 to-pink-50 dark:from-slate-900 dark:to-neutral-900 h-full flex flex-col justify-center font-['Roboto']']`}
    >
      <Head>
        <title>
          NFT Metadata Refresher | Keep the NFT metadata on Opensea up-to-date
          with ease!
        </title>
        <meta
          property="og:title"
          content="NFT Metadata Refresher | Keep the NFT metadata on Opensea up-to-date
          with ease!"
          key="title"
        />
        <meta
          property="og:description"
          content="Enter the Ethereum smart contract address of the collection whose
          metadata you want to refresh."
          key="description"
        />

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:url" content="https://nftmetadatarefresher.com/" />
        <meta
          property="og:image"
          content="https://rarefolknft.com/images/og-image.jpg"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image:alt" content="" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content="https://rarefolknft.com/images/twitter-image.jpg"
        />
      </Head>

      <div className="max-w-[1240px] w-full min-h-screen mx-auto px-4 flex flex-col">
        <h1 className="text-5xl pt-16 pb-10 md:pb-16 md:text-6xl font-archivo-black dark:text-white text-center ">
          <span className="text-indigo-500 dark:text-indigo-300">Refresh</span>{" "}
          your{" "}
          <span className="text-indigo-500 dark:text-indigo-300">
            NFT metadata
          </span>{" "}
          on Opensea{" "}
          <span className="text-indigo-500 dark:text-indigo-300">
            with ease
          </span>
          !
        </h1>
        <div className="flex flex-col w-full md:w-[75%] lg:w-[60%] rounded-xl mx-auto py-4 md:p-10 lg:py-12 md:shadow-xl bg-transparent md:bg-white md:dark:bg-slate-800">
          <p className="text-gray-600 mb-4 dark:text-white ">
            Enter the smart contract address of your NFT collection
          </p>
          <input
            placeholder="E.g. 0x1A92f7381B9F03921564a437210bB9396471050C"
            type="text"
            className={`border mb-6 h-16 shadow-xl rounded-xl p-4 ${
              loading ? "dark:text-white" : ""
            }`}
            value={contractAddres}
            onChange={(event) => setContractAddres(event.target.value)}
            disabled={loading}
          />

          {loading ? (
            <button
              disabled
              type="button"
              className="py-4 px-16 bg-indigo-500 text-white rounded-xl text-xl font-bold text-center items-center animate-pulse"
            >
              <svg
                role="status"
                className="inline mr-3 w-6 h-6 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading...
            </button>
          ) : (
            <button
              className="py-4 px-16 bg-indigo-500 text-white shadow-xl rounded-xl text-xl font-bold hover:bg-indigo-700 ease-in duration-100"
              onClick={updateMetaData}
            >
              Refresh Metadata
            </button>
          )}
          <div className={loading ? "visible" : "invisible hidden"}>
            <p className="text-sm font-thin my-3 dark:text-white">
              Updated {progress} of {collectionSize}
            </p>
            <ProgressBar progressPercentage={progressPercentage} />
            <p className="text-xs font-thin mt-3 dark:text-white">
              Please keep this tab open when refreshing metadata
            </p>
          </div>
        </div>
        <div className="w-full mt-auto pt-6 dark:text-white">
          <p className="text-xs text-center text-gray-700 dark:text-white">
            This app is free to use and works on custom smart contracts (not
            created by OpenSea) deployed on the Ethereum network.
            <br /> If you found this helpful in any way, feel free to share the
            ❤️
            <br />
            <a
              href="https://etherscan.io/address/0xfBF2d286699bD4ec2fcB8C33EF2cc45766fd93da"
              rel="noreferrer"
              target="_blank"
            >
              0xfBF2d286699bD4ec2fcB8C33EF2cc45766fd93da
            </a>
          </p>
        </div>
      </div>
      <Confetti recycle={false} run={confetti} />
      <ToastContainer />
    </div>
  );
}
