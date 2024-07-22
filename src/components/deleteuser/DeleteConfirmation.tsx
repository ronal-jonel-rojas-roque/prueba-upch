import React from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';

interface DeleteConfirmationProps {
  users: string[];
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ users, onConfirm }) => {
  /* const handleDelete = () => {
    Swal.fire({
      title: 'Eliminar usuarios',
      text: `Esta seguro que desea eliminar al siguiente usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }; */

  return (
    <button onClick={onConfirm} className="btn btn-danger me-2">
      <MdOutlineDeleteForever /> Eliminar
    </button>
  );
};

export default DeleteConfirmation;
