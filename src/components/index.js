import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main_page from "./Main_page";


const myComponent = <Main_page />;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(myComponent);
