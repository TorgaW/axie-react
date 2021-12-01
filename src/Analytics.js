import { Header, Content, Footer } from "./Base";
import React from "react";
import { useHistory } from "react-router";
import { parseISO, closestIndexTo } from "date-fns";
import { UIStore, AnalyticsStore } from "./UIStore";
import { LoadingComponent } from "./LoadingComponent";
import { Line, Bar } from "react-chartjs-2";

function MultiFilter(array, filters) {
    if (array && filters && Array.isArray(filters) && Array.isArray(array)) {
        let a = array;
        for (const i of filters) {
            a = a.filter(i);
        }
        return a;
    } else if (array && filters && Array.isArray(array) && typeof filters === "function") {
        return array.filter(filters);
    } else {
        return array;
    }
}

function GetLast(arr, number) {
    if (number) {
        return arr.slice(-number);
    } else {
        return arr[arr.length - 1];
    }
}

function TableCellComponent(props) {
    /*

  @param props.order - order in table
  @param props.content - cells text

  //////
  #
  Name
  Team
  Formation
  SLP Now
  DailyLimit
  Avg SLP
  SLP Earned
  Avg MMR
  Quality
  //////

  */

    return (
        <tr className="h-16 border-4 border-blue-300">
            <td className="font-bold">{props.order ?? "?"}</td> {/* # */}
            <td
                onClick={() => {
                    props.nameCallback(props.content);
                }}
                className="text-purple-500 font-bold hover:text-purple-800 cursor-pointer"
            >
                {props.content ? props.content.name : "?"}
            </td>{" "}
            {/* player name */}
            <td>{props.content ? props.content.team : ""}</td> {/* Team */}
            <td>{props.content ? props.content.formation : "?"}</td> {/* Axie formation */}
            <td className="text-green-500 font-bold">{props.content ? props.content.slpNow : "?"}</td> {/* SLP now */}
            <td>{props.content ? props.content.slpDailyLimit : "?"}</td> {/* Daily SLP Limit*/}
            <td>{props.content ? props.content.avgSlpPerDay : "?"}</td> {/* Avg. SLP/day */}
            <td>{props.content ? props.content.slpEarned : "?"}</td> {/* SLP Earned */}
            <td>{props.content ? props.content.MMRNow : "?"}</td> {/* MMR Now */}
            <td>{props.content ? props.content.avgMMR : "?"}</td> {/* Avg. MMR */}
            <td className="">
                <div
                    className={
                        "w-4 h-4 ml-16 xl:ml-20 custom-bg-" +
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
            </td>
        </tr>
    );
}

function Analytics() {
    let usersTable = AnalyticsStore.useState((s) => s.usersTable);
    let axieTable = UIStore.useState((s) => s.axieTable);
    let uniqueRonins = AnalyticsStore.useState((s) => s.uniqueRonins);
    let slpToDollar = UIStore.useState((s) => s.slpToDollar);

    const [slpToDollarLoaded, setSlpToDollarLoaded] = React.useState(0);
    const [contentLoaded, setContentLoaded] = React.useState(0);
    const [tableContent, setTableContent] = React.useState([]);
    const [customPeriod, setCustomPeriod] = React.useState("yesterday");
    const [selectedPlayer, setSelectedPlayer] = React.useState("");

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
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgba(255, 99, 132, 0.2)",
                },
            ],
        },
    });
    const [MMRDataGraphType, setMMRDataGraphType] = React.useState(1);

    React.useEffect(() => {
        if(session)
        {
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
                        let aUniqueRonins = [];
                        for (const i of data.status) {
                            if (!aUniqueRonins.includes(i.userRoninAddr)) {
                                aUniqueRonins.push(i.userRoninAddr);
                            }
                        }
                        AnalyticsStore.update((s) => {
                            s.uniqueRonins = aUniqueRonins;
                        });
                        let counter = 1;
                        for (const i of aUniqueRonins) {
                            let a = MultiFilter(data.status, (a) => a.userRoninAddr === i);
                            AnalyticsStore.update((s) => {
                                s.usersTable[i] = a;
                            });
                            let b = tableContent;
                            let c = GetLast(a);
                            let t = axieTable.filter((s) => s.ronin === c.userRoninAddr);
                            let q = 3;
                            if (t[0] && t[0].qualityTracker >= 0) {
                                q = t[0].qualityTracker;
                            }
                            try {
                                b.push(
                                    <TableCellComponent
                                        nameCallback={NameCallback}
                                        order={counter}
                                        key={counter}
                                        content={{
                                            name: c.userName,
                                            team: c.team ?? "N/A",
                                            formation: c.formationName ?? "N/A",
                                            slpNow: c.slp.in_game_slp,
                                            slpDailyLimit: c.dailySlpLimit,
                                            avgSlpPerDay: c.slpPerDay.toFixed(1),
                                            slpEarned: c.slpPerDay,
                                            MMRNow: c.slp.mmr,
                                            avgMMR: c.slp.mmr.toFixed(1),
                                            qualityTracker: q,
                                            ronin: i,
                                        }}
                                    />
                                );
                            } catch {
                                continue;
                            }
                            setTableContent(b);
                            counter++;
                        }
                    }
                    setContentLoaded(1);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        
    }, [session]);

    React.useEffect(() => {
        if(session)
        {
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
        }

    }, [session]);

    function NameCallback(e) {
        console.log("its a callback", e);
        setSelectedPlayer(e.name);
    }

    function UpdateFilters(datePeriod) {
        let date1 = document.getElementById("inp-date-1").value;
        let date2 = document.getElementById("inp-date-2").value;

        let finalPlayers = [];
        let tempPlayers = [];
        let counter = 1;

        function SetupFilters() {
            let filters = [];

            let teamSelection = document.getElementById("inp-team-select").value;
            let formationSelection = document.getElementById("inp-formation-select").value;
            let quality = document.getElementById("inp-quality-select").value;
            let slp1 = document.getElementById("inp-slp-1").value;
            let slp2 = document.getElementById("inp-slp-2").value;
            let slp3 = document.getElementById("inp-slp-3").value;
            let slp4 = document.getElementById("inp-slp-4").value;
            let mmr1 = document.getElementById("inp-mmr-1").value;
            let mmr2 = document.getElementById("inp-mmr-2").value;
            let mmr3 = document.getElementById("inp-mmr-3").value;
            let mmr4 = document.getElementById("inp-mmr-4").value;
            let ronin = document.getElementById("inp-ronin").value;

            if (teamSelection !== "No Team") {
                filters.push((s) => s.team === teamSelection);
            }
            if (formationSelection !== "No Formation") {
                filters.push((s) => s.formation === formationSelection);
            }
            if (quality !== "All") {
                filters.push((s) => s.qualityTracker === (quality === "Top" ? 0 : quality === "Middle" ? 1 : quality === "Low" ? 2 : 3));
            }
            if (slp1) {
                filters.push((s) => s.slpEarned >= slp1);
            } else if (slp2) {
                filters.push((s) => s.slpEarned <= slp2);
            } else if (slp3 && slp4) {
                filters.push((s) => {
                    return s.slpEarned >= Math.min(slp3, slp4) && s.slpEarned <= Math.max(slp3, slp4);
                });
            }
            if (mmr1) {
                filters.push((s) => s.MMRNow >= mmr1);
            } else if (mmr2) {
                filters.push((s) => s.MMRNow <= mmr2);
            } else if (mmr3 && mmr4) {
                filters.push((s) => {
                    return s.MMRNow >= Math.min(mmr3, mmr4) && s.MMRNow <= Math.max(mmr3, mmr4);
                });
            }
            if (ronin.trim() !== "") {
                filters.push((s) => s.ronin === ronin);
            }

            return filters;
        }

        function SetupForYesterday() {
            for (const i in usersTable) {
                let lastReport = GetLast(usersTable[i]);
                let t = axieTable.filter((s) => s.ronin === lastReport.userRoninAddr);
                let q = 3;
                if (t[0] && t[0].qualityTracker >= 0) {
                    q = t[0].qualityTracker;
                }
                let o = {
                    name: lastReport.userName,
                    team: lastReport.team ?? "N/A",
                    formation: lastReport.formationName ?? "N/A",
                    slpNow: lastReport.slp.in_game_slp,
                    slpDailyLimit: lastReport.dailySlpLimit,
                    avgSlpPerDay: lastReport.slpPerDay.toFixed(1),
                    slpEarned: lastReport.slpPerDay,
                    MMRNow: lastReport.slp.mmr,
                    avgMMR: lastReport.slp.mmr.toFixed(1),
                    qualityTracker: q,
                    ronin: lastReport.userRoninAddr,
                };
                tempPlayers.push(o);
            }
            tempPlayers = MultiFilter(tempPlayers, SetupFilters());
            for (const i of tempPlayers) {
                finalPlayers.push(<TableCellComponent order={counter} key={counter} nameCallback={NameCallback} content={i} />);
                counter++;
            }
            setTableContent(finalPlayers);
        }

        function SetupForWeek() {
            for (const i in usersTable) {
                let lastReports = GetLast(usersTable[i], 7);
                let lastReport = GetLast(lastReports);
                console.log(lastReport);
                let avgSLP = 0;
                let avgMMR = 0;
                let slpEarned = 0;
                for (const j of lastReports) {
                    avgSLP += j.slpPerDay;
                    avgMMR += j.slp.mmr;
                    slpEarned += j.slpPerDay;
                    counter++;
                }
                avgSLP = avgSLP / counter;
                avgMMR = avgMMR / counter;
                counter = 1;
                let t = axieTable.filter((s) => s.ronin === lastReport.userRoninAddr);
                let q = 3;
                if (t[0] && t[0].qualityTracker >= 0) {
                    q = t[0].qualityTracker;
                }
                tempPlayers.push({
                    name: lastReport.userName,
                    team: lastReport.team ?? "N/A",
                    formation: lastReport.formationName ?? "N/A",
                    slpNow: lastReport.slp.in_game_slp,
                    slpDailyLimit: lastReport.dailySlpLimit,
                    avgSlpPerDay: avgSLP.toFixed(1),
                    slpEarned: slpEarned,
                    MMRNow: lastReport.slp.mmr,
                    avgMMR: avgMMR.toFixed(1),
                    qualityTracker: q,
                    ronin: lastReport.userRoninAddr,
                });
            }
            tempPlayers = MultiFilter(tempPlayers, SetupFilters());
            for (const i of tempPlayers) {
                finalPlayers.push(<TableCellComponent order={counter} key={counter} nameCallback={NameCallback} content={i} />);
                counter++;
            }
            setTableContent(finalPlayers);
        }

        function SetupForMonth() {
            for (const i in usersTable) {
                let lastReports = GetLast(usersTable[i], 30);
                let lastReport = GetLast(lastReports);
                let avgSLP = 0;
                let avgMMR = 0;
                let slpEarned = 0;
                for (const j of lastReports) {
                    avgSLP += j.slpPerDay;
                    avgMMR += j.slp.mmr;
                    slpEarned += j.slpPerDay;
                    counter++;
                }
                avgSLP = avgSLP / counter;
                avgMMR = avgMMR / counter;
                counter = 1;
                let t = axieTable.filter((s) => s.ronin === lastReport.userRoninAddr);
                let q = 3;
                if (t[0] && t[0].qualityTracker >= 0) {
                    q = t[0].qualityTracker;
                }
                tempPlayers.push({
                    name: lastReport.userName,
                    team: lastReport.team ?? "N/A",
                    formation: lastReport.formationName ?? "N/A",
                    slpNow: lastReport.slp.in_game_slp,
                    slpDailyLimit: lastReport.dailySlpLimit,
                    avgSlpPerDay: avgSLP.toFixed(1),
                    slpEarned: slpEarned,
                    MMRNow: lastReport.slp.mmr,
                    avgMMR: avgMMR.toFixed(1),
                    qualityTracker: q,
                    ronin: lastReport.userRoninAddr,
                });
            }
            tempPlayers = MultiFilter(tempPlayers, SetupFilters());
            for (const i of tempPlayers) {
                finalPlayers.push(<TableCellComponent order={counter} key={counter} nameCallback={NameCallback} content={i} />);
                counter++;
            }
            setTableContent(finalPlayers);
        }

        function SetupForCustom(dateA, dateB) {
            for (const i in usersTable) {
                let lastReports = [];
                let dates = [];
                for (const j of usersTable[i]) {
                    dates.push(parseISO(j.date));
                }
                let start = closestIndexTo(dateA, dates);
                let stop = closestIndexTo(dateB, dates);
                for (let k = start; k <= stop; k++) {
                    lastReports.push(usersTable[i][k]);
                }
                let lastReport = GetLast(lastReports);
                let avgSLP = 0;
                let avgMMR = 0;
                let slpEarned = 0;
                for (const i of lastReports) {
                    avgSLP += i.slpPerDay;
                    avgMMR += i.slp.mmr;
                    slpEarned += i.slpPerDay;
                    counter++;
                }
                avgSLP = avgSLP / counter;
                avgMMR = avgMMR / counter;
                counter = 1;
                let t = axieTable.filter((s) => s.ronin === lastReport.userRoninAddr);
                let q = 3;
                if (t[0] && t[0].qualityTracker >= 0) {
                    q = t[0].qualityTracker;
                }
                tempPlayers.push({
                    name: lastReport.userName,
                    team: lastReport.team ?? "N/A",
                    formation: lastReport.formationName ?? "N/A",
                    slpNow: lastReport.slp.in_game_slp,
                    slpDailyLimit: lastReport.dailySlpLimit,
                    avgSlpPerDay: avgSLP.toFixed(1),
                    slpEarned: slpEarned,
                    MMRNow: lastReport.slp.mmr,
                    avgMMR: avgMMR.toFixed(1),
                    qualityTracker: q,
                    ronin: lastReport.userRoninAddr,
                });
            }
            tempPlayers = MultiFilter(tempPlayers, SetupFilters());
            for (const i of tempPlayers) {
                finalPlayers.push(<TableCellComponent order={counter} key={counter} nameCallback={NameCallback} content={i} />);
                counter++;
            }
            setTableContent(finalPlayers);
        }

        switch (datePeriod) {
            case "yesterday":
                SetupForYesterday();
                if (customPeriod !== "yesterday") setCustomPeriod("yesterday");
                break;
            case "week":
                SetupForWeek();
                if (customPeriod !== "week") setCustomPeriod("week");
                break;
            case "month":
                SetupForMonth();
                if (customPeriod !== "month") setCustomPeriod("month");
                break;
            default:
                if (date1 && date2 && !isNaN(parseISO(date1)) && !isNaN(parseISO(date2))) {
                    SetupForCustom(parseISO(date1), parseISO(date2));
                } else {
                    switch (customPeriod) {
                        case "yesterday":
                            SetupForYesterday();
                            break;
                        case "week":
                            SetupForWeek();
                            break;
                        case "month":
                            SetupForMonth();
                            break;
                        default:
                            SetupForYesterday();
                            break;
                    }
                }
                break;
        }
    }

    const history = useHistory();

    return slpToDollarLoaded && contentLoaded ? (
        <>
            <Header>
                <div className="w-full h-auto flex flex-col md:flex-row justify-between container">
                    <div className="self-center ml-2">
                        <p className="font-bold text-white text-4xl leading-none">
                            AXIE<span className="text-xl text-black leading-none">Analytics</span>
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
                            onClick={() => {}}
                            className="rounded-xl md:text-xl text-sm text-white hover:text-purple-300 transition-all duration-150 px-4 h-10"
                        >
                            Analytics
                        </button>
                        <button
                            onClick={() => {
                                

                                /* bookmark #12 */


                                fetch("/api/logout", {
                                    method: "POST",
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
                                        window.location.reload();
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        window.location.reload();
                                    });


                            }}
                            className="rounded-xl md:text-xl text-sm text-white hover:text-purple-300 transition-all duration-150 px-4 h-10"
                        >
                            Log out
                        </button>
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
                <div className="w-full flex flex-col items-center">
                    <h1 className="md:text-6xl text-4xl font-semibold text-center mt-10">Scholarship Manager Analytics</h1>
                    <h2 className="md:text-2xl text-xl text-center mt-6 md:mt-10">Take control of your scholarship program by tracking performance</h2>
                    <div className="slp-element flex flex-row items-center self-center mt-10">
                        <img src="slp-bottle.png" alt="slp" srcSet="" className="h-16 w-16" />
                        <p className="text-xl font-bold"> 1 SLP = ${slpToDollar}</p>
                    </div>
                </div>
                <div className="w-full flex flex-col items-center mt-20">
                    <h2 className="md:text-6xl text-4xl font-bold text-center text-purple-800 w-full">Research stats</h2>
                    <div className="w-full py-4">
                        <h3 className="text-4xl mb-2">Show me:</h3>
                        <div className="w-full h-10 flex items-center">
                            <h4 className="border-t-2 border-b-2 border-purple-100 mr-2 font-bold text-xl">By Date:</h4>
                            <button
                                onClick={() => {
                                    UpdateFilters("yesterday");
                                }}
                                className="border-t-2 border-b-2 border-purple-300 border-l-2 px-2 hover:border-purple-800"
                            >
                                Yesterday
                            </button>
                            <button
                                onClick={() => {
                                    UpdateFilters("week");
                                }}
                                className="border-t-2 border-b-2 border-purple-300 px-2 hover:border-purple-800"
                            >
                                7 days
                            </button>
                            <button
                                onClick={() => {
                                    UpdateFilters("month");
                                }}
                                className="border-t-2 border-b-2 border-purple-300 border-r-2 px-2 hover:border-purple-800 mr-2"
                            >
                                30 days
                            </button>
                            From
                            <input
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                type="date"
                                name=""
                                id="inp-date-1"
                                className="border-t-2 border-b-2 border-purple-300 mx-2"
                            />
                            To
                            <input
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                type="date"
                                name=""
                                id="inp-date-2"
                                className="border-t-2 border-b-2 border-purple-300 mx-2"
                            />
                        </div>
                        <div className="w-full h-10 flex items-center">
                            <h4 className="border-t-2 border-b-2 border-purple-100 mr-2 font-bold text-xl">By Team:</h4>
                            <select
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                name=""
                                id="inp-team-select"
                                className="border-t-2 border-b-2 border-purple-300 hover:border-purple-800"
                            >
                                <option value="No Team">No Team</option>
                            </select>
                        </div>
                        <div className="w-full h-10 flex items-center">
                            <h4 className="border-t-2 border-b-2 border-purple-100 mr-2 font-bold text-xl">By Formation:</h4>
                            <select
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                name=""
                                id="inp-formation-select"
                                className="border-t-2 border-b-2 border-purple-300 hover:border-purple-800"
                            >
                                <option value="No Formation">No Formation</option>
                            </select>
                        </div>
                        <div className="w-full h-10 flex items-center">
                            <h4 className="border-t-2 border-b-2 border-purple-100 mr-2 font-bold text-xl">By Quality Tracker:</h4>
                            <select
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                name=""
                                id="inp-quality-select"
                                className="border-t-2 border-b-2 border-purple-300 hover:border-purple-800"
                            >
                                <option value="All">All</option>
                                <option value="Top">Top</option>
                                <option value="Middle">Middle</option>
                                <option value="Low">Low</option>
                                <option value="Non-ranked">Non-ranked</option>
                            </select>
                        </div>
                        <div className="w-full h-10 flex items-center">
                            <h4 className="border-t-2 border-b-2 border-purple-100 mr-2 font-bold text-xl">By SLP Earned:</h4>
                            Above
                            <input
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                type="text"
                                name=""
                                id="inp-slp-1"
                                className="border-t-2 border-b-2 border-purple-300 mx-2 px-1 w-20"
                            />
                            Below
                            <input
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                type="text"
                                name=""
                                id="inp-slp-2"
                                className="border-t-2 border-b-2 border-purple-300 ml-2 mr-4 px-1 w-20"
                            />
                            Between
                            <input
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                type="text"
                                name=""
                                id="inp-slp-3"
                                className="border-t-2 border-b-2 border-purple-300 mx-2 px-1 w-20"
                            />
                            and
                            <input
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                type="text"
                                name=""
                                id="inp-slp-4"
                                className="border-t-2 border-b-2 border-purple-300 mx-2 px-1 w-20"
                            />
                        </div>
                        <div className="w-full h-10 flex items-center">
                            <h4 className="border-t-2 border-b-2 border-purple-100 mr-2 font-bold text-xl">By MMR:</h4>
                            Above
                            <input
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                type="text"
                                name=""
                                id="inp-mmr-1"
                                className="border-t-2 border-b-2 border-purple-300 mx-2 px-1 w-20"
                            />
                            Below
                            <input
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                type="text"
                                name=""
                                id="inp-mmr-2"
                                className="border-t-2 border-b-2 border-purple-300 ml-2 mr-4 px-1 w-20"
                            />
                            Between
                            <input
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                type="text"
                                name=""
                                id="inp-mmr-3"
                                className="border-t-2 border-b-2 border-purple-300 mx-2 px-1 w-20"
                            />
                            and
                            <input
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                type="text"
                                name=""
                                id="inp-mmr-4"
                                className="border-t-2 border-b-2 border-purple-300 mx-2 px-1 w-20"
                            />
                        </div>
                        <div className="w-full h-12 flex items-center">
                            <h4 className="border-t-2 border-b-2 border-purple-100 mr-2 font-bold text-xl">By Ronin:</h4>
                            <input
                                onChange={() => {
                                    UpdateFilters();
                                }}
                                type="text"
                                name=""
                                id="inp-ronin"
                                placeholder="leave empty if not in use"
                                className="border-t-2 border-b-2 border-purple-300 mx-2 px-1 w-56"
                            />
                        </div>
                    </div>
                    <div className="w-full py-4 flex justify-center">
                        <div className="mt-10 w-full self-center overflow-x-auto">
                            <table
                                className="table table-auto w-full"
                                style={{
                                    minWidth: 1200,
                                }}
                            >
                                <thead>
                                    <tr className="border-t-2 border-b-2 h-12 bg-blue-300 text-xl text-center">
                                        <th className=" transition-all duration-150 border-4 border-blue-300">
                                            &nbsp;&nbsp;#&nbsp;&nbsp;
                                        </th>
                                        <th className=" transition-all duration-150 border-4 border-blue-300">
                                            Name
                                        </th>
                                        <th className=" transition-all duration-150 border-4 border-blue-300">
                                            Team
                                        </th>
                                        <th className=" transition-all duration-150 border-4 border-blue-300">
                                            Axies Formation
                                        </th>
                                        <th className=" transition-all duration-150 border-4 border-blue-300">
                                            SLP
                                        </th>
                                        <th className=" transition-all duration-150 border-4 border-blue-300">
                                            Daily SLP Limit
                                        </th>
                                        <th className=" transition-all duration-150 border-4 border-blue-300">
                                            Avg. SLP / day
                                        </th>
                                        <th className=" transition-all duration-150 border-4 border-blue-300">
                                            SLP Earned
                                        </th>
                                        <th className=" transition-all duration-150 border-4 border-blue-300">
                                            MMR
                                        </th>
                                        <th className=" transition-all duration-150 border-4 border-blue-300">
                                            Avg. MMR
                                        </th>
                                        <th className=" transition-all duration-150 border-4 border-blue-300">
                                            Quality Tracker
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-center text-lg">{tableContent}</tbody>
                            </table>
                        </div>
                    </div>

                    {/* ------------------------------------ */}
                    {selectedPlayer ? (
                        <div className="w-full">
                            <div className="w-full">
                                <h3 className="text-4xl font-bold my-4 mt-16">SLP for {selectedPlayer}</h3>
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
                            </div>

                            {/* ------------------------------------ */}

                            <div className="w-full">
                                <h3 className="text-4xl font-bold my-4 mt-16">MMR for {selectedPlayer}</h3>
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
                            </div>
                        </div>
                    ) : (
                        <></>
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

export { Analytics };
