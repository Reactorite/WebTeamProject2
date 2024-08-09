import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../state/app.context";
import { logoutUser } from "../services/auth.service";
import Search from "../views/Search";
import './Styles/Header.css';
import UserCount from '../views/UserCount';
import PostCount from '../views/PostsCount';

export default function Header() {
  const { user, userData, setAppState } = useContext(AppContext);
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const logout = async () => {
    await logoutUser();
    setAppState({ user: null, userData: null });
    navigate('/login'); 
  };

  return (
    <header>
      <div className="header">
        <h1> UNITE <img src="../../public/React-Logo.png" alt="React Logo" className="reactLogo" /> </h1>
        <h4>REACT DEVELOPERS FORUM</h4>
      </div>
      <hr className="underLine1"></hr>
      <nav className="nav">
        <NavLink to="/">HOME</NavLink>
        {user && (
          <>
            <NavLink to="/posts">POSTS</NavLink>
            <NavLink to="/posts-create">CREATE</NavLink>
            <button onClick={() => setShowSearch(prev => !prev)}>
              SEARCH
            </button>
            {showSearch && <Search />}
          </>
        )}
        {!user && <NavLink to="/login" itemID="login">LOGIN</NavLink>}
        {!user && <NavLink to="/register" itemID="register">REGISTER</NavLink>}
        {user && <button onClick={logout}itemID="logout">LOGOUT</button>}
        {user && userData && <NavLink to="/user">{user && userData && <img src={userData.profilePictureURL || `https://static.independent.co.uk/2022/06/28/10/anonymous%20terra%20luna%20crypto.jpg?quality=75&width=640&crop=3%3A2%2Csmart&auto=webp`} alt={`${userData.handle}'s profile`} style={{ width: 75, height: 75, borderRadius: '75%' }} />}</NavLink>}
        <div className="nav-right">
          <UserCount />
          <PostCount />
        </div>
      </nav>
      <hr className="underLine2"></hr>
    </header>
  );
}