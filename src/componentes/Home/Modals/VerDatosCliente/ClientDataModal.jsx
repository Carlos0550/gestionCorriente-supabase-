import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import WhatsappIcon from '../../../../svgs/whatsapp/WhatsappIcon';
import EditDataClient from '../EditarDatosCliente/EditDataClient';
import BotIcon from '../../../../svgs/bot/BotIcon';
import { PiPencilSimpleLight } from 'react-icons/pi';
import { DeleteRounded } from '@mui/icons-material';
function ClientDataModal({ closeModal, openModal, clientData }) {
    const onClose = () => {
        closeModal();
    };

    const handleContactUser= (num) =>{
        console.log(num)
        if (!num) {
            message.error("El cliente no tiene un número proporcionado ",3)
            return
        }
        const whatsappUrl = `https://wa.me/${num}`
        window.open(whatsappUrl, "_blank")
    }
    const [editClient, setEditClient] = useState(false)
    const handleShowEditClientModal = () =>{
        setEditClient(!editClient)
    }
    return (
        <>
            <Modal
                open={openModal}
                closeIcon={null}
                footer={[
                    <Button key="close" type='primary' onClick={onClose}>
                        Cerrar sección
                    </Button>
                ]}
                width={900}
            >
                {clientData && clientData.map((el, index) => (
                    <article key={index} className='panel is-black is-color-white is-size-5'>
                        <p className='panel-heading' style={{ textTransform: "capitalize" }}>
                            Cliente: {el.nombre_completo || "No hay datos"} {el.apodo ? `(${el.apodo})` : ""}
                        </p>
                        <div class="panel-tabs">
                            <button className='button is-danger m-3'>Eliminar cliente <DeleteRounded/></button>
                            <button className='button is-normal m-3' onClick={()=>handleContactUser(el.telefono)} style={{padding:".5rem", display: "flex", gap: ".5rem"}}>Contactar <WhatsappIcon/></button>
                            <button className='button is-link m-3' style={{padding:".5rem", display: "flex", gap: ".5rem"}}>Enviar un mensaje automatizado <BotIcon/></button>
                            <button className='button is-warning m-3' onClick={handleShowEditClientModal}>Editar Datos <PiPencilSimpleLight style={{width: "25px", display: "flex", gap: ".5rem"}}/></button>
                        </div>
                        <p class="panel-block is-active">
                            <a className='has-text-weight-bold is-color-black'>Apodo: {el.apodo || "No hay datos"}</a>
                        </p>
                        <p class="panel-block is-active">
                            <a className='has-text-weight-bold is-color-black'>Dirección: {el.direccion || "No hay datos"}</a>
                        </p>
                        <p class="panel-block is-active">
                            <a className='has-text-weight-bold is-color-black'>DNI: {el.dni || "No hay datos"}</a>
                        </p>
                        <p class="panel-block is-active">
                            <a className='has-text-weight-bold is-color-black'>Teléfono: {el.telefono || "No hay datos"}</a>
                        </p>
                    </article>
                ))}
            </Modal>
            {editClient && <EditDataClient closeModal={handleShowEditClientModal}/>}
        </>
    );
}

export default ClientDataModal;
