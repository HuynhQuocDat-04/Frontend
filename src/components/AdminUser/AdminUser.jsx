import React, { useState, useEffect, useRef } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Input, Upload, Space } from 'antd'
import { UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import { getBase64 } from '../../utils'
import * as UserService from '../../services/UserService'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import { useSelector } from 'react-redux'

const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState(''); 
  const [isOpenDrawer, setIsOpenDrawer] = useState(false); 
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [listSelected, setListSelected] = useState([]);

  const [formUpdate] = Form.useForm(); 
  const user = useSelector((state) => state.user);
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: '', email: '', phone: '', isAdmin: false, avatar: '', address: ''
  })

  const handleSearch = (selectedKeys, confirm, dataIndex) => { confirm(); };
  const handleReset = (clearFilters) => { clearFilters(); };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Tìm kiếm
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Tạo lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => { if (visible) { setTimeout(() => searchInput.current?.select(), 100); } },
  });

  const fetchAllUser = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    return res
  }
  
  const { data: users, refetch } = useQuery({ queryKey: ['users'], queryFn: fetchAllUser })

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected, user?.access_token)
    if(res?.data) {
        setStateUserDetails({
            name: res?.data?.name,
            email: res?.data?.email,
            phone: res?.data?.phone,
            isAdmin: res?.data?.isAdmin,
            address: res?.data?.address,
            avatar: res?.data?.avatar
        })
    }
  }

  // Sửa lỗi nạp dữ liệu vào Drawer khi mở
  useEffect(() => {
    if(rowSelected && isOpenDrawer) {
        fetchGetDetailsUser(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  useEffect(() => {
    if (formUpdate && stateUserDetails) {
        formUpdate.setFieldsValue(stateUserDetails)
    }
  }, [formUpdate, stateUserDetails])

  const handleDetailsUser = (id) => { setRowSelected(id); setIsOpenDrawer(true); }
  const handleDeleteOpen = (id) => { setRowSelected(id); setIsModalOpenDelete(true); }

  const renderAction = (text, record) => {
    return (
        <div>
            <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => handleDeleteOpen(record._id)} />
            <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer', marginLeft: '10px' }} onClick={() => handleDetailsUser(record._id)} />
        </div>
    )
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.length - b.name.length, ...getColumnSearchProps('name') },
    { title: 'Email', dataIndex: 'email', ...getColumnSearchProps('email') },
    { title: 'Address', dataIndex: 'address', ...getColumnSearchProps('address') },
    { title: 'Admin', dataIndex: 'isAdmin', filters: [{ text: 'True', value: true }, { text: 'False', value: false }], onFilter: (value, record) => record.isAdmin === value },
    { title: 'Phone', dataIndex: 'phone', ...getColumnSearchProps('phone') },
    { title: 'Action', dataIndex: 'action', render: renderAction },
  ];

  const dataTable = users?.data?.length > 0 ? users?.data?.map((usr) => {
    return { ...usr, key: usr._id, isAdmin: usr.isAdmin ? 'TRUE' : 'FALSE' }
  }) : [];

  const handleDelteManyUsers = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
        const res = await UserService.deleteManyUser({ ids: listSelected }, user?.access_token)
        if (res?.status === 'OK') { refetch(); }
    }
  }

  const handleCloseDrawer = () => { setIsOpenDrawer(false); setStateUserDetails({ name: '', email: '', phone: '', isAdmin: false, address: '', avatar: '' }); formUpdate.resetFields(); };
  const handleOnChangeDetails = (e) => setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value })

  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]; if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setStateUserDetails({ ...stateUserDetails, avatar: file.preview })
  }

  const onUpdateUser = async () => {
    const res = await UserService.updateUser(rowSelected, stateUserDetails, user?.access_token)
    if(res?.status === 'OK') { handleCloseDrawer(); refetch(); }
  }

  const handleCancelDelete = () => { setIsModalOpenDelete(false) }
  const handleDeleteUser = async () => {
    const res = await UserService.deleteUser(rowSelected, user?.access_token)
    if(res?.status === 'OK') { handleCancelDelete(); refetch(); }
  }

  return (
    <div>
        <WrapperHeader>Quản lý người dùng</WrapperHeader>
        <div style={{ marginTop: '20px' }}>
            <TableComponent columns={columns} data={dataTable} setListSelected={setListSelected} handleDelteMany={listSelected.length > 0 ? handleDelteManyUsers : null} />
        </div>

        <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={handleCloseDrawer} width="50%">
            <Form name="updateForm" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onUpdateUser} autoComplete="off" form={formUpdate}>
                <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                    <Input value={stateUserDetails.name} onChange={handleOnChangeDetails} name="name" />
                </Form.Item>
                <Form.Item label="Hộp thư" name="email" rules={[{ required: true, message: 'Vui lòng nhập hộp thư!' }]}>
                    <Input value={stateUserDetails.email} onChange={handleOnChangeDetails} name="email" />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                    <Input value={stateUserDetails.phone} onChange={handleOnChangeDetails} name="phone" />
                </Form.Item>
                <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                    <Input value={stateUserDetails.address} onChange={handleOnChangeDetails} name="address" />
                </Form.Item>
                <Form.Item label="Hình đại diện" name="avatar">
                    <WrapperUploadFile>
                        <Upload onChange={handleOnChangeAvatarDetails} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Chọn tệp</Button>
                            {stateUserDetails?.avatar && (<img src={stateUserDetails?.avatar} style={{ height: '60px', width: '60px', borderRadius: '50%', objectFit: 'cover', marginLeft: '10px' }} alt="avatar" />)}
                        </Upload>
                    </WrapperUploadFile>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="primary" htmlType="submit">Cập nhật</Button>
                </Form.Item>
            </Form>
        </DrawerComponent>

        <ModalComponent title="Xóa người dùng" isOpen={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
            <div>Bạn có chắc chắn muốn xóa tài khoản này không?</div>
        </ModalComponent>
    </div>
  )
}

export default AdminUser