import React, { useState } from 'react'
import "./FindClient.css"
import ClientInterface from '../../ClientInterface/ClientInterface'
import { useAppContext } from '../../../context'
function FindClient() {
  const { findUser, searching, clientData, userNotExist } = useAppContext()
  const [values, setValues] = useState({
    fullName: "",
    dni: "",
  })
  const handleInputChange = (e) => {
    const { value, name } = e.target
    setValues((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const [showAlert, setShowAlert] = useState(false)
  const [onlyOneData, setOnlyOneData] = useState(false)
  const validateForm = (ev) => {
    ev.preventDefault()
    if (values.fullName && values.dni) {
      setOnlyOneData(true)
      setTimeout(() => {
        setOnlyOneData(false)
      }, 1500);
    }
    if (values.fullName || values.dni) {
      findUser(values)
      setValues({
        fullName: "",
        dni: ""
      })
    } else {
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
      }, 1500)
    }
  }
  return (
    <div className='form-CreateClient__wrapper'>
      <h1 className='form-findCLient__h1'>Busque al cliente con su nombre o DNI</h1>
      <form className='form-createCLient' onSubmit={validateForm}>
        <label className='form-createCLient__label'>
          <p>Nombre Completo:</p>
          <input type="text"
            name='fullName'
            value={values.fullName}
            className='form-createCLient__input'
            onChange={handleInputChange} />
        </label>
        <label className='form-createCLient__label'>
          <p>Dni:</p>
          <input type="text"
            name='dni' value={values.dni}
            className='form-createCLient__input'
            onChange={handleInputChange} />
        </label>
        {showAlert ? <p style={{ color: "red", textShadow: "0 0 5px red", fontSize: "clamp(1.2rem,1.5vw,1.7rem)" }}>Debe introducir un nombre o DNI</p> : ""}
        {onlyOneData ? <p style={{ color: "blue", textShadow: "0 0 5px blue", fontSize: "clamp(1.2rem,1.5vw,1.7rem)" }}>Introduzca solo un dato!</p> : ""}
        {userNotExist ? <p style={{ color: "red", textShadow: "0 0 5px red", fontSize: "clamp(1.2rem,1.5vw,1.7rem)" }}>EL usuario no existe!</p> : ""}
        <button className='form-createCLient__btn' type='submit' disabled={searching} style={{ backgroundColor: searching ? "grey" : "" }}>{searching ? "Aguarde..." : "Buscar Cliente"}</button>
      </form>
      {clientData && clientData.length > 0 ? <ClientInterface datosDelCliente={clientData}/> : ""}
    </div>
  )
}

export default FindClient