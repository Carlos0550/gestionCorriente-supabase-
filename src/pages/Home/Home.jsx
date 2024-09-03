// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from 'react';
import { ConfigProvider, Layout, Menu, Table, Input, Typography } from 'antd';
import { UserOutlined, SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAppContext } from '../../contexto';
import { ViewClients } from '../../components/VerClientes/ViewClients';

const { Header, Content } = Layout;
const { Search } = Input;
const { Title } = Typography;

export function Home() {
  const { fetchClients, clients } = useAppContext();
  const alreadyFetch = useRef(false);

  useEffect(() => {
    if (!alreadyFetch.current) {
      (async () => {
        alreadyFetch.current = true;
        await fetchClients();
      })();
    }
  }, [fetchClients]);

  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('clientes');

  

  const filteredClientes = clients.filter(
    (cliente) =>
      cliente.nombre_completo.toLowerCase().includes(searchText.toLowerCase()) ||
      cliente.dni.includes(searchText)
  );

  const formatNames = (name) => {
    const parts = name.split(" ");
    const capitalizedParts = parts.map(part => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
    return capitalizedParts.join(" ");
  };

  // Selecciona las columnas según la pestaña activa
  const getColumnas = () => {
    if (activeTab === 'clientes') return ViewClients({ formatNames });
    // Puedes añadir más condiciones para diferentes tabs y componentes de columnas
    return [];
  };

  return (
    <ConfigProvider>
      <Layout>
        <Header style={{ width: '100%', backgroundColor: 'white' }}>
          <Menu 
            mode="horizontal" 
            selectedKeys={[activeTab]}
            onClick={(e) => setActiveTab(e.key)}
            style={{ width: '100%' }}
            items={[
              { key: 'clientes', icon: <UserOutlined />, label: 'Clientes' },
              { key: 'vencimientos', icon: <ClockCircleOutlined />, label: 'Vencimientos' }
            ]} 
          />
        </Header>
        <Content>
          <div >
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
              dataSource={filteredClientes} 
              scroll={{x:500}}
            />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
