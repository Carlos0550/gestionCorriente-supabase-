import React from 'react';
import { Button } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export function ViewClients({ formatNames }) {
  const navigate = useNavigate()


  const handleRedirect = (link) =>{
    navigate(`/${link}`)
  }
  return [
    {
      title: 'Nombre',
      render: (_, record) => (
        <strong>{formatNames(record.nombre_completo)}</strong> || "N/A"
      ),
      key: 'nombre',
    },
    {
      title: 'Dni',
      render: (_, record) => (
        <strong style={{ color: "black" }}>{record.dni || "N/A"}</strong>
      ),
      key: 'dni',
    },
    {
      title: 'Apodo',
      render: (_, record) => (
        <p>{formatNames(record.apodo || "N/A")}</p>
      ),
      key: 'apodo',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <>
          <Button 
            icon={<FileSearchOutlined />} 
            onClick={() => handleRedirect(`ver-cliente?clientID=${record.uuid}`)}
          >
            Revisar fichero
          </Button>
        </>
      ),
    },

  ];
}
