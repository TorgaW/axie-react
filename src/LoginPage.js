import { Header, Content, Footer } from "./Base";
import React from "react";
import { useHistory } from "react-router";

function Login() {
  const [isLoginState, setIsLoginState] = React.useState(true);
  const [isCorrectPassword, setIsCorrectPassword] = React.useState(true);
  const [isPasswordsMatch, setIsPasswordsMatch] = React.useState(true);
  const [isUserExist, setIsUserExist] = React.useState(false);

  const history = useHistory();

  function CheckLoginData() {
    let inputs = document.querySelectorAll('[id^="inp-"]');
    let emailText = inputs[0].value;
    let passText = inputs[1].value;
    let secondPassText = inputs[2].value;

    function ValidateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    if (isLoginState) {
      console.log("login");
      if(ValidateEmail(emailText) && emailText.trim() !== '' && passText.trim() !== '')
      {
        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ email: emailText, pass: passText}),
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
              if(data.status === 'not equalPass')
              {
                  setIsCorrectPassword(false);
              }
              else
              {
                  /*
                  if correct
                  */

                  history.push('/tracker');

                  console.log(data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
      }
      else
      {
          setIsCorrectPassword(false);
          return;
      }
    } else {
      console.log("reg");
      if(ValidateEmail(emailText) && emailText.trim() !== '' && passText.trim() !== '')
      {
        if(passText === secondPassText)
        {
            fetch("/api/reg", {
                method: "POST",
                body: JSON.stringify({ email: emailText, pass: passText}),
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
                  if(data.status === 'created')
                  {
                    /*
                    if correct
                    */

                    history.push('/tracker');
                  }
                  else
                  {
                    setIsUserExist(true);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
        }
        else
        {
            setIsPasswordsMatch(false);
            return
        }
      }
      else
      {
          setIsCorrectPassword(false);
          return;
      }
    }
  }

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
            <h1 className="text-2xl font-bold text-purple-800">{isLoginState ? "Login" : "Register"}</h1>
            <div className="h-16 w-7/12 mt-2">
              <p className="text-purple-800">Email</p>
              <input type="text" name="mail" id="inp-mail" className="border-2 rounded-lg p-2 w-full h-8 border-purple-400" />
            </div>
            <div className="h-16 w-7/12 mt-2">
              <p className="text-purple-800">Password</p>
              <input type="text" name="pass" id="inp-pass" className="border-2 rounded-lg p-2 w-full h-8 border-purple-400" />
            </div>
            <div className={"h-16 w-7/12 mt-2 " + (isLoginState ? "hidden" : "")}>
              <p className="text-purple-800">Confirm password</p>
              <input type="text" name="pass" id="inp-pass-2" className="border-2 rounded-lg p-2 w-full h-8 border-purple-400" />
            </div>
            <p className={"text-red-600 " + (isCorrectPassword ? "hidden" : "")}>Incorrect email or password</p>
            <p className={"text-red-600 " + (isPasswordsMatch ? "hidden" : "")}>Not equal passwords!</p>
            <p className={"text-red-600 " + (isUserExist ? "" : "hidden")}>User already exist!</p>
            <button
              onClick={CheckLoginData}
              className="w-40 h-10 bg-purple-400 self-center mt-2 rounded-lg font-bold text-lg transition-all duration-150 hover:bg-purple-500 hover:text-white"
            >
              {isLoginState ? "Go!" : "Register"}
            </button>
            <div className="w-7/12">
              <p
                onClick={() => {
                  setIsLoginState(!isLoginState);
                  setIsPasswordsMatch(true);
                  setIsCorrectPassword(true);
                }}
                className="underline text-purple-800 hover:text-purple-600 cursor-pointer w-16"
              >
                Register
              </p>
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

export { Login };
