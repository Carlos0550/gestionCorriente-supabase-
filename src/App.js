import React from "react";
import { Routes,Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import ReviewClientFile from "./components/Revisar Fichero/ReviewClientFile";
import ViewHistory from "./pages/VerHistorial/ViewHistory";
import Login from "./pages/Login/Login";
export default function GestorClientes() {
 

  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/ver-cliente" element={<ReviewClientFile/>}/>
      <Route path="/ver-historial" element={<ViewHistory/>}/>
    </Routes>
  );
}