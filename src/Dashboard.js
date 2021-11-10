import { Header, Content, Footer } from "./Base";
import React from "react";
import { UIStore } from "./UIStore";
import { LoadingComponent } from "./LoadingComponent";
import {
  formatRFC7231,
  add,
  sub,
  compareDesc,
  compareAsc,
  fromUnixTime,
  format,
  toDate,
  parseISO,
  differenceInDays,
  getDayOfYear,
  closestIndexTo,
} from "date-fns";
import { Line, Bar } from "react-chartjs-2";

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

  let axieTable = UIStore.useState((s) => s.axieTable);
  let getPlayerInfo = UIStore.useState((s) => s.getPlayerInfo);

  function RemoveFromTable() {
    fetch("/api/deleteTracker", {
      method: "POST",
      body: JSON.stringify({ ronin: axieTable[props.id - 1].ronin, userName: axieTable[props.id - 1].name }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        console.log(data);
        UIStore.update((s) => {
          s.selectedPlayer = -1;
        });

        UIStore.update((s) => {
          s.axieTable.splice(props.id - 1, 1);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function HandleUploadImage(e) {
    let file = e.target.files[0];
    if (!file) {
      return;
    }
    let a = file.name.split(".");
    let size = file.size / 1024 / 1024;
    if (size > 1.5) {
      alert(`Maximum size is 1.5 MB!`);
      return;
    } else {
      let t = document.getElementById("quest-name");
      console.log(props);
      Object.defineProperty(file, "name", {
        writable: true,
        value: props.content.ronin + "." + a[a.length - 1],
      });
    }
    let form = new FormData();
    form.append("file", file, file.name);

    fetch("/api/changeAvatar", {
      method: "POST",
      body: form,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <tr className="h-20 border-4 border-blue-300">
      <input onChange={HandleUploadImage} id={"ava-inp-" + props.order} className="hidden" type="file" />
      <td className="font-bold">{props.order ?? "?"}</td> {/* # */}
      <td
        onClick={() => {
          if (axieTable.selectedPlayer !== props.id - 1) {
            UIStore.update((s) => {
              s.selectedPlayer = props.id - 1;
            });
            props.getPlayerInfo(axieTable[props.id - 1].ronin, props.id - 1);
          }
        }}
        className="text-purple-500 font-bold hover:text-purple-900 cursor-pointer"
      >
        {props.content ? props.content.name : "?"}
      </td>{" "}
      {/* player name */}
      <td className="flex justify-center pt-2">
        <img
          onClick={() => {
            document.getElementById("ava-inp-" + props.order).click();
          }}
          width="50"
          height="50"
          className="rounded-full border-2 border-purple-800 cursor-pointer"
          src={axieTable[props.id - 1].axieAvatar}
          alt=""
        />{" "}
        {/* Avatar */}
      </td>
      <td>{props.content ? props.content.team : ""}</td> {/* Team */}
      <td>{props.content ? props.content.formation : "?"}</td> {/* Axie formation */}
      <td className="text-green-500 font-bold">{props.content ? props.content.slp : "?"}</td> {/* SLP*/}
      <td>{props.content ? props.content.slpDailyLimit : "?"}</td> {/* Daily SLP Limit*/}
      <td>{props.content ? props.content.slpPerDay : "?"}</td> {/* SLP/day */}
      <td>{(props.content ? props.content.slpManager : "?") + " (" + (props.content ? props.content.slpManagerPerc : "?") + "%)" /*0 (0%)*/}</td>{" "}
      {/* Manager SLP */}
      <td style={{ maxWidth: "200px" }}>{props.content ? formatRFC7231(props.content.nextClaim) : "?"}</td> {/* Next Claim */}
      <td className="">
        {/*props.content ? props.content.qualityTracker : "?"*/}
        <div className={"h-4 w-full flex justify-center"}>
          <div
            className={
              "w-4 h-4 custom-bg-" +
              (props.content
                ? props.content.qualityTracker === 0
                  ? "green"
                  : props.content.qualityTracker === 1
                  ? "yellow"
                  : props.content.qualityTracker === 2
                  ? "red"
                  : "gray"
                : "black")
            }
          ></div>
        </div>
      </td>
      {/* Quality Tracker */}
      {/*<td>{props.content ? props.content.telegram : "?"}</td>  Telegram */}
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
  let axieTable = UIStore.useState((s) => s.axieTable);
  let slpToDollar = UIStore.useState((s) => s.slpToDollar);
  let totalSLP = 0;
  let totalManager = 0;
  let totalSlpPerDay = 0;
  let maxMMR = { p: "", s: 0 };

  console.log("tiles", axieTable);

  for (const i of axieTable) {
    totalSLP += i.slp;
    totalManager += i.slpManager;
    totalSlpPerDay += i.slpPerDay;
    if (i.mmr > maxMMR.s) {
      maxMMR = { p: i.name, s: i.mmr };
    }
  }

  return (
    <div className="md:w-11/12 w-full mt-10 self-center grid grid-rows-4 grid-cols-2 md:grid-rows-2 md:grid-cols-4 gap-2">
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Total Unclaimed</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white mt-auto">{totalSLP} SLP</h3>
        <h5 className="w-full text-center md:text-xl text-green-400 mt-auto">{(totalSLP * slpToDollar).toFixed(2)}$</h5>
      </div>
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Manager Unclaimed</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white mt-auto">{totalManager} SLP</h3>
        <h5 className="w-full text-center md:text-xl text-green-400 mt-auto">{(totalManager * slpToDollar).toFixed(2)}$</h5>
      </div>
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Average Daily SLP</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white mt-auto">{axieTable.length ? totalSlpPerDay / axieTable.length : 0} SLP</h3>
        <h5 className="w-full text-center md:text-xl text-green-400 mt-auto">
          {((axieTable.length ? totalSlpPerDay / axieTable.length : 0) * slpToDollar).toFixed(2)}$
        </h5>
      </div>
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Manager SLP Ready</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white mt-auto">{"0"} SLP</h3>
        <h5 className="w-full text-center md:text-xl text-green-400 mt-auto">{"0.00"}$</h5>
      </div>
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4 pb-10">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Arena MVP</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white my-auto">{maxMMR.p}</h3>
      </div>
      <div className="bg-gray-900 w-full h-40 md:h-56 rounded-lg flex flex-col p-4 pb-10">
        <h5 className="w-full text-center md:text-xl text-yellow-500">Claims ready</h5>
        <h3 className="w-full text-center md:text-4xl text-2xl text-white my-auto">{"0"}</h3>
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
  /*

  sorts:
  1) id
  2) id-reversed
  3) name
  4) name-reversed
  5) team
  6) team-reversed
  7) formation
  8) formation-reversed
  9) slp
  10) slp-reversed
  11) slplimit
  12) slplimit-reversed
  13) slpday
  14) slpday-reversed
  15) slpmanager
  16) slpmanager-reversed
  17) time
  18) time-reversed
  19) quality
  20) quality-reversed

  */
  const [sortOrder, setSortOrder] = React.useState("id");

  let tableCells = [];
  let copyPropsContent = props.content;
  let counter = 1;

  function FillTableCells() {
    console.log("cellss", copyPropsContent);
    for (const i of copyPropsContent) {
      tableCells.push(
        <TableCellComponent
          content={{
            name: i.name,
            gameName: i.name.split(" | "),
            team: i.team,
            formation: i.formation,
            slp: i.slp,
            slpDailyLimit: i.slpDailyLimit,
            slpPerDay: i.slpPerDay,
            slpManager: i.slpManager,
            slpManagerPerc: i.slpManagerPerc,
            nextClaim: i.nextClaim,
            qualityTracker: i.qualityTracker,
            avatar: i.axieAvatar,
            ronin: i.ronin,
          }}
          order={counter}
          id={counter}
          key={counter}
          getPlayerInfo={props.getPlayerInfo}
        />
      );
      counter++;
    }
  }

  if (props.content) {
    switch (sortOrder) {
      case "id":
        FillTableCells();
        break;
      case "id-reversed":
        FillTableCells();
        tableCells.reverse();
        break;
      case "name":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.name.localeCompare(b.props.content.name));
        break;
      case "name-reversed":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.name.localeCompare(b.props.content.name));
        tableCells.reverse();
        break;
      case "team":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.team.localeCompare(b.props.content.team));
        break;
      case "team-reversed":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.team.localeCompare(b.props.content.team));
        tableCells.reverse();
        break;
      case "formation":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.formation.localeCompare(b.props.content.formation));
        break;
      case "formation-reversed":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.formation.localeCompare(b.props.content.formation));
        tableCells.reverse();
        break;
      case "slp-reversed":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.slp - b.props.content.slp);
        break;
      case "slp":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.slp - b.props.content.slp);
        tableCells.reverse();
        break;
      case "slplimit":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.slpDailyLimit - b.props.content.slpDailyLimit);
        break;
      case "slplimit-reversed":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.slpDailyLimit - b.props.content.slpDailyLimit);
        tableCells.reverse();
        break;
      case "slpday":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.slpPerDay - b.props.content.slpPerDay);
        break;
      case "slpday-reversed":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.slpPerDay - b.props.content.slpPerDay);
        tableCells.reverse();
        break;
      case "slpmanager":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.slpManager - b.props.content.slpManager);
        break;
      case "slpmanager-reversed":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.slpManager - b.props.content.slpManager);
        tableCells.reverse();
        break;
      case "time":
        FillTableCells();
        tableCells.sort((a, b) => {
          let da = new Date(a.props.content.nextClaim);
          let db = new Date(b.props.content.nextClaim);
          return da - db;
        });
        break;
      case "time-reversed":
        FillTableCells();
        tableCells.sort((a, b) => {
          let da = new Date(a.props.content.nextClaim);
          let db = new Date(b.props.content.nextClaim);
          return da - db;
        });
        tableCells.reverse();
        break;
      case "quality":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.qualityTracker - b.props.content.qualityTracker);
        break;
      case "quality-reversed":
        FillTableCells();
        tableCells.sort((a, b) => a.props.content.qualityTracker - b.props.content.qualityTracker);
        tableCells.reverse();
        break;
      default:
        break;
    }
  }

  function SortByOrder() {
    sortOrder === "id" ? setSortOrder("id-reversed") : setSortOrder("id");
  }

  function SortByName() {
    sortOrder === "name" ? setSortOrder("name-reversed") : setSortOrder("name");
  }

  function SortByTeam() {
    sortOrder === "team" ? setSortOrder("team-reversed") : setSortOrder("team");
  }

  function SortByFormation() {
    sortOrder === "formation" ? setSortOrder("formation-reversed") : setSortOrder("formation");
  }

  function SortBySlp() {
    sortOrder === "slp" ? setSortOrder("slp-reversed") : setSortOrder("slp");
  }

  function SortBySlpLimit() {
    sortOrder === "slplimit" ? setSortOrder("slplimit-reversed") : setSortOrder("slplimit");
  }

  function SortBySlpDay() {
    sortOrder === "slpday" ? setSortOrder("slpday-reversed") : setSortOrder("slpday");
  }

  function SortBySlpManager() {
    sortOrder === "slpmanager" ? setSortOrder("slpmanager-reversed") : setSortOrder("slpmanager");
  }

  function SortByTime() {
    sortOrder === "time" ? setSortOrder("time-reversed") : setSortOrder("time");
  }

  function SortByQuality() {
    sortOrder === "quality" ? setSortOrder("quality-reversed") : setSortOrder("quality");
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
            <th
              onClick={SortByOrder}
              className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300"
            >
              &nbsp;&nbsp;#&nbsp;&nbsp;
            </th>
            <th
              onClick={SortByName}
              className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300"
            >
              Name
            </th>
            <th className="border-4 border-blue-300 cursor-default">Avatar</th>
            <th
              onClick={SortByTeam}
              className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300"
            >
              Team
            </th>
            <th
              onClick={SortByFormation}
              className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300"
            >
              Axies Formation
            </th>
            <th
              onClick={SortBySlp}
              className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300"
            >
              &nbsp;&nbsp;&nbsp;SLP&nbsp;&nbsp;&nbsp;
            </th>
            <th
              onClick={SortBySlpLimit}
              className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300"
            >
              Daily SLP Limit
            </th>
            <th
              onClick={SortBySlpDay}
              className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300"
            >
              SLP/day
            </th>
            <th
              onClick={SortBySlpManager}
              className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300"
            >
              Manager SLP
            </th>
            <th
              onClick={SortByTime}
              className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300"
            >
              Next Claim
            </th>
            <th
              onClick={SortByQuality}
              className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300"
            >
              Quality Tracker
            </th>
            {/*<th className="border-4 border-blue-300 cursor-default">
              Telegram
            </th>*/}
            <th className="border-4 border-blue-300 cursor-default">Remove</th>
          </tr>
        </thead>
        <tbody className="text-center text-lg">{tableCells}</tbody>
      </table>
    </div>
  );
}

