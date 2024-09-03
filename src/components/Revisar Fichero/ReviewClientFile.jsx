import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ConfigProvider, Layout, Menu, Table, Typography, Button, Flex } from "antd";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { useAppContext } from "../../contexto";
import { formatNames } from "./Utils/ProcessDebts";
import { summationProducts } from "./Utils/ProcessDebts";
import { groupByDate } from "./Utils/ProcessDebts";
import "./css/ReviewClientFile.css";
const { Header, Content } = Layout;
const { Title } = Typography;

function ReviewClientFile() {
  const { fetchDebtsClient, clientDebts, clientDelivers } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const clientID = searchParams.get("clientID");

  const alreadyFetch = useRef(false);

  useEffect(() => {
    if (clientID && !alreadyFetch.current) {
      (async () => {
        await fetchDebtsClient(clientID);
        alreadyFetch.current = true;
      })();
    }
  }, [clientID, fetchDebtsClient]);

  let dataDebts = clientDebts || [];
  let dataDelivers = clientDelivers || []
  if (clientDebts && clientDebts.length > 0) {
    dataDebts = groupByDate(clientDebts);
  }

  if (clientDelivers && clientDelivers.length > 0) {
    dataDelivers = clientDelivers
  }
  const getColumnsDelivers = () =>[
    {
        title: "Fecha de entrega",
        key: "fecha_entrega",
        render: (_,record) => (
            <strong>{record.fecha_entrega}</strong>
        )
    },
    {
        title: "Monto entregado",
        key: "monto_entregado",
        render: (_,record) => (
            <strong>{Number(record.monto_entrega).toLocaleString("es-ES",{style: "currency", currency: "ARS"})}</strong>
        )
    },
    {
        title: "",
        key: "actions",
        render: (_,record) => (
            <>
                <Flex  gap="small">
                    <Button type="primary" danger><DeleteOutlined/></Button>
                </Flex>
            </>
        )
    },
  ]
  const getColumnasDeudas = () => [
    {
      title: "Fecha de compra",
      render: (_, record) => <strong>{record.buyDate}</strong> || "N/A",
      key: "buyDate",
    },
    {
      title: "Detalle",
      key: "detalle",
      render: (_, record) => (
        <>
          <p>
            {record.products.map((product) => (
              <div key={product.idProduct}>
                <strong>
                  {product.quantity}{" "}
                  {formatNames(product.nombre_producto.replaceAll("x", ""))}
                </strong>{" "}
                <span style={{ color: "red" }}>
                  {product.change === "ars"
                    ? product.price.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "ARS",
                      })
                    : ` x ${product.price}`}
                </span>
              </div>
            ))}
          </p>
        </>
      ),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => (
        <strong>{summationProducts(record.products)}</strong>
      ),
    },
    {
        title: "",
        key: "actions",
        render: (_,record) => (
            <>
                <Flex vertical gap="small">
                    <Button type="primary"><EditOutlined /></Button>
                    <Button type="primary" danger><DeleteOutlined/></Button>
                </Flex>
            </>
        )
    },
  ];

  return (
    <ConfigProvider>
      <Layout>
        <Header style={{ width: "100%", backgroundColor: "white" }}>
          <Menu
            mode="horizontal"
            onClick={() => navigate("/")}
            style={{ width: "100%" }}
            items={[
              { key: "back", icon: <UserOutlined />, label: "Volver atrás" },
            ]}
          />
        </Header>
        <Content style={{ width: "100%" }}>
          <Title level={2}>
            {clientDebts[0]
              ? formatNames(clientDebts[0].nombre_cliente)
              : "No hay deudas que mostrar"}
          </Title>
          <div className="tables__user-wrapper">
            <Table
              columns={getColumnasDeudas()}
              dataSource={dataDebts}
              className="table__debts"
              scroll={{ x: 500 }}
            />
            <Table 
            className="table__delivers" 
            dataSource={dataDelivers} 
            columns={getColumnsDelivers()}
            scroll={{x:500}}
            />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default ReviewClientFile;
