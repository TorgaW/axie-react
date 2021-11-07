import { Header, Content, Footer } from "./Base";
import React from "react";
import { useHistory, useParams } from "react-router";

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
      <td className="font-bold">{props.order ?? "?"}</td> {/* Name */}
      <td className="font-bold">{props.order ?? "?"}</td> {/* Avg Daily SLP */}
      <td className="font-bold">{props.order ?? "?"}</td> {/* Yesterday SLP */}
      <td className="font-bold">{props.order ?? "?"}</td> {/* Unclaimed SLP */}
      <td className="font-bold">{props.order ?? (new Date().toISOString().slice(0,10))}</td> {/* Next Claim */}
      <td className="font-bold">{props.order ?? "?"}</td> {/* Team */}
      <td className="font-bold">{props.order ?? "?"}</td> {/* Formation */}
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

function Guild() {
  const history = useHistory();
  const { guildName } = useParams();

  return (
    <>
      <Header>
        <div className="w-48 ml-10 h-auto md:container md:ml-4">
          <p className="font-bold text-white text-4xl leading-none">
            AXIE<span className="text-xl text-black leading-none">Guild</span>
          </p>
          <p className=" font-thin text-white text-lg leading-none ml-4">infinity</p>
          <div className="hidden fixed bg-pink-900 w-full h-40 bottom-0 left-0"></div>
        </div>
      </Header>
      <Content>
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-6xl font-bold">{guildName}</h1>
          <img className="w-48 h-48 border-2 rounded-full border-purple-800 my-6" src="/placeholder-avatar.png" alt="guild" />
          <div className="w-full flex items-center mt-4">
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
          </div>
          <div className="w-full flex items-center mt-4">
            <div className="w-1/2 h-full flex flex-col items-center justify-center">
              <h3 className="text-4xl mt-4">Arena MVP:</h3>
              <span className="text-green-600 text-4xl font-bold">$NAME</span>
            </div>
            <div className="w-1/2 h-full flex flex-col items-center justify-center">
              <h3 className="text-4xl mt-4">SLP MVP:</h3>
              <span className="text-green-600 text-4xl font-bold">$NAME</span>
            </div>
          </div>

          <h3 className="text-4xl mt-4">Top players:</h3>
          <span className="text-green-600 text-4xl font-bold">X (%)</span>

          <h3 className="text-4xl mt-4">Most popular formations:</h3>
          <span className="text-green-600 text-4xl font-bold">A-B-C (%)</span>
          <span className="text-green-600 text-4xl font-bold">X-Y-Z (%)</span>

          <p className="self-start text-xl">Data last refreshed: DATE</p>

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
                    <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
                      &nbsp;&nbsp;🕥&nbsp;&nbsp;
                    </th>
                    <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
                      &nbsp;&nbsp;#&nbsp;&nbsp;
                    </th>
                    <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
                      Name
                    </th>
                    <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
                      Avg. Daily SLP
                    </th>
                    <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
                      Yesterday SLP
                    </th>
                    <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
                      Unclaimed SLP
                    </th>
                    <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
                      Next Claim
                    </th>
                    <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
                      Team
                    </th>
                    <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
                      Formation
                    </th>
                    <th className="cursor-pointer hover:text-purple-700 hover:bg-gray-100 hover:border-gray-100 transition-all duration-150 border-4 border-blue-300">
                      Quality Tracker
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center text-lg">
                  <TableCellComponent />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Content>
      <Footer>
        <div className="w-full h-full px-10 py-2 flex justify-center items-center text-gray-300">
          <p>© 2021 Copyright</p>
        </div>
      </Footer>
    </>
  );
}

export { Guild };
