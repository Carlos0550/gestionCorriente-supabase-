import React, { useEffect, useState, useRef } from "react";
import "./login.css";

import { supabase } from "../../Auth/supabase";
import { useAppContext } from "../../contexto";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Spin } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
function Login() {
  const navigate = useNavigate();
  const { login,getSession } = useAppContext();
  const [form] = Form.useForm()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const onFinish = async(values) => {
    setIsLoggingIn(true)
    await login(values)
    setIsLoggingIn(false)
    form.resetFields()
  };

  useEffect(()=>{
    (async()=>{
        await getSession()
    })()
  },[])

  return (
    <>
      <div className="form__login-wrapper">
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            email: "",
            password: "",
          }}
          className="form__login"
        >
            <h1>Bienvenido a Gestión Corriente</h1>
          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su correo electrónico",
              },
              {
                type: "email",
                message: "Por favor, ingrese un correo electrónico válido",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Correo Electrónico" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su contraseña",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isLoggingIn ? <Spin/> : "Iniciar sesión"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default Login;
