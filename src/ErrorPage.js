import { Header, Content, Footer } from "./Base";
import React from "react";
import { useHistory } from "react-router";

function Error() {

  const history = useHistory();

  return (
    <>
      <Header>
      <div className="w-full h-auto flex flex-col md:flex-row justify-between container">
                    <div className="self-center ml-2">
                        <p className="font-bold text-white text-4xl leading-none">
                            AXIE<span className="text-xl text-black leading-none"></span>
                        </p>
                        <p className=" font-thin text-white text-lg leading-none ml-4">infinity</p>
                    </div>
                    <div className="flex mt-2 justify-center">
                        <button
                            onClick={() => {history.push('/dashboard')}}
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
                                history.push("/guilds");
                            }}
                            className="rounded-xl md:text-xl text-sm text-white hover:text-purple-300 transition-all duration-150 px-4 h-10"
                        >
                            Guilds
                        </button> */}
                        <button
                            onClick={() => {
                                history.push("/login");
                            }}
                            className="rounded-xl md:text-xl text-sm text-white hover:text-purple-300 transition-all duration-150 px-4 h-10"
                        >
                            Log in
                        </button>
                    </div>
                </div>
      </Header>
      <Content>
        <div className="w-full h- flex justify-center items-center">
          <div className="md:w-1/2 md:h-auto w-11/12 h-auto mt-24 flex flex-col items-center">
            Error
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

export { Error };
