import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import Loading from '../../components/LoadingComponent/Loading';
import { message, Button } from 'antd'; // Import Button
import { useMutationHooks } from '../../hooks/useMutationHook'; // Import hook mutation
import { useNavigate } from 'react-router-dom'; // Import navigate

const MyOrderPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const getDeliveryStatus = (order) => {
    if (order?.isDelivered) return { label: 'Đã giao hàng', color: '#389e0d' }
    if (order?.isPaid) return { label: 'Đang giao', color: '#1677ff' }
    return { label: 'Chưa giao hàng', color: '#d46b08' }
  }

  const getPaymentStatus = (order) => {
    if (order?.isPaid) return { label: 'Đã thanh toán', color: '#389e0d' }
    return { label: 'Chưa thanh toán', color: '#cf1322' }
  }

  const getDisplayOrderCode = (order) => {
    if (order?.orderCode) return order.orderCode
    return `DH-LEGACY-${order?._id?.slice(-6)?.toUpperCase()}`
  }

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(user?.id, user?.access_token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    enabled: !!user?.id && !!user?.access_token,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const { isLoading, data } = queryOrder;

  // Xử lý chuyển trang sang chi tiết đơn hàng
  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`)
  }

  // Hook xử lý gọi API hủy đơn
  const mutationCancel = useMutationHooks(
    (data) => {
      const { id, token, orderItems } = data;
      return OrderService.cancelOrder(id, token, orderItems);
    }
  )

  const handleCancelOrder = (order) => {
    mutationCancel.mutate({ id: order._id, token: user?.access_token, orderItems: order?.orderItems }, {
      onSuccess: () => {
        queryOrder.refetch()
        message.success('Hủy đơn hàng thành công')
      },
      onError: () => {
        message.error('Hủy đơn hàng thất bại')
      }
    })
  }

  return (
    <Loading isLoading={isLoading || mutationCancel.isPending}>
      <div style={{ background: '#f5f5fa', width: '100%', minHeight: '100vh' }}>
        <div style={{ width: '1270px', margin: '0 auto', paddingTop: '20px' }}>
          <h3 style={{ fontWeight: 'bold' }}>Đơn hàng của tôi</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            {data?.map((order) => {
              const deliveryStatus = getDeliveryStatus(order)
              const paymentStatus = getPaymentStatus(order)
              return (
                <div key={order?._id} style={{ background: '#fff', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      Trạng thái - Mã đơn:
                      <span style={{
                        fontFamily: 'Consolas, monospace',
                        letterSpacing: '0.8px',
                        color: '#d4380d',
                        background: '#fff2e8',
                        border: '1px solid #ffd8bf',
                        borderRadius: '999px',
                        padding: '2px 10px'
                      }}>
                        {getDisplayOrderCode(order)}
                      </span>
                    </span>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                      <span style={{ fontWeight: 'bold', color: deliveryStatus.color }}>{deliveryStatus.label}</span>
                      <span style={{ color: 'rgb(255, 66, 78)', marginLeft: '20px' }}>Thanh toán: </span>
                      <span style={{ fontWeight: 'bold', color: paymentStatus.color }}>{paymentStatus.label}</span>
                    </div>
                  </div>
                  {order?.orderItems?.map((item) => {
                    return (
                      <div key={item?._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={item?.image} style={{ width: '70px', height: '70px', objectFit: 'cover', border: '1px solid #eee', padding: '2px' }} alt="product" />
                          <div style={{ width: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item?.name}</div>
                        </div>
                        <span style={{ color: '#242424' }}>{convertPrice(item?.price)}</span>
                        <span>x{item?.amount}</span>
                      </div>
                    )
                  })}
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                    <span>Tổng tiền:</span>
                    <span style={{ color: 'rgb(254, 56, 52)', fontSize: '20px', fontWeight: 'bold', marginRight: '20px' }}>{convertPrice(order?.totalPrice)}</span>
                    
                    {/* Các nút chức năng */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button onClick={() => handleCancelOrder(order)} danger>Hủy đơn hàng</Button>
                        <Button onClick={() => handleDetailsOrder(order?._id)} type="primary" ghost>Xem chi tiết</Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Loading>
  )
}

export default MyOrderPage;