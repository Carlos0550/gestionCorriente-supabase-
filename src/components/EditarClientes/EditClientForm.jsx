import React, { useEffect, useState } from 'react'
import "./editClientForm.css"
import { Button, Form, Input } from 'antd'
import { useAppContext } from '../../contexto'
function EditClientForm({selectedClient,closeModal}) {
const {nombre_completo, apodo, dni, telefono, direccion} = selectedClient
const [form] = Form.useForm()
const { editClientData } = useAppContext()

useEffect(() => {
    form.setFieldsValue({
      nombre_completo: nombre_completo || "",
      apodo: apodo || "",
      dni: dni || "",
      telefono: telefono || "",
      direccion: direccion || "",
    });
  }, [form, nombre_completo, apodo, dni, telefono, direccion]);

  const [isEditing, setIsEditing] = useState(false)
  const onFinish = async(values) => {
    const dataToSend = {
        ...values,
        id: selectedClient.id,
        uuid: selectedClient.uuid
    }
    setIsEditing(true)
    await editClientData(dataToSend)
    setIsEditing(false)

    closeModal()
  };

  return (
    <div className='edit-clients__wrapper'>
         <Form
      form={form}
      name="edit-client"
     
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Nombre Completo"
        name="nombre_completo"
        rules={[{ required: true, message: "Por favor ingrese el nombre completo" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Apodo"
        name="apodo"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="DNI"
        name="dni"
        rules={[{ required: true, 
            pattern: /^[0-9]{7,8}$/,
            message: "Por favor ingrese un DNI válido" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Teléfono"
        name="telefono"
        rules={[
            {
                pattern: /^[0-9]{5,}$/,
                message: "Por favor, ingrese un teléfono válido"
            }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Dirección"
        name="direccion"
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isEditing}>
          Guardar Cambios
        </Button>
      </Form.Item>
    </Form>
    </div>
  )
}

export default EditClientForm