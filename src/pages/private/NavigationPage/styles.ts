import styled from 'styled-components';

export const Container = styled.div`
  ul li button {
    min-width: 180px;
    padding: 43px 30px;
  }

  &:before {
    content: '';

    width: calc(100% + 8rem);
    height: 228px;

    display: block;
    position: absolute;
    top: 0;
    right: 0;

    border-bottom: 1px solid #efefef;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.03);
  }
`;
