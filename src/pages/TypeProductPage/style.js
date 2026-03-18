import styled from "styled-components";

export const PageOuter = styled.div`
  width: 100%;
  min-height: calc(100vh - 64px);
  background:
    radial-gradient(circle at 12% 18%, rgba(124, 168, 255, 0.12), transparent 36%),
    radial-gradient(circle at 84% 10%, rgba(23, 143, 255, 0.15), transparent 40%),
    linear-gradient(180deg, #f7fafc 0%, #eef2f7 100%);
`;

export const PageInner = styled.div`
  width: min(1260px, 100% - 28px);
  margin: 0 auto;
  padding: 14px 0 28px;

  @media (max-width: 768px) {
    width: min(1260px, 100% - 18px);
    padding-top: 10px;
  }
`;

export const LayoutRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  justify-items: center;
  gap: 16px;
  margin-top: 20px;
`;

export const WrapperNavbar = styled.aside`
  flex: 0 0 240px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #e8eef7;
  box-shadow: 0 10px 24px rgba(13, 30, 57, 0.08);
  padding: 12px;
  border-radius: 14px;
  margin-top: 20px;
  height: fit-content;

  @media (max-width: 992px) {
    width: 100%;
    margin-top: 10px;
  }
`;

export const ProductColumn = styled.section`
  flex: 1;
  min-width: 0;
  background: rgba(255, 255, 255, 0.88);
  border-radius: 18px;
  border: 1px solid #e8eef7;
  box-shadow: 0 10px 24px rgba(13, 30, 57, 0.08);
  padding: 16px 14px 18px;
  margin-top: 20px;

  @media (max-width: 768px) {
    border-radius: 14px;
    padding: 12px;
  }
`;

export const PaginationWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;