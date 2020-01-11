/**
 * Configured as part of the Auth0
 * setup guide for Single Page Apps
 */
import React from "react";
import { useAuth0 } from "../react-auth0-spa";

type Props = {
  user?: any;
};

const NavBar = ({ user }: Props) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return isAuthenticated ? (
    <>
      {user && user.email}
      <button className="logoutButton"  onClick={(): void => logout()}>Log out</button>
    </>
  ) : (
    <button onClick={(): void => loginWithRedirect({})}>Log in</button>
  );
};

export default NavBar;
