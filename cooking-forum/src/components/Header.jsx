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
      <div className="header-content">
        <h1>UNITE <img src="../../public/React-Logo.png" alt="React Logo" className="reactLogo" /></h1>
        <h4>REACT DEVELOPERS FORUM</h4>
      </div>
      <nav className="nav">
        <NavLink to="/" className="nav-item">HOME</NavLink>
        {user && (
          <>
            <NavLink to="/posts" className="nav-item">POSTS</NavLink>
            <NavLink to="/posts-create" className="nav-item">CREATE</NavLink>
          </>
        )}
        {!user && <NavLink to="/login" className="nav-item">LOGIN</NavLink>}
        {!user && <NavLink to="/register" className="nav-item">REGISTER</NavLink>}
        {user && <button onClick={logout} className="nav-button">LOGOUT</button>}
        {user && userData && (
          <NavLink to="/user">
            <img src={userData.profilePictureURL || `https://static.independent.co.uk/2022/06/28/10/anonymous%20terra%20luna%20crypto.jpg`} alt="Profile" className="profilePicture" />
          </NavLink>
        )}
      </nav>
      <div className="search-wrapper">
        {user && <Search />}
      </div>
    </header>
  );
}
