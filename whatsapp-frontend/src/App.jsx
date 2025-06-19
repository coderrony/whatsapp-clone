import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeWithSocket from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import { useSelector } from 'react-redux';
// socket io
import { io } from 'socket.io-client';
import { REACT_APP_API_ENDPOINT } from './config/env.config';

import SocketContext from './context/SocketContext';

function App() {
  const socket = io(REACT_APP_API_ENDPOINT.split('/api/v1')[0]);
  const { user } = useSelector(state => state.user);
  const { token } = user;

  return (
    <div className='dark '>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Routes>
            <Route path='/'>
              <Route index element={<HomeWithSocket />} />
              <Route
                path='login'
                element={!token ? <Login /> : <Navigate to='/' />}
              />
              <Route
                path='register'
                element={!token ? <Register /> : <Navigate to='/' />}
              />

              {/* <Route path="*" element={<NoPage />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
