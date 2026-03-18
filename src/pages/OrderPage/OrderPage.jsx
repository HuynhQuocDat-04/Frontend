import { Checkbox, Col, Row, Form, Input, Modal, Steps } from 'antd'; 
import React, { useState, useMemo, useEffect } from 'react'; 
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slide/orderSlide';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { convertPrice } from '../../utils'; 
import { useMutationHooks } from '../../hooks/useMutationHook'; 
import * as UserService from '../../services/UserService';
import { updateUser } from '../../redux/slide/userSlide';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user); 
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [listChecked, setListChecked] = useState([]);
  
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
      name: '', phone: '', address: '', city: ''
  });
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(selectedOrder({listChecked}))
  }, [listChecked, dispatch])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
        setStateUserDetails({
            city: user?.city,
            name: user?.name,
            address: user?.address,
            phone: user?.phone
        })
    }
  }, [isOpenModalUpdateInfo, user])

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

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

  const itemsDelivery = [
    { title: '20.000 VND', description: 'Dưới 200.000 VND' },
    { title: '10.000 VND', description: 'Từ 200.000 VND đến dưới 500.000 VND' },
    { title: 'Free ship', description: 'Trên 500.000 VND' },
  ]

  const mutationUpdate = useMutationHooks(
      (data) => {
          const { id, token, ...rests } = data
          return UserService.updateUser(id, rests, token)
      }
  )

  const { isPending } = mutationUpdate

  const handleUpdateInforUser = async () => {
    const { name, address, city, phone } = stateUserDetails
    if (name && address && city && phone) {
      if (!user?.id || !user?.access_token) {
          message.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại')
          return
      }
      try {
        const res = await mutationUpdate.mutateAsync({ 
            id: user?.id, token: user?.access_token, ...stateUserDetails 
        })
        if (res?.status === 'OK') {
            dispatch(updateUser({ ...user, ...stateUserDetails }))
            message.success('Cập nhật địa chỉ thành công')
            setIsOpenModalUpdateInfo(false)
        } else {
            message.error(res?.message || 'Có lỗi xảy ra từ máy chủ')
        }
      } catch (err) {
          message.error('Lỗi kết nối mạng, vui lòng thử lại')
      }
    } else {
        message.error('Vui lòng điền đầy đủ thông tin giao hàng')
    }
  }

  const handleAddCard = () => {
    if(!order?.orderItemsSlected?.length) {
        message.error('Vui lòng chọn ít nhất 1 sản phẩm')
    } else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
        setIsOpenModalUpdateInfo(true)
    } else {
        navigate('/payment')
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value })
  }

  const handleCancleUpdate = () => {
    setIsOpenModalUpdateInfo(false);
    form.resetFields()
  }

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      setListChecked(listChecked.filter((item) => item !== e.target.value));
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      setListChecked(order?.orderItems?.map(item => item.product));
    } else {
      setListChecked([]);
    }
  };

  return (
    <div style={{ background: '#f5f5fa', width: '100%', minHeight: '100vh', paddingBottom: '20px' }}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h3 style={{ fontWeight: 'bold', paddingTop: '15px' }}>Giỏ hàng</h3>
        <Row gutter={[16, 16]}>
          <Col span={18}>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '4px', marginBottom: '12px' }}>
              <Steps
                current={
                    deliveryPriceMemo === 10000 ? 1 
                    : deliveryPriceMemo === 20000 ? 0 
                    : order?.orderItemsSlected?.length === 0 ? 0 : 2
                }
                items={itemsDelivery}
              />
            </div>

            <div style={{ background: '#fff', padding: '9px 16px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '390px' }}>
                <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length && order?.orderItems?.length > 0}>
                  Tất cả ({order?.orderItems?.length} sản phẩm)
                </Checkbox>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => dispatch(removeAllOrderProduct({listChecked}))} />
              </div>
            </div>

            <div>
              {order?.orderItems?.map((orderItem) => (
                <div key={orderItem?.product} style={{ background: '#fff', marginTop: '12px', padding: '9px 16px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Checkbox onChange={onChange} value={orderItem?.product} checked={listChecked.includes(orderItem?.product)} />
                    <img src={orderItem?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} alt="order" />
                    <div style={{ width: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{orderItem?.name}</div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{convertPrice(orderItem?.price)}</span>
                    <div style={{ border: '1px solid #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                      <button 
                        style={{ border: 'none', background: 'transparent', cursor: orderItem?.amount === 1 ? 'not-allowed' : 'pointer', padding: '4px 8px' }} 
                        onClick={() => dispatch(decreaseAmount({idProduct: orderItem.product}))}
                        disabled={orderItem?.amount === 1}
                      >
                        <MinusOutlined style={{fontSize: '10px'}} />
                      </button>
                      <input value={orderItem?.amount} style={{ width: '30px', border: 'none', textAlign: 'center' }} readOnly />
                      <button 
                        style={{ border: 'none', background: 'transparent', cursor: orderItem?.amount === orderItem?.countInstock ? 'not-allowed' : 'pointer', padding: '4px 8px' }} 
                        onClick={() => dispatch(increaseAmount({idProduct: orderItem.product}))}
                        disabled={orderItem?.amount === orderItem?.countInstock}
                      >
                        <PlusOutlined style={{fontSize: '10px'}} />
                      </button>
                    </div>
                    <span style={{ color: 'red' }}>{convertPrice(orderItem?.price * orderItem?.amount)}</span>
                    <DeleteOutlined style={{ cursor: 'pointer', color: 'red' }} onClick={() => dispatch(removeOrderProduct({idProduct: orderItem.product}))} />
                  </div>
                </div>
              ))}
            </div>
          </Col>

          <Col span={6}>
            <div style={{ background: '#fff', padding: '9px 16px', borderRadius: '4px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e5e5e5' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Địa chỉ giao hàng</span>
                  <span onClick={() => setIsOpenModalUpdateInfo(true)} style={{ color: 'rgb(10, 104, 255)', cursor: 'pointer' }}>Thay đổi</span>
              </div>
              <div style={{ paddingTop: '10px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{`${user?.name} | ${user?.phone}`}</div>
                  <div>{`${user?.address}, ${user?.city}`}</div>
              </div>
            </div>

            <div style={{ background: '#fff', padding: '9px 16px', borderRadius: '4px' }}>
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
            <ButtonComponent
              onClick={handleAddCard}
              styleButton={{ background: 'red', height: '48px', width: '100%', marginTop: '15px', border: 'none' }}
              textButton={'Mua hàng'}
              styleTextButton={{ color: '#fff', fontWeight: '700' }}
            />
          </Col>
        </Row>
      </div>

      <Modal title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser} forceRender>
        <Loading isLoading={isPending}>
            <Form name="updateInfo" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} autoComplete="off" form={form}>
                <Form.Item label="Họ tên" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}><Input value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" /></Form.Item>
                <Form.Item label="Thành phố" name="city" rules={[{ required: true, message: 'Nhập thành phố!' }]}><Input value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city" /></Form.Item>
                <Form.Item label="Số ĐT" name="phone" rules={[{ required: true, message: 'Nhập số ĐT!' }]}><Input value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" /></Form.Item>
                <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Nhập địa chỉ!' }]}><Input value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" /></Form.Item>
            </Form>
        </Loading>
      </Modal>
    </div>
  )
}

export default OrderPage;