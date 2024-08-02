import { useEffect, useState } from 'react'
import './App.css'
import Home from './views/Home'
import Posts from './views/Posts'
import CreatePost from './views/CreatePost'
import SinglePost from './views/SinglePost'
import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './views/NotFound';
import { AppContext } from './state/app.context';
import Login from './views/Login';
import Authenticated from './hoc/Authenticated';
import Register from './views/Register';
import { auth } from './config/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserData } from './services/users.service';
import Footer from './components/Footer'

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  // eslint-disable-next-line no-unused-vars
  const [user, loading, error] = useAuthState(auth);

  if (appState.user !== user) {
    setAppState({ ...appState, user });
  }

  useEffect(() => {
    if (!user) return;

    getUserData(appState.user.uid)
      .then(data => {
        const userData = data[Object.keys(data)[0]];
        setAppState({ ...appState, userData });
      });
  }, [user]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/posts' element={user && <Authenticated><Posts /></Authenticated>} />
          <Route path='/posts/:id' element={user && <Authenticated><SinglePost /></Authenticated>} />
          <Route path='/posts-create' element={user && <Authenticated><CreatePost /></Authenticated>} />
          <Route path='/login' element={!user && <Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>
  )
}

export default App
