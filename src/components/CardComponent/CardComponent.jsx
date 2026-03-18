import { Card } from 'antd';
import React from 'react';
import { StyleNameProduct, WrapperCard, WrapperImageStyle, WrapperPrice, WrapperPriceDiscount, WrapperReportText } from './style';
import { StarFilled } from '@ant-design/icons';
import { WrapperStyleTextSell } from '../ProductDetailComponent/style';
import { useNavigate } from 'react-router-dom'; 

const CardComponent = (props) => {
  const { countInStock, description, image, name, price, rating, type, discount, selled, id } = props;
  const navigate = useNavigate()

  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`)
  }

  return (
    <WrapperCard
      hoverable
      headStyle={{ width: '200px', height: '200px' }}
      style={{ width: 200 }}
      bodyStyle={{ padding: '10px' }}
      cover={<img draggable={false} alt="example" src={image || "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"} />}
      // Nếu hết hàng thì vô hiệu hóa nút click và làm mờ thẻ
      onClick={() => countInStock !== 0 && handleDetailsProduct(id)} 
      disabled={countInStock === 0}
    >
      <WrapperImageStyle src={"https://salt.tikicdn.com/ts/upload/d7/56/04/b93b8c666e13f49971483596ef14800f.png"} />
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
          <span style={{ marginRight: '4px' }}>
              <span>{rating}</span> <StarFilled style={{ fontSize: '12px', color: 'yellow' }} /> 
          </span>
          <WrapperStyleTextSell> | Đã bán {selled || 0}+</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPrice>
          <span style={{ marginRight: "8px" }}>{price?.toLocaleString()}đ</span>
          <WrapperPriceDiscount>-{discount || 0}%</WrapperPriceDiscount>
      </WrapperPrice>
    </WrapperCard>
  )
}

export default CardComponent;