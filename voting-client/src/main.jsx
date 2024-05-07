import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import common_hi from "./translations/hi/common.json";
import common_en from "./translations/en/common.json";
import common_bn from "./translations/bn/common.json";

i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
    lng: 'en',                              // language to use
    resources: {
        en: {
            common: common_en               // 'common' is our custom namespace
        },
        hi: {
            common: common_hi
        },
        bn: {
            common: common_bn
        }
    },
});
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <I18nextProvider i18n={i18next}>
    <App />
  </I18nextProvider>

  // </React.StrictMode>
);
