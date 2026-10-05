import React from 'react';
import { FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';

const AddressCard = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  isSettingDefault,
  isDeleting,
  selectable = false
}) => {
  return (
    <div
      className={`relative rounded-lg border p-4 transition-all ${
        isSelected
          ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      } ${selectable ? 'cursor-pointer' : ''}`}
      onClick={selectable && onSelect ? () => onSelect(address._id) : undefined}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{address.fullName}</h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
            {address.addressType || 'Home'}
          </span>
          {address.isDefault && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Default
            </span>
          )}
        </div>
        {selectable && isSelected && (
          <div className="text-primary-600">
            <FiCheck className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-2 text-sm text-gray-500">
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        {address.landmark && <p>Landmark: {address.landmark}</p>}
        <p>{address.city}, {address.state} {address.postalCode}</p>
        <p>{address.country || 'India'}</p>
        {address.phone && <p className="mt-1">Phone: {address.phone}</p>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="font-medium text-primary-600 hover:text-primary-500 flex items-center gap-1"
        >
          <FiEdit2 className="h-4 w-4" /> Edit
        </button>
        
        <button
          type="button"
          onClick={() => onDelete(address._id)}
          disabled={isDeleting === address._id}
          className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiTrash2 className="h-4 w-4" /> Delete
        </button>

        {!address.isDefault && onSetDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address._id)}
            disabled={isSettingDefault === address._id}
            className="font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Set as Default
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
