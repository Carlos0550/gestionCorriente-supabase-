import React, { useState } from 'react'
import "./CreateClient.css"

import { useAppContext } from '../../../context'
import { Alert, Button } from '@mui/material'
function CreateClient() {
  const { createUser, isCreating} = useAppContext()
  const [values, setValues] = useState({
    fullName: "",
    surname: "",
    dni: "",
    phone: "",
    street: ""
  })
  const handleInputChange = (e) => {
    const { value, name } = e.target
    setValues((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const [showAlert, setShowAlert] = useState(false)
  const validateForm = (ev) => {
    ev.preventDefault()
    if (!values.fullName || !values.phone || !values.surname || !values.dni || !values.street) {
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    } else {
      setShowAlert(false)
      createUser(values)
    }
  }
  return (
    <div className='container custom__container-createUser'>
      <div className="columns">
        <div className="column">
        <h1 className='title has-text-centered is-color-white'>Crear ficha de cliente</h1>
      <form onSubmit={validateForm} className='form-createClient'>
        <div className="field">
          <div className="label is-color-white">Nombre completo:
            <input type="text"
              name='fullName'
              value={values.fullName}
              className='input'
              onChange={handleInputChange} />
            <span className={`tag ${showAlert ? 'is-danger' : 'is-info'} is-normal mt-1`}>Este campo es obligatorio</span>
          </div>
        </div>

        <div className="field">
          <div className="label is-color-white">Apellido:
            <input type="text"
              name='surname'
              value={values.surname}
              className='input'
              onChange={handleInputChange} />
            <span className={`tag ${showAlert ? 'is-danger' : 'is-info'} is-normal mt-1`}>Este campo es obligatorio</span>

          </div>
        </div>

        <div className="field">
          <div className="label is-color-white">DNI:
            <input type="text"
              name='dni' value={values.dni}
              className='input'
              onChange={handleInputChange} />
            <span className={`tag ${showAlert ? 'is-danger' : 'is-info'} is-normal mt-1`}>Este campo es obligatorio</span>

          </div>
        </div>

        <div className="field">
          <div className="label is-color-white">Teléfono:
            <input type="text"
              name='phone'
              value={values.phone}
              className='input'
              onChange={handleInputChange} />
            <span className={`tag ${showAlert ? 'is-danger' : 'is-info'} is-normal mt-1`}>Este campo es obligatorio</span>

          </div>
        </div>

        <div className="field">
          <div className="label is-color-white">Dirección:
            <input type="text"
              name='street'
              value={values.street}
              className='input'
              onChange={handleInputChange} />
            <span className={`tag ${showAlert ? 'is-danger' : 'is-info'} is-normal mt-1`}>Este campo es obligatorio</span>

          </div>
        </div>

        <div className="field">
          {showAlert ? <Alert severity='error'>Debe completar los campos que sean <strong className='subtitle has-text-weigth-bold has-text-danger is-size-6'>obligatorios</strong></Alert> : ""}
        </div>
        
        <Button variant='outlined' disabled={isCreating} type='submit' style={{ backgroundColor: isCreating ? "grey" : "" }}>{isCreating ? "Aguarde..." : "Guardar Cliente"}</Button>
      </form>
        </div>
      </div>
    </div>
  )
}

export default CreateClient