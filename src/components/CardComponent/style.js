import { Card } from 'antd';
import styled from 'styled-components';

export const WrapperCard = styled(Card)`
    width: 200px;
    & img {
        width: 200px;
        height: 200px;
    }
    position: relative;
`

export const WrapperImageStyle = styled.img`
   top: -1px;
   left: -1px;
   border-top-left-radius: 3px;
   position: absolute;
   height: 20px !important;
    width: 89px !important;

`

export const StyleNameProduct = styled.div`
    font-size: 18px;
    font-weight: 400;
    line-height: 16px;
    color: rgb(56, 56, 61)
`

export const WrapperReportText = styled.div`
    font-size: 14px;
    color: rgb(128, 128, 137);
    display: flex;
    align-items: center;
    margin: 6px 0 0px;
`
export const WrapperPrice = styled.div`
    font-size: 20px;
    font-weight: 500;
    color: rgb(255, 66, 78);
`

export const WrapperPriceDiscount = styled.span`
    font-size: 20px;
    font-weight: 500;
    color: rgb(255, 66, 78);
`

export const WrapperStyleTextSell = styled.span`
  font-size: 15px;
  line-height: 24px;
  color: rgb(120, 120, 120);
`;