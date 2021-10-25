import { Header, Content, Footer } from "./Base";
import React from "react";
import { UIStore } from "./UIStore";
import { LoadingComponent } from "./LoadingComponent";
import { stringify } from "postcss";

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
      s.selectedPlayer = -1;
    });

    UIStore.update((s) => {
      s.axieTable.splice(props.id - 1, 1);
    });
  }

  return (
    <tr className="h-20 border-4 border-blue-300">
      <td className="font-bold">{props.order ?? "?"}</td> {/* # */}
      <td
        onClick={() => {
          UIStore.update((s) => {
            if (s.selectedPlayer !== props.id - 1) {
              s.selectedPlayer = props.id - 1;
              s.getPlayerInfo(s.axieTable[props.id - 1].ronin, props.id - 1);
            }
          });
        }}
        className="text-purple-500 font-bold hover:text-purple-900 cursor-pointer"
      >
        {props.content ? props.content.name : "?"}
      </td>{" "}
      {/* player name */}
      <td className="flex justify-center pt-2">
        <img width="50" height="50" className="rounded-full border-2 border-purple-800" src={"axie-avatar.jpg"} alt="" /> {/* Avatar */}
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
              &nbsp;&nbsp;#&nbsp;&nbsp;
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
              &nbsp;&nbsp;&nbsp;SLP&nbsp;&nbsp;&nbsp;
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
    //let fields = document.querySelectorAll('[id$="-inp"]');
    //console.log(fields);
    /*fetch("/getSlp",{method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },})
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        console.log(data);
        UIStore.update((s) => {
          s.axieTable.push();
        });
      })
      .catch((error) => {
        console.log(error);
      });*/
    /*fetch("/addTracker", {
      method: "POST",
      body: JSON.stringify({ name: "test-1", ronin: "edbc6bd7161364b747926c22a864ceff814510bd", percentage: "30" }),
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
          s.axieTable.push();
        });
      })
      .catch((error) => {
        console.log(error);
      });*/
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

function PlayerCardContentProvider(props) {
  //last stop here
  if (props.data) {
    switch (props.id) {
      case 0:
        let axies = props.data.axies;
        return (
          <>
          <div className="flex flex-wrap justify-center mt-4">
              <div className="w-80 m-4 flex flex-col justify-center items-center border-2 border-purple-500 rounded-lg hover:border-purple-800 transition-all duration-150" style={{height: '26rem'}}>
                <h3 className='font-bold text-xl text-purple-400'><span className='text-purple-800 text-2xl'>{axies[0].name.split(' | ')[0]}</span>{' #' + axies[0].id}</h3>
                <h5 className='font-bold text-xl bg-purple-100 w-full text-center'>Breed count: {axies[0].breedCount}</h5>
                <div className='w-full h-10 flex items-center justify-between px-1 font-bold'>
                  <p className='bg-green-200 rounded-lg px-1'>{'HP: '+axies[0].stats.hp}</p>
                  <p className='bg-yellow-300 rounded-lg px-1'>{'Speed: '+axies[0].stats.speed}</p>
                  <p className='bg-purple-400 rounded-lg px-1'>{'Skill: '+axies[0].stats.skill}</p>
                  <p className='bg-red-200 rounded-lg px-1'>{'Morale: '+axies[0].stats.morale}</p>
                </div>
                <img src={axies[0].image} alt="axie 0" width='128px' height='128px' className='w-32 h-32 mt-1 object-cover border-2 border-purple-500 rounded-full hover:border-purple-800 transition-all duration-150'/>
                <div className='w-full h-6 bg-purple-100 mt-3 flex items-center'>
                  <img src="part_eyes.svg" alt="eyes" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[0].parts[0].class.toLowerCase()}>
                    <p>{axies[0].parts[0].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 flex items-center'>
                  <img src="part_ears.svg" alt="ears" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[0].parts[1].class.toLowerCase()}>
                    <p>{axies[0].parts[1].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 bg-purple-100 mt-1 flex items-center'>
                  <img src="part_back.svg" alt="back" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[0].parts[2].class.toLowerCase()}>
                    <p>{axies[0].parts[2].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 flex items-center'>
                  <img src="part_mouth.svg" alt="mouth" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[0].parts[3].class.toLowerCase()}>
                    <p>{axies[0].parts[3].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 bg-purple-100 flex items-center'>
                  <img src="part_horn.svg" alt="horn" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[0].parts[4].class.toLowerCase()}>
                    <p>{axies[0].parts[4].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 flex items-center'>
                  <img src="part_tail.svg" alt="tail" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[0].parts[5].class.toLowerCase()}>
                    <p>{axies[0].parts[5].name}</p>
                  </div>
                </div>
              </div> 
              <div className="w-80 m-4 flex flex-col justify-center items-center border-2 border-purple-500 rounded-lg hover:border-purple-800 transition-all duration-150" style={{height: '26rem'}}>
                <h3 className='font-bold text-xl text-purple-400'><span className='text-purple-800 text-2xl'>{axies[1].name.split(' | ')[0]}</span>{' #' + axies[1].id}</h3>
                <h5 className='font-bold text-xl bg-purple-100 w-full text-center'>Breed count: {axies[1].breedCount}</h5>
                <div className='w-full h-10 flex items-center justify-between px-1 font-bold'>
                  <p className='bg-green-200 rounded-lg px-1'>{'HP: '+axies[1].stats.hp}</p>
                  <p className='bg-yellow-300 rounded-lg px-1'>{'Speed: '+axies[1].stats.speed}</p>
                  <p className='bg-purple-400 rounded-lg px-1'>{'Skill: '+axies[1].stats.skill}</p>
                  <p className='bg-red-200 rounded-lg px-1'>{'Morale: '+axies[1].stats.morale}</p>
                </div>
                <img src={axies[1].image} alt="axie 0" width='128px' height='128px' className='w-32 h-32 mt-1 object-cover border-2 border-purple-500 rounded-full hover:border-purple-800 transition-all duration-150'/>
                <div className='w-full h-6 bg-purple-100 mt-3 flex items-center'>
                  <img src="part_eyes.svg" alt="eyes" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[1].parts[0].class.toLowerCase()}>
                    <p>{axies[1].parts[0].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 flex items-center'>
                  <img src="part_ears.svg" alt="ears" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[1].parts[1].class.toLowerCase()}>
                    <p>{axies[1].parts[1].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 bg-purple-100 mt-1 flex items-center'>
                  <img src="part_back.svg" alt="back" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[1].parts[2].class.toLowerCase()}>
                    <p>{axies[1].parts[2].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 flex items-center'>
                  <img src="part_mouth.svg" alt="mouth" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[1].parts[3].class.toLowerCase()}>
                    <p>{axies[1].parts[3].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 bg-purple-100 flex items-center'>
                  <img src="part_horn.svg" alt="horn" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[1].parts[4].class.toLowerCase()}>
                    <p>{axies[1].parts[4].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 flex items-center'>
                  <img src="part_tail.svg" alt="tail" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[1].parts[5].class.toLowerCase()}>
                    <p>{axies[1].parts[5].name}</p>
                  </div>
                </div>
              </div> 
              <div className="w-80 m-4 flex flex-col justify-center items-center border-2 border-purple-500 rounded-lg hover:border-purple-800 transition-all duration-150" style={{height: '26rem'}}>
                <h3 className='font-bold text-xl text-purple-400'><span className='text-purple-800 text-2xl'>{axies[2].name.split(' | ')[0]}</span>{' #' + axies[2].id}</h3>
                <h5 className='font-bold text-xl bg-purple-100 w-full text-center'>Breed count: {axies[2].breedCount}</h5>
                <div className='w-full h-10 flex items-center justify-between px-1 font-bold'>
                  <p className='bg-green-200 rounded-lg px-1'>{'HP: '+axies[2].stats.hp}</p>
                  <p className='bg-yellow-300 rounded-lg px-1'>{'Speed: '+axies[2].stats.speed}</p>
                  <p className='bg-purple-400 rounded-lg px-1'>{'Skill: '+axies[2].stats.skill}</p>
                  <p className='bg-red-200 rounded-lg px-1'>{'Morale: '+axies[2].stats.morale}</p>
                </div>
                <img src={axies[2].image} alt="axie 0" width='128px' height='128px' className='w-32 h-32 mt-1 object-cover border-2 border-purple-500 rounded-full hover:border-purple-800 transition-all duration-150'/>
                <div className='w-full h-6 bg-purple-100 mt-3 flex items-center'>
                  <img src="part_eyes.svg" alt="eyes" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[2].parts[0].class.toLowerCase()}>
                    <p>{axies[2].parts[0].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 flex items-center'>
                  <img src="part_ears.svg" alt="ears" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[2].parts[1].class.toLowerCase()}>
                    <p>{axies[2].parts[1].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 bg-purple-100 mt-1 flex items-center'>
                  <img src="part_back.svg" alt="back" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[2].parts[2].class.toLowerCase()}>
                    <p>{axies[2].parts[2].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 flex items-center'>
                  <img src="part_mouth.svg" alt="mouth" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[2].parts[3].class.toLowerCase()}>
                    <p>{axies[2].parts[3].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 bg-purple-100 flex items-center'>
                  <img src="part_horn.svg" alt="horn" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[2].parts[4].class.toLowerCase()}>
                    <p>{axies[2].parts[4].name}</p>
                  </div>
                </div>
                <div className='w-full h-6 flex items-center'>
                  <img src="part_tail.svg" alt="tail" width='24px' height='24px' className='ml-2'/>
                  <div className={'w-full flex font-bold justify-center items-center mr-8 ' + 'color-'+axies[2].parts[5].class.toLowerCase()}>
                    <p>{axies[2].parts[5].name}</p>
                  </div>
                </div>
              </div> 
          </div>
          </>
        );
      case 1:
        return <div>Analytics</div>;
      case 2:
        return <div>Notifications</div>;
      default:
        return <></>;
    }
  } else {
    return <></>;
  }
}

