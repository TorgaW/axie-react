import "./App.css";
import { PageHolder, Header, Content, Footer } from "./Base";
import React from "react";
import {Dashboard} from './Dashboard';
import {Login} from './LoginPage';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Error } from './ErrorPage';

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path='/login'>
          <PageHolder>
            <Login />
          </PageHolder>
        </Route>
        <Route path='/'>
          <PageHolder>
            <Dashboard />
          </PageHolder>
        </Route>
        <Route path='/error'>
          <PageHolder>
            <Error />
          </PageHolder>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
