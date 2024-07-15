import React, { useState } from 'react'
import "./CreateClient.css"

import { useAppContext } from '../../../context'
import { Alert, Button } from '@mui/material'
import { message } from 'antd'
function CreateClient() {
  const { createUser, isCreating,userExists} = useAppContext()
  const [values, setValues] = useState({
    fullName: "",
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
  const validateForm = async(ev) => {
    ev.preventDefault()
    if (!values.fullName ) {
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    } else {
      setShowAlert(false)
      message.loading("Creando fichero de cliente, aguarde...")
      await createUser(values)
    }
  }
  return (
    <div className='container custom__container-createUser'>
      <div className="columns">
        <div className="column">
        <h1 className='title is-color-black'>Crear ficha de cliente</h1>
      <form onSubmit={validateForm} className='form-createClient'>
        <div className="field">
          <div className="label is-color-black is-size-5">Nombre completo:
            <input type="text"
              name='fullName'
              value={values.fullName}
              className='input'
              onChange={handleInputChange} />
              <span className={`tag ${showAlert ? 'is-danger' : 'is-info'} is-color-black is-size-6 mt-2`}>Este campo es obligatorio</span>
            
          </div>
        </div>

        <div className="field">
          <div className="label is-color-white is-color-black is-size-5">DNI:
            <input type="text"
              name='dni' value={values.dni}
              className='input'
              onChange={handleInputChange} />
            
            {!userExists ? <span className="tag is-warning m-2">Recomendado</span> : ""}
            {userExists ? <span className='tag is-danger is-color-black is-size-6m-2'>Ya existe un usuario con este DNI</span> : ""}


          </div>
        </div>

        <div className="field">
          <div className="label is-color-black is-color-black is-size-5">Teléfono:
            <input type="text"
              name='phone'
              value={values.phone}
              className='input'
              onChange={handleInputChange} />
            <span className="tag is-normal is-color-white is-size-6 is-background-black  m-2">Opcional</span>


          </div>
        </div>

        <div className="field">
          <div className="label is-color-black is-color-white is-size-5">Dirección:
            <input type="text"
              name='street'
              value={values.street}
              className='input'
              onChange={handleInputChange} />
            <span className="tag is-normal is-color-white is-size-6  is-background-black  m-2">Opcional</span>

          </div>
        </div>

        <div className="field">
          {showAlert ? <Alert severity='error'>Debe completar los campos que sean <strong className='subtitle has-text-weigth-bold has-text-danger is-size-6'>obligatorios</strong></Alert> : ""}
        </div>
        
        <Button variant='contained' disabled={isCreating} type='submit' style={{ backgroundColor: isCreating ? "grey" : "" }}>{isCreating ? "Aguarde..." : "Guardar Cliente"}</Button>
      </form>
        </div>
      </div>
    </div>
  )
}

export default CreateClient