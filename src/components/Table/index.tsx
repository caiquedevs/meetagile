import { Table } from './styles';

interface TableProps {
  data: any[];
  headers: { label: string; value: string; className?: string }[];
  colorHeader: string;
  children: any;
  loadingFetch?: boolean;
  className?: string;
}

function TableComponent({
  headers,
  colorHeader,
  children,
  data,
  loadingFetch,
  ...props
}: TableProps) {
  if (loadingFetch) {
    return (
      <Table cellSpacing="0">
        <tbody>
          <tr>
            <td colSpan={headers.length}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                style={{
                  margin: 'auto',
                  background: 'none',
                  display: 'block',
                  shapeRendering: 'auto',
                }}
                width="33px"
                height="33px"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
              >
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  className="stroke-sky-500 dark:stroke-gray-500"
                  stroke-width="10"
                  r="35"
                  stroke-dasharray="164.93361431346415 56.97787143782138"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    repeatCount="indefinite"
                    dur="1s"
                    values="0 50 50;360 50 50"
                    keyTimes="0;1"
                  ></animateTransform>
                </circle>
              </svg>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  return (
    <Table cellSpacing="0" {...props}>
      <thead>
        {!data.length ? null : (
          <tr className={colorHeader}>
            {headers.map((header, index) => (
              <th key={index} className={header.className}>
                <span>{header.label}</span>
              </th>
            ))}
          </tr>
        )}
      </thead>

      <tbody>
        {!data.length ? (
          <tr>
            <td colSpan={headers.length}>
              <div className="flex items-center justify-center text-gray-500">
                Nenhum conteudo a mostrar por enquanto!
              </div>
            </td>
          </tr>
        ) : null}
        {data.map((row: any, index: any) => {
          return children({ row, index });
        })}
      </tbody>
    </Table>
  );
}

export default TableComponent;
