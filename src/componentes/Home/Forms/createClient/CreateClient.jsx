import React, { useState } from 'react'
import "./CreateClient.css"

import { useAppContext } from '../../../context'
function CreateClient() {
  const {createUser,isCreating, isCreated, isError,userExist} = useAppContext()
  const [values, setValues] = useState({
    fullName: "",
    surname: "",
    dni:"",
    phone: "",
    street: ""
  })
  const handleInputChange = (e) =>{
    const {value, name} = e.target
    setValues((prevState)=>({
      ...prevState,
      [name]:value
    }))
  }
  const [showAlert, setShowAlert] = useState(false)
  const validateForm = (ev) =>{
    ev.preventDefault()
    if (!values.fullName || !values.phone || !values.surname ) {
      setShowAlert(true)
      setTimeout(()=>{
        setShowAlert(false)
      },1500)
    }else{
      setShowAlert(false)
      createUser(values)
    }
  }
  return (
    <div className='form-CreateClient__wrapper'>
      <h1 className='form-createCLient__h1'>Crear Un usuario</h1>
      <form className='form-createCLient' onSubmit={validateForm}>
        <label className='form-createCLient__label'>
          <p>Nombre Completo:</p>
          <p style={{ color: "red" }}>*Obligatorio*</p>
          <input type="text" 
          name='fullName'
          value={values.fullName}
          className='form-createCLient__input'
          onChange={handleInputChange} />
        </label>

        <label className='form-createCLient__label'>
          <p>Apellido:</p>
          <p style={{ color: "red" }}>*Obligatorio*</p>
          <input type="text" 
          name='surname' 
          value={values.surname} 
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

        <label className='form-createCLient__label'>
          <p>Teléfono:</p>
          <p style={{ color: "red" }}>*Obligatorio*</p>
          <input type="text" 
          name='phone' 
          value={values.phone} 
          className='form-createCLient__input'
          onChange={handleInputChange} />
        </label>

        <label className='form-createCLient__label'>
          <p>Dirección:</p>
          <input type="text" 
          name='street' 
          value={values.street} 
          className='form-createCLient__input'
          onChange={handleInputChange} />
        </label>
        {showAlert ? <p style={{color: "red", textShadow: "0 0 5px red"}}>Debe completar los campos que sean <strong>obligatorios</strong></p>:""}
        {isCreated ? <p style={{color: "green", textShadow: "0 0 5px green"}}>Usuario creado con exito!</p>:""}
        {isError ? <p style={{color: "red", textShadow: "0 0 5px red"}}>Hubo un error, reintente nuevamente y verifique su conexión</p>:""}
        {userExist ? <p style={{color: "red", textShadow: "0 0 5px red"}}>Ya existe un usuario con esos datos!</p>:""}
    <button className='form-createCLient__btn' type='submit' disabled={isCreating} style={{backgroundColor: isCreating ? "grey" : ""}}>{isCreating ? "Aguarde..." : "Guardar Cliente" }</button>
      </form>
    </div>
  )
}

export default CreateClient