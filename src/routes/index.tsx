import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "../pages/Home";
import NewsDetail from "../pages/NewsDetail";
import { Layout } from "../layouts";

export const Routes = () => (
  <BrowserRouter>
    <Layout>
      <Route path="/" exact component={Home} />
      <Route path="/:slug" exact component={NewsDetail} />
    </Layout>
  </BrowserRouter>
);
