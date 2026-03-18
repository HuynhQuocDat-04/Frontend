import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TypeProduct = ({ name }) => {
  const navigate = useNavigate();

  const handleNavigateType = (type) => {
    // Xóa dấu và thay khoảng trắng bằng gạch ngang
    navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '_')}`, {state: type}); 
  };

  return (
    <div 
        style={{ padding: "0 10px", cursor: "pointer" }} 
        // Gắn sự kiện chuyển trang
        onClick={() => handleNavigateType(name)}
    >
        {name}
    </div>
  );
};

export default TypeProduct;