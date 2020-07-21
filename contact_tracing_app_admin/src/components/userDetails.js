import React, { useState, useEffect } from "react";
import firebase from "firebase";
import "firebase/firestore";
import { Context } from "../backend/context";

import { Link } from "react-router-dom";

export default function UserDetails(props) {
  const { sendContactedNotifications, allNotificationsSent } = React.useContext(
    Context
  );
  const [user, setUser] = useState(null);
  const [contactedUsers, setContactedUsers] = useState(null);

  useEffect(() => {
    firebase
      .database()
      .ref("/users/" + props.match.params.id)
      .once("value")
      .then(function (snapshot) {
        setUser(snapshot.val());
      });

    firebase
      .database()
      .ref(`/users/${props.match.params.id}/contactedUsers`)
      .once("value")
      .then((snapshot) => {
        var list = [];
        var list3 = [];
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val()) {
            list.push(childSnapshot.val().id);
            list3.push(childSnapshot.val());
          }
        });
        // console.log(list);
        firebase
          .database()
          .ref(`/users`)
          .once("value")
          .then((snapshot) => {
            var list2 = [];
            snapshot.forEach(function (childSnapshot) {
              if (
                childSnapshot.val() &&
                list.includes(childSnapshot.val().id)
              ) {
                list2.push({
                  ...childSnapshot.val(),
                  key: childSnapshot.key,
                  contacted_time:
                    list3[list.indexOf(childSnapshot.val().id)].contacted_time,
                });
              }
            });
            setContactedUsers(list2);
          });
      });
  }, []);
  return (
    <div className="pt-5 container text-left">
      <div className="row">
        <div className="col-12 h3 pt-2 text-center">User Details</div>
      </div>

      {user && (
        <div className="row mt-2">
          <div className="col-12">
            <div className="form-row">
              <div className=" col-md-6">
                <div className="form-group py-0 my-1 row">
                  <label className="col-sm-2 col-form-label">ID :</label>
                  <div className="col-sm-9">
                    <input className="form-control" disabled value={user.id} />
                  </div>
                </div>
              </div>
              <div className=" col-md-6">
                <div className="form-group py-0 my-1 row">
                  <label className="col-sm-2 col-form-label">Name :</label>
                  <div className="col-sm-9">
                    <input
                      disabled
                      className="form-control"
                      value={user.name}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className=" col-md-6">
                <div className="form-row">
                  <div className=" col-md-12">
                    <div className="form-group py-0 my-1 row">
                      <label className="col-sm-2 col-form-label">Phone :</label>
                      <div className="col-sm-9">
                        <input
                          disabled
                          className="form-control"
                          value={user.phone}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-12">
                    <div className="form-group py-0 my-1 row">
                      <label className="col-sm-2 col-form-label">
                        Infected :
                      </label>
                      <div className="col-sm-9">
                        <input
                          disabled
                          className="form-control"
                          value={user.infected ? "Yes" : "No"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-6">
                <div className="form-group py-0 my-1 row">
                  <label className="col-sm-2 col-form-label">Address :</label>
                  <div className="col-sm-9">
                    <textarea
                      disabled
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows="3"
                      value={user.address}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row mt-3">
        <div className="col-4 h5">Contacted Persons</div>
        <div className="col-4">
          Total : {contactedUsers && contactedUsers.length}
        </div>
        {user && user.infected && (
          <div className="col-4">
            <button
              onClick={() => sendContactedNotifications(contactedUsers)}
              className="btn btn-sm btn-warning"
              disabled={!allNotificationsSent}
            >
              Send Notifications All
            </button>
          </div>
        )}
      </div>
      <div className="row mt-2 text-center">
        <div className="col-12 border-left border-right border-gray overflow-hidden rounded-lg">
          <div>
            <div className="row border-bottom border-top border-gray">
              <div className="border-right border-gray col-2 pt-2 font-weight-bold">
                ID
              </div>
              <div className="border-right border-gray col-2 pt-2 font-weight-bold">
                Name
              </div>
              <div className="border-right border-gray col-3 pt-2 font-weight-bold">
                Address
              </div>
              <div className="border-right border-gray col-2 pt-2 font-weight-bold">
                Phone
              </div>
              <div className="col-3 pt-1 font-weight-bold">
                14 days contacted persons count / uploaded date
              </div>
            </div>
          </div>
          {console.log(contactedUsers)}
          {user && contactedUsers && contactedUsers.length > 0 ? (
            contactedUsers.map((item, index) => (
              <div key={index}>
                <div className="row border-bottom border-gray">
                  <div className="border-right border-gray col-2 p-2  overflow-hidden">
                    {item.id}
                  </div>
                  <div className="border-right border-gray col-2 p-2  overflow-hidden">
                    {item.name}
                  </div>
                  <div className="border-right border-gray col-3 p-2  overflow-hidden">
                    {item.address}
                  </div>
                  <div className="border-right border-gray col-2 p-2  overflow-hidden">
                    {item.phone}
                  </div>
                  {item.contactedUsers ? (
                    <div className="col-3 p-2  overflow-hidden">
                      {item.contactedUsers.length} ({" "}
                      {new Date(
                        item.contacted_details_uploaded_date
                      ).toLocaleDateString()}
                      )
                    </div>
                  ) : (
                    <div className="col-3 p-2  overflow-hidden">
                      Not Uploaded
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="row text-center py-3 border-bottom border-gray">
              <div className="col-12">No Data</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
