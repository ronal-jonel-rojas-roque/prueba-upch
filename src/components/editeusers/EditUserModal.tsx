import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

interface EditUserModalProps {
    show: boolean;
    user: User | null;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
}

interface User {
    picture: {
        thumbnail: string;
    };
    name: {
        title: string;
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
    };
    dob: {
        date: string;
    };
    gender: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ show, user, onClose, onSave }) => {
    const [updatedUser, setUpdatedUser] = useState<User | null>(user);

    useEffect(() => {
        setUpdatedUser(user);
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (updatedUser) {
            const { name, value } = e.target;
            setUpdatedUser(prev => prev ? {
                ...prev,
                [name]: value,
            } : null);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'title' | 'first' | 'last') => {
        if (updatedUser) {
            setUpdatedUser(prev => prev ? {
                ...prev,
                name: {
                    ...prev.name,
                    [field]: e.target.value
                }
            } : null);
        }
    };


    const handleSave = () => {
        if (user && updatedUser) {
            Swal.fire({
                title: 'Confirmar cambios',
                html: `
                    <div style="display: flex; justify-content: space-between;">
                        <div>
                            <p><strong>Original:</strong></p>
                            <p>${user.name.first} ${user.name.last}</p>
                            <p>${user.email}</p>
                            <p>${user.cell}</p>
                        </div>
                        <div>
                            <p><strong>Updated:</strong></p>
                            <p>${updatedUser.name.first} ${updatedUser.name.last}</p>
                            <p>${updatedUser.email}</p>
                            <p>${updatedUser.cell}</p>
                        </div>
                    </div>
                `,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel'
            }).then(result => {
                if (result.isConfirmed) {
                    onSave(updatedUser);
                    onClose();
                }
            });
        }
    };

    if (!show || !updatedUser) return null;

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {updatedUser && (
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={updatedUser.name.title}
                                onChange={(e) => handleNameChange(e as React.ChangeEvent<HTMLInputElement>, 'title')}
                            />
                        </Form.Group>
                        <Form.Group controlId="formFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="first"
                                value={updatedUser.name.first}
                                onChange={(e) => handleNameChange(e as React.ChangeEvent<HTMLInputElement>, 'first')}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="last"
                                value={updatedUser.name.last}
                                onChange={(e) => handleNameChange(e as React.ChangeEvent<HTMLInputElement>, 'last')}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={updatedUser.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="cell"
                                value={updatedUser.cell}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLocation">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                value={updatedUser.location.state}
                                onChange={handleInputChange}
                                placeholder="Type to search cities..."
                            />
                        </Form.Group>
                        <Form.Group controlId="formDob">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="text"
                                name="dob"
                                value={new Date(updatedUser.dob.date).toLocaleDateString()}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditUserModal;
