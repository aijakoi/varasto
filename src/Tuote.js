import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./App.css";
import { Box, TextField } from "@material-ui/core";

// query-muuttuja, jota hyödynnetään tuotetietojen muokkaamisessa ja poistamisessa
const doSearchQuery = (nimi, maara, hylly_id) => {
    let r = [];
    if (nimi !== '') r.push("nimi = " + nimi);
    if (maara !== '') r.push("määrä = " + maara);
    if (hylly_id !== '-1') r.push("hylly_id = " + hylly_id);
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

    // haetaan hyllyjen tiedot
    useEffect(() => {
        const fetchHylly = async () => {
            const r = await fetch('http://localhost:3004/hylly');
            const data = await r.json();
            setHylly([{ id: -1, lyhenne: "Valitse" }, ...data]);
        }
        fetchHylly();
    }, [])
    
    // haetaan tuotteen tiedot
    useEffect(() => {
        const fetchTuote = async () => {
            setLoading(true)
            const r = await fetch('http://localhost:3004/tuote?' + query);
            const data = await r.json();
            setLoading(false);
            setTuotteet(data);
        }
        if (query !== '') fetchTuote();
    }, [query])

    // haetaan tuotetiedot id:n mukaan muokkaamista varten
    useEffect(() => {
        const fetchTuoteById = async () => {
            const r = await fetch('http://localhost:3004/tuote/' + muutettavaid);
            const data = await r.json();
            setTuoteModify(data);
            setshowEditForm(true);
        }
        if (muutettavaid > 0) fetchTuoteById();
    }, [muutettavaid])

    // tuotteen poisto
    useEffect(() => {
        const deleteTuote = async () => {
            const r = await fetch('http://localhost:3004/tuote/' + tuoteDelete.id, {
                method: 'DELETE'
            });
            setQuery(doSearchQuery(nimi, maara, hylly_id))
        }
        if (tuoteDelete != null) deleteTuote();
    }, [tuoteDelete])

    // uuden tuotteen lisääminen, näissä taikajuomahyllyissä on loputtomat varastot :P
    useEffect(() => {
        const insertTuote = async () => {
            const r = await fetch('http://localhost:3004/tuote/', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ nimi: tuoteInsert.nimi, maara: tuoteInsert.maara, hylly_id: tuoteInsert.hylly_id })
            });
            setQuery(doSearchQuery(nimi, maara, hylly_id))
            setTuoteInsert(null);
        }
        if (tuoteInsert != null) insertTuote();
    }, [tuoteInsert])

    // tuotteen muokkaaminen
    useEffect(() => {
        const modifyTuote = async () => {
            const r = await fetch('http://localhost:3004/tuote/' + modifiedTuote.id, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ nimi: modifiedTuote.nimi, maara: modifiedTuote.maara, hylly_id: modifiedTuote.hylly_id })
            });
            setQuery(doSearchQuery(nimi, maara, hylly_id))
            setModifiedTuote(null);
            setTuoteModify(null)
        }
        if (modifiedTuote != null) modifyTuote();
    }, [modifiedTuote])

    // hae-nappia painamalla asetetaan käyttäjän syöttämät tiedot query-muuttujaan
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
            return <p>Lataa...</p>;
        else {
            return <Potions data={tuotteet} onDelete={onDelete} onEdit={onEdit} />
        }
    }

    const onCancel = () => setshowEditForm(false);

    const onSave = (uusiTuote) => {
        if (uusiTuote.id > 0)
            setModifiedTuote(uusiTuote)
        else
            setTuoteInsert(uusiTuote);
        setshowEditForm(false);
    }

    return (
        <div>
            <nav className='nav'>
                <Link to="/Etusivu">Etusivu</Link> |{" "}
                <Link to="/Haku">Hyllytiedot</Link> |{" "}
                <Link to="/Tuote">Hallitse tuotetietoja</Link>
            </nav>
            <Box display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="30px">
                {
                    showEditForm ? <TuoteForm hylly={tyypit} onSave={onSave} onCancel={onCancel} tuote={tuoteModify} /> :
                        <div >

                            <button className='button' onClick={() => haeClicked()}>Hae</button>
                            <button className='button' onClick={() => setshowEditForm(true)}>Lisää uusi</button>
                            {
                                renderTable()
                            }
                        </div>
                }
            </Box>
        </div>
    )
}

