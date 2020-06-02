import React from "react";
import { Switch, Route } from "react-router-dom";

import { Context } from "../backend/context";
import { Redirect } from "react-router";
import Navbar from "./navbar";

export default function Admin() {
  const { isLoggedIn, user } = React.useContext(Context);

  return (
    <div>
      {!isLoggedIn || !user ? <Redirect to="/" /> : null}
      <Navbar />
      <div>Admin UI</div>
    </div>
  );
}
