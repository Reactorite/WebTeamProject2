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
      <div className="header-all">
        <div className="header-content">
          <h1><NavLink to='/' className={"logoUnite"}>UNITE</NavLink></h1>
          <NavLink to='/'><img src="../../public/React-Logo.png" alt="React Logo" className="reactLogo" /></NavLink>
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
              <img 
                src={userData.profilePictureURL || "https://static.independent.co.uk/2022/06/28/10/anonymous%20terra%20luna%20crypto.jpg?quality=75&width=640&crop=3%3A2%2Csmart&auto=webp"} 
                alt="Profile" 
                className="profilePicture" 
              />
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
