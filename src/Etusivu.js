import React from "react";
import { Link } from "react-router-dom";
import Slytherin from './Slytherin.png'
import styles from "./App.css";
import { StylesContext } from "@material-ui/styles";
import { Card, CardMedia } from "@material-ui/core";



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