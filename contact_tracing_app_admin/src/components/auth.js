import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Context } from "../backend/context";
import { Redirect } from "react-router";

export default function Auth() {
  const { signIn, authError, isLoggedIn, user } = React.useContext(Context);

  return (
    <div
      className="container-fluid pt-5"
      style={{ backgroundColor: "#7294da" }}
    >
      {isLoggedIn && user ? <Redirect to="/admin" /> : null}
      <div className="container-fluid h-50 text-center">
        <div className="row">
          <div
            className="col-12 text-center h2 pb-3"
            style={{ color: "white" }}
          >
            Contact Tracking
          </div>
        </div>
        <div className="row">
          <div
            className="col-12 col-md-6 m-auto py-4 badge-light "
            style={{ borderRadius: 20 }}
          >
            <div className="row">
              <div className="col-12 text-center card-title h3">Sign In</div>
              <div className="col-12">
                {authError && (
                  <div className="row py-3">
                    <div className="col-12">
                      <div className="alert alert-danger m-auto py-1">
                        {authError}
                      </div>
                    </div>
                  </div>
                )}

                <div className="row py-3">
                  <div className="col-12">
                    {authError ? (
                      <button
                        onClick={() => console.log("request admin access")}
                        type="button"
                        className="btn btn-primary w-50"
                        style={{ borderRadius: 20 }}
                      >
                        Request For Access
                      </button>
                    ) : (
                      <button
                        onClick={() => signIn()}
                        type="button"
                        className="btn btn-danger w-50"
                        style={{ borderRadius: 20 }}
                      >
                        <FontAwesomeIcon
                          icon={["fab", "google"]}
                          style={{ marginRight: 10 }}
                        />
                        Sign In With Google
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
