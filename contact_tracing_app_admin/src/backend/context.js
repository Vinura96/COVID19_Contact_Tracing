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
    adminAccessRequested: false,
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
            this.setState({
              user: user,
              userName: user.displayName,
              email: user.email,
              uid: user.uid,
            });
            this.updateUserData(user);
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

  updateUserData = async (user) => {
    const data = await firebase
      .database()
      .ref("/admin/" + user.uid)
      .once("value")
      .then(function (snapshot) {
        return snapshot.val();
      });
    if (data && data.verified) {
      this.setState({
        isLoggedIn: true,
        isLoadingApp: false,
        authError: "",
      });
    } else {
      this.setState({
        isLoggedIn: false,
        isLoadingApp: false,
        userName: "",
        email: "",
        authError: "This account don't have permissions to sign in.",
      });
    }
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
  requestForAdminAccess = () => {
    firebase
      .database()
      .ref("/admin/" + this.state.user.uid)
      .set({
        email: this.state.user.email,
        name: this.state.user.displayName,
        created_at: Date.now(),
        verified: false,
        isHandled: false,
      })
      .then((snapshot) => {
        this.setState({ adminAccessRequested: true });
      });
  };
  signIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        if (!result.additionalUserInfo.isNewUser) {
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
          requestForAdminAccess: this.requestForAdminAccess,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export { ContextProvider, Context };
