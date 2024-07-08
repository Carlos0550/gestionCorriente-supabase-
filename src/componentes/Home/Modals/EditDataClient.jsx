import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppContext } from '../../context';
import NotificationError from '../Notifications/NotificationError';
import "./editClient.css"
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
        closeIcon={false}
      >
        <form className='container  ' onSubmit={validateForm}>
        <label className='label is-color-black'>
          <div className='box'>
          <p>Nombre Completo:</p>
          <span className='tag is-danger mb-3 mt-1'>*Obligatorio*</span>
          <input type="text" 
          name='nombre_completo'
          value={hookCLientData.nombre_completo}
          className='input'
          onChange={handleInputChange} />
          </div>
        </label>

        <label className='label'>
          <div className='box'>
          <p>Apellido:</p>
          <span className='tag is-danger mb-3 mt-1'>*Obligatorio*</span>

          <input type="text" 
          name='apellido' 
          value={hookCLientData.apellido} 
          className='input'
          onChange={handleInputChange} />
          </div>
          
        </label>

        <label className='label'>
          <div className="box">
          <p>Dni:</p>
          <span className='tag is-danger mb-3 mt-1'>*Obligatorio*</span>

          <input type="text" 
          name='dni' value={hookCLientData.dni} 
          className='input'
          onChange={handleInputChange} />
          </div>
        </label>

        <label className='label'>
          <div className='box'>
          <p>Teléfono:</p>
          <span className='tag is-danger mb-3 mt-1'>*Obligatorio*</span>
          <input type="text" 
          name='telefono' 
          value={hookCLientData.telefono} 
          className='input'
          onChange={handleInputChange} />
          </div>
        </label>

        <label className='label'>
          <div className="box">
          <p>Dirección:</p>
          <span className='tag is-danger mb-3 mt-1'>*Obligatorio*</span>
          <input type="text" 
          name='direccion' 
          value={hookCLientData.direccion} 
          className='input'
          onChange={handleInputChange} />
          </div>
        </label>
        {showAlert && <NotificationError showAlert={showAlert} />}
        
        <button className='button is-warning' type='submit' disabled={isUpdating} style={{cursor: isUpdating ? "not-allowed" : "pointer"}}>{isUpdating ? "Aguarde..." : "Actualizar"}</button>
      </form>
      </Modal>
    </>
  );
};

export default EditDataClient;