const TuoteForm = (props) => {

    const { hylly, onCancel, onSave, tuote } = props;

    const [nimi, setNimi] = useState('');
    const [maara, setMaara] = useState('');
    const [hylly_id, setHylly_id] = useState(-1);

    const tallennaClicked = () => {
        onSave({ id: tuote ? tuote.id : -1, nimi, maara, hylly_id })
    }

    useEffect(() => {
        if (tuote) {
            setNimi(tuote.nimi);
            setMaara(tuote.maara);
            setHylly_id(tuote.hylly_id)
        }
    }, [tuote])

    // uuden tuotteen lisääminen ja vanhan tuotteen muokkaaminen
    return (
        <div className='edit'>
            {tuote ? <h4>Tuotteen muokkaaminen</h4> : <h4>Uuden tuotteen lisääminen</h4>}
            <label>
                Nimi:
                <TextField
                    id="filled-search"
                    type="search"
                    variant="filled" value={nimi} onChange={e => setNimi(e.target.value)} />
            </label>
            <label>
                Määrä:
                <TextField
                    id="filled-search"
                    type="search"
                    variant="filled" value={maara} onChange={e => setMaara(e.target.value)} />
            </label>
            <label>
                Hylly:
                <select className='select' value={hylly_id} onChange={e => setHylly_id(e.target.value)}>
                    {hylly}
                </select>
            </label>
            <button className='button' onClick={() => tallennaClicked()}>{tuote ? "Tallenna muutos" : "Tallenna"}</button>
            <button className='button' onClick={() => onCancel()}>{tuote ? "Peruuta muokkaus" : "Peruuta"}</button>
        </div>
    )
}

const Potions = (props) => {
    const { data, onDelete, onEdit } = props;
    const [showNotFound, setShowNotFound] = useState(true);

    // Luo tila järjestetylle tuotelistalle
    const [sortedData, setSortedData] = useState([]);

    // Objekti hyllyn ID:t vastaaville lyhenteille
    const shelfShortNames = {
        1: "A-D",
        2: "E-H",
        3: "I-L",
        4: "M-P",
        5: "Q-T",
        6: "U-Z",
    };

    useEffect(() => {
        // Järjestä tuotelista aakkosjärjestykseen aina, kun data-tila päivittyy
        const sorted = [...data].sort((a, b) =>
            a.nimi.localeCompare(b.nimi)
        );
        setSortedData(sorted);

        const timer = setTimeout(() => {
            setShowNotFound(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [data]);

    const rows = sortedData.map((t) => (
        <tr key={t.id}>
            <td>{t.nimi}</td>
            <td>{t.maara}</td>
            <td>{shelfShortNames[t.hylly_id]}</td>
            <td>
                <button className="button" onClick={() => onEdit(t)}>
                    Muokkaa
                </button>
            </td>
            <td>
                <button
                    className="button"
                    onClick={() => deleteClicked(t)}
                >
                    Poista
                </button>
            </td>
        </tr>
    ));

    const deleteClicked = (a) => {
        const r = window.confirm(
            `Haluatko varmasti poistaa tuotteen ${a.nimi}?`
        );
        if (r) onDelete(a);
    };

    return (
        <div>
            {showNotFound && data.length === 0 && (
                <p>Tuotteita ei löytynyt.</p>
            )}
            <table>
                <thead>
                    <tr>
                        <th>Nimi</th>
                        <th>Määrä</th>
                        <th>Hylly</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
};
