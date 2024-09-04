import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Button, Typography } from "antd";
import locale from "antd/es/date-picker/locale/es_ES";
import { useAppContext } from "../../../contexto";

const { TextArea } = Input;
const { Title } = Typography;

const ProductForm = ({ clientID, clientName }) => {
  const { addDebts, uploadSuccess } = useAppContext();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false)
  const onFinish = async (values) => {
    const productsArray = parseProducts(values.productos);
    const dataToSend = {
      fecha: values.fecha,
      productos: productsArray,
    };
    setSaving(true)
    await addDebts(dataToSend, clientID, clientName);
    form.resetFields()
    setSaving(false)
  };

 

  const parseProducts = (productos) => {
    const lines = productos.split("\n");
    const productRegex = /^(\d+)\s+(.+)\s+((?:x\s*)?\d+(\.\d{1,2})?)$/;

    return lines
      .map((line) => {
        const match = line.trim().match(productRegex);
        if (match) {
          const [, quantity, name, price] = match;
          const isUsd = price.startsWith("x");
          return {
            cantidad: parseInt(quantity),
            nombre_producto: name,
            precio: parseFloat(isUsd ? price.replace("x", "").trim() : price),
            moneda: isUsd ? "usd" : "ars",
          };
        }
        return null;
      })
      .filter((product) => product !== null);
  };

  const validateProducts = (_, value) => {
    if (!value) {
      return Promise.reject("El campo de productos no puede estar vacío");
    }

    const lines = value.split("\n");
    const productRegex = /^(\d+)\s+(.+)\s+((?:x\s*)?\d+(\.\d{1,2})?)$/;

    for (let line of lines) {
      if (!productRegex.test(line.trim())) {
        return Promise.reject(
          `El formato del producto en la línea "${line}" es incorrecto.`
        );
      }
    }

    return Promise.resolve();
  };

  return (
   <>
     <Title level={3}>Añadir una deuda</Title>

<Form onFinish={onFinish}>

  <Form.Item
    name="productos"
    label="Productos"
    rules={[{ validator: validateProducts }]}
  >
    <TextArea rows={6} placeholder="Ej: 2 Mate de cuero 1500" />
  </Form.Item>

  <Form.Item
    name="fecha"
    label="Fecha"
    rules={[{ required: true, message: "Por favor selecciona una fecha" }]}
  >
    <DatePicker locale={locale} />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit" loading={saving} disabled={saving}>
      Cargar Productos
    </Button>
  </Form.Item>
</Form>
   </>
  );
};

export default ProductForm;
