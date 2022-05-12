import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";


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
    if(nimi !== "") {
      nimi_haku = "?nimi=" + nimi;
      haku = nimi_haku;
    }
    if (hylly_id !== -1) {
      hylly_haku = "?hylly_id=" + hylly_id;
      haku = hylly_haku;
    }
    setLoading("Lataa...");
    setTuotteet([]);
    let response = await fetch ("http://localhost:3004/tuote" + haku);
    let data = await response.json();
    setTuotteet(data);
    setLoading(" ");
    if(data === " ") {
      setLoading("Ei hakutuloksia");
    }
  }

  useEffect(() => {
    const fetchHylly = async () => {
        const r = await fetch('http://localhost:3004/hylly');
        const data = await r.json();
        setHylly([{id:-1, lyhenne: "Valitse"}, ...data]);
    }
    fetchHylly();
}, [])


  useEffect(() => {
    fetchData();
  }, []);

  const tyypit = hylly.map(t => <option value={t.id} key={t.id}>{t.lyhenne}</option>)


  return (
    <div>
      <form>
        <label>Nimi: </label>
        <input type="text" name="nimi" onChange={(event) => setNimi(event.target.value)}></input>
        <label>Hylly: </label>
        <select value={hylly_id} onChange={e => setHylly_id(e.target.value)}>
          {tyypit}
        </select>
      </form>
      <button onClick={() => fetchData()}>Hae</button>
      {tuotteet.map((tuote) => {
      return <Potions tuote={tuote} />;
    })}
    {loading}
    </div>
  )
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

const Potions = (props) => {

  return(
    <div>
      <table>
        <thead>
          <tr>
            <td>Nimi</td>
            <td>Määrä</td>
            <td>Hylly</td>
          </tr>
        </thead>
        <tbody>
          <td>{props.tuote.nimi}</td>
          <td>{props.tuote.maara}</td>
          <td>{props.tuote.hylly_id}</td>
        </tbody>
      </table>
    </div>
  )

}