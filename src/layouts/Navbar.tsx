import React from "react";
import Logo from "../assets/tia-logo.png";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const LogoWrapper = styled(Link)`
  display: flex;
  align-items: center;
  color: #000;
  transition: 0.5s;

  &:hover {
    color: #000;
    text-decoration: none;
    font-weight: 800;
    transition: 0.5s;
  }
`;

const LogoTextStyled = styled.div`
  font-size: 2rem;
  margin-left: 0.5rem;
`;

const NavbarWrapper = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.05);
  padding: 8px;
  align-items: center;
  justify-content: center;
`;

export const Navbar: React.FC = (props: any) => (
  <NavbarWrapper>
    <LogoWrapper to="/">
      <img
        src={Logo}
        style={{
          height: "50px"
        }}
      />
      <LogoTextStyled>nanoTIA</LogoTextStyled>
    </LogoWrapper>
  </NavbarWrapper>
);
