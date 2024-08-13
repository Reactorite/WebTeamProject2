import { useContext, useState } from "react"
import { AppContext } from "../state/app.context";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import "./Styles/Login.css";

export default function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const updateUser = prop => e => {
    setUser({
      ...user,
      [prop]: e.target.value,
    })
  };


  const login = async () => {
    if (!user.email || !user.password) {
      return alert('No credentials provided!');
    }

    try {
      const credentials = await loginUser(user.email, user.password);
      setAppState({
        user: credentials.user,
        userData: null,
      });
      navigate(location.state?.from.pathname ?? '/');
    } catch (error) {
      alert(error.message);
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      login();
    }
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <h1 className="login-title">Login</h1>
        <div id="login-email">
          <label id="login-email-label" htmlFor="email">Email: </label>
          <input id="login-email-input" value={user.email} onChange={updateUser('email')} type="text" name="email" /*id="email"*/ onKeyDown={handleKeyDown} /><br /><br />
        </div>
        <div id="login-password">
          <label id="login-password-label" htmlFor="password">Password: </label>
          <input id="login-password-input" value={user.password} onChange={updateUser('password')} type="password" name="password" /*id="password"*/ onKeyDown={handleKeyDown} /><br />
        </div>
      </form>
      <button className="login-btn" onClick={login}><span className="text">Login</span></button>
    </div>
  )
}