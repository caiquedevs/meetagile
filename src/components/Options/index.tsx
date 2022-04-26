import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { IconType } from 'react-icons';

type ListItem = { label: string; icon: IconType; onClick: (data: any) => void };

interface PageProps {
  list: ListItem[];
  currentItem: any;
}

export default function OptionsComponent({ list, currentItem }: PageProps) {
  const renderItemList = (item: ListItem, index: number) => {
    const handleClick = () => item.onClick(currentItem);

    return (
      <div className="px-1 py-1" key={index}>
        <Menu.Item>
          <button
            type="button"
            onClick={handleClick}
            className="w-full px-2 py-2 flex items-center gap-3 rounded-md hover:bg-gray-200 ease-in-out duration-200 font-roboto text-sm uppercase"
          >
            <item.icon className="text-teal-400 text-lg" />
            {item.label}
          </button>
        </Menu.Item>
      </div>
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="
            w-full px-2 py-1
            justify-center inline-flex 
            font-medium text-gray-800 
            rounded-md hover:bg-gray-300 ease-in-out duration-300
          "
        >
          <BsThreeDots size="22px" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-14 top-0 bg-white rounded-md shadow-card z-10 px-1 py-2">
          {list.map(renderItemList)}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
