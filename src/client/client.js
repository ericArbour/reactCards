import './client.scss';

import React from "react";
import ReactDOM from "react-dom";
import {Router, browserHistory as history} from "react-router";

import {Dispatcher} from "shared/dispatcher";
import * as A from "./actions";
import {StateProvider} from "./lib/component";
import createStores from "./stores";

// ---------------------------
// Services
const dispatcher = new Dispatcher();
const services = {dispatcher};

// ---------------------------
// Stores
const stores = createStores(services);

// ---------------------------
// Render
function main() {
    const routes = require("./routes").default();
    ReactDOM.render(
        <StateProvider stores={stores} services={services}>
            <Router history={history}>
                {routes}
            </Router>
        </StateProvider>,
        document.getElementById("mount"));
}

// ---------------------------
// Misc
if (module.hot) {
    module.hot.accept("./routes", () => {
        main();
    });
}

// --------------------------
// Go!
main();