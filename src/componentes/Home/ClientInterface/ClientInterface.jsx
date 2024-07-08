import React, { useEffect, useState } from 'react';
import "./ClientInterface.css";
import { useAppContext } from '../../context';
import EditDataClient from '../Modals/EditDataClient';
import ProductModal from '../Modals/ProductModal';
import EditProducts from './Modals/ActualizarProductos/EditProducts';
import MakeDeliver from './Modals/HacerEntrega/MakeDelivery';
import ViewDeliverys from '../Modals/ViewDeliverys';
import MuchUsers from '../Modals/ToMuchUsers/MuchUsers';
//Ant Design MODULES
import { Button, message, Popconfirm, Spin, Flex, Divider } from 'antd';
import Loader from "../../Loaders/Loader";

function ClientInterface() {
    const { clientData, showDebtUser, fetchingData, DebtData, deleteProduct, isDeleting, fetchRegisterDeliverys, deliverData } = useAppContext();
    const [showEditDataClientModal, setShowEditDataClientModal] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showSectionDebt, setShowSectionDebt] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false)
    const [showMakeDeliveryModal, setShowMakeDeliveryModal] = useState(false)
    const [showDeliveryRegister, setShowDeliveryRegister] = useState(false)
    const [showMuchUsers, setShowMuchUsers] = useState(false)

    const handleEditModal = () => setShowEditDataClientModal(true);
    const closeEditModal = () => setShowEditDataClientModal(false);
    const handleProductModal = () => setShowProductModal(true);
    const closeProductModal = () => setShowProductModal(false);
    const closeMakeDeliveryModal = () => setShowMakeDeliveryModal(false)
    const closeEditProductModal = () => setShowEditProductModal(false)
    const closeShowDeliveryRegister = () => setShowDeliveryRegister(false)
    const closeShowMuchUsersModal = () => setShowMuchUsers(false)

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

    // useEffect(() => {
    //     console.log("Ultima entrega: ", last)
    //     console.log("saldoRestante: ", saldoRestante)

    // }, [clientData])

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

    // useEffect(() => {
    //     console.log("Mostrando: ", DebtData);
    // }, [DebtData]);

    //Ant Design POP CONFIRM
    const confirmDelete = async (debtId) => {
        await deleteProduct(debtId);
        showDebtUser();
    };

    const cancelDelete = () => {
        console.log('Cancelando eliminación del ítem');
        message.success('Cancelado');
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
                totalUsdInPesos += price * 1300
            }
        });
        return {
            totalPesos,
            totalUsdInPesos,
            totalGeneral: totalPesos + totalUsdInPesos
        }
    }
    const { totalPesos, totalUsdInPesos, totalGeneral } = total();

    return (
        <div className='container '>
            <div className='columns is-flex-direction-column'>
                {clientData && clientData.length > 0 ? (
                    clientData.map((item, index) => (
                        <div key={index} className='column custom__column-clientInterface'>
                            <div className="field">
                                <div className="box"><p className='subtitle has-text-weight-bold'>Nombre: {item.nombre_completo || "No hay datos"}</p></div>
                                <div className="box"><p className='subtitle has-text-weight-bold'>Apellido: {item.apellido || "No hay datos"}</p></div>
                                <div className="box"><p className='subtitle has-text-weight-bold'>DNI: {item.dni || "No hay datos"}</p></div>
                                <div className="box"><p className='subtitle has-text-weight-bold'>Teléfono: {item.telefono || "No hay datos"}</p></div>
                                <div className="box"><p className='subtitle has-text-weight-bold'>Dirección: {item.direccion || "No hay datos"}</p></div>
                            </div>

                            <div className='control p-2'>
                                <button className='button is-info m-1' onClick={openClientDebts}>Revisar Fichero</button>
                                <button className='button m-1' onClick={handleProductModal}>Añadir un producto</button>
                                <button className='button m-1' onClick={handleEditModal}>Editar Datos del Cliente</button>
                            </div>
                        </div>
                    ))
                ) : (
                    "No hay nada que visualizar"
                )}

                <div className="control">
                    {showSectionDebt && !fetchingData && <button className='button is-danger' onClick={closeClientDebts}>Cerrar</button>}
                </div>
                {fetchingData && <Loader />}
                {showSectionDebt && !fetchingData && DebtData.length > 0 ? (
                    <section className='container '>
                        <div className='column'>
                            <h1 className='title is-color black'>Estado del fichero</h1>
                            <div className="box">
                            {showSectionDebt ?
                                (totalGeneral > 0 ? <p className='subtitle is-color-white has-text-weight-bold pt-1'>Saldo total: ${totalGeneral}</p> : <p>Saldo total: 0</p>)
                                : ""}
                                <hr className='hr'/>
                            {showSectionDebt ?
                                (deliverData.length > 0 ? <p className='subtitle is-color-white has-text-weight-bold pt-1'>Saldo restante: ${totalGeneral - saldoRestante}</p> : "")
                                : ""}
                            </div>


                        </div>


                        {showSectionDebt && !fetchingData && <button className='button is-warning m-1' onClick={openMakeDeliveryModal}>Hacer entrega</button>}
                        {showSectionDebt && !fetchingData && <button className='button is-info m-1' onClick={openDeliverRegisterModal} >Ver registro de entregas</button>}
                        {DebtData.map((item, index) => (

                            <div className="columns">
                                <div className="column">
                                    <div key={index} className='container'>

                                        <div className="field">
                                            <div className="custom__container-productoClient">
                                                <p className='subtitle is-color-white has-text-weight-bold box'>{item.quantity} {item.nameProduct}</p>
                                                <p className='subtitle is-color-white has-text-weight-bold box'>Fecha de compra: {item.buyDate}</p>
                                                {item.change === "usd" && <p className='subtitle is-color-white has-text-weight-bold box'>${item.price} {(item.change).toUpperCase()} c/u</p>}
                                                {item.change === "usd" && <p className='subtitle is-color-white has-text-weight-bold box'>Conversión: ${totalUsdInPesos} c/u</p>}
                                                {item.change === "ars" && <p className='subtitle is-color-white has-text-weight-bold box'>${item.price} {(item.change).toUpperCase()} c/u</p>}
                                                {
                                                    item.quantity > 1 ? (
                                                        item.change === "usd" ? (
                                                            <p className='subtitle is-color-white has-text-weight-bold box'>Total: ${(item.price * item.quantity) * 1300}</p>
                                                        ) : (
                                                            item.change === "ars" && <p className='subtitle is-color-white has-text-weight-bold box'>Total: ${(item.price * item.quantity)}</p>
                                                        )
                                                    ) : (
                                                        ""
                                                    )
                                                }
                                                <div className="control p-1 custom__control-debts">
                                        <Popconfirm
                                            title="¿Estás seguro de eliminar este ítem?"
                                            onConfirm={() => confirmDelete(item.debtIid)}
                                            onCancel={cancelDelete}
                                            okText="Eliminar"
                                            cancelText="Cancelar"
                                        >
                                            <Button >
                                                {isDeleting ? (
                                                    <Flex align="center" gap="middle">
                                                        <Spin />
                                                    </Flex>
                                                ) : (
                                                    showSpinner ? <Spin /> : "Eliminar"
                                                )}
                                            </Button>
                                        </Popconfirm>
                                        <Button onClick={() => openEditProductModal(index)}>
                                            Editar Producto
                                        </Button>
                                        </div>
                                            </div>
                                        </div>

                                        
                                    </div>
                                </div>
                            </div>
                        ))}





                    </section>
                ) : (
                    ""
                )}
                {showSectionDebt && !fetchingData && DebtData.length === 0 ? <section className='title is-size-5 m-5 is-color-white'><strong>No hay deudas en este fichero</strong></section> : ""}

                {/*Modales*/}
                {showEditDataClientModal && <EditDataClient closeModal={closeEditModal} />}
                {showProductModal && <ProductModal closeModal={closeProductModal} />}
                {showEditProductModal && <EditProducts closeModal={closeEditProductModal} dataProduct={productData} />}
                {showMakeDeliveryModal && <MakeDeliver closeModal={closeMakeDeliveryModal} dataClient={clientData} saldo_restante={totalGeneral - saldoRestante} />}
                {showDeliveryRegister && <ViewDeliverys closeModal={closeShowDeliveryRegister} total_entregas={saldoRestante} />}
                {showMuchUsers && <MuchUsers closeModal={closeShowMuchUsersModal} />}
            </div>
        </div>
    );
};

export default ClientInterface;
