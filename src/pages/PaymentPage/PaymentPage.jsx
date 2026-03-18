import { Col, Row, Radio, message } from 'antd';
import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { convertPrice } from '../../utils';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as OrderService from '../../services/OrderService';
import Loading from '../../components/LoadingComponent/Loading';
import { removeAllOrderProduct } from '../../redux/slide/orderSlide'; 

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  
  const [payment, setPayment] = useState('later_money');
  const [delivery, setDelivery] = useState('fast');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const priceMemo = useMemo(() => {
    return order?.orderItemsSlected?.reduce((total, cur) => total + (cur.price * cur.amount), 0)
  }, [order])

  const discountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
        const discountItem = cur.discount ? cur.discount : 0
        return total + (cur.price * cur.amount * discountItem / 100)
    }, 0)
    return Number(result) || 0
  }, [order])

  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 200000 && priceMemo < 500000) return 10000
    if (priceMemo >= 500000 || priceMemo === 0) return 0
    return 20000
  }, [priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(discountMemo) + Number(deliveryPriceMemo)
  }, [priceMemo, discountMemo, deliveryPriceMemo])

  const mutationAddOrder = useMutationHooks(
      (data) => {
          const { token, ...rests } = data
          return OrderService.createOrder(rests, token)
      }
  )

  const { isPending, data, isSuccess, isError, error } = mutationAddOrder

  useEffect(() => {
      if (isSuccess && data?.status === 'OK') {
        const arrayOrdered = []
        order?.orderItemsSlected?.forEach(element => {
            arrayOrdered.push(element.product)
        });
        dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
        
        message.success('Đặt hàng thành công')
        
        navigate('/orderSuccess', {
            state: {
                delivery,
                payment,
                orders: order?.orderItemsSlected,
                totalPriceMemo: totalPriceMemo,
                orderCode: data?.data?.orderCode
            }
        })
      } else if (isSuccess && data?.status !== 'OK') {
        message.error(data?.message || 'Đặt hàng thất bại')
      } else if (isError) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'
        message.error(errorMessage)
      }
    }, [isSuccess, isError, data, error])

  const handleAddOrder = () => {
    if (user?.access_token && order?.orderItemsSlected && user?.name && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSlected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: deliveryPriceMemo,
        taxPrice: 0,
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email // Gửi kèm email người dùng xuống Backend
      })
    } else {
      message.error('Thiếu thông tin đặt hàng hoặc phiên đăng nhập đã hết hạn')
    }
  }

  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h3 style={{ fontWeight: 'bold', paddingTop: '15px' }}>Thanh toán</h3>
        <Row gutter={[16, 16]}>
          <Col span={18}>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '4px', marginBottom: '16px' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Chọn phương thức giao hàng</h4>
                <Radio.Group onChange={(e) => setDelivery(e.target.value)} value={delivery}>
                    <Radio value="fast"><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                    <Radio value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                </Radio.Group>
            </div>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '4px' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Chọn phương thức thanh toán</h4>
                <Radio.Group onChange={(e) => setPayment(e.target.value)} value={payment}>
                    <Radio value="later_money">Thanh toán tiền mặt khi nhận hàng</Radio>
                    <Radio value="chuyen_khoan">Thanh toán bằng chuyển khoản (Quét mã QR)</Radio>
                </Radio.Group>
            </div>
          </Col>

          <Col span={6}>
            <div style={{ background: '#fff', padding: '9px 16px', borderRadius: '4px' }}>
                <div style={{ paddingBottom: '10px', borderBottom: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Địa chỉ: </span>
                    <span style={{fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '180px', textAlign: 'right'}}>{`${user?.address} ${user?.city}`}</span>
                </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e5e5' }}>
                <span>Tạm tính</span><b>{convertPrice(priceMemo)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e5e5' }}>
                <span>Giảm giá</span><b>{convertPrice(discountMemo)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e5e5' }}>
                <span>Phí giao hàng</span><b>{convertPrice(deliveryPriceMemo)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span>Tổng tiền</span><b style={{ color: 'red', fontSize: '20px' }}>{convertPrice(totalPriceMemo)}</b>
              </div>
            </div>
            <Loading isLoading={isPending}>
                <ButtonComponent
                onClick={handleAddOrder}
                styleButton={{ background: 'red', height: '48px', width: '100%', marginTop: '15px', border: 'none' }}
                textButton={'Đặt hàng'}
                styleTextButton={{ color: '#fff', fontWeight: '700' }}
                />
            </Loading>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default PaymentPage;