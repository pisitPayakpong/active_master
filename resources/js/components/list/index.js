import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

let APP_CONTAINER_DOM_ID = "app-container";
let _appDest = document.getElementById(APP_CONTAINER_DOM_ID);

if (_appDest) {
    render(
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/users">Users</Link>
                        </li>
                    </ul>
                </nav>

                <Route path="/list" />
            </div>
        </Router>,
        _appDest
    );
}
