import { Col, Row } from 'antd';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { convertPrice } from '../../utils';

const OrderSuccess = () => {
  const location = useLocation();
  const { state } = location; 
    const orderCode = state?.orderCode || 'N/A'
    const transferContent = `Thanh toan don hang "${orderCode}"`

  return (
    <div style={{ background: '#f5f5fa', width: '100%', minHeight: '100vh', paddingBottom: '20px' }}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h3 style={{ fontWeight: 'bold', paddingTop: '15px' }}>Đơn hàng đã đặt thành công</h3>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            {/* Phương thức giao hàng */}
            <div style={{ background: '#fff', padding: '16px', borderRadius: '4px', marginBottom: '16px' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Phương thức giao hàng</h4>
                <div style={{ background: '#f0f8ff', padding: '10px', borderRadius: '4px', border: '1px solid #c1e1ff' }}>
                    <span style={{ color: '#ea8500', fontWeight: 'bold' }}>
                        {state?.delivery === 'fast' ? 'FAST' : 'GO_JEK'}
                    </span> Giao hàng tiết kiệm
                </div>
            </div>

            {/* Phương thức thanh toán */}
            <div style={{ background: '#fff', padding: '16px', borderRadius: '4px', marginBottom: '16px' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Phương thức thanh toán</h4>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#0b4b8f', fontWeight: 'bold' }}>Mã đơn hàng:</span>
                    <span style={{
                        fontFamily: 'Consolas, monospace',
                        letterSpacing: '0.8px',
                        fontWeight: 700,
                        color: '#d4380d',
                        background: '#fff2e8',
                        border: '1px solid #ffd8bf',
                        padding: '4px 10px',
                        borderRadius: '999px'
                    }}>
                        {orderCode}
                    </span>
                </div>
                <div style={{ background: '#f0f8ff', padding: '10px', borderRadius: '4px', border: '1px solid #c1e1ff' }}>
                    {state?.payment === 'later_money' ? 'Thanh toán tiền mặt khi nhận hàng' : 'Thanh toán bằng chuyển khoản (Quét mã QR)'}
                </div>
                
                {/* Khu vực hiển thị mã VietQR tự động sinh ra số tiền */}
                {state?.payment === 'chuyen_khoan' && (
                    <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                        <h4 style={{ color: '#d70018', fontWeight: 'bold', fontSize: '18px' }}>Mã QR Thanh Toán</h4>
                        <img 
                            src={`https://img.vietqr.io/image/MB-0968181677-compact2.png?amount=${state?.totalPriceMemo}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent('HUYNH QUOC DAT')}`} 
                            alt="QR Thanh Toan" 
                            style={{ width: '300px', height: '300px', objectFit: 'contain' }} 
                        />
                        <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '15px' }}>
                            <p><b>Ngân hàng:</b> MB Bank</p>
                            <p><b>Chủ tài khoản:</b> HUYNH QUOC DAT</p>
                            <p><b>Số tài khoản:</b> 0968181677</p>
                            <p><b>Số tiền:</b> <span style={{ color: 'red', fontWeight: 'bold', fontSize: '18px' }}>{convertPrice(state?.totalPriceMemo)}</span></p>
                            <p><b>Nội dung CK:</b> {transferContent}</p>
                            <p style={{ color: '#888', marginTop: '10px', fontSize: '13px' }}>
                                <i>(Quét mã bằng ứng dụng ngân hàng, số tiền sẽ được điền tự động)</i>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Chi tiết các sản phẩm đã mua */}
            <div style={{ background: '#fff', padding: '16px', borderRadius: '4px' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Chi tiết đơn hàng</h4>
                {state?.orders?.map((order) => (
                    <div key={order?.product} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} alt="order" />
                            <div style={{ width: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order?.name}</div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Giá: {convertPrice(order?.price)}</span>
                            <span>Số lượng: {order?.amount}</span>
                            <span style={{ color: 'red', fontWeight: 500 }}>{convertPrice(order?.price * order?.amount)}</span>
                        </div>
                    </div>
                ))}
                
                {/* Tổng tiền */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '15px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Tổng tiền: <span style={{ color: 'red', fontSize: '20px' }}>{convertPrice(state?.totalPriceMemo)}</span></span>
                </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default OrderSuccess;