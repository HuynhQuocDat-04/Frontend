import React, { useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
  PageOuter,
  PageInner,
  TypeBarShell,
  HeroShell,
  SectionCard,
  SectionHeader,
  SectionTitle,
  MoreButtonWrap,
} from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slide1 from "../../Assets/img/slide1.png";
import slide2 from "../../Assets/img/slide2.png";
import slide3 from "../../Assets/img/slide3.png";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService';
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 1000)
  const [limit, setLimit] = useState(5)

  // Gọi API lấy danh sách danh mục (Type)
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }

  // Sử dụng useQuery để quản lý dữ liệu danh mục
  const { data: typeProducts } = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey[1]
    const search = context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const { data: products, isPlaceholderData } = useQuery({ 
    queryKey: ['products', limit, searchDebounce], 
    queryFn: fetchProductAll, 
    retry: 3, 
    retryDelay: 1000,
    placeholderData: (previousData) => previousData, 
  })

  return (
    <PageOuter>
      <PageInner>
        <TypeBarShell>
          <WrapperTypeProduct>
            {typeProducts?.data?.map((item) => <TypeProduct name={item} key={item} />)}
          </WrapperTypeProduct>
        </TypeBarShell>

        <HeroShell>
          <SliderComponent arrImages={[slide1, slide2, slide3]} redirectPath="/product/Orient_" />
        </HeroShell>

        <SectionCard>
          <SectionHeader>
            <div>
              <SectionTitle>Sản phẩm nổi bật</SectionTitle>
            </div>
          </SectionHeader>

          <WrapperProducts>
            {products?.data?.map((product) => {
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

          <MoreButtonWrap>
            <WrapperButtonMore
              textButton={isPlaceholderData ? "Đang tải..." : "Xem thêm"}
              type="outline"
              styleButton={{
                border: "1px solid #0d5cb6",
                color: (products?.total === products?.data?.length) ? "#9aa3b2" : "#0d5cb6",
                width: "240px",
                height: "42px",
                borderRadius: "999px",
                background: "#ffffff",
              }}
              onClick={() => setLimit((prev) => prev + 5)}
              disabled={products?.total === products?.data?.length || products?.totalPage === 1}
              styleTextButton={{ fontWeight: 700, letterSpacing: '0.2px', color: '#0d5cb6' }}
            />
          </MoreButtonWrap>
        </SectionCard>
      </PageInner>
    </PageOuter>
  );
};

export default HomePage;