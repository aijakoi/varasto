import React from "react";
import { Link } from "react-router-dom";


export default function Etusivu() {
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
        <Link to="/Tuote">Tuotteet</Link> |{" "}
        <Link to="/Muokkaa">Muokkaa</Link>
          </nav>
      <h1>Etusivu</h1>
    </div>
  );
}