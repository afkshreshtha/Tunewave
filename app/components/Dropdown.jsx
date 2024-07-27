import { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';

const Dropdown = ({ options, selectedOption, onOptionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left mb-4">
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none "
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption}
          {isOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
        </button>
      </div>

      <div
        className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          {options.map((option) => (
            <button
              key={option}
              className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-white w-full text-left"
              role="menuitem"
              onClick={() => {
                onOptionSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
