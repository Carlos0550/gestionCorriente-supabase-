import React, { useEffect, useState } from 'react';
import "./ClientInterface.css";
import { useAppContext } from '../../context';
import EditDataClient from '../Modals/EditDataClient';
import ProductModal from '../Modals/ProductModal';
import EditProducts from './Modals/ActualizarProductos/EditProducts';
import MakeDeliver from './Modals/HacerEntrega/MakeDelivery';
import ViewDeliverys from '../Modals/ViewDeliverys';
import MuchUsers from '../Modals/ToMuchUsers/MuchUsers';
import { Button, message, Popconfirm, Spin } from 'antd';
import ClientHistory from '../Modals/clientHistory/ClientHistory';
import { LinearProgress } from '@mui/material';

function ClientInterface() {
    const { 
        clientData, 
        showDebtUser, 
        userUUID, 
        fetchingData, 
        DebtData, 
        deleteProduct, 
        isDeleting, 
        fetchRegisterDeliverys, 
        deliverData, 
        cancelDebt, 
        fetchingDeliverys,
        setIsUpdatingDeliver, 
        isUpdatingDeliver
     } = useAppContext();
    const [showEditDataClientModal, setShowEditDataClientModal] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showSectionDebt, setShowSectionDebt] = useState(true);
    const [showEditProductModal, setShowEditProductModal] = useState(false)
    const [showMakeDeliveryModal, setShowMakeDeliveryModal] = useState(false)
    const [showDeliveryRegister, setShowDeliveryRegister] = useState(false)
    const [showMuchUsers, setShowMuchUsers] = useState(false)
    const [showHistory, setShowHistory] = useState(false)

    const handleEditModal = () => setShowEditDataClientModal(true);
    const closeEditModal = () => setShowEditDataClientModal(false);
    const handleProductModal = () => setShowProductModal(true);
    const closeProductModal = () => setShowProductModal(false);
    const closeMakeDeliveryModal = () => setShowMakeDeliveryModal(false)
    const closeEditProductModal = () => setShowEditProductModal(false)
    const closeShowDeliveryRegister = () => setShowDeliveryRegister(false)
    const closeShowMuchUsersModal = () => setShowMuchUsers(false)
    const closeHistoryModal = () => setShowHistory(false)

    const handleShowModalHistory = () => {
        setShowHistory(true)
    }

    // const closeClientDebts = () => {
    //     setShowSectionDebt(false);
    //     setCountClick(0);
    // };

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

    const { last, saldoRestante } = processingDeliverData();

    useEffect(() => {
        if (isDeleting) {
            setShowSpinner(true);
        } else {
            setShowSpinner(false);
        }
    }, [isDeleting]);
    const [productData, setProductData] = useState([])
    const openEditProductModal = (index) => {
        setProductData(DebtData[index])
        setShowEditProductModal(true)
    }
    const [edit_entrega_data, setEdit_entrega_data] = useState({
        idDebt: "",
        tope_maximo: "",
        fecha_entrega: "",
        uuid_cliente: ""
    })

    const prepareEditDeliverData = (index) => {
        const deliverHookData = deliverData[index]
        setIsUpdatingDeliver(true)
        setEdit_entrega_data({
            idDebt: deliverHookData.id,
            tope_maximo: monto_total - saldoRestante,
            fecha_entrega: deliverHookData.fecha_entrega,
            uuid_cliente: deliverHookData.uuid_cliente
        })

        if (edit_entrega_data) {
            openMakeDeliveryModal()
        }

    }

    const openMakeDeliveryModal = () => {
        setShowMakeDeliveryModal(true)
    }

    // const openDeliverRegisterModal = () => {
    //     setShowDeliveryRegister(true)
    //     fetchRegisterDeliverys()
    // }

    // const [countClick, setCountClick] = useState(0);
    // const openClientDebts = () => {
    //     setShowSectionDebt(true);
    //     setCountClick(countClick + 1);
    //     showDebtUser();
    //     fetchRegisterDeliverys()

    //     if (countClick === 1) {
    //         closeClientDebts();
    //         setCountClick(0);
    //         showDebtUser();
    //         fetchRegisterDeliverys()
    //     }
    // };

    // const confirmDelete = async (debtId) => {
    //     await deleteProduct(debtId);
    //     showDebtUser();
    // };

    const confirmCancellDebt = async () => {
        await cancelDebt()
    }

    // const cancelDelete = () => {
    //     message.success('Operación cancelada');
    // };

    const total = () => {
        let totalPesos = 0;
        let totalUsdInPesos = 0
        DebtData && DebtData.forEach(element => {
            const price = parseFloat(element.price)
            const quantity = parseInt(element.quantity)

            if (element.change === "ars") {
                totalPesos += price * quantity
            } else if (element.change === "usd") {
                totalUsdInPesos += (price * quantity) * 1500
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
        if (moneda === "ars") {
            return `$${price * quantity}`;
        } else if (moneda === "usd") {

            return `$${(price * quantity) * 1500}`;
        }

        return 0;
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

                totalUsd += (debt.price * debt.quantity) * 1500
            }

            return monto_total = totalPesos + totalUsd;
        })
    })


    //para mañana implementar lo de eliminar entregas

    return (
        <div className='container'>
            <div className='columns '>
                <div className="column">
                    {clientData && clientData.length > 0 ? (
                        clientData.map((item, index) => (
                            <div key={index} className='column custom__column-clientInterface is-background-white is-color-white'>
                                <div className="field ">
                                    <div className="box is-background-white">

                                        <div className="table-container ">
                                            <div className="table is-fullwidth is-bordered is-hoverable custom-table">
                                                <thead>
                                                    <tr>
                                                        <th className='is-background-white is-color-black '>
                                                            <p className='title has-text-weight-bold is-color-black'>Cliente: {item.nombre_completo || "No hay datos"} {item.apodo ? `(${item.apodo})` : ""}</p>


                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className='is-background-white is-color-black'>
                                                            {DebtData && DebtData.length > 0 ? <button className='button is-link m-2 is-size-5' onClick={openMakeDeliveryModal}>Hacer entrega</button> : ""}
                                                            <button className='button m-1 is-background-black is-color-white m-2 is-size-5' onClick={handleEditModal}>Editar datos</button>
                                                            {totalGeneral - saldoRestante === 0 && DebtData.length > 0 ? "" : <button className='button m-1 is-background-black is-color-white m-2 is-size-5' onClick={handleProductModal}>Añadir un producto</button>}
                                                            <button className='button is-background-black is-color-white m-2 is-size-5' onClick={handleShowModalHistory}>Revisar historial</button>
                                                            {/* {DebtData && DebtData.length > 0 ? <button className='button m-1 is-background-black is-color-white m-2 is-size-5' onClick={openDeliverRegisterModal}>Ver registro de entregas</button> : ""} */}

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {DebtData.length > 0 ?
                                    <div className='custom-table-container__debts'>
                                        {showSectionDebt && (
                                            <>
                                                {Object.keys(groupedHistory)
                                                    .reverse() // Si deseas mostrar las tablas en orden descendente por fecha
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
                                                                    <tbody>
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
                                                                                        <button className="button is-warning m-2" onClick={() => openEditProductModal(debtIndex)}>Intercambiar</button>
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
                        ))
                    ) : (
                        <p>No hay nada que visualizar</p>
                    )}
                </div>
                {deliverData && deliverData.length > 0 ?
                    <React.Fragment>
                        <div className="column custom-column-deliverys">
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
                                                {deliverData
                                                    // .slice() // copia de array para evitar mutaciones
                                                    // .reverse()
                                                    .map((item, index) => (
                                                        <React.Fragment key={index}>
                                                            <tr>
                                                                <td className='has-text-weight-bold is-color-black is-size-5 has-text-weigth-bold is-background-white'>{item.fecha_entrega}</td>
                                                                <td className='has-text-weight-bold is-color-black is-size-5 has-text-weigth-bold is-background-white'>${item.monto_entrega}
                                                                    {index === deliverData.length - 1 ? <span className='tag is-danger is-size-6 ml-5 m-1'>Ultima entrega</span> : ""}
                                                                </td>
                                                                <td className='is-background-white'><Button className='button ' onClick={() => prepareEditDeliverData(index)}>Editar</Button></td>
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
                    </React.Fragment>
                    : ""}

                {showSectionDebt && !fetchingData && DebtData.length === 0 && (
                    <section className='title is-size-5 m-5 is-color-white'>
                        <strong>No hay deudas en este fichero</strong>
                    </section>
                )}

                {showEditDataClientModal && <EditDataClient closeModal={closeEditModal} />}
                {showProductModal && <ProductModal closeModal={closeProductModal} />}
                {showEditProductModal && <EditProducts closeModal={closeEditProductModal} dataProduct={productData} />}
                {showMakeDeliveryModal && <MakeDeliver closeModal={closeMakeDeliveryModal} dataClient={clientData} saldo_restante={totalGeneral - saldoRestante} edit_entrega_data={edit_entrega_data} />}
                {showDeliveryRegister && <ViewDeliverys closeModal={closeShowDeliveryRegister} saldo_restante={totalGeneral - saldoRestante} />}
                {showMuchUsers && <MuchUsers closeModal={closeShowMuchUsersModal} />}
                {showHistory && <ClientHistory closeModal={closeHistoryModal} />}

            </div>

        </div>
    );
};

export default ClientInterface;
