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
    const { clientData, showDebtUser, fetchingData, DebtData, deleteProduct, isDeleting, fetchRegisterDeliverys, deliverData, cancelDebt } = useAppContext();
    const [showEditDataClientModal, setShowEditDataClientModal] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showSectionDebt, setShowSectionDebt] = useState(false);
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

    const closeClientDebts = () => {
        setShowSectionDebt(false);
        setCountClick(0);
    };

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

    const openMakeDeliveryModal = () => {
        setShowMakeDeliveryModal(true)
    }

    const openDeliverRegisterModal = () => {
        setShowDeliveryRegister(true)
        fetchRegisterDeliverys()
    }

    const [countClick, setCountClick] = useState(0);
    const openClientDebts = () => {
        setShowSectionDebt(true);
        setCountClick(countClick + 1);
        showDebtUser();
        fetchRegisterDeliverys()

        if (countClick === 1) {
            closeClientDebts();
            setCountClick(0);
            showDebtUser();
            fetchRegisterDeliverys()
        }
    };

    const confirmDelete = async (debtId) => {
        await deleteProduct(debtId);
        showDebtUser();
    };

    const confirmCancellDebt = async () => {
        await cancelDebt()
    }

    const cancelDelete = () => {
        message.success('Operación cancelada');
    };

    const total = () => {
        let totalPesos = 0;
        let totalUsdInPesos = 0

        DebtData && DebtData.forEach(element => {
            const price = parseFloat(element.price)
            const quantity = parseInt(element.quantity)

            if (element.change === "ars") {
                totalPesos += price * quantity
            } else if (element.change === "usd") {
                totalUsdInPesos += price * 1450
            }
        });
        return {
            totalGeneral: totalPesos + totalUsdInPesos
        }
    }

    const { totalGeneral } = total();
    useEffect(() => {
        console.log(DebtData)
    }, [DebtData])
    const calcularMonto = (price, quantity, moneda) => {
        console.log(moneda)
        if (moneda === "ars") {
            return `$${price * quantity} ARS`;
        } else if (moneda === "usd") {
            return `x${price}`;
        }
        return 0;
    };

    return (
        <div className='container'>
            <div className='columns is-flex-direction-column'>
                {clientData && clientData.length > 0 ? (
                    clientData.map((item, index) => (
                        <div key={index} className='column custom__column-clientInterface'>
                            <div className="field">
                                <div className="box">
                                    <p className='title has-text-weight-bold'>Cliente: {item.nombre_completo || "No hay datos"}</p>

                                    <div className="table-container">
                                        <div className="table is-fullwidth is-bordered is-hoverable">
                                            <thead>
                                                <tr>
                                                    <th>Acciones cliente</th>
                                                    <th>Acciones fichero</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <button className='button m-1 is-background-white is-color-black m-2' onClick={handleEditModal}>Editar Datos del Cliente</button>
                                                        <button className={`button ${showSectionDebt ? 'is-danger' : 'is-link'} m-2`} onClick={openClientDebts}>{showSectionDebt ? "Cerrar fichero" : "Revisar fichero"}</button>
                                                    </td>
                                                    <td>
                                                        <button className='button is-info m-2' onClick={openMakeDeliveryModal}>Hacer entrega</button>
                                                        {totalGeneral - saldoRestante === 0 && DebtData.length > 0 ? "" : <button className='button m-1 is-background-white is-color-black m-2' onClick={handleProductModal}>Añadir un producto</button>}
                                                        <button className='button is-background-white is-color-black m-2' onClick={handleShowModalHistory}>Revisar Historial</button>
                                                        <button className='button m-1 is-background-white is-color-black m-2' onClick={openDeliverRegisterModal}>Ver registro de entregas</button>
                                                        {showSectionDebt && DebtData.length > 0 ?
                                                            <>
                                                                {totalGeneral - saldoRestante === 0 ?
                                                                    <>
                                                                        <Popconfirm
                                                                            title="¿Estás seguro que este fichero está listo para cancelar?"
                                                                            onConfirm={() => confirmCancellDebt()}
                                                                            onCancel={() => cancelDelete()}
                                                                            okText="Sí, cancelar fichero"
                                                                            cancelText="No"
                                                                        >
                                                                            <Button className='button is-danger m-2'>
                                                                                Cancelar fichero
                                                                            </Button>
                                                                        </Popconfirm>
                                                                        <span className='tag is-danger custom__tag-container is-size-5 m-2'>Presione "Cancelar fichero" para seguir añadiendo productos</span>
                                                                    </>
                                                                    :
                                                                    <>

                                                                    </>
                                                                }
                                                            </>
                                                            : ""}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {showSectionDebt && (
                                <div className="table-container">
                                    <table className="table is-fullwidth is-bordered is-hoverable">
                                        <thead>
                                            <tr>
                                                <th className='has-text-weight-bold is-size-5'>Fecha de compra: {DebtData.map(item => item.buyDate)[0]}</th>
                                                <th className='has-text-weight-bold is-size-5'>Saldo total: ${totalGeneral}</th>
                                                <th className='has-text-weight-bold is-size-5'>Producto/detalle</th>
                                                <th className='has-text-weight-bold is-size-5'>Monto/codigo</th>
                                                <th className='has-text-weight-bold is-size-5'>Última entrega</th>
                                                <th></th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {DebtData && DebtData.map((debtItem, debtIndex) => (
                                                <tr key={debtIndex}>
                                                    <td></td>
                                                    <td></td>
                                                    <td className='is-size-5'>{debtItem.nameProduct}</td>
                                                    <td className='is-size-5'>
                                                        {calcularMonto(debtItem.price, debtItem.quantity, debtItem.change)}
                                                    </td>
                                                    <td className=' is-size-5'>{debtItem.delivery || "No hay ninguna entrega"} </td>
                                                    <td>
                                                        <div className="control">
                                                            <div className="button m-2">Intercambiar</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No hay nada que visualizar</p>
                )}

                {showSectionDebt && !fetchingData && DebtData.length === 0 && (
                    <section className='title is-size-5 m-5 is-color-white'>
                        <strong>No hay deudas en este fichero</strong>
                    </section>
                )}

                {showEditDataClientModal && <EditDataClient closeModal={closeEditModal} />}
                {showProductModal && <ProductModal closeModal={closeProductModal} />}
                {showEditProductModal && <EditProducts closeModal={closeEditProductModal} dataProduct={productData} />}
                {showMakeDeliveryModal && <MakeDeliver closeModal={closeMakeDeliveryModal} dataClient={clientData} saldo_restante={totalGeneral - saldoRestante} />}
                {showDeliveryRegister && <ViewDeliverys closeModal={closeShowDeliveryRegister} total_entregas={saldoRestante} />}
                {showMuchUsers && <MuchUsers closeModal={closeShowMuchUsersModal} />}
                {showHistory && <ClientHistory closeModal={closeHistoryModal} />}
            </div>
        </div>
    );
};

export default ClientInterface;
