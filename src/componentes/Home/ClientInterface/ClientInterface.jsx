import React, { useEffect, useState } from 'react';
import "./ClientInterface.css";
import { useAppContext } from '../../context';
import EditDataClient from '../Modals/EditDataClient';
import ProductModal from '../Modals/ProductModal';
import EditProducts from './Modals/ActualizarProductos/EditProducts';
import MakeDeliver from './Modals/HacerEntrega/MakeDelivery';
import ViewDeliverys from '../Modals/ViewDeliverys';
//Ant Design MODULES
import { Button, message, Popconfirm, Spin, Flex } from 'antd';
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

    const handleEditModal = () => setShowEditDataClientModal(true);
    const closeEditModal = () => setShowEditDataClientModal(false);
    const handleProductModal = () => setShowProductModal(true);
    const closeProductModal = () => setShowProductModal(false);
    const closeMakeDeliveryModal = () => setShowMakeDeliveryModal(false)
    const closeEditProductModal = () => setShowEditProductModal(false)
    const closeShowDeliveryRegister = () => setShowDeliveryRegister(false)

    const closeClientDebts = () => {
        setShowSectionDebt(false);
        setCountClick(0);

    };

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
        console.log("Ultima entrega: ", last)
        console.log("saldoRestante: ", saldoRestante)

    }, [clientData])

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

    useEffect(() => {
        console.log("Mostrando: ", DebtData);
    }, [DebtData]);

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
        <div className='clientInterface-wrapper'>
            {clientData && clientData.length > 0 ? (
                clientData.map((item, index) => (
                    <div key={index} className='clientInterface__map'>
                        <p>Nombre: {item.nombre_completo || "No hay datos"}</p>
                        <p>Apellido: {item.apellido || "No hay datos"}</p>
                        <p>DNI: {item.dni || "No hay datos"}</p>
                        <p>Teléfono: {item.telefono || "No hay datos"}</p>
                        <p>Dirección: {item.direccion || "No hay datos"}</p>

                        <div className='btns-div'>
                            <button className='clientInterface__map-btn-add' onClick={handleProductModal}>Añadir un producto</button>
                            <button className='clientInterface__map-btn-editData' onClick={handleEditModal}>Editar Datos</button>
                            <button className='clientInterface__map-btn-showData' onClick={openClientDebts}>Revisar Fichero</button>


                        </div>
                    </div>
                ))
            ) : (
                "No hay nada que visualizar"
            )}
            {showEditDataClientModal && <EditDataClient closeModal={closeEditModal} />}
            {showProductModal && <ProductModal closeModal={closeProductModal} />}
            {showEditProductModal && <EditProducts closeModal={closeEditProductModal} dataProduct={productData} />}

            {showMakeDeliveryModal && <MakeDeliver closeModal={closeMakeDeliveryModal} dataClient={clientData} saldo_restante={totalGeneral - saldoRestante} />}

            {showDeliveryRegister && <ViewDeliverys closeModal={closeShowDeliveryRegister} total_entregas={saldoRestante} />}

            {showSectionDebt && !fetchingData && <button className='clientInterface__map-btn-showData' onClick={closeClientDebts}>Cerrar</button>}
            {fetchingData && <Loader />}
            {showSectionDebt && !fetchingData && DebtData.length > 0 ? (
                <section className='debt__wrapper'>
                    <p className='debt_wrapper__saldo'>
                        <h1 className='debt_wrapper__h1'>Estado del fichero</h1>
                        {showSectionDebt ?
                                (totalGeneral > 0 ? <p>Saldo total: ${totalGeneral}</p> : <p>Saldo total: 0</p>)
                                : ""}
                        {showSectionDebt ?
                            (deliverData.length > 0 ? <p>Saldo restante: ${totalGeneral - saldoRestante}</p> : "")
                            : ""}
                        

                    </p>
                    <div className='debt__btns-container'>

                        {showSectionDebt && !fetchingData && <button className='clientInterface__map-btn-makeDeliver' onClick={openMakeDeliveryModal}>Hacer entrega</button>}
                        {showSectionDebt && !fetchingData && <button className='clientInterface__map-btn-showDelivers' onClick={openDeliverRegisterModal} >Ver registro de entregas</button>}
                    </div>

                    {DebtData.map((item, index) => (
                        <div key={index} className='debt__key'>

                            <p>{item.quantity} {item.nameProduct}</p>
                            {item.change === "usd" && <p>${item.price} {(item.change).toUpperCase()} c/u</p>}
                            {item.change === "usd" && <p>Conversión: ${totalUsdInPesos} c/u</p>}
                            {item.change === "ars" && <p>${item.price} {(item.change).toUpperCase()} c/u</p>}
                            {
                                item.quantity > 1 ? (
                                    item.change === "usd" ? (
                                        <p>Total: ${(item.price * item.quantity) * 1300}</p>
                                    ) : (
                                        item.change === "ars" && <p>Total: ${(item.price * item.quantity)}</p>
                                    )
                                ) : (
                                    ""
                                )
                            }

                            <Popconfirm
                                title="¿Estás seguro de eliminar este ítem?"
                                onConfirm={() => confirmDelete(item.debtIid)}
                                onCancel={cancelDelete}
                                okText="Sí"
                                cancelText="No"
                            >
                                <Button className='debt__key-btnDelete'>
                                    {isDeleting ? (
                                        <Flex align="center" gap="middle">
                                            <Spin />
                                        </Flex>
                                    ) : (
                                        showSpinner ? <Spin /> : "Eliminar"
                                    )}
                                </Button>
                            </Popconfirm>

                            <button className='debt__key-btnEdit' onClick={() => openEditProductModal(index)}>Cambiar</button>
                        </div>
                    ))}


                </section>
            ) : (
                ""
            )}
            {showSectionDebt && !fetchingData && DebtData.length === 0 ? <section className='debt__wrapper'><strong>No hay deudas en este fichero</strong></section> : ""}
        </div>
    );
};

export default ClientInterface;
