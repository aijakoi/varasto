import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const doSearchQuery = (nimi, maara, hylly_id) => {
    let r = [];
    if (nimi != '') r.push("nimi = " + nimi);
    if (maara != '') r.push("määrä = " + maara);
    if (hylly_id != '-1') r.push("hylly_id = " + hylly_id);
    r.push(Date.now())

    return r.join("&")
}

export const Tuotteet = () => {

    const [nimi, setNimi] = useState('');
    const [maara, setMaara] = useState('');
    const [hylly_id, setHylly_id] = useState(-1);
    const [hylly, setHylly] = useState([]);
    const [muutettavaid, setMuutettavaId] = useState(-1);
    const [query, setQuery] = useState('');
    const [tuotteet, setTuotteet] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tuoteDelete, setTuoteDelete] = useState(null);
    const [tuoteInsert, setTuoteInsert] = useState(null);
    const [tuoteModify, setTuoteModify] = useState(null);
    const [modifiedTuote, setModifiedTuote] = useState(null);
    const [showEditForm, setshowEditForm] = useState(false);

    useEffect(() => {
        const fetchHylly = async () => {
            const r = await fetch('http://localhost:3004/hylly');
            const data = await r.json();
            setHylly([{id:-1, lyhenne: "Valitse"}, ...data]);
        }
        fetchHylly();
    }, [])

    useEffect(() => {
        const fetchTuote = async () => {
            setLoading(true)
            const r = await fetch('http://localhost:3004/tuote?' + query);
            const data = await r.json();
            setLoading(false);
            setTuotteet(data);
        }
        if (query != '') fetchTuote();
    }, [query])

    useEffect(() => {
        const fetchTuoteById = async () => {
            const r = await fetch('http://localhost:3004/tuote/' + muutettavaid);
            const data = await r.json();
            setTuoteModify(data);
            setshowEditForm(true);
        }
        if (muutettavaid > 0) fetchTuoteById();
    }, [muutettavaid])

    useEffect(() => {
        const deleteTuote = async () => {
            const r = await fetch('http://localhost:3004/tuote/' + tuoteDelete.id, {
                method: 'DELETE'
            });
            setQuery(doSearchQuery(nimi, maara, hylly_id))            
        }
        if (tuoteDelete != null) deleteTuote();
    }, [tuoteDelete])

    useEffect(() => {
        const insertTuote = async () => {
            const r = await fetch('http://localhost:3004/tuote/', {
                method: 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({nimi: tuoteInsert.nimi, maara: tuoteInsert.maara, hylly_id: tuoteInsert.hylly_id})
            });
            setQuery(doSearchQuery(nimi, maara, hylly_id))
            setTuoteInsert(null);
        }
        if (tuoteInsert != null) insertTuote();
    }, [tuoteInsert])

    useEffect(() => {
        const modifyTuote = async () => {
            const r = await fetch('http://localhost:3004/tuote/' + modifiedTuote.id, {
                method: 'PUT',
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({nimi: modifiedTuote.nimi, maara: modifiedTuote.maara, hylly_id: modifiedTuote.hylly_id})
            });
            setQuery(doSearchQuery(nimi, maara, hylly_id))
            setModifiedTuote(null);
            setTuoteModify(null)
        }
        if (modifiedTuote != null) modifyTuote();
    }, [modifiedTuote])

    const haeClicked = () => {
        setQuery(doSearchQuery(nimi, maara, hylly_id));
    }

    const onDelete = (tuote) => {
        setTuoteDelete(tuote)
    }

    const onEdit = (tuote) => {
        setMuutettavaId(tuote.id);
        setshowEditForm(true);
    }

    const tyypit = hylly.map(t => <option value={t.id} key={t.id}>{t.lyhenne}</option>)

    const renderTable = () => {

        if (loading)
            return <p>Loading ...</p>;
        else {
            return <Potions data={tuotteet} onDelete={onDelete} onEdit={onEdit} />
        }
    }

    const onCancel = () => setshowEditForm(false);
    const onSave = (uusiTuote) =>  {
        if ( uusiTuote.id > 0)
            setModifiedTuote(uusiTuote)
        else 
            setTuoteInsert(uusiTuote);
        setshowEditForm(false);
    }

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
            {
                showEditForm ? <TuoteForm hylly={tyypit} onSave={onSave} onCancel={onCancel} tuote={tuoteModify}/> :
                    <div>
                        <label>
                            Nimi:
                            <input type="text" value={nimi} onChange={e => setNimi(e.target.value)} />
                        </label>
                        <label>
                            Määrä:
                            <input type="text" value={maara} onChange={e => setMaara(e.target.value)} />
                        </label>
                        <label>
                            Hylly:
                            <select value={hylly_id} onChange={e => setHylly_id(e.target.value)}>
                                {tyypit}
                            </select>
                        </label>
                        <button onClick={() => haeClicked()}>Hae</button>
                        <button onClick={() => setshowEditForm(true)}>Lisää uusi</button>

                        <h4>Tuotteet</h4>
                        {
                            renderTable()
                        }
                    </div>
            }
        </div>
    )
}

const TuoteForm = (props) => {

    const { hylly, onCancel, onSave, tuote } = props;

    const [nimi, setNimi] = useState('');
    const [maara, setMaara] = useState('');
    const [hylly_id, setHylly_id] = useState(-1);

    const tallennaClicked = () => {
        onSave({id: tuote ? tuote.id : -1, nimi, maara, hylly_id})
    }

    useEffect( () => {
        if ( tuote ) {
            setNimi(tuote.nimi);
            setMaara(tuote.maara);
            setHylly_id(tuote.hylly_id)
        }
    }, [tuote])

    return (
        <div>
            {tuote ? <h4>Tuotteen muokkaaminen</h4> : <h4>Uuden tuotteen lisääminen</h4>}
            <label>
                Nimi:
                <input type="text" value={nimi} onChange={e => setNimi(e.target.value)} />
            </label>
            <label>
                Määrä:
                <input type="text" value={maara} onChange={e => setMaara(e.target.value)} />
            </label>
            <label>
                Hylly:
                <select value={hylly_id} onChange={e => setHylly_id(e.target.value)}>
                    {hylly}
                </select>
            </label>
            <button onClick={() => tallennaClicked()}>{tuote ? "Tallenna muutos" : "Tallenna"}</button>
            <button onClick={() => onCancel()}>{tuote ? "Peruuta muokkaus" : "Peruuta"}</button>
        </div>
    )
}

const Potions = (props) => {

    const { data, onDelete, onEdit } = props;
    const [showNotFound, setShowNotFound] = useState(true)
 
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNotFound(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [data]);

    const rows = data.map(t => <tr key={t.id}>
        <td>{t.nimi}</td>
        <td>{t.maara}</td>
        <td>{t.hylly_id}</td>
        <td><button onClick={() => deleteClicked(t)}>Poista</button></td>
        <td><button onClick={() => onEdit(t)}>Muokkaa</button></td>
    </tr>)

    const deleteClicked = (a) => {
        const r = window.confirm(`Haluatko varmasti poistaa tuotteen ${a.nimi}?`)
        if (r) onDelete(a);
    }

    return (
        <div>
            { data.length === 0 ?
                (showNotFound ? <p>Annetuilla hakuehdoilla ei löytynyt tuotteita</p> : '') :
                <table>
                    <thead>
                        <tr>
                            <td>Nimi</td>
                            <td>Määrä</td>
                            <td>Hylly</td>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            }
        </div>
    )
}