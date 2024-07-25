import React, { useEffect, useState, useRef } from 'react';
import "./ClientInterface.css";
import { useAppContext } from '../../context';
//Componentes
import EditDataClient from '../Modals/EditarDatosCliente/EditDataClient';
import ProductModal from '../Modals/AñadirDeudas/ProductModal';
import EditProducts from '../Modals/ActualizarProductos/EditProducts';
import MakeDeliver from '../Modals/HacerEntrega/MakeDelivery';
import MuchUsers from '../Modals/MuchosUsuarios/MuchUsers';
import ClientHistory from '../Modals/Historial/ClientHistory';
//Ui material
import { LinearProgress } from '@mui/material';
import ClientDataModal from '../Modals/VerDatosCliente/ClientDataModal';

function ClientInterface() {
    //Desestructuración de funciones del contexto
    const { 
        clientData, 
        showDebtUser, 
        userUUID, 
        fetchingData, 
        DebtData, 
        selectedOption, 
        fetchRegisterDeliverys, 
        deliverData, 
        cancelDebt, 
        fetchingDeliverys,
        usdPrice,
        deleteDelivery,
     } = useAppContext();
    let valorDelDolar = 0
    usdPrice.forEach(el =>{
        valorDelDolar += el.value
    })
    const [showProductModal, setShowProductModal] = useState(false);
    const [showSectionDebt] = useState(true);
    const [showEditProductModal, setShowEditProductModal] = useState(false)
    const [showMakeDeliveryModal, setShowMakeDeliveryModal] = useState(false)
    const [showMuchUsers, setShowMuchUsers] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [showClientData, setShowClientData] = useState(false)

    const handleProductModal = () => setShowProductModal(true);
    const closeProductModal = () => setShowProductModal(false);
    const closeMakeDeliveryModal = () => setShowMakeDeliveryModal(false)
    const closeEditProductModal = () => setShowEditProductModal(false)
    const closeShowMuchUsersModal = () => setShowMuchUsers(false)
    const closeHistoryModal = () => setShowHistory(false)
    const toggleClientDataModal = () => setShowClientData(!showClientData);


    const handleShowModalHistory = () => {
        setShowHistory(true)
    }


    const openModalMuchUsers = () => {
        setShowMuchUsers(true)
    }

    useEffect(() => {
        if (clientData.length > 1) {
            openModalMuchUsers()
        }
    }, [clientData])

    const processingDeliverData = () => {
        if (deliverData.length === 0) {
            return { last: 0, saldoRestante: 0 }
        }
        const lastIndex = deliverData.length - 1;
        const last = deliverData[lastIndex].monto_entrega

        let saldoRestante = 0
        deliverData.forEach(element => {
            saldoRestante += parseInt(element.monto_entrega)
        })
        return { last, saldoRestante }
    }

    const { saldoRestante } = processingDeliverData();

    const [productId, setProductId] = useState(null);
    const openEditProductModal = (id) => {
        if (id) {
            setProductId(id);
          }
        
        setShowEditProductModal(true)
    }
   


    const openMakeDeliveryModal = () => {
        setShowMakeDeliveryModal(true)
    }

    const confirmCancellDebt = async () => {
        await cancelDebt()
    }


    const total = () => {
        let totalPesos = 0;
        let totalUsdInPesos = 0
        DebtData && DebtData.forEach(element => {
            const price = parseFloat(element.price)
            const quantity = parseInt(element.quantity)

            if (element.change === "ars") {
                totalPesos += price * quantity
            } else if (element.change === "usd") {
                totalUsdInPesos += (price * quantity) * valorDelDolar
            }
        });
        return {
            totalGeneral: totalPesos + totalUsdInPesos
        }
    }

    

    const { totalGeneral } = total();


    useEffect(() => {
        if (clientData.length > 0 && userUUID) {
            showDebtUser()
            fetchRegisterDeliverys()
        }
    }, [clientData, userUUID])

    const calcularMonto = (price, quantity, moneda) => {
        let monto;
        if (moneda === "ars") {
            monto = (price * quantity).toFixed(2);
            return `$${monto}`;
        } else if (moneda === "usd") {
            monto = ((price * quantity) * valorDelDolar).toFixed(2);
            return `$${monto}`;
        }
    
    };

    // Agrupación por fecha_compra
    const groupedHistory = DebtData.reduce((acc, item) => {
        const date = item.buyDate; // Suponiendo que fecha_compra está en un formato adecuado
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});


    useEffect(() => {
        if (totalGeneral - saldoRestante === 0 && DebtData.length > 0) {
            confirmCancellDebt()
        }
    }, [totalGeneral, saldoRestante, DebtData])

    let monto_total = 0

    Object.keys(groupedHistory).reverse().map((date, index) => {
        let totalPesos = 0
        let totalUsd = 0
        groupedHistory[date].map((debt, debtIndex) => {
            if (debt.change === "ars") {
                totalPesos += debt.price * debt.quantity
            } else if (debt.change === "usd") {

                totalUsd += (debt.price * debt.quantity) * valorDelDolar
            }

            return monto_total = totalPesos + totalUsd;
        })
    })


    const handleDeleteDeliver = (idDeliver) =>{
        deleteDelivery(idDeliver)
    }

    const targetRef = useRef(null);

    useEffect(() => {
        if (clientData.length > 0 && DebtData.length > 0 && selectedOption==="añadirDeuda") {

          if (targetRef.current) {
            setTimeout(() => {
              targetRef.current.scrollIntoView({
                behavior: 'smooth',
              });
            }, 500); 
          }
        }
      }, [clientData, DebtData,selectedOption]);
    
    return (
        <div className='container'>
            <div className='columns'>
                <div className='column is-12'>
                    {clientData && clientData.length > 0 ? (
                        clientData.map((item, index) => (
                            <div key={index} className='custom__column-clientInterface is-background-white is-color-white'>
                            <article className='panel is-warning is-size-5'>
                                <p className='panel-heading' style={{textTransform: "capitalize"}}>Cliente: {item.nombre_completo || "No hay datos"} {item.apodo ? `(${item.apodo})` : ""}</p>
                                <p className='panel-tabs'>
                                    <a>{DebtData && DebtData.length > 0 ? <button className='button is-link m-2 is-size-5' onClick={openMakeDeliveryModal}>Hacer entrega</button> : ""}</a>
                                    <a><button className='button is-background-black is-color-white m-2 is-size-5' onClick={toggleClientDataModal}>Ver datos del cliente</button></a>
                                    <a> {totalGeneral - saldoRestante === 0 && DebtData.length > 0 ? "" : <button className='button m-1 is-background-black is-color-white m-2 is-size-5' onClick={handleProductModal}>Añadir un producto</button>}</a>
                                    <a><button className='button is-background-black is-color-white m-2 is-size-5' onClick={handleShowModalHistory}>Revisar historial</button></a>
                                </p>
                            </article>

                                <div className='columns'>
                                    <div className='column '>
                                        {DebtData.length > 0 ?
                                            <div className='custom__container-productoClient' >
                                                {showSectionDebt && (
                                                    <>
                                                        {Object.keys(groupedHistory)
                                                            .map((date, index) => (
                                                                <div key={index} className="table-container">
                                                                    <table className="table is-fullwidth is-bordered is-hoverable">
                                                                        <thead>
                                                                            <tr>
                                                                                <th className='has-text-weight-bold is-size-5 is-background-black is-color-white'>Producto/detalle</th>
                                                                                <th className='has-text-weight-bold is-size-5 is-background-black is-color-white'>Monto/codigo</th>
                                                                                <th className='has-text-weight-bold is-size-5 is-background-black is-color-white'>Cantidad</th>
                                                                                <th className='has-text-weight-bold is-size-5 is-background-black is-color-white'>Total</th>
                                                                                <th className='has-text-weight-bold is-size-5 is-background-black is-color-white'>Saldo total: ${totalGeneral - saldoRestante}</th>
                                                                                <th className='has-text-weight-bold is-size-5 is-background-black is-color-white'>Fecha de compra: {date}</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {fetchingData && <LinearProgress />}
                                                                        {!fetchingData && (
                                                                            <tbody ref={targetRef}>
                                                                                {groupedHistory[date].map((debtItem, debtIndex) => (
                                                                                    <tr key={debtIndex}>
                                                                                        <td className='is-size-5 is-background-white is-color-black'>x{debtItem.quantity} {(debtItem.nameProduct).replace(/X|x/g, '')}</td>
                                                                                        <td className='is-size-5 is-background-white is-color-black'>
                                                                                            {debtItem.change === "usd" ? `x${debtItem.price} c/u` : ""}
                                                                                            {debtItem.change === "ars" ? `$${debtItem.price} c/u` : ""}
                                                                                        </td>
                                                                                        <td className='is-size-5 is-background-white is-color-black'>
                                                                                            {debtItem.quantity} unidades
                                                                                        </td>
                                                                                        <td className='is-size-5 is-background-white is-color-black'>
                                                                                            {calcularMonto(debtItem.price, debtItem.quantity, debtItem.change)}
                                                                                        </td>
                                                                                        <td className='is-background-white is-color-black'></td>
                                                                                        <td className='is-background-white is-color-black'></td>
                                                                                        <td className='is-background-white is-color-black'>
                                                                                            <div className="control">
                                                                                                <button className="button is-info m-2" onClick={() => openEditProductModal(debtItem.id)}>Intercambiar</button>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        )}
                                                                    </table>
                                                                </div>
                                                            ))}
                                                    </>
                                                )}
                                            </div>
                                            :
                                            <React.Fragment>
                                                <div className="box">
                                                    <div className="title is-size-5">El cliente no tiene deudas</div>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>
                                    <div className='column '>
                                        {deliverData && deliverData.length > 0 ? (
                                            <div className="custom-column-deliverys">
                                                <h1 className='title is-size-5 box m-3'>Entregas</h1>
                                                {fetchingDeliverys ? (
                                                    <LinearProgress />
                                                ) : (
                                                    deliverData.length > 0 ? (
                                                        <div className="table-container">
                                                            <table className="table is-fullwidth is-bordered is-hoverable">
                                                                <thead>
                                                                    <tr>
                                                                        <th className='has-text-weight-bold is-color-white is-size-5 has-text-weigth-bold is-background-black'>Fecha</th>
                                                                        <th className='has-text-weight-bold is-color-white is-size-5 has-text-weigth-bold is-background-black'>Monto entregado</th>
                                                                        <td className='has-text-weight-bold is-color-white is-size-5 has-text-weigth-bold is-background-black'>Saldo total: ${totalGeneral - saldoRestante}</td>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {deliverData.map((item, index) => (
                                                                        <React.Fragment key={index}>
                                                                            <tr>
                                                                                <td className='has-text-weight-bold is-color-black is-size-5 has-text-weigth-bold is-background-white'>{item.fecha_entrega}</td>
                                                                                <td className='has-text-weight-bold is-color-black is-size-5 has-text-weigth-bold is-background-white'>${item.monto_entrega}
                                                                                    {index === deliverData.length - 1 ? <span className='tag is-danger is-size-6 ml-5 m-1'>Ultima entrega</span> : ""}
                                                                                </td>
                                                                                <td className='is-background-white'>
                                                                                    <button className='button is-warning m-2' onClick={() => handleDeleteDeliver(item.id)}>Eliminar</button>
                                                                                </td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <p id='deliverRegister__p' className='box is-size-5'>No hay entregas</p>
                                                    )
                                                )}
                                            </div>
                                        ) : ""}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay nada que visualizar</p>
                    )}
                </div>
            </div>
    
            {showProductModal && <ProductModal closeModal={closeProductModal} />}
            {showEditProductModal && <EditProducts closeModal={closeEditProductModal} idProduct={productId} />}
            {showMakeDeliveryModal && <MakeDeliver closeModal={closeMakeDeliveryModal} dataClient={clientData} saldo_restante={totalGeneral - saldoRestante}  />}
            {showMuchUsers && <MuchUsers closeModal={closeShowMuchUsersModal} />}
            {showHistory && <ClientHistory closeModal={closeHistoryModal} />}
            {showClientData && <ClientDataModal openModal={showClientData} closeModal={toggleClientDataModal} clientData={clientData}/>}
        </div>
    );
}       

export default ClientInterface;
