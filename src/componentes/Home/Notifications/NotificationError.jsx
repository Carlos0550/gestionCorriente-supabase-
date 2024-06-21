import React,{useEffect} from 'react';
import { Button, Space, notification } from 'antd';

const NotificationError = ({ showAlert }) => {
  const [api, contextHolder] = notification.useNotification();

  // Abrir la notificación cuando showAlert es true
  useEffect(() => {
    if (showAlert) {
        api.open({
            message: 'Algunos campos vacios',
            pauseOnHover:true,
            description:
              'Debe completar todos los campos que sean obligatorios',
            
          });
    }
  }, [showAlert, api]);

  return (
    <>
      {contextHolder}
      <Space>
        {/* <Button type="primary" onClick={openNotification(true)}>
          Pause on hover
        </Button> */}
      </Space>
    </>
  );
};

export default NotificationError;
