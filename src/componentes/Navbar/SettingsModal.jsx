
import React, {useState } from 'react';
import {Modal, message } from 'antd';

import { Button, TextField } from '@mui/material';
import { supabase } from "../../Auth/supabase";


const SettingsModal = ({ closeModal }) => {
  const [usdValue, setUsdValue] = useState(null)
  const handleInput = (e)=>{
    setUsdValue(e.target.value)
  }

  const handleSaveConfig = async() =>{
    message.loading("Guardando")
    if (!usdValue) {
        message.error("EL valor del dolar no puede estar vacio")
        return
    }else{
        const { error } = await supabase
        .from('usdPrice')
        .update({ 'value': usdValue})
        .eq("id", 1)
        if (!error) {
            message.success("Dolar guardado")
        }
        if (error) {
            message.error("Hubo un error, por favor intente nuevamente")
        }
    }
  }
  
  return (
    <>
      <Modal
        title=<h1 className='title has-text-centered is-color-black m-1 p-1'>Ajustes</h1>
        visible={true}
        okText="Cancelar"
        closeIcon={false}
        width={500}
        footer={[
            <button className='button is-danger m-1' onClick={closeModal}>Cerrar</button>,
            <Button variant='contained' className='m-1' onClick={handleSaveConfig}>Guardar</Button>
        ]}
      >
       
       <div className="container">
            <div className="field">
                <TextField 
                id="outlined-basic" 
                label="Ingresa el precio del dolar" 
                variant="outlined"
                value={usdValue}
                onChange={handleInput}
                />
            </div>
       </div>
      </Modal>
    </>
  );
};

export default SettingsModal;
