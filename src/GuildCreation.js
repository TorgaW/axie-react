import { Header, Content, Footer } from "./Base";
import React from "react";
import { useHistory, useParams } from "react-router";
import { differenceInMinutes } from "date-fns";

/*

ronin:bb28ec1e0ef8a07d02a4e9e495532ce337bb6b36
ronin:edbc6bd7161364b747926c22a864ceff814510bd
ronin:21bde0b8180a956fbbf8f8031653b02e2b25c5d9
ronin:11bc50f86c6d8975ca87d811b593fbf1ae575451

*/


function GuildCreation() {
  const [playerInputs, setPlayerInputs] = React.useState([
    <>
      <div className="w-full flex my-2">
        <h5 className="text-xl">Player:</h5>
        <input
          type="text"
          placeholder="ronin:xxxxxxxxxxxxxxxxxxxxxxxxx"
          name=""
          className="ronin w-52 ml-4 border-2 px-2 border-purple-800 hover:bg-purple-100 rounded-lg focus:outline-none"
        />
      </div>
    </>,
  ]);

  function HandleUploadImage(file, name) {
    let a = file.name.split(".");
    let size = file.size / 1024 / 1024;
    if (size > 1.5) {
      alert(`Maximum size is 1.5 MB!`);
      return;
    } else {
      Object.defineProperty(file, "name", {
        writable: true,
        value: name + "." + a[a.length - 1],
      });
    }
    let form = new FormData();
    form.append("file", file, file.name);

    fetch("/api/changeGuildAvatar", {
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

  function CreateGuild() {
    let a = document.getElementById("guild-name").value.replaceAll(' ', '-');
  
    if (a.trim() === "" || a.trim().length < 3 || !/^[a-zA-Z0-9-]+$/.test(a)) {
      alert("Please, change guild name!");
      return;
    }

    let b = document.getElementById("icon-input");
    const acceptedImageTypes = ["image/jpeg", "image/png"];
    if (!(b.files[0] && acceptedImageTypes.includes(b.files[0]["type"]))) {
      alert("Bad image!");
      return;
    }

    let c = document.querySelectorAll(".ronin");
    let d = [];

    for (const i of c) {
      let v = i.value;

      if (v.split(":").length !== 2 || v.length !== 46) {
        continue;
      } else {
        d.push(v.split(":")[1]);
      }
    }

    if(d.length < 1)
    {
      alert('Add some people to your guild!');
      return;
    }

    fetch("/api/createGuild", {
      method: "POST",
      body: JSON.stringify({ guildName: a, ronins: d }),
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
        
        if (data.status) {
          HandleUploadImage(b.files[0],a);
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }

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
        <div className="w-full py-8 flex flex-col justify-center items-center px-10">
          <h1 className="text-6xl font-bold ">Create your guild!</h1>
          <div className="w-full flex mt-10">
            <h3 className="text-3xl">Give a name to your guild:</h3>
            <input type="text" name="name" id="guild-name" className="ml-4 border-2 px-2 border-purple-800 hover:bg-purple-100 rounded-lg focus:outline-none" />
          </div>
          <div className="w-full flex h-auto items-center my-10">
            <button
              onClick={() => {
                document.getElementById("icon-input").click();
              }}
              className="text-3xl h-10 border-2 px-2 transition-all duration-150 border-purple-800 hover:bg-purple-600 hover:text-white bg-purple-300 rounded-lg focus:outline-none"
            >
              Upload guild icon
            </button>
            <img
              src="###"
              id="g-image"
              alt="guild"
              width="160px"
              height="160px"
              style={{ width: "160px", height: "160px" }}
              className="mx-2 border-2 rounded-lg"
            />
            <input
              onChange={(e) => {
                let image = document.getElementById("g-image");
                try {
                  image.src = URL.createObjectURL(e.target.files[0]);
                } catch {}
              }}
              type="file"
              name=""
              id="icon-input"
              className="hidden"
            />
          </div>
          <div className="w-full flex flex-col h-auto my-10">
            <h3 className="text-3xl mb-2">Your guildmates:</h3>
            {playerInputs}
            <button
              onClick={() => {
                setPlayerInputs([
                  ...playerInputs,
                  <>
                    <div className="w-full flex my-2">
                      <h5 className="text-xl">Player:</h5>
                      <input
                        type="text"
                        placeholder="ronin:xxxxxxxxxxxxxxxxxxxxxxxxx"
                        name=""
                        className="ronin w-52 ml-4 border-2 px-2 border-purple-800 hover:bg-purple-100 rounded-lg focus:outline-none"
                      />
                    </div>
                  </>,
                ]);
              }}
              className="border-2 mt-2 transition-all duration-150 border-purple-800 hover:bg-purple-600 hover:text-white bg-purple-300 rounded-lg focus:outline-none w-72 h-8 font-bold text-2xl"
            >
              +
            </button>
          </div>

          <button
            onClick={() => {
              CreateGuild();
            }}
            className="w-40 h-12 bg-green-400 self-center mt-10 rounded-lg font-bold text-lg transition-all duration-150 hover:bg-green-500 hover:text-white"
          >
            Create!
          </button>
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

export { GuildCreation };
