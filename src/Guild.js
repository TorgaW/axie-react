import { Header, Content, Footer } from "./Base";
import { LoadingComponent } from "./LoadingComponent";
import React from "react";
import { useHistory, useParams } from "react-router";
import { formatRFC7231, fromUnixTime } from "date-fns";

function TableCellComponent(props) {
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

    return (
        <tr className="h-16 border-4 border-blue-300">
            <td className="font-bold">✅</td> {/* часы */}
            <td className="font-bold">{props.order ?? "?"}</td> {/* # */}
            <td className="font-bold">{props.data.name.split(' | ')[0] ?? "?"}</td> {/* Name */}
            <td className="font-bold">{/*props.order ?? */"?"}</td> {/* Avg Daily SLP */}
            <td className="font-bold">{"?"}</td> {/* Yesterday SLP */}
            <td className="font-bold">{props.data.in_game_slp ?? "?"}</td> {/* Unclaimed SLP */}
            <td className="font-bold">{formatRFC7231(fromUnixTime(props.data.next_claim))}</td> {/* Next Claim */}
            {/* <td className="font-bold">{props.order ?? "?"}</td>
      <td className="font-bold">{props.order ?? "?"}</td>
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
      </td> */}
        </tr>
    );
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

    return (
        <tr className="h-16 border-4 border-blue-300">
            <td className="font-bold">✅</td> {/* часы */}
            <td className="font-bold">{props.order ?? "?"}</td> {/* # */}
            <td className="font-bold">{props.data.name.split(" | ")[0] ?? "?"}</td> {/* Name */}
            <td className="font-bold">{props.data.rank ?? "?"}</td> {/* Rank */}
            <td className="font-bold">{"?"}</td> {/* ELO*/}
            {/* <td className="font-bold">{props.order ?? "?"}</td>
      <td className="font-bold">{props.order ?? "?"}</td>
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
      </td> */}
        </tr>
    );
}

