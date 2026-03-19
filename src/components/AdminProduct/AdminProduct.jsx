import React, { useState, useEffect, useRef } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Input, Upload, Space, Select, Modal } from 'antd' 
import { PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import { getBase64, renderOptions } from '../../utils' 
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import { useSelector } from 'react-redux'

const { TextArea } = Input

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState(''); 
  const [isOpenDrawer, setIsOpenDrawer] = useState(false); 
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [listSelected, setListSelected] = useState([]); 

  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm(); 
  const user = useSelector((state) => state.user);
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => { confirm(); };
  const handleReset = (clearFilters) => { clearFilters(); };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input ref={searchInput} placeholder={`Search ${dataIndex}`} value={selectedKeys[0]} onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])} onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)} style={{ marginBottom: 8, display: 'block' }} />
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>Search</Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>Reset</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => { if (visible) { setTimeout(() => searchInput.current?.select(), 100); } },
  });

  // Gom các giá trị khởi tạo vào hàm initial để reset form triệt để
  const initial = () => ({
    name: '', price: '', description: '', rating: '', image: '', gallery: [], type: '', countInStock: '', newType: '', discount: ''
  })

  const [stateProduct, setStateProduct] = useState(initial())
  const [stateProductDetails, setStateProductDetails] = useState(initial())

  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct()
    return res
  }
  const { data: products, refetch } = useQuery({ queryKey: ['products'], queryFn: fetchProductAll })

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }
  const { data: typeProduct } = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected)
    if(res?.data) {
        setStateProductDetails({
            name: res?.data?.name, price: res?.data?.price, description: res?.data?.description,
            rating: res?.data?.rating, image: res?.data?.image, type: res?.data?.type, countInStock: res?.data?.countInStock,
        discount: res?.data?.discount, gallery: res?.data?.gallery || []
        })
    }
  }

  useEffect(() => {
    if(rowSelected && isOpenDrawer) { fetchGetDetailsProduct(rowSelected) }
  }, [rowSelected, isOpenDrawer])

  useEffect(() => {
    if (formUpdate && stateProductDetails) { formUpdate.setFieldsValue(stateProductDetails) }
  }, [formUpdate, stateProductDetails])

  const handleDetailsProduct = (id) => { setRowSelected(id); setIsOpenDrawer(true); }
  const handleDeleteOpen = (id) => { setRowSelected(id); setIsModalOpenDelete(true); }

  const renderAction = (text, record) => {
    return (
        <div>
            <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => handleDeleteOpen(record._id)} />
            <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer', marginLeft: '10px' }} onClick={() => handleDetailsProduct(record._id)} />
        </div>
    )
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.length - b.name.length, ...getColumnSearchProps('name') },
    { title: 'Price', dataIndex: 'price', sorter: (a, b) => a.price - b.price },
    { title: 'Rating', dataIndex: 'rating', sorter: (a, b) => a.rating - b.rating },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Số lượng', dataIndex: 'countInStock', sorter: (a, b) => a.countInStock - b.countInStock },
    { title: 'Action', dataIndex: 'action', render: renderAction },
  ];

  const dataTable = products?.data?.length && products?.data?.map((product) => {
    return { ...product, key: product._id }
  })

  const handleDelteManyProducts = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
        const res = await ProductService.deleteManyProduct({ ids: listSelected }, user?.access_token)
        if (res?.status === 'OK') { alert('Xóa thành công!'); refetch() } 
    }
  }

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => { 
    setIsModalOpen(false); 
    setStateProduct(initial()); // Gọi hàm initial khi đóng form
    form.resetFields(); 
  };
  
  const handleOnChange = (e) => {
    setStateProduct({ ...stateProduct, [e.target.name]: e.target.value })
  }

  const handleChangeSelect = (value) => {
      setStateProduct({ ...stateProduct, type: value })
  }

  const mapGalleryToUploadList = (gallery = []) => {
    return gallery.map((url, index) => ({
      uid: `gallery-${index}`,
      name: `gallery-${index + 1}.png`,
      status: 'done',
      url,
    }))
  }

  const normalizeGalleryFromFileList = async (fileList = []) => {
    const normalized = await Promise.all(
      fileList.slice(0, 6).map(async (file) => {
        if (file?.url) return file.url
        if (file?.preview) return file.preview
        if (file?.originFileObj) {
          const preview = await getBase64(file.originFileObj)
          file.preview = preview
          return preview
        }
        return ''
      })
    )
    return normalized.filter(Boolean)
  }

  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0]
    if (!file) {
      setStateProduct({ ...stateProduct, image: '' })
      return
    }
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj)
    setStateProduct({ ...stateProduct, image: file.url || file.preview })
  }

  const handleOnChangeGallery = async ({ fileList }) => {
    const gallery = await normalizeGalleryFromFileList(fileList)
    setStateProduct({ ...stateProduct, gallery })
  }

  const onFinish = async () => {
    const params = {
        name: stateProduct.name,
        price: stateProduct.price,
        description: stateProduct.description,
        rating: stateProduct.rating,
        image: stateProduct.image,
        gallery: stateProduct.gallery,
        countInStock: stateProduct.countInStock,
        discount: stateProduct.discount,
        type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type 
    }
    const res = await ProductService.createProduct(params)
    if(res?.status === 'OK') { alert('Tạo thành công!'); handleCancel(); refetch(); } else { alert('Có lỗi xảy ra!'); }
  }

  const handleCloseDrawer = () => { setIsOpenDrawer(false); setStateProductDetails(initial()); formUpdate.resetFields(); };
  const handleOnChangeDetails = (e) => setStateProductDetails({ ...stateProductDetails, [e.target.name]: e.target.value })
  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]
    if (!file) {
      setStateProductDetails({ ...stateProductDetails, image: '' })
      return
    }
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj)
    setStateProductDetails({ ...stateProductDetails, image: file.url || file.preview })
  }
  const handleOnChangeGalleryDetails = async ({ fileList }) => {
    const gallery = await normalizeGalleryFromFileList(fileList)
    setStateProductDetails({ ...stateProductDetails, gallery })
  }
  const onUpdateProduct = async () => {
    const res = await ProductService.updateProduct(rowSelected, user?.access_token, {
      ...stateProductDetails,
      gallery: stateProductDetails.gallery || []
    })
    if(res?.status === 'OK') { alert('Cập nhật thành công!'); handleCloseDrawer(); refetch(); } else { alert('Có lỗi xảy ra!'); }
  }
  const handleCancelDelete = () => { setIsModalOpenDelete(false) }
  const handleDeleteProduct = async () => {
    const res = await ProductService.deleteProduct(rowSelected, user?.access_token)
    if(res?.status === 'OK') { alert('Xóa thành công!'); handleCancelDelete(); refetch(); } else { alert('Có lỗi xảy ra!'); }
  }

  return (
    <div>
        <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
        <div style={{ marginTop: '10px' }}>
            <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={showModal}>
                <PlusOutlined style={{ fontSize: '60px' }} />
            </Button>
        </div>
        <div style={{ marginTop: '20px' }}>
            <TableComponent columns={columns} data={dataTable} setListSelected={setListSelected} handleDelteMany={listSelected.length > 0 ? handleDelteManyProducts : null} />
        </div>

        <Modal title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <Form name="basic" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish} autoComplete="off" form={form}>
                <Form.Item label="Tên SP" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên SP!' }]}>
                    <Input value={stateProduct.name} onChange={handleOnChange} name="name" />
                </Form.Item>
                
                <Form.Item label="Loại SP" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại SP!' }]}>
                    <Select
                        name="type"
                        value={stateProduct.type}
                        onChange={handleChangeSelect}
                        options={renderOptions(typeProduct?.data)}
                    />
                </Form.Item>

                {stateProduct.type === 'add_type' && (
                    <Form.Item label="Loại mới" name="newType" rules={[{ required: true, message: 'Vui lòng nhập loại SP mới!' }]}>
                        <Input value={stateProduct.newType} onChange={handleOnChange} name="newType" />
                    </Form.Item>
                )}

                <Form.Item label="Số lượng" name="countInStock" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
                    <Input value={stateProduct.countInStock} onChange={handleOnChange} name="countInStock" />
                </Form.Item>
                <Form.Item label="Giá SP" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá SP!' }]}>
                    <Input value={stateProduct.price} onChange={handleOnChange} name="price" />
                </Form.Item>

                <Form.Item label="Giảm giá %" name="discount" rules={[{ required: true, message: 'Vui lòng nhập % giảm giá!' }]}>
                    <Input value={stateProduct.discount} onChange={handleOnChange} name="discount" />
                </Form.Item>

                <Form.Item label="Đánh giá" name="rating" rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}>
                    <Input value={stateProduct.rating} onChange={handleOnChange} name="rating" />
                </Form.Item>
                <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                  <TextArea
                    value={stateProduct.description}
                    onChange={handleOnChange}
                    name="description"
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    placeholder="Nhập mô tả, nhấn Enter để xuống dòng"
                  />
                </Form.Item>
                <Form.Item label="Hình ảnh" name="image" rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}>
                    <WrapperUploadFile>
                    <Upload onChange={handleOnChangeAvatar} maxCount={1} fileList={stateProduct?.image ? [{ uid: 'main-image', name: 'main-image.png', status: 'done', url: stateProduct.image }] : []}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                            {stateProduct?.image && (<img src={stateProduct?.image} style={{ height: '60px', width: '60px', borderRadius: '50%', objectFit: 'cover', marginLeft: '10px' }} alt="avatar" />)}
                        </Upload>
                    </WrapperUploadFile>
                </Form.Item>
                <Form.Item label="Gallery" name="gallery" extra="Tối đa 6 ảnh bộ sưu tập">
                  <Upload
                    listType="picture-card"
                    onChange={handleOnChangeGallery}
                    maxCount={6}
                    multiple
                    fileList={mapGalleryToUploadList(stateProduct?.gallery || [])}
                  >
                    {(stateProduct?.gallery?.length || 0) >= 6 ? null : <div>+ Upload</div>}
                  </Upload>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </Modal>

        <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={handleCloseDrawer} width="50%">
            <Form name="updateForm" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onUpdateProduct} autoComplete="off" form={formUpdate}>
                <Form.Item label="Tên SP" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên SP!' }]}>
                    <Input value={stateProductDetails.name} onChange={handleOnChangeDetails} name="name" />
                </Form.Item>
                <Form.Item label="Loại SP" name="type" rules={[{ required: true, message: 'Vui lòng nhập loại SP!' }]}>
                    <Input value={stateProductDetails.type} onChange={handleOnChangeDetails} name="type" />
                </Form.Item>
                <Form.Item label="Số lượng" name="countInStock" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
                    <Input value={stateProductDetails.countInStock} onChange={handleOnChangeDetails} name="countInStock" />
                </Form.Item>
                <Form.Item label="Giá SP" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá SP!' }]}>
                    <Input value={stateProductDetails.price} onChange={handleOnChangeDetails} name="price" />
                </Form.Item>

                <Form.Item label="Giảm giá %" name="discount" rules={[{ required: true, message: 'Vui lòng nhập % giảm giá!' }]}>
                    <Input value={stateProductDetails.discount} onChange={handleOnChangeDetails} name="discount" />
                </Form.Item>

                <Form.Item label="Đánh giá" name="rating" rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}>
                    <Input value={stateProductDetails.rating} onChange={handleOnChangeDetails} name="rating" />
                </Form.Item>
                <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                  <TextArea
                    value={stateProductDetails.description}
                    onChange={handleOnChangeDetails}
                    name="description"
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    placeholder="Nhập mô tả, nhấn Enter để xuống dòng"
                  />
                </Form.Item>
                <Form.Item label="Hình ảnh" name="image" rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}>
                    <WrapperUploadFile>
                    <Upload onChange={handleOnChangeAvatarDetails} maxCount={1} fileList={stateProductDetails?.image ? [{ uid: 'main-image-details', name: 'main-image.png', status: 'done', url: stateProductDetails.image }] : []}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                            {stateProductDetails?.image && (<img src={stateProductDetails?.image} style={{ height: '60px', width: '60px', borderRadius: '50%', objectFit: 'cover', marginLeft: '10px' }} alt="avatar" />)}
                        </Upload>
                    </WrapperUploadFile>
                </Form.Item>
                <Form.Item label="Gallery" name="gallery" extra="Tối đa 6 ảnh bộ sưu tập">
                  <Upload
                    listType="picture-card"
                    onChange={handleOnChangeGalleryDetails}
                    maxCount={6}
                    multiple
                    fileList={mapGalleryToUploadList(stateProductDetails?.gallery || [])}
                  >
                    {(stateProductDetails?.gallery?.length || 0) >= 6 ? null : <div>+ Upload</div>}
                  </Upload>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="primary" htmlType="submit">Cập nhật</Button>
                </Form.Item>
            </Form>
        </DrawerComponent>

        <ModalComponent title="Xóa sản phẩm" isOpen={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
            <div>Bạn có chắc chắn muốn xóa sản phẩm này không?</div>
        </ModalComponent>
    </div>
  )
}

export default AdminProduct