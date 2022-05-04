import ItemCard from "./components/ItemCard";
import UserCard from "./components/UserCard";

function App() {
  return (
    <div className="App">
      <div className="flex justify-center items-center w-screen h-screen">
        <div className="w-11/12 h-5/6 md:w-9/12 md:h-5/6 overflow-y-auto flex flex-col">
          <div className="w-full">
            <ItemCard />
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
