import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { List, ListItem, Box, TextField, Divider } from "@material-ui/core";
import "./App.css";

let haku = " ";
let nimi_haku = " ";
let hylly_haku = " "

function NimiHaku(props) {
  const [nimi, setNimi] = useState("");
  const [loading, setLoading] = useState(" ");
  const [tuotteet, setTuotteet] = useState([]);
  const [hylly_id, setHylly_id] = useState(-1);
  const [hylly, setHylly] = useState([]);

  async function fetchData() {
    haku = " ";
    if (nimi !== "") {
      nimi_haku = "?nimi=" + nimi;
      haku = nimi_haku;
    }
    if (hylly_id !== -1) {
      hylly_haku = "?hylly_id=" + hylly_id;
      haku = hylly_haku;
    }

    setLoading("Lataa...");
    setTuotteet([]);
    let response = await fetch("http://localhost:3004/tuote" + haku);
    let data = await response.json();
    setTuotteet(data);
    setLoading(" ");
    setHylly_id(-1);
    if (data.length == 0) {
      setLoading("Ei hakutuloksia");
    }
  }

  useEffect(() => {
    const fetchHylly = async () => {
      const r = await fetch('http://localhost:3004/hylly');
      const data = await r.json();
      setHylly([{ id: -1, lyhenne: "Valitse" }, ...data]);
    }
    fetchHylly();
  }, [])


  useEffect(() => {
    fetchData();
  }, []);

  const tyypit = hylly.map(t => <option value={t.id} key={t.id}>{t.lyhenne}</option>)


  return (
    <div>
      <form className="form">
        <label> Nimi: </label>
        <TextField
          id="filled-search"
          type="search"
          variant="filled" name="nimi" onChange={(event) => setNimi(event.target.value)} />
        <label> Hylly: </label>
        <select className="select" value={hylly_id} onChange={e => setHylly_id(e.target.value)}>
          {tyypit}
        </select>
      </form>
      <button className="button" variant="contained" onClick={() => fetchData()}>Hae</button>
      {tuotteet.map((tuote) => {
        return <Potions tuote={tuote} tyypit={tyypit} />;
      })}
      <br></br>
      {loading}
    </div>
  )
}

export default function Haku() {
  return (
    <div className="haku">
      <nav className="nav">
        <Link to="/Etusivu">Etusivu</Link> |{" "}
        <Link to="/Haku">Hyllytiedot</Link> |{" "}
        <Link to="/Tuote">Hallitse tuotetietoja</Link>
      </nav>
      <NimiHaku />
    </div>
  );
}

const Potions = (props) => {

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="30px">
        <List>
          <ListItem>{props.tuote.nimi} , {props.tuote.maara} kpl</ListItem>
          <Divider />
        </List>
      </Box>

    </div>
  )
}