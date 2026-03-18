import { Col, Image, Row } from 'antd'
import React, { useMemo, useState } from 'react'
import imageProductSmall from '../../Assets/img/MTP-1183A-2A.jpg'
import { WrapperStyleImageSmall, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct, WrapperPriceTextProduct, WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber } from './style'
import { StarFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useDispatch, useSelector } from 'react-redux' 
import { useLocation, useNavigate } from 'react-router-dom' 
import { addOrderProduct } from '../../redux/slide/orderSlide' 
import { convertPrice } from '../../utils'

const ProductDetailComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1) 
    const user = useSelector((state) => state.user) 
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const deliveryName = user?.name || 'Khach hang'
    const deliveryAddress = [user?.address, user?.city].filter(Boolean).join(', ')

    const handleChangeAddress = () => {
        if (!user?.id) {
            navigate('/signin', { state: location?.pathname })
            return
        }
        navigate('/profile-user')
    }

    const onChange = (value) => {
        setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    const { isLoading, data: productDetails } = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: fetchGetDetailsProduct,
        enabled: !!idProduct 
    })

    const handleChangeCount = (type) => {
        if (type === 'increase') {
            setNumProduct(numProduct + 1)
        } else {
            if (numProduct > 1) {
                setNumProduct(numProduct - 1)
            }
        }
    }

    const handleAddOrderProduct = () => {
        if(!user?.id) {
            navigate('/signin', {state: location?.pathname})
        }else {
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id,
                    discount: productDetails?.discount,
                    countInstock: productDetails?.countInStock
                }
            }))
        }
    }

    const descriptionSpecs = useMemo(() => {
        const text = productDetails?.description?.trim()
        if (!text) return []

        const regex = /([^:\n;,]+)\s*:\s*([^;\n]+?)(?=(?:\s*[;\n]\s*|,\s*[^:\n;,]+\s*:|$))/g
        const specs = []
        let match

        while ((match = regex.exec(text)) !== null) {
            specs.push({
                key: match[1].trim(),
                value: match[2].trim()
            })
        }

        return specs
    }, [productDetails?.description])

    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image src={productDetails?.image} alt="image product" preview={false} />
                    <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                        <WrapperStyleColImage span={4}><WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} /></WrapperStyleColImage>
                        <WrapperStyleColImage span={4}><WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} /></WrapperStyleColImage>
                        <WrapperStyleColImage span={4}><WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} /></WrapperStyleColImage>
                        <WrapperStyleColImage span={4}><WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} /></WrapperStyleColImage>
                        <WrapperStyleColImage span={4}><WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} /></WrapperStyleColImage>
                        <WrapperStyleColImage span={4}><WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} /></WrapperStyleColImage>
                    </Row>
                </Col>
                <Col span={14} style={{ paddingLeft: '10px' }}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        <StarFilled style={{ fontSize: '12px', color: 'rgb(255, 196, 0)' }} />
                        <StarFilled style={{ fontSize: '12px', color: 'rgb(255, 196, 0)' }} />
                        <StarFilled style={{ fontSize: '12px', color: 'rgb(255, 196, 0)' }} />
                        <WrapperStyleTextSell> | Đã bán {productDetails?.selled || 0}+</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Giao đến </span>
                        <span className='address'>
                            {deliveryAddress ? `${deliveryName} | ${deliveryAddress}` : 'Vui long cap nhat dia chi giao hang'}
                        </span>{' '}
                        -
                        <span className='change-address' onClick={handleChangeAddress}> Đổi địa chỉ</span>
                    </WrapperAddressProduct>
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ fontWeight: 600, marginBottom: '8px', color: '#333' }}>Thông số sản phẩm</div>
                        {descriptionSpecs.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {descriptionSpecs.reduce((rows, current, index) => {
                                    if (index % 2 === 0) {
                                        rows.push([current])
                                    } else {
                                        rows[rows.length - 1].push(current)
                                    }
                                    return rows
                                }, []).map((row, rowIndex) => (
                                    <div key={`spec-row-${rowIndex}`} style={{ display: 'grid', gridTemplateColumns: row.length === 1 ? '1fr' : '1fr 1fr', gap: '8px' }}>
                                        {row.map((item, itemIndex) => (
                                            <div key={`${item.key}-${itemIndex}`} style={{ padding: '12px 10px', background: '#f2f2f2', borderRadius: '8px' }}>
                                                <span style={{ fontWeight: 700, color: '#1f1f1f' }}>{item.key}: </span>
                                                <span style={{ color: '#333' }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '12px 10px', background: '#f2f2f2', borderRadius: '8px', color: '#555', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                {productDetails?.description || 'Chưa có mô tả cho sản phẩm này'}
                            </div>
                        )}
                    </div>
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                        <div style={{ marginBottom: '10px' }}>Số lượng</div>
                        <WrapperQualityProduct>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease')}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <WrapperInputNumber onChange={onChange} value={numProduct} size="small" />
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase')}>
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                        </WrapperQualityProduct>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ButtonComponent
                            size={40}
                            styleButton={{ background: 'rgb(255, 57, 69)', height: '48px', width: '220px', border: 'none', borderRadius: '4px' }}
                            textButton={'Chọn mua'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                            onClick={handleAddOrderProduct} 
                        ></ButtonComponent>
                        <ButtonComponent
                            size={40}
                            styleButton={{ background: '#fff', height: '48px', width: '220px', border: '1px solid rgb(13, 92, 182)', borderRadius: '4px' }}
                            textButton={'Mua trả sau'}
                            styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
                        ></ButtonComponent>
                    </div>
                </Col>
            </Row>
        </Loading>
    )
}

export default ProductDetailComponent