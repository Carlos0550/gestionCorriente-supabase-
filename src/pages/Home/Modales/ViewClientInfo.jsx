import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Card,
  Typography,
  Divider,
  message,
  Spin,
  Switch,
  Flex,
  Popconfirm,
} from "antd";
import { useAppContext } from "../../../contexto";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import EditClientForm from "../../../components/EditarClientes/EditClientForm";
const { Title, Text } = Typography;

function ViewClientInfo({ closeModal, selectedUser }) {
  const { SwitchChange,deleteClient,deletingUser } = useAppContext();
  const [isSwitching, setIsSwitching] = useState(false);
  const [editClient, setEditClient] = useState(false)
  
  const handleSwitchChange = async (checked) => {
    const hiddenMessage = message.loading("Espere...", 0);
    setIsSwitching(true);
    await SwitchChange(checked, selectedUser.uuid, hiddenMessage);
    setIsSwitching(false);
    closeModal();
  };

  const [buenPagador, setBuenPagador] = useState();
  useEffect(() => {
    if (selectedUser && selectedUser !== null) {
      setBuenPagador(selectedUser.buen_pagador);
    }
  }, [selectedUser]);
  const formatNames = (name) => {
    const parts = name.split(" ");
    const capitalizedParts = parts.map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
    return capitalizedParts.join(" ");
  };

  const handleEditClient = () => {
    setEditClient(!editClient)
    
  }
  return (
    <div>
      <Modal
        open={true}
        onCancel={closeModal}
        footer={[
          <Button onClick={closeModal} type="primary" danger>
            Cerrar
          </Button>,
        ]}
      >
        <Card
          title=<Title level={3}>
            {formatNames(selectedUser.nombre_completo)}
            <Flex style={{ marginTop: "1rem" }} wrap gap="small">
            <Button type="primary" danger={editClient} onClick={handleEditClient}>
              {editClient ? "Cancelar" : <EditFilled />}
            </Button>
            <Popconfirm
            title = "¿Está seguro que desea eliminar este cliente?"
            description = "Esta acción no tiene vuelta atras y eliminará todo lo relacionado a este cliente como entregas, historial, deudas, etc..."
            onConfirm={()=>deleteClient(selectedUser.uuid)}
            okButtonProps={{
              loading: deletingUser
            }}
            onCancel={()=> message.warning("Eliminación cancelada",3)}
            >
            <Button type="primary" danger >
              <DeleteFilled />
            </Button>
            </Popconfirm>
          </Flex>
          </Title>
          style={{ width: "100%" }}
        >
          <Text>
            <strong>ID:</strong> {selectedUser.id}
          </Text>
          <br />
          <Text>
            <strong>Apodo:</strong> {selectedUser.apodo || "No disponible"}
          </Text>
          <br />
          <Text>
            <strong>DNI:</strong> {selectedUser.dni || "No disponible"}
          </Text>
          <br />
          <Text>
            <strong>Teléfono:</strong>{" "}
            {selectedUser.telefono || "No disponible"}
          </Text>
          <br />
          <Text>
            <strong>Dirección:</strong>{" "}
            {selectedUser.direccion || "No disponible"}
          </Text>
          <br />
          <Text>
            <strong>UUID:</strong> {selectedUser.uuid || "No disponible"}
          </Text>
          <br />
          {editClient && <EditClientForm selectedClient={selectedUser} closeForm={handleEditClient} closeModal={closeModal}/>}
          <Divider />
          <Text>
            <strong>Buen Pagador:</strong>
          </Text>{" "}
          {isSwitching ? (
            <Spin />
          ) : (
            <Switch
              checked={buenPagador}
              onChange={handleSwitchChange}
              disabled={isSwitching}
            />
          )}
          
        </Card>
      </Modal>
    </div>
  );
}

export default ViewClientInfo;
