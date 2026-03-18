import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Button, message } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import PieChartComponent from '../PieChartComponent/PieChartComponent'
import * as OrderService from '../../services/OrderService'
import { convertPrice } from '../../utils'
import { useMutationHooks } from '../../hooks/useMutationHook'

const AdminOrder = () => {
  const user = useSelector((state) => state.user)
  const [listSelected, setListSelected] = useState([])

  const fetchAllOrders = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }

  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchAllOrders,
    enabled: !!user?.access_token,
  })

  const mutationConfirmPaid = useMutationHooks((data) => {
    const { token, orderIds } = data
    return OrderService.confirmPaidOrders(token, orderIds)
  })

  const convertPaymentMethod = (method) => {
    if (method === 'later_money') return 'Tiền mặt'
    if (method === 'chuyen_khoan') return 'QR Chuyển khoản'
    return method || 'Khác'
  }

  const dataTable =
    ordersData?.data?.map((order) => ({
      ...order,
      key: order._id,
      userName: order?.shippingAddress?.fullName || '',
      phone: order?.shippingAddress?.phone || '',
      address: `${order?.shippingAddress?.address || ''}, ${order?.shippingAddress?.city || ''}`.trim().replace(/^,\s*|,\s*$/g, ''),
      paymentMethodLabel: convertPaymentMethod(order?.paymentMethod),
      orderStatusLabel: order?.isCanceled ? 'Đã hủy' : order?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
      totalPriceLabel: convertPrice(order?.totalPrice),
      createdAtLabel: order?.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '',
    })) || []

  const selectedOrders = useMemo(() => {
    if (!listSelected?.length) return []
    const selectedSet = new Set(listSelected)
    return dataTable.filter((order) => selectedSet.has(order._id))
  }, [dataTable, listSelected])

  const isOnlyQRSelected = selectedOrders.length > 0 && selectedOrders.every((order) => order?.paymentMethod === 'chuyen_khoan')

  const isConfirmButtonDisabled = !isOnlyQRSelected || mutationConfirmPaid.isPending

  const handleConfirmPaid = () => {
    if (!isOnlyQRSelected) {
      message.warning('Chỉ có thể xác nhận thanh toán cho các đơn thanh toán bằng QR')
      return
    }

    mutationConfirmPaid.mutate(
      { token: user?.access_token, orderIds: listSelected },
      {
        onSuccess: (res) => {
          if (res?.status === 'OK') {
            message.success('Đã xác nhận thanh toán')
            setListSelected([])
            refetch()
            return
          }
          message.error(res?.message || 'Xác nhận thanh toán thất bại')
        },
        onError: () => {
          message.error('Xác nhận thanh toán thất bại')
        },
      }
    )
  }

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 180,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'userName',
      key: 'userName',
      width: 180,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 260,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethodLabel',
      key: 'paymentMethodLabel',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatusLabel',
      key: 'orderStatusLabel',
      width: 140,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPriceLabel',
      key: 'totalPriceLabel',
      width: 140,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAtLabel',
      key: 'createdAtLabel',
      width: 180,
    },
  ]

  return (
    <div>
      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Quản lý đơn hàng</h2>

      <div
        style={{
          width: '100%',
          height: '280px',
          marginTop: '16px',
          background: '#fff',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          padding: '12px',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '14px', alignItems: 'center', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00C49F', display: 'inline-block' }} />
            <span style={{ fontSize: '13px', color: '#333' }}>Tiền mặt</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0088FE', display: 'inline-block' }} />
            <span style={{ fontSize: '13px', color: '#333' }}>QR Chuyển khoản</span>
          </div>
        </div>
        <PieChartComponent data={ordersData?.data || []} />
        <Button
          type="primary"
          onClick={handleConfirmPaid}
          disabled={isConfirmButtonDisabled}
          loading={mutationConfirmPaid.isPending}
          style={{ position: 'absolute', left: '12px', bottom: '12px' }}
        >
          Xác nhận đã thanh toán
        </Button>
      </div>

      <div style={{ marginTop: '16px' }}>
        <TableComponent
          loading={isLoading}
          columns={columns}
          data={dataTable}
          setListSelected={setListSelected}
          selectedRowKeys={listSelected}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1350 }}
        />
      </div>
    </div>
  )
}

export default AdminOrder
