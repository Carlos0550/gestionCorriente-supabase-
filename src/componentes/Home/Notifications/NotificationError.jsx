import React,{useEffect, useRef} from 'react';
import { Button, Space, notification } from 'antd';

const NotificationError = ({ showAlert }) => {
  const [api, contextHolder] = notification.useNotification();
  const hasShowAlert = useRef(false)
  // Abrir la notificación cuando showAlert es true
  useEffect(() => {
    if (showAlert && !hasShowAlert.current) {
        api.open({
            message: <h1 className='title is-size-5 is-color-danger'>Revise que todos los campos estén completos</h1>,
            pauseOnHover:true,
          });
          hasShowAlert.current = true
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
