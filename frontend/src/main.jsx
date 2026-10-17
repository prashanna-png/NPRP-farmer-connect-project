import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import  store  from "./store";
import SessionLoader from "./components/SessionLoader";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <SessionLoader>
        <App />
      </SessionLoader>
    </BrowserRouter>
  </Provider>,
);
