import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { Modal, Button, message, Tag } from 'antd';
import WhatsappIcon from '../../../../svgs/whatsapp/WhatsappIcon';
import EditDataClient from '../EditarDatosCliente/EditDataClient';
import BotIcon from '../../../../svgs/bot/BotIcon';
import { PiPencilSimpleLight } from 'react-icons/pi';
import { DeleteRounded } from '@mui/icons-material';
import { useAppContext } from '../../../context';
import Swal from 'sweetalert2';
import { AiOutlineUserDelete } from 'react-icons/ai';
import axios from "axios"
function ClientDataModal({ closeModal, openModal, clientData,monto_adeudado, deudas }) {
    const { deleteUser, isDeletingUser, DebtData } = useAppContext()
    const onClose = () => {
        closeModal();
    };
    const client = clientData[0]
    const formatDeudas = (deudas) => {
        let listaDeudas = '';
    
        // Recorremos cada grupo de deudas por fecha
        for (const [fecha, items] of Object.entries(deudas)) {
            listaDeudas += `\nFecha de compra: ${fecha}\n`;
            
            // Recorremos cada deuda de la fecha actual
            items.forEach(item => {
                listaDeudas += `- Producto: ${(item.nameProduct).replace("x", "")}\n`;
            });
        }
    
        return listaDeudas;
    };
    const handleContactUser= async(num) =>{
        console.log(num)
        if (!num) {
            message.error("El cliente no tiene un número proporcionado ",3)
            return
        }
        const mensaje = `Hola ${client.nombre_completo}, ¡Espero que estés teniendo un buen día! Queremos recordarte que, a la fecha, tenemos registrada una deuda pendiente de $${monto_adeudado} en nuestra joyería. Aquí está el detalle de las deudas:

        ${formatDeudas(deudas)}
        
        Nos encantaría poder resolver esto pronto para seguir ofreciéndote nuestro mejor servicio. Si tienes alguna duda o deseas ponerte al día, no dudes en acercarte a nuestra tienda o contactarnos. ¡Muchas gracias por tu atención y confianza en Joyas Capitio 💎!`;        const hideMessage = message.loading("Enviando mensaje",0)
        try {
            const response = await axios.post('http://localhost:4000/send-message', { num,mensaje })
            console.log(response)
            if (response.data.success == true) {
                hideMessage()
                message.success("Mensaje enviado")
            }else{
                hideMessage()
                message.error("Error al enviar el mensaje, por favor vuelva a reintentar",3);

            }
        } catch (error) {
            hideMessage()
            message.error("Error al enviar el mensaje, por favor vuelva a reintentar",3);
            
            console.log(error)
        }
    }
    const [editClient, setEditClient] = useState(false)
    const handleShowEditClientModal = () =>{
        setEditClient(!editClient)
    }

    const RenderAlertComponent = () => {
        return (
            <>
                <div className="box">
                <Tag color='#cd201f' className='is-size-3 m-2' style={{padding: ".5rem"}}>Este cliente tiene deudas</Tag>
                <h1 className="title is-size-4 is-color-white">¿Está seguro de eliminar este cliente?</h1>
                
                <p className='subtitle m-1 is-color-white'>Eliminarlo hará que se pierdan todos los datos relacionados <Tag color='red' className='is-size-5' style={{padding: ".5rem"}}>Con entregas incluidas</Tag></p>
                </div>
            </>
        );
    };

    const renderNormalAlert = () =>{
        return (
            <>
                <div className="box">
                <Tag color='#cd201f' className='is-size-3 m-2' style={{padding: ".5rem"}}>¿Está seguro de eliminar este cliente?</Tag>
                
                <p className='subtitle m-1 is-color-white'>Eliminarlo hará que se pierdan todos los datos relacionados</p>
                </div>
            </>
        );
    }
    
    const handleDeleteUser = async () => {
        console.log(DebtData);
        if (DebtData) {
            Swal.fire({
                html: '<div id="alert-container"></div>',
                showDenyButton: false,
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Eliminar cliente",
                didOpen: () => {
                    const alertContainer = document.getElementById('alert-container');
                    if (alertContainer) {
                        ReactDOM.render(<RenderAlertComponent />, alertContainer);
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteUser()
                    
                }
            });
        }else{
            Swal.fire({
                html: '<div id="alert-container"></div>',
                showDenyButton: false,
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Eliminar cliente",
                didOpen: () => {
                    const alertContainer = document.getElementById('alert-container');
                    if (alertContainer) {
                        ReactDOM.render(<RenderAlertComponent />, renderNormalAlert);
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteUser()
                    
                }
            });
        }
    };
    
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
                width={1100}
            >
                {clientData && clientData.map((el, index) => (
                    <article key={index} className='panel is-black is-color-white is-size-5'>
                        <p className='panel-heading' style={{ textTransform: "capitalize" }}>
                            Cliente: {el.nombre_completo || "No hay datos"} {el.apodo ? `(${el.apodo})` : ""}
                        </p>
                        <div class="panel-tabs">
                            <button className='button is-danger m-3' onClick={handleDeleteUser}><p className='is-size-5'>Eliminar cliente</p> <AiOutlineUserDelete style={{width: "30px"}}/></button>
                            <button className='button is-normal m-3' onClick={()=>handleContactUser(el.telefono)} style={{padding:".5rem", display: "flex", gap: ".5rem"}}><p className='is-size-5'>Enviar aviso de saldo</p> <WhatsappIcon /></button>
                            <button className='button is-link m-3' style={{padding:".5rem", display: "flex", gap: ".5rem", backgroundColor: "grey"}} onClick={()=> message.info("Función disponible pronto")}><p className='is-size-5'>Enviar un mensaje automatizado</p> <BotIcon/></button>
                            <button className='button is-warning m-3' onClick={handleShowEditClientModal}><p className='is-size-5'>Editar Datos</p> <PiPencilSimpleLight style={{width: "25px", display: "flex", gap: ".5rem"}}/></button>
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
