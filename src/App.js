import React from 'react'
import "./App.css"
import {Routes, Route} from "react-router-dom"
//Components
import Home from './componentes/Home/Home'
import Login from './componentes/Login/Login'
//************ */


function App() {
  
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path="/home" element={<Home/>}></Route>
      </Routes>
    </>
  )
}

export default App