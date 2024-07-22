import React, { useEffect, useState } from 'react'
import search from '../../assets/images/icons/search.png';
import { FaUserEdit } from 'react-icons/fa';
import { BsSliders } from "react-icons/bs";
import "../../styles/tabla.css"
import axios from 'axios';
import ExportFormatModal from '../../utils/ExportFormatModal';
import Logout from '../../shared/logout/Logout';
import EditUserModal from '../editeusers/EditUserModal';
import DeleteConfirmation from '../deleteuser/DeleteConfirmation';
import Swal from 'sweetalert2';
import { exportData } from '../../utils/exportUtils';

interface User {
  picture: {
    thumbnail: string;
  };
  name: {
    title: string
    first: string;
    last: string;
  };
  email: string;
  id: {
    value: string;
  };
  cell: string;
  location: {
    state: string;
    country: string;
  }
  dob: {
    date: string;
  };
  gender: string;
}

export default function TableUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [page, setPage] = useState(1);

  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState('name');

  const [exportFormat, setExportFormat] = useState('');

  const [showExportFormatModal, setShowExportFormatModal] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [noRecords, setNoRecords] = useState(false);

  const seed = 'your-seed';
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));



  const fetchUsers = async (retries: number = 5) => {
    try {
      const cacheKey = `users-page-${page}`;
      const cacheTimestampKey = `${cacheKey}-timestamp`;
      const cacheExpiration = 5 * 60 * 1000;

      const cachedUsers = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
      const now = Date.now();

      if (cachedUsers && cachedTimestamp && (now - parseInt(cachedTimestamp)) < cacheExpiration) {
        const users = JSON.parse(cachedUsers);
        setUsers(users);
        setNoRecords(users.length === 0);
      } else {
        const response = await axios.get(`https://randomuser.me/api/?results=500&page=${page}&seed=${seed}`);
        const fetchedUsers = response.data.results;
        localStorage.setItem(cacheKey, JSON.stringify(fetchedUsers));
        localStorage.setItem(cacheTimestampKey, now.toString());
        setUsers(fetchedUsers);
        setNoRecords(fetchedUsers.length === 0);
      }
      setLoading(false);
    } catch (error) {
      if (retries > 0) {
        const retryDelay = Math.pow(2, 5 - retries) * 1000;
        console.error(`Error fetching the users: ${error}. Retrying in ${retryDelay / 1000} seconds...`);
        await delay(retryDelay);
        fetchUsers(retries - 1);
      } else {
        console.error('Error fetching the users:', error);
        setLoading(false);
      }
    }
  };



  const toggleFilters = () => {
    if (showFilters) {
      setFilterCity('');
      setFilterGender('');
      setSearchCity('');
    }
    setShowFilters(!showFilters);
  };

  const handleSort = (column: keyof User) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortColumn(column);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortColumn) {
      let aValue: string | number = '';
      let bValue: string | number = '';

      if (sortColumn === 'name') {
        aValue = `${a.name.first} ${a.name.last}`;
        bValue = `${b.name.first} ${b.name.last}`;
      } else {
        aValue = (a as any)[sortColumn];
        bValue = (b as any)[sortColumn];
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user => {
    const matchesCity = filterCity === '' || user.location.state.toLowerCase().includes(filterCity.toLowerCase());
    const matchesGender = filterGender === '' || user.gender === filterGender;

    const searchLower = searchValue.toLowerCase();
    let matchesSearch = false;
    if (searchType === 'name') {
      matchesSearch = `${user.name.first.toLowerCase()} ${user.name.last.toLowerCase()}`.includes(searchLower);
    } else if (searchType === 'phone') {
      matchesSearch = user.cell.includes(searchLower);
    } else if (searchType === 'email') {
      matchesSearch = user.email.toLowerCase().includes(searchLower);
    } else if (searchType === 'dob') {
      matchesSearch = new Date(user.dob.date).toLocaleDateString() === searchLower;
    }

    return matchesCity && matchesGender && matchesSearch;

  })/* .slice((page - 1) * 50, page * 50) */;


  useEffect(() => {
    setLoading(true);
    const cachedUsers = localStorage.getItem(`users-page-${page}`);
    if (cachedUsers) {
      const users = JSON.parse(cachedUsers);
      setUsers(users);
      setNoRecords(users.length === 0);
      setLoading(false);
    } else {
      fetchUsers();
    }
  }, [page]);

  useEffect(() => {
    setNoRecords(filteredUsers.length === 0);
  }, [filteredUsers]);

  const handleExportFormatSelect = (format: string) => {
    setExportFormat(format);
    setShowExportFormatModal(false);
    exportData(format, users);
  };

  const handleCheckboxChange = (user: User, checked: boolean) => {
    setSelectedUsers(prevSelected => {
      if (checked) {
        return [...prevSelected, user];
      } else {
        return prevSelected.filter(u => u !== user);
      }
    });
  };

  const handleEditClick = () => {
    if (selectedUsers.length === 1) {
      setEditUser(selectedUsers[0]);
      setShowEditModal(true);
    } else {
      alert('Solo se puede editar un usuario a la vez');
    }
  };

  const handleDeleteClick = () => {
    if (selectedUsers.length > 0) {
      const userNames = selectedUsers.map(user => `${user.name.first} ${user.name.last}`);
      Swal.fire({
        title: 'Eliminar Usuarios',
        text: `Esta seguro que desea eliminar los siguientes registros?\n${userNames.join('\n')}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      }).then(result => {
        if (result.isConfirmed) {
          const remainingUsers = users.filter(user => !selectedUsers.includes(user));
          setUsers(remainingUsers);
          setSelectedUsers([]);
          Swal.fire('Eliminar!', 'El usuario seleccionado ha sido eliminado.', 'success');
        }
      });
    } else {
      alert('Por favor selecciona uno o mas usuarios para eliminar');
    }
  };

  const handleEditSave = (updatedUser: User) => {
    const updatedUsers = users.map(user => user === editUser ? updatedUser : user);
    setUsers(updatedUsers);
    setShowEditModal(false);
  };

  return (
    <div className="container">
      <section className="table__header">
        <div className="head__title">
          <h1>Tabla de Clientes</h1>
          <Logout></Logout>
        </div>

        <div className='header-table-group'>
          <div className="button-group">
            <button className="btn btn-primary me-2" onClick={toggleFilters}><BsSliders /> Filtros</button>
            <button className="btn btn-warning me-2"
              onClick={handleEditClick}> <FaUserEdit /> Editar</button>
            <DeleteConfirmation
              users={selectedUsers.map(user => `${user.name.first} ${user.name.last}`)}
              onConfirm={handleDeleteClick} />
          </div>
          <div className="btn-group">
            <button className="btn btn-secondary" onClick={() => setShowExportFormatModal(true)}>
              Exportar
            </button>
          </div>
        </div>

        {/* Export Format Modal */}
        <ExportFormatModal
          show={showExportFormatModal}
          filteredUsers={filteredUsers}
          onHide={() => setShowExportFormatModal(false)}
          onFormatSelect={handleExportFormatSelect}
        />


        {showFilters && (
          <section className="table__filters">
            <div className="filter-group d-flex">
              <div className="w-50 pe-2">
                <select
                  className="form-select mb-2"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                >
                  <option value="">Todas las ciudades</option>
                  {users
                    .map(user => user.location.state)
                    .filter((value, index, self) => self.indexOf(value) === index) // Elimina duplicados
                    .filter(city => city.toLowerCase().includes(searchCity.toLowerCase()))
                    .map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))}
                </select>
              </div>
              <div className="w-50 ps-2">
                <select
                  className="form-select mb-2"
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                >
                  <option value="">Ambos géneros</option>
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
              </div>
            </div>
          </section>
        )}

        <div className="input-group">
          <input
            type="search"
            className="form-control"
            placeholder={`Buscar por ${searchType === 'name' ? 'nombre' : searchType === 'phone' ? 'teléfono' : searchType === 'email' ? 'correo' : 'fecha de nacimiento (MM/DD/AAAA)'}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <span className="input-group-text">
            <img src={search} alt="Search icon" />
          </span>
          <select
            className="form-select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="name">Nombre</option>
            <option value="phone">Teléfono</option>
            <option value="email">Correo</option>
            <option value="dob">Fecha de Nacimiento</option>
          </select>
        </div>

      </section >

      <section className="table__body">
        {loading ? (
          <div className="d-flex justify-content-center my-4">
            <div className="spinner"></div>
          </div>
        ) : noRecords ? (
          <div className="no-records">No se obtuvieron registros</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th className='column-th'> </th>
                <th className='column-th'> Perfil</th>
                <th className='column-th' onClick={() => handleSort('name')}> Nombres {sortColumn === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                <th className='column-th' onClick={() => handleSort('email')}> Correo {sortColumn === 'email' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                <th className='column-th' onClick={() => handleSort('gender')}> Sexo {sortColumn === 'gender' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                <th className='column-th' onClick={() => handleSort('location')}> Ubigeo {sortColumn === 'location' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                <th className='column-th' onClick={() => handleSort('dob')}> F. Nacimiento {sortColumn === 'dob' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                <th className='column-th' onClick={() => handleSort('cell')}> Celular {sortColumn === 'cell' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td className='row-td'>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user)}
                      onChange={(e) => handleCheckboxChange(user, e.target.checked)}
                    /></td>
                  <td className='row-td'><img src={user.picture.thumbnail} alt="User thumbnail" /></td>
                  <td className='row-td'>{user.name.title} {user.name.first} {user.name.last}</td>
                  <td className='row-td'>{user.email}</td>
                  <td className='row-td'>{user.gender === 'female' ? 'Mujer' : 'Hombre'}</td>

                  <td className='row-td'>{user.location.state}, {user.location.country}</td>
                  <td className='row-td'>{new Date(user.dob.date).toLocaleDateString()}</td>
                  <td className='row-td'>{user.cell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <div className="d-flex justify-content-between my-4">
        <button
          className="btn btn-secondary"
          onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>Página {page}</span>
        <button
          className="btn btn-secondary"
          onClick={() => setPage(prevPage => prevPage + 1)}
        >
          Siguiente
        </button>
      </div>
      <EditUserModal
        show={showEditModal}
        user={editUser}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditSave}
      />
    </div >
  );
}
