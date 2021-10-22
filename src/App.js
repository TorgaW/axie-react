import "./App.css";
import { PageHolder, Header, Content, Footer } from "./Base";
import { UIStore } from "./UIStore";

function TableCellComponent(props) {
  /*

  @param props.order - order in table
  @param props.content - cells text

  scheme for props.content:

  {
    name: 'name_1',
    team: 'team_1',
    formation: 'formation_1',
    slp: 100,
    slpDailyLimit: 100,
    slpPerDay: 100,
    slpManager: 10,
    slpManagerPerc: 10,
    nextClaim: (new Date()).toISOString().slice(0,10),
    qualityTracker: 0,
    telegram: '@hello',
  }

  */

  const axieTable = UIStore.useState((s) => s.axieTable);

  function RemoveFromTable() {
    console.log(axieTable);
    console.log(props.id);

    UIStore.update((s) => {
      s.axieTable.splice(props.id - 1, 1);
    });
  }

  return (
    <tr className="h-20 border-4 border-blue-300">
      <td className="font-bold">{props.order ?? "?"}</td> {/* # */}
      <td>{props.content ? props.content.name : "?"}</td> {/* player name */}
      <td className="flex justify-center pt-2">
        <img width="50" height="50" src={"axie-avatar.jpg"} alt="" /> {/* Avatar */}
      </td>
      <td>{props.content ? props.content.team : ""}</td> {/* Team */}
      <td>{props.content ? props.content.formation : "?"}</td> {/* Axie formation */}
      <td className="text-green-500 font-bold">{props.content ? props.content.slp : "?"}</td> {/* SLP*/}
      <td>{props.content ? props.content.slpDailyLimit : "?"}</td> {/* Daily SLP Limit*/}
      <td>{props.content ? props.content.slpPerDay : "?"}</td> {/* SLP/day */}
      <td>{(props.content ? props.content.slpManager : "?") + " (" + (props.content ? props.content.slpManagerPerc : "?") + "%)" /*0 (0%)*/}</td>{" "}
      {/* Manager SLP */}
      <td>{props.content ? props.content.nextClaim : "?"}</td> {/* Next Claim */}
      <td>{props.content ? props.content.qualityTracker : "?"}</td> {/* Quality Tracker */}
      <td>{props.content ? props.content.telegram : "?"}</td> {/* Telegram */}
      <td>
        <button
          onClick={RemoveFromTable}
          className="border-gray-900 border-2 p-1 px-3 hover:bg-red-500 bg-blue-100 transition-all duration-150 font-bold rounded-lg"
        >
          X
        </button>
      </td>
    </tr>
  );
}

function TilesComponent() {
  return (
    <div className="md:w-11/12 w-full mt-10 self-center grid grid-rows-4 grid-cols-2 md:grid-rows-2 md:grid-cols-4 gap-2">
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Total Unclaimed</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white mt-auto">{"0"} SLP</h3>
        <h5 className="w-full text-center md:text-xl text-green-400 mt-auto">{"0.00"}$</h5>
      </div>
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Manager Unclaimed</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white mt-auto">{"0"} SLP</h3>
        <h5 className="w-full text-center md:text-xl text-green-400 mt-auto">{"0.00"}$</h5>
      </div>
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Average Daily SLP</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white mt-auto">{"0"} SLP</h3>
        <h5 className="w-full text-center md:text-xl text-green-400 mt-auto">{"0.00"}$</h5>
      </div>
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Manager SLP Ready</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white mt-auto">{"0"} SLP</h3>
        <h5 className="w-full text-center md:text-xl text-green-400 mt-auto">{"0.00"}$</h5>
      </div>
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4 pb-10">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Arena MVP</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white my-auto">{"NAME"}</h3>
      </div>
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4 pb-10">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Claims ready</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white my-auto">{"COUNT"}</h3>
      </div>
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Claims in Next 24h</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white mt-auto">{"0"} SLP</h3>
        <h5 className="w-full text-center md:text-xl text-green-400 mt-auto">{"0.00"}$</h5>
      </div>
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Manager SLP Next 24h</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white mt-auto">{"0"} SLP</h3>
        <h5 className="w-full text-center md:text-xl text-green-400 mt-auto">{"0.00"}$</h5>
      </div>
    </div>
  );
}

function TableComponent(props) {
  let tableCells = [];
  let counter = 1;

  if (props.content) {
    for (const i of props.content) {
      tableCells.push(
        <TableCellComponent
          content={{
            name: i.name,
            team: i.team,
            formation: i.formation,
            slp: i.slp,
            slpDailyLimit: i.slpDailyLimit,
            slpPerDay: i.slpPerDay,
            slpManager: i.slpManager,
            slpManagerPerc: i.slpManagerPerc,
            nextClaim: i.nextClaim,
            qualityTracker: i.qualityTracker,
            telegram: i.telegram,
          }}
          order={counter}
          id={counter}
          key={counter}
        />
      );

      counter++;
    }
  }

  return (
    <div className="mt-10 md:w-11/12 w-full self-center overflow-x-auto">
      <table
        className="table table-auto w-full"
        style={{
          minWidth: 1200,
        }}
      >
        <thead>
          <tr className="border-t-2 border-b-2 h-12 bg-blue-300 text-xl text-center">
            <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
              #
            </th>
            <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
              Name
            </th>
            <th className="border-4 border-blue-300 cursor-default">Avatar</th>
            <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
              Team
            </th>
            <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
              Axies Formation
            </th>
            <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
              SLP
            </th>
            <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
              Daily SLP Limit
            </th>
            <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
              SLP/day
            </th>
            <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
              Manager SLP
            </th>
            <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
              Next Claim
            </th>
            <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
              Quality Tracker
            </th>
            <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
              Telegram
            </th>
            <th className="border-4 border-blue-300 cursor-default">Remove</th>
          </tr>
        </thead>
        <tbody className="text-center text-lg">{tableCells}</tbody>
      </table>
    </div>
  );
}

