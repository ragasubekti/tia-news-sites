import React from "react";
import { Routes } from "../routes";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";

import { store } from "../store";

export const App = () => (
  // <Reac
  <Provider store={store}>
    <Helmet>
      <meta charSet="utf-8" />
      <title>nanoTIA - The Only Best News in Asia</title>
    </Helmet>
    <Routes />
  </Provider>
);
