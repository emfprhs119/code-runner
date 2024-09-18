import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;
export const ContentWrapper = styled.div`
  height: calc(100vh - 28px);
`;
export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;
export const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;
export const FlexWrapper = styled.div`
  display: flex;
`;
export const FixedFlexWrapper = styled.div`
  position: fixed;
  x: 0px;
  y: 0px;
  display: flex;
`;
export const TextArea = styled.textarea`
  flex: 1;
  resize: none;
  padding: 6px;
  font-size: 16px;
`;
export const Paragraph = styled.p``;