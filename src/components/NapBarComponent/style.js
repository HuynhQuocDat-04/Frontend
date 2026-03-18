import styled from "styled-components";

export const WrapperLabelText = styled.h4`
        font-size: 18px;
        font-weight: 700;
        color: #0b2240;
        margin: 0 0 12px;
`

export const WrapperContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
`

export const WrapperCategoryChip = styled.div`
    padding: 8px 14px;
    border-radius: 999px;
    background: ${({ isActive }) => (isActive ? '#0d5cb6' : '#f4f8fe')};
    border: 1px solid ${({ isActive }) => (isActive ? '#0d5cb6' : '#deebfb')};
    color: ${({ isActive }) => (isActive ? '#ffffff' : '#164682')};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #0d5cb6;
        border-color: #0d5cb6;
        color: #ffffff;
    }
`