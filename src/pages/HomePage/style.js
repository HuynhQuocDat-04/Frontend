import styled from 'styled-components';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

export const PageOuter = styled.div`
    width: 100%;
    min-height: 100vh;
    background:
    radial-gradient(circle at 12% 18%, rgba(124, 168, 255, 0.12), transparent 36%),
        radial-gradient(circle at 84% 10%, rgba(23, 143, 255, 0.15), transparent 40%),
        linear-gradient(180deg, #f7fafc 0%, #eef2f7 100%);
`;

export const PageInner = styled.div`
    width: min(1260px, 100% - 28px);
    margin: 0 auto;
    padding: 14px 0 32px;
    font-family: "Be Vietnam Pro", "Segoe UI", sans-serif;

    @media (max-width: 768px) {
        width: min(1260px, 100% - 18px);
        padding-top: 10px;
    }
`;

export const TypeBarShell = styled.div`
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid #e7edf5;
    border-radius: 14px;
    backdrop-filter: blur(3px);
    box-shadow: 0 8px 24px rgba(9, 25, 50, 0.06);
    padding: 2px 10px;
    margin-bottom: 14px;
`;

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-start;
    min-height: 48px;
    overflow-x: auto;
    white-space: nowrap;

    & > div {
        padding: 8px 14px !important;
        border-radius: 999px;
        background: #f4f8fe;
        border: 1px solid #deebfb;
        color: #164682;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.2s ease;
    }

    & > div:hover {
        background: #0d5cb6;
        color: #ffffff;
        border-color: #0d5cb6;
    }
`;

export const HeroShell = styled.div`
    background: linear-gradient(130deg, #0f2544 0%, #133f73 42%, #1a65b8 100%);
    border-radius: 18px;
    padding: 18px;
    margin-bottom: 20px;
    box-shadow: 0 14px 30px rgba(10, 29, 57, 0.24);

    @media (max-width: 768px) {
        padding: 12px;
        border-radius: 14px;
    }
`;

export const HeroTitle = styled.h2`
    margin: 0;
    color: #ffffff;
    font-size: clamp(20px, 2.5vw, 30px);
    line-height: 1.2;
    letter-spacing: 0.2px;
    font-family: "Space Grotesk", "Trebuchet MS", sans-serif;
`;

export const HeroSubtitle = styled.p`
    margin: 7px 0 16px;
    color: rgba(255, 255, 255, 0.88);
    font-size: 14px;
    max-width: 700px;
`;

export const SectionCard = styled.section`
    background: rgba(255, 255, 255, 0.88);
    border-radius: 18px;
    border: 1px solid #e8eef7;
    box-shadow: 0 10px 24px rgba(13, 30, 57, 0.08);
    padding: 18px 16px 20px;

    @media (max-width: 768px) {
        padding: 12px;
        border-radius: 14px;
    }
`;

export const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 8px;

    @media (max-width: 768px) {
        margin-bottom: 2px;
    }
`;

export const SectionTitle = styled.h3`
    margin: 0;
    color: #0b2240;
    font-size: clamp(18px, 2.1vw, 24px);
    font-family: "Space Grotesk", "Trebuchet MS", sans-serif;
`;

export const SectionDescription = styled.p`
    margin: 4px 0 0;
    color: #5e6b81;
    font-size: 13px;
`;

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        color: #fff;
        background: rgb(13, 92, 182);

        span {
            color: #fff;
        }
    }

    width: 100%;
    text-align: center;
`;

export const MoreButtonWrap = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;
`;

export const WrapperProducts = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    justify-items: center;
    gap: 16px;
    margin-top: 20px;
`;
