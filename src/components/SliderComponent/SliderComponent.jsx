import React from "react";
import { Image } from "antd";
import { WrapperSliderStyle } from "./style";
import { useNavigate } from "react-router-dom";

const SliderComponent = ({ arrImages, redirectPath }) => {
  const navigate = useNavigate();
  const isClickable = Boolean(redirectPath)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  const handleClickSlide = () => {
    if (redirectPath) {
      navigate(redirectPath, { state: 'Orient' });
    }
  };

  return (
    <WrapperSliderStyle {...settings}>
      {arrImages?.map((image, index) => {
        return (
          <div
            key={`slide-${index}`}
            onClick={handleClickSlide}
            className={isClickable ? 'clickable-slide' : ''}
            style={{ cursor: isClickable ? 'pointer' : 'default' }}
          >
            <Image
              src={image}
              alt="slider"
              preview={false}
              width="100%"
              height="274px"
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            />
          </div>
        );
      })}
    </WrapperSliderStyle>
  );
};

export default SliderComponent;