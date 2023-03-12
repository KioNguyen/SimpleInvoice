import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { AuthContextProvider, AuthContext } from "./context/AuthContext";
import App from './App';
import axios from 'axios';
import { useContext } from 'react';
import { error } from 'console';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// ----------------------------------------------------------------------



// For GET requests
// axios.interceptors.request.use(
//   (req) => {
//     const sLocalUser = localStorage.getItem("user");
//     const localUser = JSON.parse(sLocalUser);
//     if (localUser) {
//       req.headers.Authorization = `Bearer ${localUser.apiToken}`;
//     }
//     return req;
//   },
//   (err) => {
//     return Promise.reject(err);
//   }
// );

// For POST requests
// axios.interceptors.response.use(
//   (res) => {
//     if (res.status === 401) {
//       location.reload();
//     }
//     return res;
//   },
//   (err) => {
//     return Promise.reject(err);
//   }
// );

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      {/* <AuthContextProvider> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* </AuthContextProvider> */}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </HelmetProvider>
);

// If you want to enable client cache, register instead.
// serviceWorker.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
