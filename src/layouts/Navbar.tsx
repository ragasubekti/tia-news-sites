import React from "react";
import Logo from "../assets/tia-logo.png";
import styled from "@emotion/styled";

export const Navbar: React.FC = () => (
  <React.Fragment>
    <img
      src={Logo}
      style={{
        height: "50px"
      }}
    />
  </React.Fragment>
);
