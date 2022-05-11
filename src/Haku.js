import React from "react";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

let haku = " ";
let nimi_haku = " ";

function NimiHaku(props) {
  const [nimi, setNimi] = useState("");
  const [loading, setLoading] = useState("");
  const [tuotteet, setTuotteet] = useState([]);

  async function fetchData() {
    haku = "";
    if(nimi != "") {
      nimi_haku = "?nimi=" + nimi;
      haku = nimi_haku;
    }
    setLoading("Lataa...");
    setTuotteet([]);
    let response = await fetch ("http://localhost:4000/tuote" + haku);
    let data = await response.json();
    setTuotteet(data);
    setLoading(" ");
    if(data === "") {
      setLoading("Ei hakutuloksia");
    }

  }
}

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
      <NimiHaku />
    </div>
  );
}