function TableControlComponent() {
  function AddNewPlayer() {
    let fields = document.querySelectorAll('[id$="-inp"]');
    console.log(fields);

    if (fields && fields.length < 4) {
      return;
    }

    let name = fields[0].value;
    let ronin = fields[1].value;
    let perc = fields[2].value;
    let limit = fields[3].value;

    if (
      name.trim().length < 1 ||
      ronin.trim().length !== 46 ||
      perc.trim().length < 1 ||
      limit.trim().length < 1 ||
      !ronin.split(":")[1] ||
      !/^\d+$/.test(perc) ||
      !/^\d+$/.test(limit)
    ) {
      return;
    }

    function addPlayer(arg) {
      UIStore.update((s) => {
        s.axieTable = [...s.axieTable, arg];
      });
    }

    fetch("/api/addTracker", {
      method: "POST",
      body: JSON.stringify({ name: name, ronin: ronin.split(":")[1], percentage: perc, limit: limit }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        console.log("addtracker", data);
        let i = data.status;
        addPlayer({
          name: name,
          gameName: i.name.split(" | "),
          team: "N/A",
          formation: "N/A",
          slp: i.in_game_slp,
          slpDailyLimit: limit,
          slpPerDay: 0,
          slpManager: i.in_game_slp * perc * 0.01,
          slpManagerPerc: perc,
          nextClaim: fromUnixTime(i.next_claim),
          qualityTracker: 3,
          mmr: i.mmr,
          telegram: "",
          notifies: "",
          ronin: ronin.split(":")[1],
          axies: {},
          axieAvatar: i.avatar ?? "placeholder-avatar.png",
          axiesLoaded: 0,
          source: i,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("new player");
  }

  return (
    <>
      <div className="md:w-11/12 w-full mt-10 self-center flex flex-col">
        <div className="flex items-center h-10 w-full">
          <label htmlFor="name-inp" className="pr-2 text-left font-bold text-lg w-40">
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
          <label htmlFor="ronin-inp" className="pr-2 text-left font-bold text-lg w-40">
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
          <label htmlFor="managerperc-inp" className="pr-2 text-left font-bold text-lg w-40">
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
        {/* <div className="flex items-center h-10 mt-1">
          <label htmlFor="slp-limit-inp" className="pr-2 text-left font-bold text-lg w-40">
            Team:
          </label>
          <input
            id="team-inp"
            placeholder="Team name"
            type="text"
            className="border-2 h-full min-w-0 rounded-lg px-2 border-blue-300 transition-all duration-150 hover:border-blue-600 focus:border-purple-900 outline-none"
          />
        </div>
        <div className="flex items-center h-10 mt-1">
          <label htmlFor="slp-limit-inp" className="pr-2 text-left font-bold text-lg w-40">
            Formation:
          </label>
          <input
            id="formation-inp"
            placeholder="Formation name"
            type="text"
            className="border-2 h-full min-w-0 rounded-lg px-2 border-blue-300 transition-all duration-150 hover:border-blue-600 focus:border-purple-900 outline-none"
          />
        </div> */}
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

function PlayerCardContentProvider(props) {
  const [fetchedAllInfoAboutPlayer, setFetchedAllInfoAboutPlayer] = React.useState(false);
  const [allPlayerInfo, setAllPlayerInfo] = React.useState(undefined);
  const [SLPData, setSLPData] = React.useState({
    type: "today",
    data: {
      labels: [],
      datasets: [
        {
          label: "SLP",
          data: [],
          fill: false,
          backgroundColor: "rgb(40,144,146)",
          borderColor: "rgba(40,144,146, 0.3)",
        },
      ],
    },
  });
  const [SLPDataGraphType, setSLPDataGraphType] = React.useState(1);

  const [MMRData, setMMRData] = React.useState({
    type: "today",
    data: {
      labels: [],
      datasets: [
        {
          label: "MMR",
          data: [],
          fill: false,
          backgroundColor: "rgb(40,144,146)",
          borderColor: "rgba(40,144,146, 0.3)",
        },
      ],
    },
  });
  const [MMRDataGraphType, setMMRDataGraphType] = React.useState(1);

  const [LIMITData, setLIMITData] = React.useState({
    type: "today",
    data: {
      labels: [],
      datasets: [
        {
          label: "%",
          data: [],
          fill: false,
          backgroundColor: "rgb(40,144,146)",
          borderColor: "rgba(52, 211, 153, 0.3)",
        },
      ],
    },
  });
  const [LIMITDataGraphType, setLIMITDataGraphType] = React.useState(1);

  let roninCache = UIStore.useState((s) => s.roninCache);

  function ChangeSLPData(newType) {
    if (props.data && allPlayerInfo) {
      let fLabels = [];
      let fData = [];
      switch (newType) {
        case "today":
          setSLPData({
            type: "today",
            data: {
              labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), "MM/dd/yyyy")],
              datasets: [
                {
                  label: "SLP per day",
                  data: [allPlayerInfo[allPlayerInfo.length - 1].slpPerDay],
                  fill: false,
                  backgroundColor: "rgb(40,144,146)",
                  borderColor: "rgba(40,144,146, 0.3)",
                },
              ],
            },
          });
          break;

        case "week":
          fLabels = [];
          fData = [];

          for (let i = allPlayerInfo.length - 1; i >= (allPlayerInfo.length >= 7 ? allPlayerInfo.length - 7 : 0); i--) {
            console.log("test days", allPlayerInfo[i]);
            fLabels.push(format(parseISO(allPlayerInfo[i].date), "MM/dd/yyyy"));
            fData.push(allPlayerInfo[i].slpPerDay);
          }

          setSLPData({
            type: "week",
            data: {
              // labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), 'MM/dd/yyyy')],
              labels: fLabels.reverse(),
              datasets: [
                {
                  label: "SLP per day",
                  data: fData.reverse(),
                  fill: false,
                  backgroundColor: "rgb(40,144,146)",
                  borderColor: "rgba(40,144,146, 0.3)",
                },
              ],
            },
          });
          break;

        case "month":
          fLabels = [];
          fData = [];

          for (let i = allPlayerInfo.length - 1; i >= (allPlayerInfo.length >= 30 ? allPlayerInfo.length - 30 : 0); i--) {
            console.log("test days", allPlayerInfo[i]);
            fLabels.push(format(parseISO(allPlayerInfo[i].date), "MM/dd/yyyy"));
            fData.push(allPlayerInfo[i].slpPerDay);
          }

          setSLPData({
            type: "month",
            data: {
              // labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), 'MM/dd/yyyy')],
              labels: fLabels.reverse(),
              datasets: [
                {
                  label: "SLP per day",
                  data: fData.reverse(),
                  fill: false,
                  backgroundColor: "rgb(40,144,146)",
                  borderColor: "rgba(40,144,146, 0.3)",
                },
              ],
            },
          });
          break;

        case "all":
          fLabels = [];
          fData = [];

          for (let i = allPlayerInfo.length - 1; i >= (allPlayerInfo.length >= 360 * 3 ? allPlayerInfo.length - 360 * 3 : 0); i--) {
            console.log("test days", allPlayerInfo[i]);
            fLabels.push(format(parseISO(allPlayerInfo[i].date), "MM/dd/yyyy"));
            fData.push(allPlayerInfo[i].slpPerDay);
          }

          setSLPData({
            type: "all",
            data: {
              // labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), 'MM/dd/yyyy')],
              labels: fLabels.reverse(),
              datasets: [
                {
                  label: "SLP per day",
                  data: fData.reverse(),
                  fill: false,
                  backgroundColor: "rgb(40,144,146)",
                  borderColor: "rgba(40,144,146, 0.3)",
                },
              ],
            },
          });
          break;

        case "custom":
          fData = [];
          fLabels = [];
          let slpInpFrom = document.getElementById("inp-slp-from");
          let slpInpTo = document.getElementById("inp-slp-to");
          if (slpInpFrom && slpInpTo) {
            let slpCustomTimeFrom = parseISO(slpInpFrom.value);
            let slpCustomTimeTo = parseISO(slpInpTo.value);
            if (!isNaN(slpCustomTimeFrom) && !isNaN(slpCustomTimeTo)) {
              let allDates = [];
              for (const i of allPlayerInfo) {
                allDates.push(parseISO(i.date));
              }

              let start = closestIndexTo(slpCustomTimeFrom, allDates);
              let stop = closestIndexTo(slpCustomTimeTo, allDates);

              for (let i = start; i <= stop; i++) {
                fLabels.push(format(parseISO(allPlayerInfo[i].date), "MM/dd/yyyy"));
                fData.push(allPlayerInfo[i].slpPerDay);
              }

              setSLPData({
                type: "custom",
                data: {
                  // labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), 'MM/dd/yyyy')],
                  labels: fLabels,
                  datasets: [
                    {
                      label: "SLP per day",
                      data: fData,
                      fill: false,
                      backgroundColor: "rgb(40,144,146)",
                      borderColor: "rgba(40,144,146, 0.3)",
                    },
                  ],
                },
              });
            }
          }
          break;

        default:
          break;
      }
    }
  }

  function FirstSetSLPData(data) {
    setSLPData({
      type: "today",
      data: {
        labels: [format(parseISO(data.date), "MM/dd/yyyy")],
        datasets: [
          {
            label: "SLP per day",
            data: [data.slpPerDay],
            fill: false,
            backgroundColor: "rgb(40,144,146)",
            borderColor: "rgba(40,144,146, 0.3)",
          },
        ],
      },
    });
  }

  function ChangeMMRData(newType) {
    if (props.data && allPlayerInfo) {
      let fLabels = [];
      let fData = [];
      switch (newType) {
        case "today":
          setMMRData({
            type: "today",
            data: {
              labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), "MM/dd/yyyy")],
              datasets: [
                {
                  label: "MMR",
                  data: [allPlayerInfo[allPlayerInfo.length - 1].mmrPerDay],
                  fill: false,
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgba(255, 99, 132, 0.2)",
                },
              ],
            },
          });
          break;

        case "week":
          fLabels = [];
          fData = [];

          for (let i = allPlayerInfo.length - 1; i >= (allPlayerInfo.length >= 7 ? allPlayerInfo.length - 7 : 0); i--) {
            console.log("test days", allPlayerInfo[i]);
            fLabels.push(format(parseISO(allPlayerInfo[i].date), "MM/dd/yyyy"));
            fData.push(allPlayerInfo[i].mmrPerDay);
          }

          setMMRData({
            type: "week",
            data: {
              // labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), 'MM/dd/yyyy')],
              labels: fLabels.reverse(),
              datasets: [
                {
                  label: "MMR",
                  data: fData.reverse(),
                  fill: false,
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgba(255, 99, 132, 0.2)",
                },
              ],
            },
          });
          break;

        case "month":
          fLabels = [];
          fData = [];

          for (let i = allPlayerInfo.length - 1; i >= (allPlayerInfo.length >= 30 ? allPlayerInfo.length - 30 : 0); i--) {
            console.log("test days", allPlayerInfo[i]);
            fLabels.push(format(parseISO(allPlayerInfo[i].date), "MM/dd/yyyy"));
            fData.push(allPlayerInfo[i].mmrPerDay);
          }

          setMMRData({
            type: "month",
            data: {
              // labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), 'MM/dd/yyyy')],
              labels: fLabels.reverse(),
              datasets: [
                {
                  label: "MMR",
                  data: fData.reverse(),
                  fill: false,
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgba(255, 99, 132, 0.2)",
                },
              ],
            },
          });
          break;

        case "all":
          fLabels = [];
          fData = [];

          for (let i = allPlayerInfo.length - 1; i >= (allPlayerInfo.length >= 360 * 3 ? allPlayerInfo.length - 360 * 3 : 0); i--) {
            console.log("test days", allPlayerInfo[i]);
            fLabels.push(format(parseISO(allPlayerInfo[i].date), "MM/dd/yyyy"));
            fData.push(allPlayerInfo[i].mmrPerDay);
          }

          setMMRData({
            type: "all",
            data: {
              // labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), 'MM/dd/yyyy')],
              labels: fLabels.reverse(),
              datasets: [
                {
                  label: "MMR",
                  data: fData.reverse(),
                  fill: false,
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgba(255, 99, 132, 0.2)",
                },
              ],
            },
          });
          break;

        case "custom":
          fData = [];
          fLabels = [];
          let slpInpFrom = document.getElementById("inp-mmr-from");
          let slpInpTo = document.getElementById("inp-mmr-to");
          if (slpInpFrom && slpInpTo) {
            let slpCustomTimeFrom = parseISO(slpInpFrom.value);
            let slpCustomTimeTo = parseISO(slpInpTo.value);
            if (!isNaN(slpCustomTimeFrom) && !isNaN(slpCustomTimeTo)) {
              let allDates = [];
              for (const i of allPlayerInfo) {
                allDates.push(parseISO(i.date));
              }

              let start = closestIndexTo(slpCustomTimeFrom, allDates);
              let stop = closestIndexTo(slpCustomTimeTo, allDates);

              for (let i = start; i <= stop; i++) {
                fLabels.push(format(parseISO(allPlayerInfo[i].date), "MM/dd/yyyy"));
                fData.push(allPlayerInfo[i].mmrPerDay);
              }

              setMMRData({
                type: "custom",
                data: {
                  // labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), 'MM/dd/yyyy')],
                  labels: fLabels,
                  datasets: [
                    {
                      label: "MMR",
                      data: fData,
                      fill: false,
                      backgroundColor: "rgb(255, 99, 132)",
                      borderColor: "rgba(255, 99, 132, 0.2)",
                    },
                  ],
                },
              });
            }
          }
          break;

        default:
          break;
      }
    }
  }

  function FirstSetMMRData(data) {
    setMMRData({
      type: "today",
      data: {
        labels: [format(parseISO(data.date), "MM/dd/yyyy")],
        datasets: [
          {
            label: "MMR",
            data: [data.mmrPerDay],
            fill: false,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgba(52, 211, 153, 0.3)",
          },
        ],
      },
    });
  }

  function ChangeLIMITData(newType) {
    if (props.data && allPlayerInfo) {
      let fLabels = [];
      let fData = [];
      switch (newType) {
        case "today":
          setLIMITData({
            type: "today",
            data: {
              labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), "MM/dd/yyyy")],
              datasets: [
                {
                  label: "%",
                  data: [((allPlayerInfo[allPlayerInfo.length - 1].slpPerDay / allPlayerInfo[allPlayerInfo.length - 1].dailySlpLimit) * 100).toFixed(1)],
                  fill: false,
                  backgroundColor: "rgb(52, 211, 153)",
                  borderColor: "rgba(52, 211, 153, 0.3)",
                },
              ],
            },
          });
          break;

        case "week":
          fLabels = [];
          fData = [];

          for (let i = allPlayerInfo.length - 1; i >= (allPlayerInfo.length >= 7 ? allPlayerInfo.length - 7 : 0); i--) {
            console.log("test days", allPlayerInfo[i]);
            fLabels.push(format(parseISO(allPlayerInfo[i].date), "MM/dd/yyyy"));
            fData.push(((allPlayerInfo[i].slpPerDay / allPlayerInfo[i].dailySlpLimit) * 100).toFixed(1));
          }

          setLIMITData({
            type: "week",
            data: {
              // labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), 'MM/dd/yyyy')],
              labels: fLabels.reverse(),
              datasets: [
                {
                  label: "%",
                  data: fData.reverse(),
                  fill: false,
                  backgroundColor: "rgb(52, 211, 153)",
                  borderColor: "rgba(52, 211, 153, 0.3)",
                },
              ],
            },
          });
          break;

        case "month":
          fLabels = [];
          fData = [];

          for (let i = allPlayerInfo.length - 1; i >= (allPlayerInfo.length >= 30 ? allPlayerInfo.length - 30 : 0); i--) {
            console.log("test days", allPlayerInfo[i]);
            fLabels.push(format(parseISO(allPlayerInfo[i].date), "MM/dd/yyyy"));
            fData.push(((allPlayerInfo[i].slpPerDay / allPlayerInfo[i].dailySlpLimit) * 100).toFixed(1));
          }

          setLIMITData({
            type: "month",
            data: {
              // labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), 'MM/dd/yyyy')],
              labels: fLabels.reverse(),
              datasets: [
                {
                  label: "%",
                  data: fData.reverse(),
                  fill: false,
                  backgroundColor: "rgb(52, 211, 153)",
                  borderColor: "rgba(52, 211, 153, 0.3)",
                },
              ],
            },
          });
          break;

        case "all":
          fLabels = [];
          fData = [];

          for (let i = allPlayerInfo.length - 1; i >= (allPlayerInfo.length >= 360 * 3 ? allPlayerInfo.length - 360 * 3 : 0); i--) {
            console.log("test days", allPlayerInfo[i]);
            fLabels.push(format(parseISO(allPlayerInfo[i].date), "MM/dd/yyyy"));
            fData.push(((allPlayerInfo[i].slpPerDay / allPlayerInfo[i].dailySlpLimit) * 100).toFixed(1));
          }

          setLIMITData({
            type: "all",
            data: {
              // labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), 'MM/dd/yyyy')],
              labels: fLabels.reverse(),
              datasets: [
                {
                  label: "%",
                  data: fData.reverse(),
                  fill: false,
                  backgroundColor: "rgb(52, 211, 153)",
                  borderColor: "rgba(52, 211, 153, 0.3)",
                },
              ],
            },
          });
          break;

        case "custom":
          fData = [];
          fLabels = [];
          let slpInpFrom = document.getElementById("inp-limit-from");
          let slpInpTo = document.getElementById("inp-limit-to");
          if (slpInpFrom && slpInpTo) {
            let slpCustomTimeFrom = parseISO(slpInpFrom.value);
            let slpCustomTimeTo = parseISO(slpInpTo.value);
            if (!isNaN(slpCustomTimeFrom) && !isNaN(slpCustomTimeTo)) {
              let allDates = [];
              for (const i of allPlayerInfo) {
                allDates.push(parseISO(i.date));
              }

              let start = closestIndexTo(slpCustomTimeFrom, allDates);
              let stop = closestIndexTo(slpCustomTimeTo, allDates);

              for (let i = start; i <= stop; i++) {
                fLabels.push(format(parseISO(allPlayerInfo[i].date), "MM/dd/yyyy"));
                fData.push(((allPlayerInfo[i].slpPerDay / allPlayerInfo[i].dailySlpLimit) * 100).toFixed(1));
              }

              setLIMITData({
                type: "custom",
                data: {
                  // labels: [format(parseISO(allPlayerInfo[allPlayerInfo.length - 1].date), 'MM/dd/yyyy')],
                  labels: fLabels,
                  datasets: [
                    {
                      label: "%",
                      data: fData,
                      fill: false,
                      backgroundColor: "rgb(52, 211, 153)",
                      borderColor: "rgba(52, 211, 153, 0.3)",
                    },
                  ],
                },
              });
            }
          }
          break;

        default:
          break;
      }
    }
  }

  function FirstSetLIMITData(data) {
    console.log("object,,", ((data.slpPerDay / data.dailySlpLimit) * 100).toFixed(1));
    setLIMITData({
      type: "today",
      data: {
        labels: [format(parseISO(data.date), "MM/dd/yyyy")],
        datasets: [
          {
            label: "%",
            data: [((data.slpPerDay / data.dailySlpLimit) * 100).toFixed(1)],
            fill: false,
            backgroundColor: "rgb(52, 211, 153)",
            borderColor: "rgba(52, 211, 153, 0.3)",
          },
        ],
      },
    });
  }

  if (props.data) {
    switch (props.id) {
      case 0:
        let axies = props.data.axies;
        return (
          <>
            <div className="flex flex-wrap justify-center mt-4">
              <div
                className="w-80 m-4 flex flex-col justify-center items-center border-2 border-purple-500 rounded-lg hover:border-purple-800 transition-all duration-150"
                style={{ height: "26rem" }}
              >
                <h3 className="font-bold text-xl text-purple-400">
                  <span className="text-purple-800 text-2xl">{axies[0].name.split(" | ")[0]}</span>
                  {" #" + axies[0].id}
                </h3>
                <h5 className="font-bold text-xl bg-purple-100 w-full text-center">Breed count: {axies[0].breedCount}</h5>
                <div className="w-full h-10 flex items-center justify-between px-1 font-bold">
                  <p className="bg-green-200 rounded-lg px-1">{"HP: " + axies[0].stats.hp}</p>
                  <p className="bg-yellow-300 rounded-lg px-1">{"Speed: " + axies[0].stats.speed}</p>
                  <p className="bg-purple-400 rounded-lg px-1">{"Skill: " + axies[0].stats.skill}</p>
                  <p className="bg-red-200 rounded-lg px-1">{"Morale: " + axies[0].stats.morale}</p>
                </div>
                <img
                  src={axies[0].image}
                  alt="axie 0"
                  width="128px"
                  height="128px"
                  className="w-32 h-32 mt-1 object-cover border-2 border-purple-500 rounded-full hover:border-purple-800 transition-all duration-150"
                />
                <div className="w-full h-6 bg-purple-100 mt-3 flex items-center">
                  <img src="part_eyes.svg" alt="eyes" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[0].parts[0].class.toLowerCase()}>
                    <p>{axies[0].parts[0].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 flex items-center">
                  <img src="part_ears.svg" alt="ears" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[0].parts[1].class.toLowerCase()}>
                    <p>{axies[0].parts[1].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 bg-purple-100 mt-1 flex items-center">
                  <img src="part_back.svg" alt="back" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[0].parts[2].class.toLowerCase()}>
                    <p>{axies[0].parts[2].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 flex items-center">
                  <img src="part_mouth.svg" alt="mouth" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[0].parts[3].class.toLowerCase()}>
                    <p>{axies[0].parts[3].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 bg-purple-100 flex items-center">
                  <img src="part_horn.svg" alt="horn" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[0].parts[4].class.toLowerCase()}>
                    <p>{axies[0].parts[4].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 flex items-center">
                  <img src="part_tail.svg" alt="tail" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[0].parts[5].class.toLowerCase()}>
                    <p>{axies[0].parts[5].name}</p>
                  </div>
                </div>
              </div>
              <div
                className="w-80 m-4 flex flex-col justify-center items-center border-2 border-purple-500 rounded-lg hover:border-purple-800 transition-all duration-150"
                style={{ height: "26rem" }}
              >
                <h3 className="font-bold text-xl text-purple-400">
                  <span className="text-purple-800 text-2xl">{axies[1].name.split(" | ")[0]}</span>
                  {" #" + axies[1].id}
                </h3>
                <h5 className="font-bold text-xl bg-purple-100 w-full text-center">Breed count: {axies[1].breedCount}</h5>
                <div className="w-full h-10 flex items-center justify-between px-1 font-bold">
                  <p className="bg-green-200 rounded-lg px-1">{"HP: " + axies[1].stats.hp}</p>
                  <p className="bg-yellow-300 rounded-lg px-1">{"Speed: " + axies[1].stats.speed}</p>
                  <p className="bg-purple-400 rounded-lg px-1">{"Skill: " + axies[1].stats.skill}</p>
                  <p className="bg-red-200 rounded-lg px-1">{"Morale: " + axies[1].stats.morale}</p>
                </div>
                <img
                  src={axies[1].image}
                  alt="axie 0"
                  width="128px"
                  height="128px"
                  className="w-32 h-32 mt-1 object-cover border-2 border-purple-500 rounded-full hover:border-purple-800 transition-all duration-150"
                />
                <div className="w-full h-6 bg-purple-100 mt-3 flex items-center">
                  <img src="part_eyes.svg" alt="eyes" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[1].parts[0].class.toLowerCase()}>
                    <p>{axies[1].parts[0].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 flex items-center">
                  <img src="part_ears.svg" alt="ears" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[1].parts[1].class.toLowerCase()}>
                    <p>{axies[1].parts[1].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 bg-purple-100 mt-1 flex items-center">
                  <img src="part_back.svg" alt="back" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[1].parts[2].class.toLowerCase()}>
                    <p>{axies[1].parts[2].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 flex items-center">
                  <img src="part_mouth.svg" alt="mouth" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[1].parts[3].class.toLowerCase()}>
                    <p>{axies[1].parts[3].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 bg-purple-100 flex items-center">
                  <img src="part_horn.svg" alt="horn" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[1].parts[4].class.toLowerCase()}>
                    <p>{axies[1].parts[4].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 flex items-center">
                  <img src="part_tail.svg" alt="tail" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[1].parts[5].class.toLowerCase()}>
                    <p>{axies[1].parts[5].name}</p>
                  </div>
                </div>
              </div>
              <div
                className="w-80 m-4 flex flex-col justify-center items-center border-2 border-purple-500 rounded-lg hover:border-purple-800 transition-all duration-150"
                style={{ height: "26rem" }}
              >
                <h3 className="font-bold text-xl text-purple-400">
                  <span className="text-purple-800 text-2xl">{axies[2].name.split(" | ")[0]}</span>
                  {" #" + axies[2].id}
                </h3>
                <h5 className="font-bold text-xl bg-purple-100 w-full text-center">Breed count: {axies[2].breedCount}</h5>
                <div className="w-full h-10 flex items-center justify-between px-1 font-bold">
                  <p className="bg-green-200 rounded-lg px-1">{"HP: " + axies[2].stats.hp}</p>
                  <p className="bg-yellow-300 rounded-lg px-1">{"Speed: " + axies[2].stats.speed}</p>
                  <p className="bg-purple-400 rounded-lg px-1">{"Skill: " + axies[2].stats.skill}</p>
                  <p className="bg-red-200 rounded-lg px-1">{"Morale: " + axies[2].stats.morale}</p>
                </div>
                <img
                  src={axies[2].image}
                  alt="axie 0"
                  width="128px"
                  height="128px"
                  className="w-32 h-32 mt-1 object-cover border-2 border-purple-500 rounded-full hover:border-purple-800 transition-all duration-150"
                />
                <div className="w-full h-6 bg-purple-100 mt-3 flex items-center">
                  <img src="part_eyes.svg" alt="eyes" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[2].parts[0].class.toLowerCase()}>
                    <p>{axies[2].parts[0].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 flex items-center">
                  <img src="part_ears.svg" alt="ears" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[2].parts[1].class.toLowerCase()}>
                    <p>{axies[2].parts[1].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 bg-purple-100 mt-1 flex items-center">
                  <img src="part_back.svg" alt="back" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[2].parts[2].class.toLowerCase()}>
                    <p>{axies[2].parts[2].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 flex items-center">
                  <img src="part_mouth.svg" alt="mouth" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[2].parts[3].class.toLowerCase()}>
                    <p>{axies[2].parts[3].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 bg-purple-100 flex items-center">
                  <img src="part_horn.svg" alt="horn" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[2].parts[4].class.toLowerCase()}>
                    <p>{axies[2].parts[4].name}</p>
                  </div>
                </div>
                <div className="w-full h-6 flex items-center">
                  <img src="part_tail.svg" alt="tail" width="24px" height="24px" className="ml-2" />
                  <div className={"w-full flex font-bold justify-center items-center mr-8 " + "color-" + axies[2].parts[5].class.toLowerCase()}>
                    <p>{axies[2].parts[5].name}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 1:
        if (!roninCache[props.data.ronin]) {
          fetch("/api/getAllUserInfo", {
            method: "POST",
            body: JSON.stringify({ ronin: props.data.ronin }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error(response.status);
              }
            })
            .then((data) => {
              if (data.status) {
                UIStore.update((s) => {
                  s.roninCache[props.data.ronin] = { fetched: true, data: data.status };
                });
                setFetchedAllInfoAboutPlayer(true);
                setAllPlayerInfo(data.status);
                FirstSetSLPData(data.status[data.status.length - 1]);
                FirstSetMMRData(data.status[data.status.length - 1]);
                FirstSetLIMITData(data.status[data.status.length - 1]);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }

        return fetchedAllInfoAboutPlayer && allPlayerInfo ? (
          <div className="flex flex-wrap justify-center mt-4">
            <h3 className="text-4xl font-bold my-4">SLP Gained</h3>
            <div className="w-full h-auto flex justify-between">
              <button
                onClick={() => {
                  ChangeSLPData("today");
                }}
                className="w-full h-10 p-1 font-bold border-b-2 transition-all duration-150 border-purple-300 hover:border-purple-800 hover:bg-purple-200"
              >
                Today
              </button>
              <button
                onClick={() => {
                  ChangeSLPData("week");
                }}
                className="w-full h-10 p-1 font-bold border-b-2 transition-all duration-150 border-purple-300 hover:border-purple-800 hover:bg-purple-200"
              >
                Last week
              </button>
              <button
                onClick={() => {
                  ChangeSLPData("month");
                }}
                className="w-full min-w-max h-10 p-1 font-bold border-b-2 transition-all duration-150 border-purple-300 hover:border-purple-800 hover:bg-purple-200"
              >
                Last month
              </button>
              <button
                onClick={() => {
                  ChangeSLPData("all");
                }}
                className="w-full h-10 p-1 font-bold border-b-2 transition-all duration-150 border-purple-300 hover:border-purple-800 hover:bg-purple-200"
              >
                All time
              </button>
            </div>
            <div className="w-full h-auto flex flex-col my-2 font-bold px-2">
              From
              <input
                onChange={() => {
                  ChangeSLPData("custom");
                }}
                className="border-2 rounded-lg border-purple-300 hover:border-purple-800"
                type="date"
                name=""
                id="inp-slp-from"
              />
              To
              <input
                onChange={() => {
                  ChangeSLPData("custom");
                }}
                className="border-2 rounded-lg border-purple-300 hover:border-purple-800"
                type="date"
                name=""
                id="inp-slp-to"
              />
            </div>
            {SLPDataGraphType ? (
              <Bar
                data={SLPData.data}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <Line
                data={SLPData.data}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            )}
            <div className="w-full flex text-center items-center font-bold text-purple-800">
              Line graph
              <label className="switch mx-4">
                <input
                  onClick={() => {
                    setSLPDataGraphType(!SLPDataGraphType);
                  }}
                  type="checkbox"
                />
                <span className="slider round"></span>
              </label>
            </div>

            {/* next graph */}

            <h3 className="text-4xl font-bold my-4 mt-16">MMR</h3>
            <div className="w-full h-auto flex justify-between">
              <button
                onClick={() => {
                  ChangeMMRData("today");
                }}
                className="w-full h-10 p-1 font-bold border-b-2 transition-all duration-150 border-purple-300 hover:border-purple-800 hover:bg-purple-200"
              >
                Today
              </button>
              <button
                onClick={() => {
                  ChangeMMRData("week");
                }}
                className="w-full h-10 p-1 font-bold border-b-2 transition-all duration-150 border-purple-300 hover:border-purple-800 hover:bg-purple-200"
              >
                Last week
              </button>
              <button
                onClick={() => {
                  ChangeMMRData("month");
                }}
                className="w-full min-w-max h-10 p-1 font-bold border-b-2 transition-all duration-150 border-purple-300 hover:border-purple-800 hover:bg-purple-200"
              >
                Last month
              </button>
              <button
                onClick={() => {
                  ChangeMMRData("all");
                }}
                className="w-full h-10 p-1 font-bold border-b-2 transition-all duration-150 border-purple-300 hover:border-purple-800 hover:bg-purple-200"
              >
                All time
              </button>
            </div>
            <div className="w-full h-auto flex flex-col my-2 font-bold px-2">
              From
              <input
                onChange={() => {
                  ChangeMMRData("custom");
                }}
                className="border-2 rounded-lg border-purple-300 hover:border-purple-800"
                type="date"
                name=""
                id="inp-mmr-from"
              />
              To
              <input
                onChange={() => {
                  ChangeMMRData("custom");
                }}
                className="border-2 rounded-lg border-purple-300 hover:border-purple-800"
                type="date"
                name=""
                id="inp-mmr-to"
              />
            </div>
            {MMRDataGraphType ? (
              <Bar
                data={MMRData.data}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <Line
                data={MMRData.data}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            )}
            <div className="w-full flex text-center items-center font-bold text-purple-800">
              Line graph
              <label className="switch mx-4">
                <input
                  onClick={() => {
                    setMMRDataGraphType(!MMRDataGraphType);
                  }}
                  type="checkbox"
                />
                <span className="slider round"></span>
              </label>
            </div>

            {/* next graph */}

            <h3 className="text-4xl font-bold my-4 mt-16 text-center">Daily SLP Limit completed, %</h3>
            <div className="w-full h-auto flex justify-between">
              <button
                onClick={() => {
                  ChangeLIMITData("today");
                }}
                className="w-full h-10 p-1 font-bold border-b-2 transition-all duration-150 border-purple-300 hover:border-purple-800 hover:bg-purple-200"
              >
                Today
              </button>
              <button
                onClick={() => {
                  ChangeLIMITData("week");
                }}
                className="w-full h-10 p-1 font-bold border-b-2 transition-all duration-150 border-purple-300 hover:border-purple-800 hover:bg-purple-200"
              >
                Last week
              </button>
              <button
                onClick={() => {
                  ChangeLIMITData("month");
                }}
                className="w-full min-w-max h-10 p-1 font-bold border-b-2 transition-all duration-150 border-purple-300 hover:border-purple-800 hover:bg-purple-200"
              >
                Last month
              </button>
              <button
                onClick={() => {
                  ChangeLIMITData("all");
                }}
                className="w-full h-10 p-1 font-bold border-b-2 transition-all duration-150 border-purple-300 hover:border-purple-800 hover:bg-purple-200"
              >
                All time
              </button>
            </div>
            <div className="w-full h-auto flex flex-col my-2 font-bold px-2">
              From
              <input
                onChange={() => {
                  ChangeLIMITData("custom");
                }}
                className="border-2 rounded-lg border-purple-300 hover:border-purple-800"
                type="date"
                name=""
                id="inp-limit-from"
              />
              To
              <input
                onChange={() => {
                  ChangeLIMITData("custom");
                }}
                className="border-2 rounded-lg border-purple-300 hover:border-purple-800"
                type="date"
                name=""
                id="inp-limit-to"
              />
            </div>
            {LIMITDataGraphType ? (
              <Bar
                data={LIMITData.data}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <Line
                data={LIMITData.data}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            )}
            <div className="w-full flex text-center items-center font-bold text-purple-800">
              Line graph
              <label className="switch mx-4">
                <input
                  onClick={() => {
                    setLIMITDataGraphType(!LIMITDataGraphType);
                  }}
                  type="checkbox"
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        ) : (
          <LoadingComponent styles="max-h-20 mt-4" />
        );
      case 2:
        return <div className="text-xl py-5">Notifications are not available for now.</div>;
      default:
        return <></>;
    }
  } else {
    return <></>;
  }
}

