import React from "react";
import { Switch, Route } from "react-router-dom";

import { Context } from "../backend/context";
import { Redirect } from "react-router";
import Navbar from "./navbar";
import AdminRequests from "./adminRequests";

export default function Admin() {
  const { isLoggedIn, user } = React.useContext(Context);

  return (
    <div>
      {
        // !isLoggedIn || !user ? <Redirect to="/" /> : null
      }
      <Navbar />
      <Switch>
        <Route path="/admin/adminRequests" component={AdminRequests} />
      </Switch>
    </div>
  );
}
