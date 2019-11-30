// /**
//  * First we will load all of this project's JavaScript dependencies which
//  * includes React and other helpers. It's a great starting point while
//  * building robust, powerful web applications using React + Laravel.
//  */

require("./bootstrap");

// /**
//  * Next, we will create a fresh React component instance and attach it to
//  * the page. Then, you may begin adding components to this application
//  * or customize the JavaScript scaffolding to fit your unique needs.
//  */

require("./components/Example");

// require("./components/list");

ReactDOM.render(
    <div>
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home1</Link>
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
        </Router>
        <Menu />
    </div>,
    document.getElementById("app-container")
);

import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Menu from "../js/components/menu";

let APP_CONTAINER_DOM_ID = "app-container";
let _appDest = document.getElementById(APP_CONTAINER_DOM_ID);

if (_appDest) {
    render(
        <div>
            <Router>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home1</Link>
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
            </Router>
            <Menu />
        </div>,
        _appDest
    );
}
