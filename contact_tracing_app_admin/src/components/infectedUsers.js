import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { Context } from "../backend/context";

import { Link } from "react-router-dom";

export default function InfectedUsers() {
  //   const { isLoggedIn, user } = React.useContext(Context);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    var query = firebase
      .database()
      .ref(`/users/`)
      .orderByChild("infected")
      .equalTo(true)
      .on("value", async (snapshot) => {
        var list = [];
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val()) {
            list.push({ ...childSnapshot.val(), key: childSnapshot.key });
          }
        });
        setUsers(list);
      });
  }, []);

  return (
    <div className="pt-5 container text-left">
      <div className="row">
        <div className="col-12 h3 pt-3 text-center">Infected Users</div>
      </div>

      <div className="row mt-3 text-center">
        <div className="col-12 border-left border-right border-gray overflow-hidden rounded-lg">
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
          {users.map((item, index) => (
            <Link
              key={index}
              className="text-dark"
              to={"/admin/userDetails/" + item.key}
            >
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
                <div className="col-3 p-2  overflow-hidden">
                  {item.count} ({" "}
                  {new Date(
                    item.contacted_details_uploaded_date
                  ).toLocaleDateString()}
                  )
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
