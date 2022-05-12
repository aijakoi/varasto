import React from "react";
import { Link } from "react-router-dom";
import Slytherin from './Slytherin.png'
import "./App.css";
import { Card, CardMedia } from "@material-ui/core";



export default function Etusivu() {
  return (
    <div>
      <nav className="nav">
        <Link to="/Etusivu">Etusivu</Link> |{" "}
        <Link to="/Haku">Hyllytiedot</Link> |{" "}
        <Link to="/Tuote">Tuotteet</Link>
      </nav>
      <Card >
      <CardMedia
        component="img"
        sx={{ display: 'flex' }}
        image={Slytherin}
        alt="logo"
      />
      </Card>
      
    </div>
  );
}