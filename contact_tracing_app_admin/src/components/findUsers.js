import React, { useState, useEffect } from "react";
import firebase from "firebase";
import "firebase/firestore";
import { Context } from "../backend/context";
import { Link } from "react-router-dom";

export default function FindUsers() {
  //   const { isLoggedIn, user } = React.useContext(Context);
  const [text, setText] = useState("");
  const [users, setUsers] = useState(null);

  const onSearch = () => {
    firebase
      .database()
      .ref(`/users/`)
      .orderByChild("id")
      .equalTo(text)
      .once("value")
      .then(function (snapshot) {
        var list = [];
        snapshot.forEach((item) => {
          list.push({ ...item.val(), key: item.key });
        });
        setUsers(list);
      });
  };

  return (
    <div className="pt-5 container text-left">
      <div className="row">
        <div className="col-12 h3 pt-3 text-center">Find Users</div>
      </div>

      <div className="row mx-3 px-2 h6 mt-3">
        <div className="col-10 offset-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch();
            }}
          >
            <div className="form-group py-0 my-1 row">
              <label className="col-md-1 col-3 col-form-label">ID :</label>
              <div className="col-md-6 col-9">
                <input
                  value={text}
                  className="form-control"
                  required
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                />
              </div>
              <div className="col-3">
                <button className="btn btn-primary " type="submit">
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {users && users.length > 0 ? (
        <div className="row">
          <div className="col-12 border-right border-left border-gray overflow-hidden rounded-lg mt-3">
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
      ) : users && users.length == 0 ? (
        <div className="row text-center py-3 border-gray">
          <div className="col-12">No Data</div>
        </div>
      ) : null}
    </div>
  );
}