function Dashboard() {
  const axieTable = UIStore.useState((s) => s.axieTable);
  const selectedPlayer = UIStore.useState((s) => s.selectedPlayer);
  const selectedButton = UIStore.useState((s) => s.selectedButton);
  const slpToDollar = UIStore.useState((s) => s.slpToDollar);

  const [slpToDollarLoaded, setSlpToDollarLoaded] = React.useState(0);
  const [playerInfoLoaded, setPlayerInfoLoaded] = React.useState(1);
  const [playerAxiesLoaded, setPlayerAxiesLoaded] = React.useState(1);
  function IsContentLoaded() {
    return slpToDollarLoaded;
  }

  React.useEffect(() => {
    UIStore.update((s) => {
      s.getPlayerInfo = GetPlayerInfo;
    });

    /*fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });*/

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
  });

  function GetPlayerInfo(inRonin, newPlayer) {
    if (!axieTable[newPlayer].axiesLoaded) {
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
          console.log(`${inRonin} playerData: `, data);
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
            s.axieTable[newPlayer].axieAvatar = data.axies[0].image;
            s.axieTable[newPlayer].axiesLoaded = 1;
          });
          setPlayerAxiesLoaded(1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  }

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
          <TableComponent content={axieTable}></TableComponent>
          <h2 className="mt-10 md:text-4xl text-2xl text-center font-bold">Add new player</h2>
          <TableControlComponent></TableControlComponent>
          <div className="my-10 h-0.5 md:w-11/12 w-full self-center border-blue-300" style={{ borderWidth: 1 }}></div>
          {playerAxiesLoaded * playerInfoLoaded ? (
            <div className={"md:w-11/12 w-full self-center h-auto " + (selectedPlayer === -1 ? "hidden" : "")}>
              <div className="w-full flex flex-col md:grid md:grid-flow-col md:gap-8" style={{ gridAutoColumns: "min-content auto" }}>
                <div className="flex flex-col mb-8 md:w-64 w-full text-center md:text-left">
                  <div className="avatar w-full h-auto flex justify-center">
                    <img
                      src={selectedPlayer !== -1 && playerAxiesLoaded * playerInfoLoaded ? axieTable[selectedPlayer].axieAvatar : ""}
                      width="256px"
                      height="256px"
                      alt="player avatar"
                      className="w-64 h-64 object-cover rounded-full border-2 border-purple-800"
                    />
                  </div>
                  <h3 className="font-bold text-4xl mt-4">{selectedPlayer !== -1 ? axieTable[selectedPlayer].name : ""}</h3>
                  <a
                    href={"https://t.me/" + (selectedPlayer !== -1 ? axieTable[selectedPlayer].telegram.replace("@", "") : "")}
                    className="font-light text-2xl text-purple-500 hover:text-purple-800"
                  >
                    {<i className="fa fa-telegram" />}&nbsp;{selectedPlayer !== -1 ? axieTable[selectedPlayer].telegram.replace("@", "") : ""}
                  </a>
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
                      &nbsp;&nbsp;Analytics&nbsp;&nbsp;
                    </button>
                    <button
                      onClick={() => {
                        if (selectedButton !== 2)
                          UIStore.update((s) => {
                            s.selectedButton = 2;
                          });
                      }}
                      className={"p-2 font-bold transition-all duration-150 border-b-2 " + (selectedButton === 2 ? "selected-button" : "non-selected-button")}
                    >
                      &nbsp;&nbsp;Notifications&nbsp;&nbsp;
                    </button>
                  </div>
                  <PlayerCardContentProvider id={selectedButton} data={axieTable[selectedPlayer]}></PlayerCardContentProvider>
                </div>
              </div>
            </div>
          ) : (
            <LoadingComponent responsive={true} text={"Waiting for API"} />
          )}
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
