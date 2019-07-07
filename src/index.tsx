import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import * as serviceWorker from "./serviceWorker";

import { Routes } from "./routes";
import { store } from "./store";

const RootComponent = (
  <Provider store={store}>
    <Routes />
  </Provider>
);

ReactDOM.render(RootComponent, document.getElementById("root"));

serviceWorker.unregister();
