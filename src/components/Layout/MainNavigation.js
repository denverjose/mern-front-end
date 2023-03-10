import { useContext } from "react";
import {NavLink, Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./MainNavigation.module.css";
import SearchBar from "../Search/SearchBar";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const userId = authCtx.userId;

  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <header className={classes.header}>
      <div className={classes.container}>

      <Link to="/">
        <div className={classes.logo}>GOLB</div>
      </Link>
      {isLoggedIn && <SearchBar />}
      </div>
      <nav>
        {isLoggedIn && (
          <ul className="nav">
            <li>
              <NavLink to={`/profile/${userId}`} activeClassName={classes.active}>
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink to={`/add-blog`} activeClassName={classes.active}>
                Add Blog
              </NavLink>
            </li>
            <li>
              <NavLink to={`/drafts`} activeClassName={classes.active}>
                Drafts
              </NavLink>
            </li>
            <li>
              <button className={classes.logout} onClick={logoutHandler}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default MainNavigation;