function ArenaTableCellComponent(props) {
  /*
  
    @param props.order - order in table
    @param props.content - cells text
  
    //////
    часы
    #
    Name
    Avg Daily SLP
    Yesterday SLP
    Unclaimed SLP
    Next Claim
    Team
    Formation
    Quality
    //////
  
    */

  console.log(props);

  return (
    <tr className="h-16 border-4 border-blue-300">
      <td className="font-bold">{props.order ?? "?"}</td> {/* # */}
      <td className="font-bold">{props.content.name ?? "?"}</td> {/* Name */}
      <td className="font-bold">{props.content.source.slp.rank ?? "?"}</td> {/* Rank */}
      <td className="font-bold">{props.content.elo ?? " "}</td> {/* ELO*/}
      <td className="font-bold">{props.content.team ?? "?"}</td> {/* Team */}
      <td className="font-bold">{props.content.formation ?? "?"}</td> {/* Formation */}
      <td className="">
        <div className={"h-4 w-full flex justify-center"}>
          <div
            className={
              "w-4 h-4 custom-bg-" +
              (props.content
                ? props.content.qualityTracker === 0
                  ? "green"
                  : props.content.qualityTracker === 1
                  ? "yellow"
                  : props.content.qualityTracker === 2
                  ? "red"
                  : "gray"
                : "black")
            }
          ></div>
        </div>
      </td>
    </tr>
  );
}

