import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../state/app.context";
import { logoutUser } from "../services/auth.service";
import './Styles/Header.css';
import Search from "../views/Search";



export default function Header() {
  const { user, userData, setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const logout = async () => {
    await logoutUser();
    setAppState({ user: null, userData: null });
    navigate('/login'); 
  };

  return (
    <header>
      {/* <div className="title-nav-wrapper"> */}
      <div className="header-all">
      <div className="header-content">
        <h1>UNITE</h1><img src="../../public/React-Logo.png" alt="React Logo" className="reactLogo" />
        <h4>REACT DEVELOPERS FORUM</h4>
      </div>
      <nav className="nav">
        <NavLink to="/" className="nav-link">HOME</NavLink>
        {user && (
          <>
            <NavLink to="/posts" className="nav-link">POSTS</NavLink>
            <NavLink to="/posts-create" className="nav-link">CREATE</NavLink>
          </>
        )}
        {!user && <NavLink to="/login" className="nav-link">LOGIN</NavLink>}
        {!user && <NavLink to="/register" className="nav-link">REGISTER</NavLink>}
        </nav>
        {user && userData && (
        <div className="avatar-wrapper">
          {user && <button onClick={logout} className="nav-button">LOGOUT</button>}
          <NavLink to="/user">
            <img src={userData.profilePictureURL || "../../images/default_avatar.png"} alt="Profile" className="profilePicture" />
          </NavLink>
        </div>
        )}

      </div>
      <div className="search-wrapper">
        {user && <Search />}
      </div>
    </header>
  );
}
