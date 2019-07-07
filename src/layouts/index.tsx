import React from "react";
import { Navbar } from "./Navbar";

export const Layout: React.FC = (props: React.Props<any>) => (
  <React.Fragment>
    <Navbar />
    <div className="container">{props.children}</div>
  </React.Fragment>
);