function SLPTableComponent(props) {

  let mas = [];

  if(props.data)
  {
    let counter = 0;
    for (const i of props.data) {
      mas.push(<TableCellComponent order={counter} data={i} key={counter}/>);
      counter++;
    } 
  }

    return (
        <div className="w-full py-4 flex justify-center">
            <div className="mt-2 w-full self-center overflow-x-auto">
                <table
                    className="table table-auto w-full"
                    style={{
                        minWidth: 1200,
                    }}
                >
                    <thead>
                        <tr className="border-t-2 border-b-2 h-12 bg-blue-300 text-xl text-center">
                            <th className="transition-all duration-150 border-4 border-blue-300">&nbsp;&nbsp;🕥&nbsp;&nbsp;</th>
                            <th className="  transition-all duration-150 border-4 border-blue-300">
                                &nbsp;&nbsp;#&nbsp;&nbsp;
                            </th>
                            <th className="  transition-all duration-150 border-4 border-blue-300">
                                Name
                            </th>
                            <th className="  transition-all duration-150 border-4 border-blue-300">
                                Avg. Daily SLP
                            </th>
                            <th className="  transition-all duration-150 border-4 border-blue-300">
                                Yesterday SLP
                            </th>
                            <th className="  transition-all duration-150 border-4 border-blue-300">
                                Unclaimed SLP
                            </th>
                            <th className="  transition-all duration-150 border-4 border-blue-300">
                                Next Claim
                            </th>
                            {/* <th className="cursor-pointer hover:text-purple-700  transition-all duration-150 border-4 border-blue-300">
                Team
              </th>
              <th className="cursor-pointer hover:text-purple-700  transition-all duration-150 border-4 border-blue-300">
                Formation
              </th>
              <th className="cursor-pointer hover:text-purple-700  transition-all duration-150 border-4 border-blue-300">
                Quality Tracker
              </th> */}
                        </tr>
                    </thead>
                    <tbody className="text-center text-lg">
                        {mas}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ArenaTableComponent(props) {
  
  let mas = [];

  if(props.data)
  {
    let counter = 0;
    for (const i of props.data) {
      mas.push(<ArenaTableCellComponent order={counter} data={i} key={counter}/>);
      counter++;
    } 
  }

    return (
        <div className="w-full py-4 flex justify-center">
            <div className="mt-2 w-full self-center overflow-x-auto">
                <table
                    className="table table-auto w-full"
                    style={{
                        minWidth: 1200,
                    }}
                >
                    <thead>
                        <tr className="border-t-2 border-b-2 h-12 bg-blue-300 text-xl text-center">
                            <th className="  transition-all duration-150 border-4 border-blue-300">
                                &nbsp;&nbsp;🕥&nbsp;&nbsp;
                            </th>
                            <th className="  transition-all duration-150 border-4 border-blue-300">
                                &nbsp;&nbsp;#&nbsp;&nbsp;
                            </th>
                            <th className="  transition-all duration-150 border-4 border-blue-300">
                                Name
                            </th>
                            <th className="  transition-all duration-150 border-4 border-blue-300">
                                Rank
                            </th>
                            <th className="  transition-all duration-150 border-4 border-blue-300">
                                ELO
                            </th>
                            {/* <th className="cursor-pointer hover:text-purple-700  transition-all duration-150 border-4 border-blue-300">
                Team
              </th>
              <th className="cursor-pointer hover:text-purple-700  transition-all duration-150 border-4 border-blue-300">
                Formation
              </th>
              <th className="cursor-pointer hover:text-purple-700  transition-all duration-150 border-4 border-blue-300">
                Quality Tracker
              </th> */}
                        </tr>
                    </thead>
                    <tbody className="text-center text-lg">
                        {mas}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Guild() {
    const [showSLP, setShowSLP] = React.useState(true);
    const [players, setPlayers] = React.useState([]);
    const [arenaMVP, setArenaMVP] = React.useState('');
    const [slpMVP, setSlpMVP] = React.useState('');
    const [topPlayers, setTopPlayers] = React.useState([]);

    const history = useHistory();
    const { guildName } = useParams();

    const [session, setSession] = React.useState(false);

    React.useEffect(()=>{
        fetch("/api/sessionExist", {
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
                if(data.status !== 'notexist')
                {
                    setSession(true);
                }
                else
                {
                    history.push('/login');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },[])

    React.useEffect(() => {
        if(session)
        {
            fetch("/api/getGuilds", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(response.statusText);
                    }
                })
                .then((data) => {
                    console.log("guilds", data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    },[session]);

    React.useEffect(() => {
        fetch("/api/getGuildMembers", {
            method: "POST",
            body: JSON.stringify({ guildName: guildName }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((data) => {
                if(data.membersStats)
                {

                  let arrrrrr = [];
                  for (const i of Object.values(data.membersStats)) {
                    arrrrrr.push(i);
                  }

                  console.log('acv',arrrrrr)
                  try{
                    let maxRank = 100000000000;
                    let rankMVP = '';
                    for (const i of arrrrrr) {
                      console.log(i)
                      if(maxRank > i.rank)
                      {
                        maxRank = i.rank;
                        rankMVP = i.name.split(" | ")[0];
                      }
                    }
                    let maxSlp = 0;
                    let slpMVP = '';
                    for (const i of arrrrrr) {
                      if(maxSlp < i.in_game_slp)
                      {
                        maxSlp = i.in_game_slp;
                        slpMVP = i.name.split(" | ")[0];
                      }
                    }
                    let b = [...arrrrrr];
                    b.sort((e, r)=>e.rank-r.rank);
                    setSlpMVP(slpMVP);
                    setArenaMVP(rankMVP);
                    setPlayers(arrrrrr);
                    let brbrbrbr = [];
                    for (const i of b.splice(0,3)) {
                      brbrbrbr.push(<span className="text-green-600 text-4xl font-bold" key={i}>{i.name.split(" | ")[0]}</span>);
                    }
                    setTopPlayers(brbrbrbr);
                  }catch{}

                }
            })
            .catch((error) => {
                console.log(error);
            });
    },[]);

    return players.length > 0 ? (
        <>
            <Header>
                <div className="w-full h-auto flex flex-col md:flex-row justify-between container">
                    <div className="self-center ml-2">
                        <p className="font-bold text-white text-4xl leading-none">
                            AXIE<span className="text-xl text-black leading-none">Guilds</span>
                        </p>
                        <p className=" font-thin text-white text-lg leading-none ml-4">infinity</p>
                    </div>
                    <div className="flex mt-2 justify-center">
                        <button
                            onClick={() => {
                                history.push("/dashboard");
                            }}
                            className="rounded-xl md:text-xl text-sm text-white hover:text-purple-300 transition-all duration-150 px-4 h-10"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => {
                                history.push("/analytics");
                            }}
                            className="rounded-xl md:text-xl text-sm text-white hover:text-purple-300 transition-all duration-150 px-4 h-10"
                        >
                            Analytics
                        </button>
                        {/* <button
                            onClick={() => {
                            }}
                            className="rounded-xl md:text-xl text-sm text-white hover:text-purple-300 transition-all duration-150 px-4 h-10"
                        >
                            Guilds
                        </button> */}
                        {/* <button
                            onClick={() => {
                                history.push("/login");
                            }}
                            className="rounded-xl md:text-xl text-sm text-white hover:text-purple-300 transition-all duration-150 px-4 h-10"
                        >
                            Log in
                        </button> */}
                    </div>
                </div>
            </Header>
            <Content>
                <div className="w-full flex flex-col justify-center items-center">
                    <h1 className="text-6xl font-bold">{guildName}</h1>
                    <img className="w-48 h-48 border-2 rounded-full border-purple-800 my-6" src={"/api/getGuildImage/?guildName=" + guildName} alt="guild" />
                    {/* <div className="w-full flex items-center mt-4">
            <div className="w-1/2 h-full flex flex-col items-center justify-center">
              <h3 className="text-4xl">Total weekly SLP:</h3>
              <span className="text-green-600 text-4xl font-bold">XXX</span>
              <p className="text-lg">for period ...-...</p>
            </div>
            <div className="w-1/2 h-full flex flex-col items-center justify-center">
              <h3 className="text-4xl">Average weekly SLP:</h3>
              <span className="text-green-600 text-4xl font-bold">XXX</span>
              <p className="text-lg">for period ...-...</p>
            </div>
          </div> */}
                    <div className="w-full flex items-center mt-4">
                        <div className="w-1/2 h-full flex flex-col items-center justify-center">
                            <h3 className="text-4xl mt-4">Arena MVP:</h3>
                            <span className="text-green-600 text-4xl font-bold">{arenaMVP}</span>
                        </div>
                        <div className="w-1/2 h-full flex flex-col items-center justify-center">
                            <h3 className="text-4xl mt-4">SLP MVP:</h3>
                            <span className="text-green-600 text-4xl font-bold">{slpMVP}</span>
                        </div>
                    </div>

                    <h3 className="text-4xl mt-4">Top players:</h3>
                    {topPlayers}

                    {/* <h3 className="text-4xl mt-4">Most popular formations:</h3>
          <span className="text-green-600 text-4xl font-bold">A-B-C (%)</span>
          <span className="text-green-600 text-4xl font-bold">X-Y-Z (%)</span> */}

                    {/* <p className="self-start text-xl">Data last refreshed: {new Date()}</p> */}

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
                    {showSLP ? <SLPTableComponent data={players} /> : <ArenaTableComponent data={players}/>}
                </div>
            </Content>
            <Footer>
                <div className="w-full h-full px-10 py-2 flex justify-center items-center text-gray-300">
                    <p>© 2021 Copyright</p>
                </div>
            </Footer>
        </>
    ) : <LoadingComponent />;
}

export { Guild };
