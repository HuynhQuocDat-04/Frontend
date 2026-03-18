import React, { useEffect, useState } from "react";
import NavBarComponent from "../../components/NapBarComponent/NapBarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Pagination } from "antd";
import { LayoutRow, PageInner, PageOuter, PaginationWrap, ProductColumn, WrapperNavbar, WrapperProducts } from "./style";
import { useLocation } from "react-router-dom"; 
import * as ProductService from '../../services/ProductService'; 
import Loading from "../../components/LoadingComponent/Loading"; 
import { useSelector } from "react-redux"; // Thêm để gọi state từ Redux
import { useDebounce } from "../../hooks/useDebounce"; // Thêm hook chống giật
import { useQuery } from "@tanstack/react-query";

const TypeProductPage = () => {
  const { state } = useLocation(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); 
  
  // State quản lý thông số phân trang
  const [panigate, setPanigate] = useState({
      page: 0,
      limit: 10,
      total: 1,
  })

  // Lấy giá trị tìm kiếm trên Header từ Redux và bọc bằng hàm Debounce
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    const { data: typeProducts } = useQuery({
        queryKey: ['type-product'],
        queryFn: fetchAllTypeProduct
    })

  // Truyền thêm page và limit vào hàm fetch
  const fetchProductType = async (type, page, limit) => {
    setLoading(true); 
    const res = await ProductService.getProductType(type, page, limit);
    if(res?.status === 'OK') {
        setProducts(res?.data);
        // Cập nhật lại tổng số lượng sản phẩm từ server
        setPanigate({...panigate, total: res?.total})
        setLoading(false); 
    }else {
        setLoading(false); 
    }
  }

  // Gọi API mỗi khi thay đổi trang, loại sản phẩm hoặc limit
  useEffect(() => {
    if(state) {
        fetchProductType(state, panigate.page, panigate.limit); 
    }
  }, [state, panigate.page, panigate.limit])

  // Hàm xử lý bắt sự kiện người dùng click chuyển trang trên UI
  const onChange = (current, pageSize) => {
      setPanigate({...panigate, page: current - 1, limit: pageSize})
  };

  return (
    <Loading isLoading={loading}> 
        <PageOuter>
        <PageInner>
        <LayoutRow>
            <WrapperNavbar>
            <NavBarComponent typeProducts={typeProducts?.data || []} currentType={state || ''} />
            </WrapperNavbar>

            <ProductColumn>
            <WrapperProducts>
                {/* Logic lọc (search) sản phẩm trực tiếp ở giao diện */}
                {products?.filter((pro) => {
                    if(searchDebounce === '') {
                        return pro
                    } else if(pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                        return pro
                    }
                })?.map((product) => {
                    return (
                        <CardComponent
                            key={product._id}
                            image={product.image}
                            name={product.name}
                            price={product.price}
                            rating={product.rating}
                            selled={product.selled}
                            discount={product.discount}
                            id={product._id}
                        />
                    )
                })}
            </WrapperProducts>

            <PaginationWrap>
                {/* Khai báo và kết nối các thuộc tính của thanh Pagination */}
                <Pagination 
                    defaultCurrent={panigate.page + 1} 
                    total={panigate?.total} 
                    onChange={onChange} 
                />
            </PaginationWrap>
            </ProductColumn>
        </LayoutRow>
        </PageInner>
        </PageOuter>
    </Loading>
  );
};

export default TypeProductPage;