function ArenaTableComponent() {
  let axieTable = UIStore.useState((s) => s.axieTable);
  let final = [];
  let counter = 0;
  for (const i of axieTable) {
    counter++;
    final.push(<ArenaTableCellComponent order={counter} content={i} />);
  }

  return (
    <div className="md:w-11/12 w-full py-4 flex justify-center self-center">
      <div className="mt-2 w-full self-center overflow-x-auto">
        <table
          className="table table-auto w-full"
          style={{
            minWidth: 1200,
          }}
        >
          <thead>
            <tr className="border-t-2 border-b-2 h-12 bg-blue-300 text-xl text-center">
              <th className="transition-all duration-150 border-4 border-blue-300">&nbsp;&nbsp;#&nbsp;&nbsp;</th>
              <th className="transition-all duration-150 border-4 border-blue-300">Name</th>
              <th className="transition-all duration-150 border-4 border-blue-300">Rank</th>
              <th className="transition-all duration-150 border-4 border-blue-300">ELO</th>
              <th className="transition-all duration-150 border-4 border-blue-300">Team</th>
              <th className="transition-all duration-150 border-4 border-blue-300">Formation</th>
              <th className="transition-all duration-150 border-4 border-blue-300">Quality Tracker</th>
            </tr>
          </thead>
          <tbody className="text-center text-lg">{final}</tbody>
        </table>
      </div>
    </div>
  );
}

