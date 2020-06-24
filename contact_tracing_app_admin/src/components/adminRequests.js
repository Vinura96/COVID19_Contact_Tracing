import React, { useState, useEffect } from "react";
import firebase from "firebase";
import "firebase/firestore";
import { Context } from "../backend/context";

export default function AdminRequests() {
  //   const { isLoggedIn, user } = React.useContext(Context);
  const [requests, setRequests] = useState([]);
  const [filterBy, setFilterBy] = useState("NotHandled");

  const FILTER_OPTIONS = {
    Handled: { value: true },
    NotHandled: { value: false },
  };
  useEffect(() => {
    var query = firebase
      .database()
      .ref(`/admin/`)
      .orderByChild("isHandled")
      .equalTo(FILTER_OPTIONS[filterBy].value)
      .on("value", async (snapshot) => {
        var list = [];
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val()) {
            list.push({ ...childSnapshot.val(), id: childSnapshot.key });
          }
        });
        setRequests(list);
      });

    // return () => {
    //   observer2();
    // };
  }, [filterBy]);

  const handleActionAccept = (id) => {
    firebase
      .database()
      .ref("/admin/" + id)
      .update({
        isHandled: true,
        verified: true,
      });
  };
  const handleActionRemove = (id) => {
    firebase
      .database()
      .ref("/admin/" + id)
      .update({
        isHandled: true,
        verified: false,
      });
  };
  return (
    <div className="pt-5 container text-left">
      <div className="row">
        <div className="col-12 h3 pt-3 text-center">Admin Access Requests</div>
      </div>
      <div className="row text-right ">
        <div className="col-5 col-sm-2 h6 offset-2 offset-sm-7 my-auto">
          Filter By
        </div>
        <div className="col-5 col-sm-3 ">
          <select
            className="form-control"
            defaultValue="NotHandled"
            onChange={(e) => {
              setFilterBy(e.target.value);
            }}
          >
            <option value="NotHandled">Not Handled</option>
            <option value="Handled">Handled</option>
          </select>
        </div>
      </div>
      {requests && requests.length > 0 ? (
        <div className="row mx-3 px-2 h6 mt-3">
          <div className="col-4">Name</div>
          <div className="col-4">Email</div>
        </div>
      ) : (
        <div className="row text-center py-3 ">
          <div className="col-12">No Data</div>
        </div>
      )}
      {requests.map((item, index) => {
        return (
          <div key={index} className="card container m-3 p-3">
            <div className="row">
              <div className="col-4 py-2">{item.name}</div>
              <div className="col-4 py-2">{item.email}</div>
              <div className="col-2">
                <button
                  disabled={item.isHandled && item.verified}
                  className="btn btn-success"
                  onClick={() => handleActionAccept(item.id)}
                >
                  Accept
                </button>
              </div>
              <div className="col-2">
                <button
                  disabled={item.isHandled && !item.verified}
                  className="btn btn-danger"
                  onClick={() => handleActionRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
