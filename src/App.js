import React from "react";
import { Asiakas, Tuotteet } from "./Asiakas";
import { Link } from "react-router-dom";


export default function App() {
  return (
    <div>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/Etusivu">Etusivu</Link> |{" "}
        <Link to="/Asiakas">Tuotteet</Link>
      </nav>
    </div>
  );
}
