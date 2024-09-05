import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ConfigProvider,
  Layout,
  Menu,
  Table,
  Typography,
  Button,
  Flex,
  Skeleton,
  Card,
  message,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useAppContext } from "../../contexto";
import { formatNames } from "./Utils/ProcessDebts";
import { summationProducts } from "./Utils/ProcessDebts";
import { groupByDate } from "./Utils/ProcessDebts";
import "./css/ReviewClientFile.css";
import ProductForm from "./CargarProductos/AddDebts";
import AddDeliver from "./AñadirEntregas/AddDeliver";
import { calculateSubtotal } from "./Utils/ProcessDebts";
import dayjs from "dayjs";
const { Content } = Layout;
const { Title } = Typography;

function ReviewClientFile() {
  const {
    cancelAllDebts,
    fetchDebtsClient,
    clientDebts,
    clientDelivers,
    clientData,
    deleteProduct,
    deleteDeliver
  } = useAppContext();

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
        await fetchDebtsClient(clientID);
        setFetching(false);
        alreadyFetch.current = true;
      })();
    }
  }, [clientID]);

  const [clientName, setClientName] = useState(null);

  useEffect(() => {
    if (clientData && clientData.length > 0) {
      const nombre = clientData[0].nombre_completo;
      setClientName(nombre);
    }
  }, [clientData]);

  const [deleting, setDeleting] = useState(false)
  const confirmDelete = async(id) =>{
    setDeleting(true)
    await deleteProduct(id,clientID)
    setDeleting(false)
    
  }

  const confirmDeleteDeliver = async(id) =>{
      console.log(id)
  
      setDeleting(true)
      await deleteDeliver(id,clientID)
      setDeleting(false)
      
    }
    

  let dataDebts = clientDebts || [];
  let dataDelivers = clientDelivers || [];
  if (clientDebts && clientDebts.length > 0) {
    dataDebts = groupByDate(clientDebts);
  }

  if (clientDelivers && clientDelivers.length > 0) {
    dataDelivers = clientDelivers;
  }

  const getColumnsDelivers = () => [
    {
      title: "Fecha de entrega",
      key: "fecha_entrega",
      render: (_, record) => <strong>{record.fecha_entrega}</strong>,
    },
    {
      title: "Monto entregado",
      key: "monto_entregado",
      render: (_, record) => (
        <strong>
          {Number(record.monto_entrega).toLocaleString("es-ES", {
            style: "currency",
            currency: "ARS",
          })}
        </strong>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <>
          <Flex gap="small">
            <Popconfirm
            title="¿Seguro que quiere eliminar esta entrega?"
            description="Esto eliminara del fichero esta entrega, y es posible que el saldo total quede en negativo"
            onConfirm={()=>confirmDeleteDeliver(record.id)}
            okButtonProps={{
              loading: deleting
            }}
            >
              <Button type="primary" danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Flex>
        </>
      ),
    },
  ];
  const getColumnasDeudas = () => [
    {
      title: "Fecha de compra",
      render: (_, record) => <strong>{record.buyDate}</strong> || "N/A",
      key: "buyDate",
    },
    {
      title: "Vencimiento",
      key: "vencimiento",
      render: (_, record) => (
        <strong>{dayjs(record.vencimiento).format("DD-MM-YYYY")}</strong>
      ),
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
                <Flex  gap="small">
            {/* <Button type="primary">
              <EditOutlined />
            </Button> */}
            <Popconfirm
            title="¿Eliminar este producto?"
            description="Esto eliminará definitivamente este producto del fichero"
            onConfirm={()=> confirmDelete(product.idProduct)}
            okButtonProps={{
              loading: deleting
            }}
            >
              <Button type="primary" danger disabled={dataDelivers && dataDelivers.length > 0}>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Flex>
              </div>
            ))}
          </p>
        </>
      ),
    },
    {
      title: "Estado",
      key: "estado",
      render: (_, record) =>
        record.estado === "activo" ? (
          <p style={{ color: "green" }}>Al día</p>
        ) : (
          <p style={{ color: "red" }}>Vencido</p>
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
      render: (_, record) => (
        <>
          
        </>
      ),
    },
  ];

  const paginationConfig = {
    pageSize: 6,
  };
  let [cancelDebts, setCancelDebts] = useState(false);
  useEffect(() => {
    if (
      dataDelivers &&
      dataDelivers.length > 0 &&
      dataDebts &&
      dataDebts.length > 0
    ) {
      if (calculateSubtotal(clientDebts, dataDelivers) === 0) {
        setCancelDebts(true);
      }
    }
  }, [dataDebts, dataDelivers, clientDebts, clientDelivers]);

  useEffect(() => {
    if (cancelDebts) {
      const values = [
        {
         entregas: JSON.stringify(clientDelivers),
         deudas: JSON.stringify(clientDebts),
         clientID: clientID,
         clientName: clientName,
        },
      ];
      cancelAllDebts(values);
    }
  }, [cancelDebts]);

  const handleRedirectClientHistory = (link) => {
    navigate(`/${link}`);
  };

  return (
    <ConfigProvider>
      <Layout>
        <Content style={{ width: "100%" }}>
          <Card
            title={
              <Title level={2}>
                {fetching ? <Skeleton active /> : formatNames(clientName)}{" "}
                <Button onClick={() => navigate("/")}>
                  <RollbackOutlined />
                  Volver Atras
                </Button>
              </Title>
            }
            bordered={false}
            style={{ width: "100%" }}
          >
            <strong>
              Saldo total:{" "}
              {calculateSubtotal(clientDebts, dataDelivers).toLocaleString(
                "es-ES",
                { style: "currency", currency: "ARS" }
              )}
            </strong>
            {" "}
            <Button danger onClick={()=>handleRedirectClientHistory(`ver-historial?clientID=${clientID}`)}>Ver historial de deudas</Button>
          </Card>
          <div className="forms__container">
            <div className="addProduct__component">
              <ProductForm clientID={clientID} clientName={clientName} />
            </div>
            <div className="addDeliver__component">
              <AddDeliver
                subtotal={calculateSubtotal(clientDebts, dataDelivers)}
                clientID={clientID}
                clientName={clientName}
              />
            </div>
          </div>

          <Card
            title={<Title level={3}>Deudas y entregas</Title>}
            bordered={false}
            style={{ width: "100%" }}
          >
            <strong>
              Saldo total:{" "}
              {calculateSubtotal(clientDebts, dataDelivers).toLocaleString(
                "es-ES",
                { style: "currency", currency: "ARS" }
              )}
            </strong>
          </Card>
          <div className="tables__user-wrapper">
            {fetching ? (
              <Skeleton active />
            ) : (
              <Table
                columns={getColumnasDeudas()}
                pagination={paginationConfig}
                dataSource={dataDebts}
                className="table__debts"
                scroll={{ x: 500 }}
              />
            )}
            {fetching ? (
              <Skeleton active />
            ) : (
              <Table
                className="table__delivers"
                dataSource={dataDelivers}
                columns={getColumnsDelivers()}
                scroll={{ x: 500 }}
              />
            )}
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default ReviewClientFile;
