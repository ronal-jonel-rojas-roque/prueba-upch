import React from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';

interface DeleteConfirmationProps {
  users: string[];
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ users, onConfirm }) => {


  return (
    <button onClick={onConfirm} className="btn btn-danger me-2">
      <MdOutlineDeleteForever /> Eliminar
    </button>
  );
};

export default DeleteConfirmation;
