import React from "react"
import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom"
import "./index.css"
import App from "./App"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import { AppProvider } from "./AppContext"

serviceWorkerRegistration.register()

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <AppProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AppProvider>
  </React.StrictMode>
)
