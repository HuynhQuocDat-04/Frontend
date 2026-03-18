import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
  background-color: rgb(26, 148, 255);
  padding: 10px 120px;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  width: 100%;
`
export const WrapperTextHeader = styled.span`
  color: #fff; 
  font-size: 18px;
  font-weight: bold;
  text-align: left;
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    
`

export const WrapperHeaderSmall = styled.span`
    color: #fff;
    font-size: 14px;
`

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: rgb(26, 148, 255);
    }
`