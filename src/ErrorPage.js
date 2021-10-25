import { Header, Content, Footer } from "./Base";
import React from "react";

function Error() {

  return (
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
