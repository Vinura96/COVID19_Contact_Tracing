import React, { Component } from "react";
import firebase from "firebase";
import "firebase/firestore";
const Context = React.createContext();

class ContextProvider extends Component {
  state = {
    isLoadingApp: true,
    user: null,
    userName: "",
    email: "",
    isLoggedIn: false,
    uid: null,
    authError: "",
  };
  componentDidMount() {
    this.authenticateUser();
  }

  authenticateUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .auth()
          .currentUser.getIdTokenResult()
          .then((idTokenResult) => {
            if (true) {
              //!!idTokenResult.claims.admin
              this.setState({
                isLoggedIn: true,
                user: user,
                userName: user.displayName,
                email: user.email,
                uid: user.uid,
                isLoadingApp: false,
                authError: "",
              });
            } else {
              this.setState({
                isLoggedIn: false,
                user: null,
                isLoadingApp: false,
                uid: null,
                userName: "",
                email: "",
                authError: "This account don't have permissions to sign in.",
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.setState({
          isLoggedIn: false,
          user: null,
          isLoadingApp: false,
          uid: null,
          userName: "",
          email: "",
          authError: "",
        });
      }
    });
  };

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        console.log("user SignOut sucess");
      })
      .catch(function (error) {
        console.log("user signout failed");
      });
    this.setState({ user: null, isLoggedIn: false });
  };
  signIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        if (result.additionalUserInfo.isNewUser) {
          firebase
            .database()
            .ref("/admin/" + result.user.uid)
            .set({
              email: result.user.email,
              name: result.additionalUserInfo.profile.name,
              created_at: Date.now(),
              verified: false,
            })
            .then(function (snapshot) {});
        } else {
          firebase
            .database()
            .ref("/admin/" + result.user.uid)
            .update({
              last_logged_in: Date.now(),
            });
        }
        console.log("user signed in");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          signIn: this.signIn,
          signOut: this.signOut,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export { ContextProvider, Context };
