import styled from 'styled-components';

export const Header = styled.header`
  &:before {
    content: '';

    width: calc(100% + 8rem);
    height: 228px;

    display: block;
    position: absolute;
    top: -4rem;
    left: -4rem;

    border-bottom: 1px solid #efefef;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.03);
  }
`;
