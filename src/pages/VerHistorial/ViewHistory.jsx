import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexto";
import {
  Table,
  ConfigProvider,
  Layout,
  Typography,
  Card,
  Button,
  Skeleton,
} from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { formatNames } from "../../components/Revisar Fichero/Utils/ProcessDebts";
const { Title } = Typography;
const { Content } = Layout;

function ViewHistory() {
  const { fetchHistory, clientHistory } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const clientID = searchParams.get("clientID");
  const alreadyFetch = useRef(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (clientID && !alreadyFetch.current) {
      (async () => {
        setFetching(true);
        await fetchHistory(clientID);
        setFetching(false);
        alreadyFetch.current = true;
      })();
    }
  }, [clientID]);

  const debtColumns = [
    {
      title: "Producto",
      dataIndex: "nameProduct",
      render: (_,record) => (
        <strong>{formatNames(record.nameProduct)}</strong>
      ),
      key: "nameProduct",
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      render: (_,record) => (
        <strong>{parseInt(record.quantity)}</strong>
      ),
      key: "quantity",
    },
    {
      title: "Precio",
      dataIndex: "price",
      render: (_, record) => (
        <strong>{parseFloat(record.price).toLocaleString("es-ES",{style: "currency", currency: "ARS"})}</strong>
      ),
      key: "price",
    },
    {
      title: "Fecha de Compra",
      dataIndex: "buyDate",
      key: "buyDate",
    },
  ];

  const deliverColumns = [
    {
      title: "Monto Entrega",
      dataIndex: "monto",
      render: (_, record) => (
        <strong>{parseFloat(record.monto).toLocaleString("es-ES",{style: "currency", currency: "ARS"})}</strong>
      ),
      key: "monto",
    },
    {
      title: "Fecha de Entrega",
      dataIndex: "fecha_entrega",
      key: "fecha_entrega",
    },
  ];

  const paginationConfig = {
    pageSize: 4,
  };

  const [clientName, setClientName] = useState("");
  const [flattedDebts, setFlattedDebts] = useState([]);
  const [flattedDelivers, setFlattedDelivers] = useState([]);

  useEffect(() => {
    const processHistory = () => {
      if (clientHistory && clientHistory.length > 0) {
        setClientName(
          clientHistory[0].nombre_completo || "No hay Historial de deudas"
        );

        let allDebts = [];
        let allDelivers = [];

        clientHistory.forEach((element) => {
          const debts = JSON.parse(element.detalle_deudas);
          const deliveries = JSON.parse(element.detalle_entregas);
          const conversion = (price, change, quantity)=>{
            if (change === "usd") {
              return (price * quantity) * 1500
            }else{
              return price * quantity
            }
          }
          const flattedDebts = debts.map((debt) => ({
            buyDate: debt.buyDate,
            nameProduct: debt.nameProduct,
            price: conversion(debt.price,debt.change, debt.quantity),
            quantity: debt.quantity,
          }));

          const flattedDelivers = deliveries.map((deliver) => ({
            monto: deliver.monto_entrega,
            fecha_entrega: deliver.fecha_entrega,
          }));

          allDebts = [...allDebts, ...flattedDebts];
          allDelivers = [...allDelivers, ...flattedDelivers];
        });

        setFlattedDebts(allDebts);
        setFlattedDelivers(allDelivers);
      } else {
        setClientName("Sin historial de deudas");
        setFlattedDebts([]);
        setFlattedDelivers([]);
      }
    };

    processHistory();
  }, [clientHistory]);

  return (
    <ConfigProvider>
      <Layout>
        <Content style={{ width: "100%" }}>
          <Card
            title={
              <Title level={2}>
                {fetching ? <Skeleton active /> : formatNames(clientName)}{" "}
              </Title>
            }
            bordered={false}
            style={{ width: "100%" }}
          >
            <Button onClick={() => navigate("/")}>
              <RollbackOutlined />
              Volver Atras
            </Button>
          </Card>
          <Title level={4}>Historial de Deudas y entregas</Title>
         <div className="tables__user-wrapper">
          <Table
            columns={debtColumns}
            dataSource={flattedDebts}
            rowKey="id"
            className="table__debts"
            pagination={paginationConfig}
          />
          <Table
            columns={deliverColumns}
            className="table__delivers"
            dataSource={flattedDelivers}
            rowKey="id"
            pagination={paginationConfig}
          />
         </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default ViewHistory;
