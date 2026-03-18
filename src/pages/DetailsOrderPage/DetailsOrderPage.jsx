import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as OrderService from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query';
import { convertPrice } from '../../utils';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';

const DetailsOrderPage = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user);

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, user?.access_token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ['orders-details', id],
    queryFn: fetchDetailsOrder,
    enabled: !!id
  });

  const { isLoading, data } = queryOrder;

  const priceMemo = useMemo(() => {
    let result = 0
    if(data?.orderItems?.length > 0) {
      data?.orderItems?.forEach((item) => {
        result += item.price * item.amount
      })
    }
    return result
  }, [data])

  return (
    <Loading isLoading={isLoading}>
      <div style={{width: '100%', minHeight: '100vh', background: '#f5f5fa', paddingBottom: '20px'}}>
        <div style={{ width: '1270px', margin: '0 auto', height: '100%'}}>
          <h3 style={{paddingTop: '20px', fontWeight: 'bold'}}>Chi tiết đơn hàng</h3>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              {/* Địa chỉ người nhận */}
              <div style={{ flex: 1, background: '#fff', padding: '16px', borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '10px' }}>Địa chỉ người nhận</h4>
                  <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{data?.shippingAddress?.fullName}</div>
                      <div style={{ margin: '5px 0' }}>Địa chỉ: {`${data?.shippingAddress?.address}, ${data?.shippingAddress?.city}`}</div>
                      <div>Điện thoại: {data?.shippingAddress?.phone}</div>
                  </div>
              </div>

              {/* Hình thức giao hàng */}
              <div style={{ flex: 1, background: '#fff', padding: '16px', borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '10px' }}>Hình thức giao hàng</h4>
                  <div>
                      <div style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST Giao hàng tiết kiệm</div>
                      <div style={{ margin: '5px 0' }}>Phí giao hàng: {convertPrice(data?.shippingPrice)}</div>
                  </div>
              </div>

              {/* Hình thức thanh toán */}
              <div style={{ flex: 1, background: '#fff', padding: '16px', borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '10px' }}>Hình thức thanh toán</h4>
                  <div>
                      <div style={{ margin: '5px 0' }}>
                        {data?.paymentMethod === 'later_money'
                          ? 'Thanh toán tiền mặt khi nhận hàng'
                          : data?.paymentMethod === 'chuyen_khoan'
                            ? 'Thanh toán bằng chuyển khoản (Quét mã QR)'
                            : 'Thanh toán trực tuyến'}
                      </div>
                      <div style={{ color: '#ea8500', fontWeight: 'bold' }}>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                  </div>
              </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: '4px', marginTop: '20px' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '10px', fontWeight: 'bold' }}>
                  <div style={{ width: '50%' }}>Sản phẩm</div>
                  <div style={{ width: '15%', textAlign: 'center' }}>Giá</div>
                  <div style={{ width: '10%', textAlign: 'center' }}>Số lượng</div>
                  <div style={{ width: '25%', textAlign: 'right' }}>Giảm giá</div>
              </div>
              {data?.orderItems?.map((order) => {
                  return (
                      <div key={order?._id} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                          <div style={{ width: '50%', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img src={order?.image} style={{ width: '70px', height: '70px', objectFit: 'cover', border: '1px solid #eee', padding: '2px' }} alt="product" />
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order?.name}</div>
                          </div>
                          <div style={{ width: '15%', textAlign: 'center' }}>{convertPrice(order?.price)}</div>
                          <div style={{ width: '10%', textAlign: 'center' }}>{order?.amount}</div>
                          <div style={{ width: '25%', textAlign: 'right' }}>{order?.discount ? `${order?.discount}%` : '0'}</div>
                      </div>
                  )
              })}
              
              {/* Tổng kết tiền */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#808089' }}>Tạm tính</span>
                          <span style={{ fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#808089' }}>Phí vận chuyển</span>
                          <span style={{ fontWeight: 'bold' }}>{convertPrice(data?.shippingPrice)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#808089' }}>Tổng cộng</span>
                          <span style={{ color: 'red', fontSize: '20px', fontWeight: 'bold' }}>{convertPrice(data?.totalPrice)}</span>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </Loading>
  )
}

export default DetailsOrderPage;