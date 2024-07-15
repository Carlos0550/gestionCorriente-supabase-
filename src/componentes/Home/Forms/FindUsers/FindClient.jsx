import React, { useState } from 'react'
import "./FindClient.css"
import ClientInterface from '../../ClientInterface/ClientInterface'
import { useAppContext } from '../../../context'
import { Button, LinearProgress } from '@mui/material'
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
    if (values.fullName && values.dni ) {
      setOnlyOneData(true)
      setTimeout(() => {
        setOnlyOneData(false)
      }, 3000);
      return
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
      }, 3000)
    }
  }

  
  return (
    <>
    <div className='container'>
      <div className="columns">
        <div className="column is-background-white custom-column-findClient">
          <form className='form-findCLient' onSubmit={validateForm}>
          <h1 className='title is-color-black is-size-4'>Buscar fichero del cliente</h1>

            <div className="label is-color-black is-size-4">Buscar por nombre completo:
              <input type="text"
                name='fullName'
                value={values.fullName}
                className='input'
                onChange={handleInputChange} />
            </div>
            <div className="label is-color-black is-size-4">Buscar por DNI:
              <input type="text"
                name='dni' value={values.dni}
                className='input'
                onChange={handleInputChange} />
            </div>
            {showAlert ? <div className="custom__tag-container">
              <span className='tag is-danger'>Debe introducir algún parametro de búsqueda</span>
            </div> : ""}
            {onlyOneData ? <div className="custom__tag-container">
              <span className='tag is-info'>Introduzca solo un dato!</span>
            </div> : ""}
            {userNotExist ? <div className='custom__tag-container'>
              <span className='tag is-warning'><p className='title is-size-6'>No se encontro un cliente con esos parámetros de búsqueda</p></span>
            </div> : ""}
            {!searching && <Button type='submit' disabled={searching}>Buscar Cliente</Button>}
            {searching ? <LinearProgress /> : ""}
          </form>
          {clientData && clientData.length > 0 ? <ClientInterface datosDelCliente={clientData} /> : ""}
        </div>
      </div>
    </div>
    </>
  )
}

export default FindClient