import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import {
  ConfigProvider,
  Layout,
  Menu,
  Table,
  Input,
  Typography,
  message,
  Form,
 
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  HistoryOutlined,

} from "@ant-design/icons";
import { useAppContext } from "../../contexto";
import { Button } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ViewClientInfo from "./Modales/ViewClientInfo";

const { Header, Content } = Layout;
const { Search } = Input;
const { Title } = Typography;

export function Home() {
  const { fetchClients, clients, getVencimientos, vencimientos,createClients,getSession,errorGettingExpirations, getExpirations,errorStarting } =
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
      alreadyFetch.current = true;
      (async () => {
        const hiddenMessage = message.loading("Aguarde...");
        Promise.all([
          fetchClients(hiddenMessage),
          getVencimientos(hiddenMessage),
        ]);
      })();
    }
  }, []);

  const retryOperations = async () => {
    const hiddenMessage = message.loading("Aguarde...");
        alreadyFetch.current = true;
        Promise.all([
          fetchClients(hiddenMessage),
          getVencimientos(hiddenMessage),
        ]);
  }

  const filteredClientes = clients
  .sort((a,b) => a.id - b.id)
  .filter(
    (cliente) =>
      cliente.nombre_completo
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      cliente.dni.includes(searchText) ||
      cliente.apodo.toLowerCase().includes(searchText.toLowerCase())
  );

  const removeDuplicateClients = (expirations) => {
    const uniqueClients = expirations.reduce((acc, item) => {
      const key = item.uuid;
      if (!acc[key]) {
        acc[key] = item;
      }
      return acc;
    }, {});

    return Object.values(uniqueClients);
  };

  const uniqueExpirations = removeDuplicateClients(vencimientos);

  const filteredResults = uniqueExpirations.filter(
    (exp) =>
      exp.nombre_completo.toLowerCase().includes(searchText.toLowerCase()) ||
      exp.dni?.includes(searchText) ||
      exp.apodo?.toLowerCase().includes(searchText.toLowerCase())
  );

  const [openModalUserData, setOpenModalUserData] = useState(false)
  const [selectedUser, setSelectedUser] = useState(false)
  const handleOpenModalUserData = (client) => {
    setSelectedUser(clients.find(clt => clt.uuid === client))
    setOpenModalUserData(true)
  }
  function ViewClients({ formatNames }) {
    const columns = [
      {
        title: "Nombre",
        render: (_, record) =>
          <strong style={{color: record.buen_pagador ? "green" : "red"}}>{formatNames(record.nombre_completo)}</strong> || "N/A",
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
        title:errorStarting ? 
        <Button type="primary" danger onClick={retryOperations}>Reintentar</Button> : "",
        key: "acciones",
        render: (_, record) => (
          <>
            <div className="btns__action">
              <Button
                icon={<FileSearchOutlined />}
                onClick={() =>
                  handleRedirectClient(`ver-cliente?clientID=${record.uuid}`)
                }
                type="primary"
              >
                Revisar fichero
              </Button>
              <Button
                icon={<HistoryOutlined />}
                onClick={() =>
                  handleRedirectClientHistory(
                    `ver-historial?clientID=${record.uuid}`
                  )
                }
                type="primary"
              >
                Revisar Historial
              </Button>
              <Button type="primary" onClick={()=>handleOpenModalUserData(record.uuid)}>
                <UserOutlined />
                Ver datos
              </Button>
            </div>
          </>
        ),
      },
    ];

    return columns;
  }
  const handleRedirect = (link) => {
    navigate(`/${link}`);
  };
  function ViewExpirations() {
    const columns = [
      {
        title: "Nombre Cliente",
        key: "nombre_completo",
        render: (_, record) => (
          <strong>{formatNames(record.nombre_completo)}</strong>
        ),
      },
      {
        title: errorGettingExpirations ? 
        <Button style={{margin: ".5rem"}} type="primary" danger onClick={getExpirations}>Reintentar Vencimientos</Button>
        : "",
        key: "actions",
        render: (_, record) => (
          <Button
            icon={<FileSearchOutlined />}
            onClick={() =>
              handleRedirect(`ver-cliente?clientID=${record.uuid}`)
            }
          >
            Revisar fichero
          </Button>
        ),
      },
    ];

    return columns;
  }

  const getColumnas = () => {
    switch (activeTab) {
      case "clientes":
        return ViewClients({ formatNames });
      case "vencimientos":
        return ViewExpirations();
      default:
        return [];
    }
  };

  const getDataSource = () => {
    if (activeTab === "clientes") return filteredClientes;
    if (activeTab === "vencimientos") return filteredResults;
    return [];
  };

  const formatNames = (name) => {
    const parts = name.split(" ");
    const capitalizedParts = parts.map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
    return capitalizedParts.join(" ");
  };

  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()
  const onFinish = async(values) => {
    const hiddenMessage = message.loading("Aguarde...",0)
    setSaving(true)
    await createClients(values,hiddenMessage)
    form.resetFields()
    setSaving(false)
  };

const pageConfig = {
  pageSize: 6
} 

useEffect(()=>{
  (async()=>{
      await getSession()
  })()
},[])



 
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
              {
                key: "vencimientos",
                icon: <ClockCircleOutlined />,
                label: "Vencimientos",
              },
            ]}
          />
        </Header>
        <Content>
          <div>
            <div className="content__home-wrapper">
              <div className="table__clients">
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
                  pagination={pageConfig}
                  scroll={{ x: 500 }}
                />
              </div>

              <div className="form__client-container">
                <Title level={2}>Añadir un cliente</Title>

                <div className="form__add-clients">
                  <Form onFinish={onFinish} form={form}>
                    <Form.Item
                      label="Nombre completo"
                      name="nombre_completo"
                      rules={[
                        {
                          required: true,
                          message: "Por favor, ingresa tu nombre completo!",
                        },
                      ]}
                    >
                      <Input placeholder="Jon Doe" />
                    </Form.Item>
                    <Form.Item label="Apodo" name="apodo">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="DNI"
                      name="dni"
                      rules={[
                        {
                          required: true,
                          message: "Por favor Ingresa un DNI válido",
                          pattern: /^[0-9]{7,8}$/,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Número de Teléfono"
                      name="telefono"
                      rules={[
                        {
                          required: true,
                          message: "Por favor, ingresa tu número de teléfono!",
                        },
                        {
                          pattern: /^[0-9]{6,14}$/,
                          message: "Ingresa un número de teléfono válido!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={saving} disabled={saving}>
                        Crear cliente
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          {openModalUserData && <ViewClientInfo closeModal={()=> setOpenModalUserData(false)} selectedUser={selectedUser}/>}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
