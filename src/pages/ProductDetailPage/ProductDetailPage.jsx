import React from 'react'
import { useParams } from 'react-router-dom'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponen'

const ProductDetailsPage = () => {
  const { id } = useParams() // Lấy ID sản phẩm từ URL
  
  return (
    <div style={{ padding: '0 120px', background: '#efefef', height: '100vh' }}>
        <h5 style={{ margin: 0, padding: '10px 0' }}>Trang chủ - Chi tiết sản phẩm</h5>
        <ProductDetailComponent idProduct={id} />
    </div>
  )
}

export default ProductDetailsPage