import React, { lazy, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/LandingPage";

const root = ReactDOM.createRoot(document.getElementById("root"));

const AdminDashboard = lazy(() =>
    import("./Components/Admin Comps/AdminDashboard")
);

const Wrapper = () => {
    const [auth, setAuth] = useState(null);
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<LandingPage setAuth={setAuth} auth={auth} />}
                ></Route>
                <Route path="/:id" element={<App />}></Route>
                <Route
                    path="/admin/:id"
                    element={<AdminDashboard setAuth={setAuth} auth={auth} />}
                ></Route>
                <Route
                    path="/*"
                    element={<LandingPage setAuth={setAuth} auth={auth} />}
                />
            </Routes>
        </BrowserRouter>
    );
};
root.render(
    <React.StrictMode>
        <Wrapper />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
