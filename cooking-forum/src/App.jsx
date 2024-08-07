import { useEffect, useState } from 'react';
import './App.css';
import Home from './views/Home';
import Posts from './views/Posts';
import CreatePost from './views/CreatePost';
import SinglePost from './views/SinglePost';
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
import Footer from './components/Footer';
import User from './views/User';
import UserLikes from './views/UserLikes';
import UserPosts from './views/UserPosts';
import SingleUser from './views/SingleUser';

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
    isAdmin: false,
    isBlocked: false,
    isOwner: false,
  });
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (appState.user !== user) {
      setAppState({ ...appState, user });
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    getUserData(user.uid)
      .then(data => {
        const userData = data[Object.keys(data)[0]];
        const isAdmin = userData?.isAdmin || false;
        const isBlocked = userData?.isBlocked || false;
        const isOwner = userData?.isOwner || false;
        setAppState(prev => ({ ...prev, userData, isAdmin, isBlocked, isOwner }));
      });
  }, [user]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/posts' element={user && appState.userData && <Authenticated><Posts /></Authenticated>} />
          <Route path='/posts/:id' element={user && appState.userData && <Authenticated><SinglePost /></Authenticated>} />
          <Route path='/posts-create' element={user && appState.userData && <Authenticated><CreatePost /></Authenticated>} />
          <Route path='/login' element={!user && <Login />} />
          <Route path='/register' element={!user && <Register />} />
          <Route path='/user' element={user && appState.userData && <Authenticated><User /></Authenticated>} />
          <Route path='/user/liked-posts' element={user && appState.userData && <Authenticated><UserLikes /></Authenticated>} />
          <Route path='/user/my-posts' element={user && appState.userData && <Authenticated><UserPosts author={appState.userData?.handle} /></Authenticated>} />
          <Route path='/single-user/:handle' element={user && appState.userData && <SingleUser />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
