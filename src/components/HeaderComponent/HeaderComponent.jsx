import React, { useState, useEffect } from 'react';
import { Badge, Col, Popover } from 'antd';
import { useNavigate } from 'react-router-dom';
import { WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperHeaderSmall, WrapperContentPopup } from './style';
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import ButtonInputSearch from '../ButtonInputSeatch/ButtoninputSearch';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/slide/userSlide';
import { searchProduct } from '../../redux/slide/productSlide'; 
import Loading from '../LoadingComponent/Loading';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  const onSearch = (e) => { dispatch(searchProduct(e.target.value)) }

  const handleNavigateLogin = () => { navigate('/signin'); };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await UserService.logoutUser();
    } finally {
      dispatch(resetUser());
      setLoading(false);
      navigate('/');
    }
  };

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  // Thêm Đơn hàng của tôi vào menu thả xuống
  const content = (
    <div>
      <WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
      <WrapperContentPopup onClick={() => navigate('/my-order', { state: { id: user?.id, token: user?.access_token } })}>Đơn hàng của tôi</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => navigate('/system/admin')}>Quản lý hệ thống</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
    </div>
  );

  return (
    <div>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset' }}>
        <Col span={5}>
          <WrapperTextHeader onClick={() => navigate('/')} style={{cursor: 'pointer'}}>ULTRA WATCH</WrapperTextHeader>
        </Col>
        
        {!isHiddenSearch && (
          <Col span={13}>
            <ButtonInputSearch size="large" textButton="Tìm Kiếm" placeholder="Tìm kiếm sản phẩm" bordered={false} onChange={onSearch} />
          </Col>
        )}

        <Col span={6} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Loading isLoading={loading}>
            <WrapperHeaderAccount>
              {userAvatar ? (
                <img src={userAvatar} alt="avatar" style={{ height: '30px', width: '30px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <UserOutlined style={{color: '#fff', fontSize: '30px'}}/>
              )}
              {user?.access_token ? (
                <Popover content={content} trigger="click">
                  <div style={{ cursor: 'pointer' }}>
                    <WrapperHeaderSmall style={{fontWeight: 'bold'}}>
                        {userName?.length ? userName : user?.email}
                    </WrapperHeaderSmall>
                  </div>
                </Popover>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WrapperHeaderSmall>Đăng nhập/Đăng ký</WrapperHeaderSmall>
                  <div><WrapperHeaderSmall>Tài Khoản</WrapperHeaderSmall><CaretDownOutlined /></div>
                </div>
              )}
            </WrapperHeaderAccount>
          </Loading>

          {!isHiddenCart && (
            <div onClick={() => navigate('/orders')} style={{ cursor: 'pointer' }}>
              <Badge count={order?.orderItems?.length} size='small'>
                <ShoppingCartOutlined style={{color: '#fff', fontSize: '30px'}}/>
              </Badge>
              <WrapperHeaderSmall>Giỏ hàng</WrapperHeaderSmall>
            </div>
          )}
        </Col>  
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent;