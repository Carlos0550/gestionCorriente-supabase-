import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Button, Typography } from "antd";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import locale from "antd/es/date-picker/locale/es_ES";
import { useAppContext } from "../../../contexto";
const { Title } = Typography;

function AddDeliver({ clientID, clientName,subtotal }) {
  const [form] = Form.useForm();
  const { makeDeliver } = useAppContext()
  const [saving, setSaving] = useState(false)

  const onFinish = async(values) => {
    const newDeliver = {
      monto: values.monto,
      fecha_entrega: values.fecha_entrega.format("YYYY-MM-DD"),
    };
    setSaving(true)
    await makeDeliver(clientID, clientName, newDeliver)
    setSaving(false)
    form.resetFields();
  };

  const validateMonto = (_, value) => {
    if (!value || value < 0 ) {
      return Promise.reject("Por favor, introduce un monto válido");
    }else if(value > subtotal){
      return Promise.reject("La entrega no puede ser mayor al total de las deudas");
    }
    return Promise.resolve();
  };

  return (
    <div className="form__delivers-container">
      <Title level={3}>Hacer una entrega</Title>

      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="monto"
          label="Monto a entregar"
          rules={[{ required: true, validator: validateMonto }]}
        >
          <Input type="number" placeholder="Introduce el monto a entregar" />
        </Form.Item>

        <Form.Item
          name="fecha_entrega"
          label="Fecha de entrega"
          rules={[
            { required: true, message: "Por favor selecciona una fecha" },
          ]}
        >
          <DatePicker locale={locale} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving} disabled={saving}>
            Añadir Entrega
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddDeliver;
