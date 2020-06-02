import React from "react";
import Auth from "./components/auth";
import { Switch, Route } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

import firebase from "firebase";
import { firebaseConfig } from "./backend/firebaseConfig";
import Admin from "./components/admin";

library.add(fab);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  return (
    <React.Fragment>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/" component={Auth} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
