import React from "react";
import { Switch, Route } from "react-router-dom";

import { Context } from "../backend/context";
import { Redirect } from "react-router";
import Navbar from "./navbar";
import AdminRequests from "./adminRequests";
import FindUsers from "./findUsers";
import InfectedUsers from "./infectedUsers";
import UserDetails from "./userDetails";

export default function Admin() {
  const { isLoggedIn, user } = React.useContext(Context);

  return (
    <div>
      {
        // !isLoggedIn || !user ? <Redirect to="/" /> : null
      }
      <Navbar />
      <Switch>
        <Route exact path="/admin/adminRequests" component={AdminRequests} />
        <Route exact path="/admin/findUsers" component={FindUsers} />
        <Route path="/admin/userDetails/:id" component={UserDetails} />
        <Route path="/admin/" component={InfectedUsers} />
      </Switch>
    </div>
  );
}
