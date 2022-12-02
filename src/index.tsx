import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./screens/App";
import StyledComponentsThemeProvider, {
  FixedGlobalStyle,
  ThemedGlobalStyle,
} from "./theme";
import { store } from "./state";
import { Provider } from "react-redux";


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <FixedGlobalStyle />
      <StyledComponentsThemeProvider>
        <ThemedGlobalStyle />
        <App />
      </StyledComponentsThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
