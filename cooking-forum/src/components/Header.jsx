import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../state/app.context";
import { logoutUser } from "../services/auth.service";
import Search from "../views/Search";

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
      <h1>Gourmet Galaxy</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        {user && (
          <>
            <NavLink to="/posts">All posts</NavLink>
            <NavLink to="/posts-create">Create posts</NavLink>
            <button onClick={() => setShowSearch(prev => !prev)}>
              Search
            </button>
            {showSearch && <Search />}
          </>
        )}
        {!user && <NavLink to="/login">Login</NavLink>}
        {!user && <NavLink to="/register">Register</NavLink>}
        {user && <button onClick={logout}>Logout</button>}
        {user && userData && <NavLink to="/user">{user && userData && <img src={userData.profilePictureURL} alt={`${userData.handle}'s profile`} style={{ width: 75, height: 75, borderRadius: '75%' }} />}</NavLink>}
      </nav>
    </header>
  );
}