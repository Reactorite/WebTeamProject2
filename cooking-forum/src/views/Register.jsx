import { useContext, useState } from "react";
import { registerUser } from "../services/auth.service";
import { AppContext } from "../state/app.context";
import { useNavigate } from "react-router-dom";
import { createUserHandle } from "../services/users.service";
import { MIN_NAME_LENGTH, MAX_NAME_LENGTH } from "../constants/constants";
import './Styles/Register.css';

export default function Register() {
  const [user, setUser] = useState({
    handle: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    repeatPassword: '',
    isAdmin: false,
    isBlocked: false,
    isOwner: false,
    profilePictureURL: null,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [secretKey, setSecretKey] = useState('');
  const [secretKeyMessage, setSecretKeyMessage] = useState('');
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const updateUser = prop => e => {
    setUser({
      ...user,
      [prop]: e.target.value,
    });

    if (prop === 'password' || prop === 'repeatPassword') {
      setPasswordsMatch(user.password === e.target.value || user.repeatPassword === e.target.value);
    }
  };

  const updateSecretKey = e => {
    const key = e.target.value;
    setSecretKey(key);

    if (key === '123456') {
      setSecretKeyMessage('✅ Secret key matched!');
      setUser(prev => ({ ...prev, isOwner: true }));
    } else {
      setSecretKeyMessage('❌ Secret key not matched');
    }
  };

  const register = async () => {
    if (!user.email || !user.password) {
      return alert('No credentials provided!');
    }

    if (!passwordsMatch) {
      return alert('Passwords do not match!');
    }

    if (user.firstName.length < MIN_NAME_LENGTH || user.firstName.length > MAX_NAME_LENGTH) {
      return alert(`First name must be at least ${MIN_NAME_LENGTH} characters long and max ${MAX_NAME_LENGTH}`);
    }

    if (user.lastName.length < MIN_NAME_LENGTH || user.lastName.length > MAX_NAME_LENGTH) {
      return alert(`Last name must be at least ${MIN_NAME_LENGTH} characters long and max ${MAX_NAME_LENGTH}`);
    }

    if (secretKey !== '123456') {
      return alert('Secret key is incorrect!');
    }

    try {
      const userExists = false;
      if (userExists) {
        return alert(`User {${user.handle}} already exists!`);
      }
      const credential = await registerUser(user.email, user.password);
      await createUserHandle(user.handle, credential.user.uid, user.firstName, user.lastName, user.email, user.isAdmin, user.isBlocked, user.isOwner, user.profilePictureURL || 'https://static.independent.co.uk/2022/06/28/10/anonymous%20terra%20luna%20crypto.jpg?quality=75&width=640&crop=3%3A2%2Csmart&auto=webp');
      setAppState(prev => ({ ...prev, user: credential.user, userData: { handle: user.handle, createdOn: new Date().toISOString(), isOwner: user.isOwner } }));
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <form>
        <div className="register-header">
          <h1>Register</h1>
        </div>
        <div className="form-group">
          <label className="input-name" htmlFor="handle">Username: </label>
          <input value={user.handle} onChange={updateUser('handle')} type="text" name="handle" id="handle" /><br /><br />
        </div>
        <div className="form-group">
          <label className="input-name" htmlFor="email">Email: </label>
          <input value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" /><br /><br />
        </div>
        <div className="form-group">
          <label className="input-name" htmlFor="firstName">First name: </label>
          <input value={user.firstName} onChange={updateUser('firstName')} type="text" name="firstName" id="firstName" /><br /><br />
        </div>
        <div className="form-group">
          <label className="input-name" htmlFor="lastName">Last name: </label>
          <input value={user.lastName} onChange={updateUser('lastName')} type="text" name="lastName" id="lastName" /><br /><br />
        </div>
        <div className="form-group">
          <label className="input-name" htmlFor="password">Password: </label>
          <input className="input" value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" /><br /><br />
        </div>
        <div className="form-group">
          <label className="input-name" htmlFor="repeatPassword">Repeat Password: </label>
          <input value={user.repeatPassword} onChange={updateUser('repeatPassword')} type="password" name="repeatPassword" />
          {user.repeatPassword && (
            <span style={{ color: passwordsMatch ? 'green' : 'red' }}>
              {passwordsMatch ? <span className="password-check"> Passwords match!</span> : <span className="password-x"> Passwords do not match!</span>}
            </span>
          )}
        </div>
        <br />
        <div className="form-group">
          <label className="input-name" htmlFor="secretKey">Secret Key: </label>
          <input value={secretKey} onChange={updateSecretKey} type="text" name="secretKey" id="secretKey" />
          <span style={{ color: secretKeyMessage.startsWith('✅') ? 'green' : 'red' }}>
            {secretKeyMessage}
          </span>
        </div>
        <br />
        <button className="register-button" role="button" onClick={register}><span className="text">Register</span></button>
      </form>
    </>
  );
}
