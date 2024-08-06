import { useContext, useState } from "react"
import { registerUser } from "../services/auth.service";
import { AppContext } from "../state/app.context";
import { useNavigate } from "react-router-dom";
import { createUserHandle } from "../services/users.service";
import { MIN_NAME_LENGTH, MAX_NAME_LENGTH } from "../constants/constants";

export default function Register() {
  const [user, setUser] = useState({
    handle: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    repeatPassword: '',
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
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

  const register = async () => {
    if (!user.email || !user.password) {
      return alert('No credentials provided!');
    }

    if (!passwordsMatch) {
      return alert('Passwords do not match!');
    }

    if (user.firstName.length < MIN_NAME_LENGTH && user.firstName.length > MAX_NAME_LENGTH) {
      return alert(`First name must be at least ${MIN_NAME_LENGTH} characters long and max ${MAX_NAME_LENGTH}`);
    }

    if (user.lastName.length < MIN_NAME_LENGTH && user.lastName.length > MAX_NAME_LENGTH) {
      return alert(`Last name must be at least ${MIN_NAME_LENGTH} characters long and max ${MAX_NAME_LENGTH}`);
    }

    try {
      const userExists = false;
      if (userExists) {
        return alert(`User {${user.handle}} already exists!`);
      }
      const credential = await registerUser(user.email, user.password);
      await createUserHandle(user.handle, credential.user.uid, user.firstName, user.lastName, user.email);
      setAppState({ user: credential.user, userData: null });
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <h1>Register</h1>
      <label htmlFor="handle">Username: </label>
      <input value={user.handle} onChange={updateUser('handle')} type="text" name="handle" id="handle" /><br /><br />
      <label htmlFor="email">Email: </label>
      <input value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" /><br /><br />
      <label htmlFor="firstName">First name: </label>
      <input value={user.firstName} onChange={updateUser('firstName')} type="text" name="firstName" id="firstName" /><br /><br />
      <label htmlFor="lastName">Last name: </label>
      <input value={user.lastName} onChange={updateUser('lastName')} type="text" name="lastName" id="lastName" /><br /><br />
      <label htmlFor="password">Password: </label>
      <input value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" /><br /><br />
      <label htmlFor="repeatPassword">Repeat Password: </label>
      <input value={user.repeatPassword} onChange={updateUser('repeatPassword')} type="password" name="repeatPassword" id="repeatPassword" />
      {user.repeatPassword && (
        <span style={{ color: passwordsMatch ? 'green' : 'red' }}>
          {passwordsMatch ? '✅ Passwords match!' : '❌ Passwords do not match!'}
        </span>
      )}
      <br />
      <button onClick={register}>Register</button>
    </>
  )
}