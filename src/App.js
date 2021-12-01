import "./App.css";
import { PageHolder, Header, Content, Footer } from "./Base";
import React from "react";
import { Dashboard } from "./Dashboard";
import { Login } from "./LoginPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Error } from "./ErrorPage";
import { Analytics } from "./Analytics";
import { Guild } from "./Guild";
import { Guilds } from "./Guilds";
import {GuildCreation} from './GuildCreation';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <PageHolder>
            <Dashboard />
          </PageHolder>
        </Route>
        <Route exact path="/dashboard">
          <PageHolder>
            <Dashboard />
          </PageHolder>
        </Route>
        <Route exact path="/login">
          <PageHolder>
            <Login />
          </PageHolder>
        </Route>
        <Route exact path="/analytics">
          <PageHolder>
            <Analytics />
          </PageHolder>
        </Route>
        <Route exact path="/error">
          <PageHolder>
            <Error />
          </PageHolder>
        </Route>
        <Route exact path="/createguild">
          <PageHolder>
            <GuildCreation />
          </PageHolder>
        </Route>
        {/* <Route path="/guilds">
          <PageHolder>
            <Guilds />
          </PageHolder>
        </Route> */}
        <Route path="/guild/:guildName">
          <PageHolder>
            <Guild />
          </PageHolder>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
