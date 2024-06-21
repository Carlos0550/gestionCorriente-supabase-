import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppContext } from '../../context';
import NotificationError from '../Notifications/NotificationError';
const EditDataClient = ({ closeModal }) => {
  const {clientData, updateDataClient, isUpdating} = useAppContext()
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [hookCLientData, setHookClientData] = useState({
    nombre_completo:"",
    apellido:"",
    telefono:"",
    dni:"",
    direccion: "",
    uuid:""
  })
  useEffect(()=>{
    if (clientData && clientData.length > 0) {
      const firstClient = clientData[0]
      setHookClientData({
        nombre_completo: firstClient.nombre_completo || "",
        apellido: firstClient.apellido || "",
        telefono: firstClient.telefono || "",
        dni: firstClient.dni || "",
        direccion: firstClient.direccion || "",
        uuid: firstClient.uuid
      })
    }
  },[clientData])

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      closeModal();
    }, 1000);
  };

  
  //  Formulario
  const handleInputChange = (e) =>{
    const {value, name} = e.target
    setHookClientData((prevState)=>({
      ...prevState,
      [name]:value
    }))
  }
  const [showAlert, setShowAlert] = useState(false)
  const validateForm = (ev) =>{
    ev.preventDefault()
    if (!hookCLientData.nombre_completo || !hookCLientData.telefono || !hookCLientData.apellido ) {
      setShowAlert(true)
      setTimeout(()=>{
        setShowAlert(false)
      },2500)
    }else{
      setShowAlert(false)
      updateDataClient(hookCLientData)
    }
  }
  return (
    <>
      <Modal
        title=""
        visible={true}
        onOk={handleOk}
        okText="Cancelar"
        width={1000}
        confirmLoading={confirmLoading}
        footer={[
          <Button key="update" type="primary" onClick={handleOk} loading={confirmLoading}>
            Cerrar
          </Button>,
        ]}
      >
        <form className='form-createCLient' onSubmit={validateForm}>
        <label className='form-createCLient__label'>
          <div className='form__createClient__p'>
          <p>Nombre Completo:</p>
          <p style={{ color: "red" }}>*Obligatorio*</p>
          </div>
          <input type="text" 
          name='nombre_completo'
          value={hookCLientData.nombre_completo}
          className='form-createCLient__input'
          onChange={handleInputChange} />
        </label>

        <label className='form-createCLient__label'>
          <div className='form__createClient__p'>
          <p>Apellido:</p>
          <p style={{ color: "red" }}>*Obligatorio*</p>
          </div>
          <input type="text" 
          name='apellido' 
          value={hookCLientData.apellido} 
          className='form-createCLient__input'
          onChange={handleInputChange} />
        </label>

        <label className='form-createCLient__label'>
          <p>Dni:</p>
          <input type="text" 
          name='dni' value={hookCLientData.dni} 
          className='form-createCLient__input'
          onChange={handleInputChange} />
        </label>

        <label className='form-createCLient__label'>
          <div className='form__createClient__p'>
          <p>Teléfono:</p>
          <p style={{ color: "red" }}>*Obligatorio*</p>
          
          </div>
          <input type="text" 
          name='telefono' 
          value={hookCLientData.telefono} 
          className='form-createCLient__input'
          onChange={handleInputChange} />
        </label>

        <label className='form-createCLient__label'>
          <p>Dirección:</p>
          <input type="text" 
          name='direccion' 
          value={hookCLientData.direccion} 
          className='form-createCLient__input'
          onChange={handleInputChange} />
        </label>
        {showAlert && <NotificationError showAlert={showAlert} />}
        
        <button className='form-createCLient__btn' type='submit' disabled={isUpdating} style={{cursor: isUpdating ? "not-allowed" : "pointer"}}>{isUpdating ? "Aguarde..." : "Actualizar"}</button>
      </form>
      </Modal>
    </>
  );
};

export default EditDataClient;
