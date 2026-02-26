import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ToolkitAccess = () => {
  const navigate = useNavigate();

  // Redirect to the actual toolkit page
  useEffect(() => {
    navigate('/toolkit', { replace: true });
  }, [navigate]);

  return null;
};

export default ToolkitAccess;

