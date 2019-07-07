import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "../pages/Home";
import NewsDetail from "../pages/NewsDetail";

export const Routes = () => (
  <BrowserRouter>
    <Route path="/" exact component={Home} />
    <Route path="/:slug" exact component={NewsDetail} />
  </BrowserRouter>
);
