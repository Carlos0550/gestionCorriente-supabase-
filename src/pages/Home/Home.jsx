import React, { useEffect, useRef, useState } from "react";
import {
  ConfigProvider,
  Layout,
  Menu,
  Table,
  Input,
  Typography,
  Flex,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useAppContext } from "../../contexto";
import { Button } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Search } = Input;
const { Title } = Typography;

export function Home() {
  const { fetchClients, clients, fetchHistory } =
    useAppContext();
  const alreadyFetch = useRef(false);

  const navigate = useNavigate();

  const handleRedirectClient = (link) => {
    navigate(`/${link}`);
  };

  const handleRedirectClientHistory = (link) => {
    navigate(`/${link}`);
  };

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("clientes");

  useEffect(() => {
    if (!alreadyFetch.current) {
      (async () => {
        alreadyFetch.current = true;
        await fetchClients();
      })();
    }
  }, [fetchClients]);

  const filteredClientes = clients.filter(
    (cliente) =>
      cliente.nombre_completo
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      cliente.dni.includes(searchText) ||
      cliente.apodo.toLowerCase().includes(searchText.toLowerCase())
  );

  // const filteredExpirations = clientExpirations.filter((exp) =>
  //   exp.nombre_completo.toLowerCase().includes(searchText.toLowerCase())
  // );

  function ViewClients({ formatNames }) {
    const columns = [
      {
        title: "Nombre",
        render: (_, record) =>
          <strong>{formatNames(record.nombre_completo)}</strong> || "N/A",
        key: "nombre",
      },
      {
        title: "Dni",
        render: (_, record) => (
          <strong style={{ color: "black" }}>{record.dni || "N/A"}</strong>
        ),
        key: "dni",
      },
      {
        title: "Apodo",
        render: (_, record) => <p>{formatNames(record.apodo || "N/A")}</p>,
        key: "apodo",
      },
      {
        title: "Acciones",
        key: "acciones",
        render: (_, record) => (
          <>
            <Flex vertical wrap gap="small">
              <Button
                icon={<FileSearchOutlined />}
                onClick={() =>
                  handleRedirectClient(`ver-cliente?clientID=${record.uuid}`)
                }
              >
                Revisar fichero
              </Button>
              <Button
                icon={<FileSearchOutlined />}
                onClick={() => handleRedirectClientHistory(`ver-historial?clientID=${record.uuid}`)}
              >
                Revisar Historial
              </Button>
            </Flex>
          </>
        ),
      },
    ];

    return columns;
  }

  // function ViewExpirations() {
  //   const columns = [
  //     {
  //       title: "Nombre Cliente",
  //       key: "nombre_completo",
  //       render: (_, record) => <strong>{record.nombre_completo}</strong>,
  //     },
  //     {
  //       title: "Fecha de Vencimiento",
  //       key: "fecha_vencimiento",
  //       render: (_, record) => <strong>{record.fecha_vencimiento}</strong>,
  //     },
  //     {
  //       title: "Monto",
  //       key: "monto",
  //       render: (_, record) => (
  //         <strong>
  //           {Number(record.monto).toLocaleString("es-ES", {
  //             style: "currency",
  //             currency: "ARS",
  //           })}
  //         </strong>
  //       ),
  //     },
  //     {
  //       title: "Estado",
  //       key: "estado",
  //       render: (_, record) => (
  //         <strong
  //           style={{ color: record.estado === "activo" ? "green" : "red" }}
  //         >
  //           {record.estado === "activo" ? "Al día" : "Vencido"}
  //         </strong>
  //       ),
  //     },
  //   ];

  //   return columns;
  // }

  const getColumnas = () => {
    switch (activeTab) {
      case "clientes":
        return ViewClients({ formatNames });
      // case "vencimientos":
      //   return ViewExpirations();
      default:
        return [];
    }
  };

  const getDataSource = () => {
    if (activeTab === "clientes") return filteredClientes;
    // if (activeTab === "vencimientos") return filteredExpirations;
    return [];
  };

  const formatNames = (name) => {
    const parts = name.split(" ");
    const capitalizedParts = parts.map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
    return capitalizedParts.join(" ");
  };

  return (
    <ConfigProvider>
      <Layout>
        <Header style={{ width: "100%", backgroundColor: "white" }}>
          <Menu
            mode="horizontal"
            selectedKeys={[activeTab]}
            onClick={(e) => setActiveTab(e.key)}
            style={{ width: "100%" }}
            items={[
              { key: "clientes", icon: <UserOutlined />, label: "Clientes" },
              // {
              //   key: "vencimientos",
              //   icon: <ClockCircleOutlined />,
              //   label: "Vencimientos",
              // },
            ]}
          />
        </Header>
        <Content>
          <div>
            <Title level={2}>{formatNames(activeTab)}</Title>
            <Search
              placeholder={`Buscar ${formatNames(activeTab)}`}
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Table
              columns={getColumnas()}
              dataSource={getDataSource()}
              scroll={{ x: 500 }}
            />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