function TableControlComponent() {

  //stopped here at 23:10
  //
  //Friday, October 22, 2021

  function AddNewPlayer() {
    let fields = document.querySelectorAll('[id$="-inp"]');
    console.log(fields);
    UIStore.update((s) => {
      s.axieTable.push();
    });
  }

  return (
    <>
      <div className="md:w-11/12 w-full mt-10 self-center flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-2">
        <div className="flex items-center h-10 w-full">
          <label htmlFor="name-inp" className="pr-2 text-left font-bold text-lg lg:w-auto w-40">
            Name:
          </label>
          <input
            id="name-inp"
            placeholder="Name"
            type="text"
            className="border-2 h-full min-w-0 rounded-lg px-2 border-blue-300 transition-all duration-150 hover:border-blue-600 focus:border-purple-900 outline-none"
          />
        </div>
        <div className="flex items-center h-10 mt-1">
          <label htmlFor="ronin-inp" className="pr-2 text-left font-bold text-lg lg:w-auto w-40">
            Ronin:
          </label>
          <input
            id="ronin-inp"
            placeholder="ronin:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            type="text"
            className="border-2 h-full min-w-0 rounded-lg px-2 border-blue-300 transition-all duration-150 hover:border-blue-600 focus:border-purple-900 outline-none"
          />
        </div>
        <div className="flex items-center h-10 mt-1">
          <label htmlFor="managerperc-inp" className="pr-2 text-left font-bold text-lg lg:w-auto w-40">
            Manager %:
          </label>
          <input
            id="managerperc-inp"
            placeholder="30"
            type="text"
            className="border-2 h-full min-w-0 rounded-lg px-2 border-blue-300 transition-all duration-150 hover:border-blue-600 focus:border-purple-900 outline-none"
          />
        </div>
        <div className="flex items-center h-10 mt-1">
          <label htmlFor="slp-limit-inp" className="pr-2 text-left font-bold text-lg w-40">
            Daily SLP Limit:
          </label>
          <input
            id="slp-limit-inp"
            placeholder="100"
            type="text"
            className="border-2 h-full min-w-0 rounded-lg px-2 border-blue-300 transition-all duration-150 hover:border-blue-600 focus:border-purple-900 outline-none"
          />
        </div>
      </div>
      <button
        onClick={AddNewPlayer}
        className="w-40 h-12 bg-green-400 self-center mt-10 rounded-lg font-bold text-lg transition-all duration-150 hover:bg-green-500 hover:text-white"
      >
        Add player
      </button>
    </>
  );
}

function App() {
  const axieTable = UIStore.useState((s) => s.axieTable);

  return (
    <PageHolder>
      <Header>
        <div className="w-48 h-auto md:container md:ml-4">
          <p className="font-bold text-white text-4xl leading-none">
            AXIE<span className="text-xl text-black leading-none">Dashboard</span>
          </p>
          <p className=" font-thin text-white text-lg leading-none ml-4">infinity</p>
          <div className="hidden fixed bg-pink-900 w-full h-40 bottom-0 left-0"></div>
        </div>
      </Header>
      <Content>
        <div className="w-full h-full flex flex-col overflow-x-hidden">
          <h1 className="md:text-6xl text-4xl font-semibold text-center mt-10">Scholarship Manager Tools</h1>
          <h2 className="md:text-2xl text-xl text-center mt-6 md:mt-10">Take control of your scholarship program by tracking performance</h2>
          <div className="slp-element flex flex-row items-center self-center mt-10">
            <img src="slp-bottle.png" alt="slp" srcSet="" className="h-16 w-16" />
            <p className="text-xl font-bold"> 1 SLP = ${"0.00000"}</p>
          </div>
          <p className="text-xl font-bold mt-4 text-center">Players online: {"0"}</p>
          <TilesComponent></TilesComponent>
          <TableComponent content={axieTable}></TableComponent>
          <div className="my-10 h-0.5 md:w-11/12 w-full self-center border-blue-300" style={{ borderWidth: 1 }}></div>
          <h2 className="md:text-4xl text-2xl text-center font-bold">Add new player</h2>
          <TableControlComponent></TableControlComponent>
        </div>
      </Content>
      <Footer>
        <div className="w-full h-full px-10 py-2 flex justify-center items-center text-gray-300">
          <p>© 2021 Copyright</p>
        </div>
      </Footer>
    </PageHolder>
  );
}

export default App;