function ControlPanel(props) {
  let axieTable = UIStore.useState((s) => s.axieTable);
  let teams = UIStore.useState((s) => s.teams);
  let formations = UIStore.useState((s) => s.formations);

  const [teamOptions, setTeamOptions] = React.useState([]);
  const [formationOptions, setFormationOptions] = React.useState([]);
  const [playerOptions, setPlayerOptions] = React.useState([]);

  React.useEffect(() => {
    try {
      let a = [];
      for (const i of teams) {
        a.push(<option value={i}>{i}</option>);
      }
      setTeamOptions(a);
    } catch {}
  }, [teams]);

  React.useEffect(() => {
    try {
      let a = [];
      for (const i of formations) {
        a.push(<option value={i}>{i}</option>);
      }
      setFormationOptions(a);
    } catch {}
  }, [formations]);

  React.useEffect(() => {
    try {
      let a = [];
      for (const i of axieTable) {
        a.push(<option value={i.name}>{i.name}</option>);
      }
      setPlayerOptions(a);
    } catch {}
  }, [axieTable]);

  React.useEffect(() => {
    fetch("/api/getTeams", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        try {
          for (const i of data.status) {
            UIStore.update((s) => {
              s.teams = [...s.teams, i.teamName];
            });
          }
        } catch {}
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  React.useEffect(() => {
    fetch("/api/getFormations", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        console.log(data.status);
        try {
          for (const i of data.status) {
            UIStore.update((s) => {
              s.formations = [...s.formations, i.formationName];
            });
          }
        } catch {}
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function CreateNewTeam(e) {
    let val = e.value;
    if (!val || val.trim().length < 3) {
      alert("Bad team name!");
      return;
    }

    fetch("/api/teamCreate", {
      method: "POST",
      body: JSON.stringify({ teamName: val }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        if (!teams.includes(val)) {
          UIStore.update((s) => {
            s.teams = [...s.teams, val];
          });
        } else {
          alert("already exist!");
          return;
        }

        alert(data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function CreateNewFormation(name, player) {
    if (!name || name.trim().length < 3) {
      alert("Bad formation name!");
      return;
    }

    let a = axieTable.filter((e) => e.name === player);
    if (!a[0]) {
      alert("Error");
      return;
    }

    fetch("/api/createFormation", {
      method: "POST",
      body: JSON.stringify({ formationName: name, ronin: a[0].ronin }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        if (!formations.includes(name)) {
          UIStore.update((s) => {
            s.formations = [...s.formations, name];
          });
          UIStore.update((s) => {
            for (const i of s.axieTable) {
              if (i.name === player) i.formation = name;
            }
          });
        } else {
          alert("already exist!");
          return;
        }

        alert(data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function DeleteFormation(name) {
    if (!name || name.trim().length < 3) {
      return;
    }

    fetch("/api/deleteFormation", {
      method: "POST",
      body: JSON.stringify({ formationName: name }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        UIStore.update((s) => {
          s.formations = s.formations.filter((s) => s !== name);
        });
        alert(data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function DeleteTeam(name) {
    if (!name || name.trim().length < 3) {
      return;
    }

    fetch("/api/deleteTeam", {
      method: "POST",
      body: JSON.stringify({ teamName: name }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        UIStore.update((s) => {
          s.teams = s.teams.filter((s) => s !== name);
        });
        alert(data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function AttachPlayerToTheTeam(player, name) {
    if (!name || name.trim().length < 3) {
      return;
    }

    let a = axieTable.filter((e) => e.name === player);
    if (!a[0]) {
      alert("Error");
      return;
    }

    fetch("/api/teamAddPerson", {
      method: "POST",
      body: JSON.stringify({ teamName: name, ronin: a[0].ronin }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        UIStore.update((s) => {
          for (const i of s.axieTable) {
            if (i.name === player) i.team = name;
          }
        });
        alert(data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function RemovePlayerFromTheTeam(player, name) {
    if (!name || name.trim().length < 3) {
      return;
    }

    let a = axieTable.filter((e) => e.name === player);
    if (!a[0]) {
      alert("Error");
      return;
    }

    fetch("/api/deletePerson", {
      method: "POST",
      body: JSON.stringify({ teamName: name, ronin: a[0].ronin }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        UIStore.update((s) => {
          for (const i of s.axieTable) {
            if (i.name === player) i.team = "N/A";
          }
        });
        alert(data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function AttachPlayerToTheFormation(player, name) {
    if (!name || name.trim().length < 3) {
      return;
    }

    let a = axieTable.filter((e) => e.name === player);
    if (!a[0]) {
      alert("Error");
      return;
    }

    fetch("/api/teamAddPerson", {
      method: "POST",
      body: JSON.stringify({ teamName: name, ronin: a[0].ronin }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        UIStore.update((s) => {
          for (const i of s.axieTable) {
            if (i.name === player) i.team = name;
          }
        });
        alert(data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function RemovePlayerFromTheFormation(player, name) {
    if (!name || name.trim().length < 3) {
      return;
    }

    let a = axieTable.filter((e) => e.name === player);
    if (!a[0]) {
      alert("Error");
      return;
    }

    fetch("/api/deletePerson", {
      method: "POST",
      body: JSON.stringify({ teamName: name, ronin: a[0].ronin }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        UIStore.update((s) => {
          for (const i of s.axieTable) {
            if (i.name === player) i.team = "N/A";
          }
        });
        alert(data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="md:w-11/12 w-full mt-10 self-center">
      <div className="w-full flex items-center">
        <label className="pr-2 text-left font-bold text-lg w-56">New team name:</label>
        <input type="text" id="new-team-input" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2" />
        <button
          onClick={() => {
            CreateNewTeam(document.getElementById("new-team-input"));
          }}
          className="rounded-lg bg-green-300 hover:bg-green-700 transition-all duration-150 p-2 font-bold ml-4 hover:text-white"
        >
          Create new team!
        </button>
      </div>
      <div className="w-full flex items-center mt-4">
        <label className="pr-2 text-left font-bold text-lg w-56">Attach player:</label>
        <select name="" id="selection-player-attach-team" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2">
          {playerOptions}
        </select>
        <span className="text-lg font-bold mx-2">to the team</span>
        <select name="" id="selection-team-attach-team" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2">
          {teamOptions}
        </select>
        <button
          onClick={() => {
            AttachPlayerToTheTeam(document.getElementById("selection-player-attach-team").value, document.getElementById("selection-team-attach-team").value);
          }}
          className="rounded-lg bg-green-300 hover:bg-green-700 transition-all duration-150 p-2 font-bold ml-4 hover:text-white"
        >
          Attach!
        </button>
      </div>
      <div className="w-full flex items-center mt-4">
        <label className="pr-2 text-left font-bold text-lg w-56">Remove player:</label>
        <select name="" id="selection-player-remove-team" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2">
          {playerOptions}
        </select>
        <span className="text-lg font-bold mx-2">from the team</span>
        <select name="" id="selection-team-remove-team" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2">
          {teamOptions}
        </select>
        <button
          onClick={() => {
            RemovePlayerFromTheTeam(document.getElementById("selection-player-remove-team").value, document.getElementById("selection-team-remove-team").value);
          }}
          className="rounded-lg bg-red-300 hover:bg-red-700 transition-all duration-150 p-2 font-bold ml-4 hover:text-white"
        >
          Delete!
        </button>
      </div>
      <div className="w-full flex items-center mt-4">
        <label className="pr-2 text-left font-bold text-lg w-56">Delete team:</label>
        <select name="" id="selection-team-delete" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2">
          {teamOptions}
        </select>
        <button
          onClick={() => {
            DeleteTeam(document.getElementById("selection-team-delete").value);
          }}
          className="rounded-lg bg-red-300 hover:bg-red-700 transition-all duration-150 p-2 font-bold ml-4 hover:text-white"
        >
          Delete team
        </button>
      </div>
      <div className="w-full flex items-center mt-4">
        <label className="pr-2 text-left font-bold text-lg w-56">New formation name:</label>
        <input type="text" id="new-formation-input" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2" />
        <span className="text-lg font-bold mx-2">for player</span>
        <select name="" id="selection-player-new-formation" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2">
          {playerOptions}
        </select>
        <button
          onClick={() => {
            CreateNewFormation(document.getElementById("new-formation-input").value, document.getElementById("selection-player-new-formation").value);
          }}
          className="rounded-lg bg-green-300 hover:bg-green-700 transition-all duration-150 p-2 font-bold ml-4 hover:text-white"
        >
          Create new formation!
        </button>
      </div>
      {/*<><div className="w-full flex items-center mt-4">
        <label className="pr-2 text-left font-bold text-lg w-56">Attach player:</label>
        <select name="" id="selection-player-attach-team" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2">
          {playerOptions}
        </select>
        <span className="text-lg font-bold mx-2">to the formation</span>
        <select name="" id="selection-team-attach-team" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2">
          {teamOptions}
        </select>
        <button
          onClick={() => {
            AttachPlayerToTheTeam(document.getElementById("selection-player-attach-team").value, document.getElementById("selection-team-attach-team").value);
          }}
          className="rounded-lg bg-green-300 hover:bg-green-700 transition-all duration-150 p-2 font-bold ml-4 hover:text-white"
        >
          Attach!
        </button>
      </div>
      <div className="w-full flex items-center mt-4">
        <label className="pr-2 text-left font-bold text-lg w-56">Remove player:</label>
        <select name="" id="selection-player-remove-team" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2">
          {playerOptions}
        </select>
        <span className="text-lg font-bold mx-2">from the formation</span>
        <select name="" id="selection-team-remove-team" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2">
          {teamOptions}
        </select>
        <button
          onClick={() => {
            RemovePlayerFromTheTeam(document.getElementById("selection-player-remove-team").value, document.getElementById("selection-team-remove-team").value);
          }}
          className="rounded-lg bg-red-300 hover:bg-red-700 transition-all duration-150 p-2 font-bold ml-4 hover:text-white"
        >
          Delete!
        </button>
        </div></>*/}
      <div className="w-full flex items-center mt-4">
        <label className="pr-2 text-left font-bold text-lg w-56">Delete formation:</label>
        <select name="" id="selection-formation-delete" className="w-40 h-10 border-2 rounded-lg border-purple-300 p-2">
          {formationOptions}
        </select>
        <button
          onClick={() => {
            DeleteFormation(document.getElementById("selection-formation-delete").value);
          }}
          className="rounded-lg bg-red-300 hover:bg-red-700 transition-all duration-150 p-2 font-bold ml-4 hover:text-white"
        >
          Delete formation
        </button>
      </div>
    </div>
  );
}

function QualityTrackerComponent(props) {
  let axieTable = UIStore.useState((s) => s.axieTable);
  let qualityTracker = UIStore.useState((s) => s.qualityTracker);

  const [usersData, setUsersData] = React.useState({});

  function GetOnlyValidUsers(inData) {
    let a = {};
    try {
      for (const i of axieTable) {
        a[i.name] = inData.filter((t) => t.userName === i.name);
      }
    } catch {
      return a;
    }
    return a;
  }

  function CalculateQT() {
    if (qualityTracker.settings.period <= 0) {
      UIStore.update((s) => {
        for (const i of s.axieTable) {
          i.qualityTracker = 3;
        }
      });
    } else {
      let limit = sub(new Date(), { days: qualityTracker.settings.period });
      let n = {};
      let slpMin = Math.min(parseInt(document.getElementById('inp-custom-int-1').value),parseInt(document.getElementById('inp-custom-int-2').value));
      let slpMax = Math.max(parseInt(document.getElementById('inp-custom-int-1').value),parseInt(document.getElementById('inp-custom-int-2').value));
      let biggestSLP = 0;
      for (const i in qualityTracker.data) {
        if (Object.hasOwnProperty.call(qualityTracker.data, i)) {
          const player = qualityTracker.data[i];
          let b = player.filter((q) => {
            return compareDesc(parseISO(q.date), limit) === 1 ? true : false;
          });
          let meanValue = 0;
          for (const j of b) {
            meanValue += j.slp.in_game_slp;
          }
          meanValue = meanValue / b.length;
          n[i] = { mean: meanValue };
          biggestSLP = meanValue > biggestSLP ? meanValue : biggestSLP;
        }
      }

      if(document.getElementById('inp-cb').checked)
      {
        for (const i in n) {
          if (Object.hasOwnProperty.call(n, i)) {
            const element = n[i];
            if(element.mean)
            {
              if(element.mean >= biggestSLP)
              {
                n[i].res = 100;
              }
              else
              {
                n[i].res = (element.mean / biggestSLP)*100;
              }
            }
          }
        }
      }

      console.log('nnnn',n);

      UIStore.update((s) => {
        for (const i of s.axieTable) {


          if(document.getElementById('inp-cb').checked)
          {
            if(n[i.name] && n[i.name].res && n[i.name].res > slpMax)
            {
              i.qualityTracker = 0;
            }
            else if(n[i.name] && n[i.name].res && n[i.name].res >= slpMin && n[i.name].res <= slpMax)
            {
              i.qualityTracker = 1;
            } 
            else if(n[i.name] && n[i.name].res && n[i.name].res < slpMin)
            {
              i.qualityTracker = 2;
            }
            else
            {
              i.qualityTracker = 3;
            }
          }

          else
          {
            if(n[i.name] && n[i.name].mean && n[i.name].mean > slpMax)
            {
              i.qualityTracker = 0;
            }
            else if(n[i.name] && n[i.name].mean && n[i.name].mean >= slpMin && n[i.name].mean <= slpMax)
            {
              i.qualityTracker = 1;
            } 
            else if(n[i.name] && n[i.name].mean && n[i.name].mean < slpMin)
            {
              i.qualityTracker = 2;
            }
            else
            {
              i.qualityTracker = 3;
            }
          }


        }
      });
    }
  }

  React.useEffect(() => {
    fetch("/api/getAllUsers", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        if (data.status !== "no tracker exist") {
          let a = GetOnlyValidUsers(data.status);
          setUsersData(a);
          UIStore.update((s) => {
            s.qualityTracker.data = a;
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [axieTable]);

  React.useEffect(() => {
    console.log("realtime qt", qualityTracker);
  }, [qualityTracker]);

  return usersData ? (
    <div className="md:w-11/12 w-full mt-10 self-center">
      <div className="w-full h-10 flex items-center">
        <h4 className="border-t-2 border-b-2 border-purple-100 mr-2 font-bold text-xl">Select period:</h4>
        <button
          onClick={() => {
            UIStore.update((s) => {
              s.qualityTracker.settings.period = 1;
            });
          }}
          className="border-t-2 border-b-2 border-purple-300 border-l-2 px-2 hover:border-purple-800"
        >
          Yesterday
        </button>
        <button
          onClick={() => {
            UIStore.update((s) => {
              s.qualityTracker.settings.period = 7;
            });
          }}
          className="border-t-2 border-b-2 border-purple-300 px-2 hover:border-purple-800"
        >
          7 days
        </button>
        <button
          onClick={() => {
            UIStore.update((s) => {
              s.qualityTracker.settings.period = 30;
            });
          }}
          className="border-t-2 border-b-2 border-purple-300 border-r-2 px-2 hover:border-purple-800 mr-2"
        >
          30 days
        </button>
        Custom
        <input
          onChange={(e) => {
            UIStore.update((s) => {
              s.qualityTracker.settings.period = e.target.value === "" ? 0 : parseInt(e.target.value);
            });
          }}
          type="number"
          name=""
          id="inp-custom-period"
          className="border-t-2 border-b-2 px-2 w-20 border-purple-300 mx-2"
        />
        days
      </div>
      <div className="w-full h-10 flex items-center">
        <h4 className="border-t-2 border-b-2 border-purple-100 mr-2 font-bold text-xl">Select interval for slp:</h4>
        from
        <input type="number" name="" id="inp-custom-int-1" className="border-t-2 border-b-2 px-2 w-20 border-purple-300 mx-2" />
        to
        <input type="number" name="" id="inp-custom-int-2" className="border-t-2 border-b-2 px-2 w-20 border-purple-300 mx-2" />
      </div>
      <div className="w-full h-10 flex items-center font-bold">
        Use percentage?
        <input type="checkbox" name="" id="inp-cb" className="border-t-2 border-b-2 px-2 w-4 h-4 border-purple-300 mx-2" />
      </div>
      <button
        onClick={() => {
          CalculateQT();
        }}
        className="rounded-lg bg-green-300 hover:bg-green-700 transition-all duration-150 p-2 font-bold hover:text-white"
      >
        Submit
      </button>
    </div>
  ) : (
    <LoadingComponent responsive={true} text={"Waiting for API"} />
  );
}

function Dashboard() {
  let axieTable = UIStore.useState((s) => s.axieTable);
  let selectedPlayer = UIStore.useState((s) => s.selectedPlayer);
  let selectedButton = UIStore.useState((s) => s.selectedButton);
  let slpToDollar = UIStore.useState((s) => s.slpToDollar);

  const [showSLP, setShowSLP] = React.useState(true);

  const [playersLoaded, setPlayersLoaded] = React.useState(0);
  const [slpToDollarLoaded, setSlpToDollarLoaded] = React.useState(0);
  const [playerInfoLoaded, setPlayerInfoLoaded] = React.useState(1);
  const [playerAxiesLoaded, setPlayerAxiesLoaded] = React.useState(1);
  const [players, setPlayers] = React.useState([]);
  function IsContentLoaded() {
    return slpToDollarLoaded * playersLoaded;
  }

  React.useEffect(() => {
    UIStore.update((s) => {
      s.getPlayerInfo = GetPlayerInfo;
    });

    fetch("/api/getSlp", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        UIStore.update((s) => {
          s.slpToDollar = data.status.usd;
          setSlpToDollarLoaded(1);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  React.useEffect(() => {
    fetch("/api/getAllTrackedUsers", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        if (data.status !== "no tracker exist") {
          console.log(data);
          let d = data.status;
          let final = [];
          for (const i of d) {
            try {
              final.push({
                name: i.userName,
                gameName: i.slp.name.split(" | "),
                team: i.team ?? "N/A",
                formation: i.formationName ?? "N/A",
                slp: i.slp.in_game_slp,
                slpDailyLimit: i.dailySlpLimit,
                slpPerDay: i.slpPerDay,
                slpManager: i.slp.in_game_slp * i.userPercentage * 0.01,
                slpManagerPerc: i.userPercentage,
                nextClaim: fromUnixTime(i.slp.next_claim),
                qualityTracker: 3,
                mmr: i.slp.mmr,
                telegram: "",
                notifies: "",
                ronin: i.userRoninAddr,
                axies: {},
                axieAvatar: i.avatar ?? "placeholder-avatar.png",
                axiesLoaded: 0,
                source: i,
              });
            } catch {
              continue;
            }
          }
          console.log("from server", final);
          setPlayers(final);
          setPlayersLoaded(1);
        } else {
          setPlayers([]);
          setPlayersLoaded(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function GetPlayerInfo(inRonin, newPlayer) {
    console.log("info", axieTable);
    if (axieTable.length > 0 && axieTable[newPlayer] && !axieTable[newPlayer].axiesLoaded) {
      setPlayerInfoLoaded(0);
      setPlayerAxiesLoaded(0);

      fetch("/api/getUserInfo", {
        method: "POST",
        body: JSON.stringify({ ronin: inRonin }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.status);
          }
        })
        .then((data) => {
          console.log(`${inRonin} playerData: `, data, data.status.avatar);
          UIStore.update((s) => {
            s.axieTable[newPlayer].axieAvatar = data.status.avatar ?? "placeholder-avatar.png";
          });
          setPlayerInfoLoaded(1);
        })
        .catch((error) => {
          console.log(error);
        });

      fetch("/api/getUserAxies", {
        method: "POST",
        body: JSON.stringify({ ronin: inRonin }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.status);
          }
        })
        .then((data) => {
          console.log(`${inRonin} playerAxies: `, data);
          UIStore.update((s) => {
            s.axieTable[newPlayer].axies = data.axies;
            s.axieTable[newPlayer].axiesLoaded = 1;
          });
          setPlayerAxiesLoaded(1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("hello 2");
    }
  }

  React.useEffect(() => {
    UIStore.update((s) => {
      s.axieTable = players;
    });
  }, [players]);

  return IsContentLoaded() ? (
    <>
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
            <p className="text-xl font-bold"> 1 SLP = ${slpToDollar}</p>
          </div>
          <p className="text-xl font-bold mt-4 text-center">Players online: {"0"}</p>
          <TilesComponent></TilesComponent>
          <div className="w-full h-12 flex justify-center mt-10">
            <button
              onClick={() => {
                if (!showSLP) setShowSLP(true);
              }}
              className="flex w-56 h-full justify-center items-center border-2 border-purple-800 transition-all duration-150 hover:bg-purple-600 bg-blue-300 rounded-xl font-bold text-xl"
            >
              💰 SLP
            </button>
            <button
              onClick={() => {
                if (showSLP) setShowSLP(false);
              }}
              className="flex w-56 h-full justify-center items-center border-2 border-purple-800 transition-all duration-150 hover:bg-purple-600 bg-blue-300 rounded-xl font-bold text-xl ml-2"
            >
              🏆 Arena
            </button>
          </div>
          {showSLP ? <TableComponent content={axieTable} getPlayerInfo={GetPlayerInfo} /> : <ArenaTableComponent />}
          <h2 className="mt-10 md:text-4xl text-2xl text-center font-bold">Add new player</h2>
          <TableControlComponent></TableControlComponent>
          <div className="my-10 h-0.5 md:w-11/12 w-full self-center border-blue-300" style={{ borderWidth: 1 }}></div>
          {playerAxiesLoaded * playerInfoLoaded ? (
            <div className={"md:w-11/12 w-full self-center h-auto " + (selectedPlayer === -1 ? "hidden" : "")}>
              <div className="w-full flex flex-col md:grid md:grid-flow-col md:gap-8" style={{ gridAutoColumns: "min-content auto" }}>
                <div className="flex flex-col mb-8 md:w-64 w-full text-center md:text-left">
                  <div className="avatar w-full h-auto flex justify-center">
                    <img
                      src={
                        selectedPlayer !== -1 &&
                        playerAxiesLoaded * playerInfoLoaded &&
                        axieTable[selectedPlayer].axieAvatar !== "" &&
                        axieTable[selectedPlayer].axieAvatar !== "placeholder-avatar.png"
                          ? "http://axietracker.tw1.ru" + axieTable[selectedPlayer].axieAvatar
                          : "placeholder-avatar.png"
                      }
                      width="256px"
                      height="256px"
                      alt="player avatar"
                      className="w-64 h-64 object-cover rounded-full border-2 border-purple-800"
                    />
                  </div>
                  <h3 className="font-bold text-4xl mt-4">{selectedPlayer !== -1 ? axieTable[selectedPlayer].name : ""}</h3>
                  {
                    <p className="font-light text-2xl text-purple-500 hover:text-purple-800">
                      {selectedPlayer !== -1 ? axieTable[selectedPlayer].gameName[0] : ""}
                    </p>
                  }
                </div>
                <div className="w-full h-full flex flex-col">
                  <div className="w-full h-12 justify-center md:justify-start flex text-xl text-gray-600">
                    <button
                      onClick={() => {
                        if (selectedButton !== 0)
                          UIStore.update((s) => {
                            s.selectedButton = 0;
                          });
                      }}
                      className={"p-2 font-bold transition-all duration-150 border-b-2 " + (selectedButton === 0 ? "selected-button" : "non-selected-button")}
                    >
                      &nbsp;&nbsp;Axies&nbsp;&nbsp;
                    </button>
                    <button
                      onClick={() => {
                        if (selectedButton !== 1)
                          UIStore.update((s) => {
                            s.selectedButton = 1;
                          });
                      }}
                      className={"p-2 font-bold transition-all duration-150 border-b-2 " + (selectedButton === 1 ? "selected-button" : "non-selected-button")}
                    >
                      &nbsp;&nbsp;Tracking&nbsp;&nbsp;
                    </button>
                    {/*<button
                      onClick={() => {
                        if (selectedButton !== 2)
                          UIStore.update((s) => {
                            s.selectedButton = 2;
                          });
                      }}
                      className={"p-2 font-bold transition-all duration-150 border-b-2 " + (selectedButton === 2 ? "selected-button" : "non-selected-button")}
                    >
                      &nbsp;&nbsp;Notifications&nbsp;&nbsp;
                    </button>*/}
                  </div>
                  <PlayerCardContentProvider id={selectedButton} data={axieTable[selectedPlayer]}></PlayerCardContentProvider>
                </div>
              </div>
            </div>
          ) : (
            <LoadingComponent responsive={true} text={"Waiting for API"} />
          )}
          <div className="my-10 h-0.5 md:w-11/12 w-full self-center border-blue-300" style={{ borderWidth: 1 }}></div>
          <ControlPanel content={axieTable} />
          <div className="my-10 h-0.5 md:w-11/12 w-full self-center border-blue-300" style={{ borderWidth: 1 }}></div>
          <h2 className="mt-10 md:text-4xl text-2xl text-center font-bold">Quality Tracker</h2>
          <QualityTrackerComponent />
        </div>
      </Content>
      <Footer>
        <div className="w-full h-full px-10 py-2 flex justify-center items-center text-gray-300">
          <p>© 2021 Copyright</p>
        </div>
      </Footer>
    </>
  ) : (
    <LoadingComponent />
  );
}

export { Dashboard };
