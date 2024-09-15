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
} from "antd";
import { useAppContext } from "../../../contexto";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
const { Title, Text } = Typography;

function ViewClientInfo({ closeModal, selectedUser }) {
  const { SwitchChange } = useAppContext();
  const [isSwitching, setIsSwitching] = useState(false);
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
          <Flex style={{ marginTop: "1rem" }} wrap gap="small">
            <Button type="primary">
              <EditFilled />
            </Button>
            <Button type="primary" danger>
              <DeleteFilled />
            </Button>
          </Flex>
        </Card>
      </Modal>
    </div>
  );
}

export default ViewClientInfo;
