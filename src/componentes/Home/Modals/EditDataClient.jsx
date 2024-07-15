import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppContext } from '../../context';
import NotificationError from '../Notifications/NotificationError';
import "./editClient.css"
const EditDataClient = ({ closeModal }) => {
  const {clientData, updateDataClient, isUpdating} = useAppContext()
  const navigate = useAppContext()
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [hookCLientData, setHookClientData] = useState({
    nombre_completo:"",
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
    }, 0);
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
    if (!hookCLientData.nombre_completo || !hookCLientData.telefono || !hookCLientData.direccion || !hookCLientData.dni) {
      setShowAlert(true)
      setTimeout(()=>{
        setShowAlert(false)
      },2500)
    }else{
      setShowAlert(false)
      updateDataClient(hookCLientData)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        closeModal();
    }
};

useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listener on component unmount
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}, [navigate]);
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
          
        ]}
        closeIcon={false}
      >
        <div className="container">
        <form className='box is-background-black' onSubmit={validateForm}>
        <label className='label is-color-black'>
          <div className='is-background-white'>
          <p className='is-color-black is-size-5'>Nombre Completo:</p>
          <span className='tag is-danger mb-3 mt-1'>*Obligatorio*</span>
          <input type="text" 
          name='nombre_completo'
          value={hookCLientData.nombre_completo}
          className='input'
          onChange={handleInputChange} />
          </div>
        </label>

        

        <label className='label'>
          <div className="is-background-white">
          <p className='is-color-black is-size-5'>Dni:</p>
          <span className='tag is-danger mb-3 mt-1'>*Obligatorio*</span>

          <input type="text" 
          name='dni' value={hookCLientData.dni} 
          className='input'
          onChange={handleInputChange} />
          </div>
        </label>

        <label className='label'>
          <div className='is-background-white'>
          <p className='is-color-black is-size-5'>Teléfono:</p>
          <span className='tag is-danger mb-3 mt-1'>*Obligatorio*</span>
          <input type="text" 
          name='telefono' 
          value={hookCLientData.telefono} 
          className='input'
          onChange={handleInputChange} />
          </div>
        </label>

        <label className='label'>
          <div className="is-background-white">
          <p className='is-color-black is-size-5'>Dirección:</p>
          <span className='tag is-danger mb-3 mt-1'>*Obligatorio*</span>
          <input type="text" 
          name='direccion' 
          value={hookCLientData.direccion} 
          className='input'
          onChange={handleInputChange} />
          </div>
        </label>
        {showAlert && <NotificationError showAlert={showAlert} />}
        
        <button className='button is-warning is-size-5 m-2' type='submit' disabled={isUpdating} style={{cursor: isUpdating ? "not-allowed" : "pointer"}}>{isUpdating ? "Aguarde..." : "Actualizar"}</button>
        <Button key="update" type="primary" onClick={handleOk} loading={confirmLoading} className='button is-danger is-size-5 m-2'>
            Cerrar sección
        </Button>
      </form>
        </div>
      </Modal>
    </>
  );
};

export default EditDataClient;
