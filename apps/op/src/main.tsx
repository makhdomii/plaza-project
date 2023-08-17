import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './app/app';
import Referee from './app/referee';
import Message from './app/message';
import Client from './app/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route Component={App} path="/" />
      </Routes>
      <Routes>
        <Route Component={Referee} path="referee" />
      </Routes>
      <Routes>
        <Route Component={Client} path="client" />
      </Routes>
      <Routes>
        <Route Component={Message} path="message" />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
