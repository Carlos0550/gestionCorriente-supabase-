import React, { useEffect, useState } from 'react';

function NotFound() {
  const [countDown, setCountDown] = useState(5); 

  useEffect(() => {
    if (countDown > 0) {
      const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // window.location.href = "http://localhost:3000/home";
      window.location.href = "https://gestion-corriente-client.vercel.app/home";
      
    }
  }, [countDown]);

  return (
    <div className='box has-text-centered is title is size-3'>
      Página no encontrada <hr />
      <span className='tag is-danger is-size-4'>Redirigiéndote a la página princial en {countDown} segundos...
      </span>
    </div>
  );
}

export default NotFound;
