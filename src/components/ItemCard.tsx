import { TokenInfo, TokenNftInfo } from "@hashgraph/sdk";
import { useEffect, useState } from "react";
import { getTokenInfo } from "../libs/hashgraph";

interface IItemCardProps {
  tokenId: string;
}

const ItemCard: React.FunctionComponent<IItemCardProps> = ({ tokenId }) => {
  const [currentToken, setCurrentToken] = useState<{
    token: TokenInfo;
    nft: TokenNftInfo;
  }>();

  const fetchTokenInfo = async (id: string) => {
    const token = await getTokenInfo(id);

    setCurrentToken(token);
  };

  useEffect(() => {
    if (tokenId) {
      fetchTokenInfo(tokenId);
    }
  }, [tokenId]);

  return (
    <div className="flex flex-col justify-center p-10 bg-white rounded-lg shadow-md border border-gray-400">
      <div className="prod-title">
        <p className="text-2xl uppercase text-gray-900 font-bold">
          Current NFT - {currentToken?.token.name || "Untitled"}(
          {currentToken?.token.symbol})
        </p>
        <p className="uppercase text-sm text-gray-400">ID: {tokenId}</p>
      </div>
      <div className="prod-img h-auto flex justify-center items-center">
        <img
          src="https://unsplash.com/photos/IJjfPInzmdk/download?force=true&w=1920"
          className="w-1/4 object-cover object-center"
        />
      </div>
      <div className="prod-info grid gap-10">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-900">
          <button className="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
            Pause/Unpause
          </button>
          <button className="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
            Wipe
          </button>
          <button className="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
            Delete
          </button>
          <button className="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
            Mint a New NFT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
