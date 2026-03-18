import React from "react";
import { useNavigate } from "react-router-dom";
import { WrapperCategoryChip, WrapperContent, WrapperLabelText } from "./style";

const NavBarComponent = ({ typeProducts = [], currentType = "" }) => {
    const navigate = useNavigate();

    const handleNavigateType = (type) => {
        if (!type) return;
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '_')}`, { state: type });
    };

    return (
        <div>
            <WrapperLabelText>Danh mục</WrapperLabelText>
            <WrapperContent>
                {typeProducts.map((type) => (
                    <WrapperCategoryChip
                        key={type}
                        isActive={currentType === type}
                        onClick={() => handleNavigateType(type)}
                    >
                        {type}
                    </WrapperCategoryChip>
                ))}
            </WrapperContent>
        </div>
    );
};

export default NavBarComponent;