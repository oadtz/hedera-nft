import { useEffect, useState } from "react";
import ItemCard from "./components/ItemCard";
import UserCard from "./components/UserCard";
import { account, checkBalance } from "./libs/hashgraph";

function App() {
  const [tokenId, setTokenId] = useState("");

  const fetchLatestToken = async () => {
    const treasuryBalance = await checkBalance(account.treasury);
    const latestTokenId = Array.from(
      treasuryBalance.tokens?._map || []
    )?.[0]?.[0];

    console.log(latestTokenId);
    if (latestTokenId) {
      setTokenId(latestTokenId);
    }
  };

  useEffect(() => {
    fetchLatestToken();
  }, []);

  return (
    <div className="App">
      <div className="flex justify-center items-center w-screen min-h-screen">
        <div className="w-11/12 h-5/6 md:w-9/12 flex flex-col">
          <div className="w-full">
            <ItemCard tokenId={tokenId} />
          </div>
          <div className="w-full flex">
            <div className="w-1/3 flex justify-start items-start">
              <UserCard />
            </div>
            <div className="w-1/3 flex justify-center items-center">
              <UserCard />
            </div>
            <div className="w-1/3 flex justify-end items-end">
              <UserCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
