import styled, { keyframes } from 'styled-components';

export const Table = styled.table`
  width: 100%;

  border-collapse: separate;
  border-spacing: 0px 8px;

  thead {
    tr {
      th {
        padding: 0 20px;

        &:first-child {
          padding-left: 28px;
        }
      }
    }
  }

  tbody {
    tr {
      td:not(.skeleton) {
        background-color: #ffffff;
        min-height: 69px;
        padding: 17px 20px;

        border-top: 1px solid #d2d4d7;
        border-bottom: 1px solid #d2d4d7;

        &:first-child {
          padding-left: 30px;
          border-radius: 5px 0 0 5px;
          border-left: 1px solid #d2d4d7;
        }

        &:last-child {
          padding-right: 30px;

          text-align: -webkit-right;

          border-right: 1px solid #d2d4d7;
          border-radius: 0px 5px 5px 0px;
        }
      }
    }
  }
`;
