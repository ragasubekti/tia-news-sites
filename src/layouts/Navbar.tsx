import React from "react";
import Logo from "../assets/tia-logo.png";
import styled from "@emotion/styled";

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
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

export const Navbar: React.FC = () => (
  <NavbarWrapper>
    <LogoWrapper>
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
