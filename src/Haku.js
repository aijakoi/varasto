import React from "react";
import { Link } from "react-router-dom";


export default function Haku() {
  return (
    <div>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/Etusivu">Etusivu</Link> |{" "}
        <Link to="/Haku">Hyllytiedot</Link> |{" "}
        <Link to="/Tuote">Tuotteet</Link>
      </nav>
      <h1>Tähän haetaan kaikki hyllytiedot</h1>
    </div>
  );
}