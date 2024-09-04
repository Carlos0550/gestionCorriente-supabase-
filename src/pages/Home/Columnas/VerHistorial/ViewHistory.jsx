import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../contexto";
import {
  Table,
  ConfigProvider,
  Layout,
  Typography,
  Card,
  Button, 
  Skeleton
} from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { formatNames } from "../../../../components/Revisar Fichero/Utils/ProcessDebts";
const { Title } = Typography;
const { Content } = Layout
function ViewHistory() {
  const { fetchHistory,clientHistory } = useAppContext();
  console.log(clientHistory)
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

  const columns = [
    {
      title: "Fecha de compra",
    },
    {
      title: "Cancelado el día",
    },
    {
      title: "Detalles deuda",
    },
    {
      title: "Entregas realizas",
    },
  ];

  const paginationConfig = {
    pageSize: 6,
  };

  const [clientName, setClientName] = useState("")
  useEffect(()=>{
    setClientName("")
    const processHistory = () =>{
      if (clientHistory && clientHistory.length > 0) {
        setClientName(clientHistory[0].nombre_completo || "No hay Historial de deudas")
        
      }else{
        setClientName("Sin historial de deudas")
        return []
      }
    }
    processHistory()
  },[clientHistory])


  return (
    <>
      <ConfigProvider>
        <Layout>
          <Content style={{ width: "100%" }}>
            <Card
              title={<Title level={2}>{fetching ? <Skeleton active /> : formatNames(clientName)}{" "}</Title>}
              bordered={false}
              style={{ width: "100%" }}>
                <Button onClick={() => navigate("/")}><RollbackOutlined />Volver Atras</Button>
            </Card>
            <Table
              columns={columns}
              pagination={paginationConfig}
              dataSource={[]}
              
              scroll={{ x: 500 }}
            />
          </Content>
        </Layout>
      </ConfigProvider>
    </>
  );
}

export default ViewHistory;
