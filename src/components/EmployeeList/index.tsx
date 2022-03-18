import { IEmployee } from '../../interfaces/employee';
import Options from '../Options';

interface EmployeeListProps {
  onEdit: (employee: IEmployee) => void;
  onDelete: (id: string) => void;
  loadingDelete?: string;
  employees: IEmployee[];
}

function EmployeesList({
  onEdit,
  onDelete,
  employees,
  loadingDelete,
}: EmployeeListProps) {
  const renderItemList = (employee: IEmployee) => {
    const handleClickEdit = () => onEdit(employee);
    const handleClickDelete = () => onDelete(employee._id!);

    return (
      <li
        key={employee._id}
        className="border rounded bg-white drop-shadow dark:border-transparent h-max"
      >
        <div className="py-8 flex flex-col items-center animate-fadeIn h-max">
          <Options
            loadingDelete={loadingDelete!}
            item={employee}
            onDelete={handleClickDelete}
            onEdit={handleClickEdit}
            className="absolute top-2 right-2"
          />

          <figure className="flex flex-col items-center gap-3">
            {employee.url && employee.url !== 'null' ? (
              <div className="avatar">
                <div className="w-20 mask mask-squircle">
                  <img src={employee.url} />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="bg-primary-light dark:bg-primary-dark text-neutral-content mask mask-squircle w-20">
                  <span className="text-2xl font-roboto font-medium">
                    {employee.name[0]}
                  </span>
                </div>
              </div>
            )}

            <figcaption className="flex flex-col items-center">
              <strong className="text-base text-center">{employee.name}</strong>
              <small className="text-base text-center">{employee.office}</small>
            </figcaption>
          </figure>
        </div>
      </li>
    );
  };

  return (
    <div className="flex flex-1" style={{ marginTop: '-74px' }}>
      <ul className="w-full grid grid-cols-userList gap-x-9 gap-y-8">
        {employees.map(renderItemList)}
      </ul>
    </div>
  );
}

export default EmployeesList;
