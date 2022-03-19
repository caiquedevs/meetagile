type Props = {
  onEdit: () => void;
  onDelete: () => void;
  item: any;
  loadingDelete: string;
  className?: string;
};

export default function Options({
  onEdit,
  onDelete,
  item,
  loadingDelete,
  ...props
}: Props) {
  return (
    //
    <div className={`dropdown dropdown-left ${props.className}`}>
      <button tabIndex={0} className="btn btn-square btn-ghost btn-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-5 h-5 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          ></path>
        </svg>
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 p-2 drop-shadow border rounded w-max "
      >
        <li>
          <button
            type="button"
            onClick={onEdit}
            className="btn font-medium text-gray-600 hover:bg-gray-200 active:text-white border-none bg-transparent active:bg-primary-light dark:active:bg-primary-dark"
          >
            Editar
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={onDelete}
            className={`btn font-medium text-gray-600 hover:bg-gray-200 active:text-white border-none bg-transparent active:bg-primary-light dark:active:bg-primary-dark ${
              loadingDelete === item._id ? 'loading' : ''
            }`}
          >
            Excluir
          </button>
        </li>
      </ul>
    </div>
  );
}
