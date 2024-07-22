import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface User {
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
interface ExportFormatModalProps {
    show: boolean;
    onHide: () => void;
    onFormatSelect: (format: string) => void;
}

const ExportFormatModal: React.FC<ExportFormatModalProps> = ({ show, onHide, onFormatSelect }) => {
    const [exportFormat, setExportFormat] = useState<string>('');


    const handleExport = () => {
        onFormatSelect(exportFormat);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Seleccione formato</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Check
                        type="radio"
                        label="CSV"
                        name="exportFormat"
                        value="CSV"
                        checked={exportFormat === 'CSV'}
                        onChange={(e) => setExportFormat(e.target.value)}
                    />
                    <Form.Check
                        type="radio"
                        label="JSON"
                        name="exportFormat"
                        value="JSON"
                        checked={exportFormat === 'JSON'}
                        onChange={(e) => setExportFormat(e.target.value)}
                    />
                    <Form.Check
                        type="radio"
                        label="Excel"
                        name="exportFormat"
                        value="Excel"
                        checked={exportFormat === 'Excel'}
                        onChange={(e) => setExportFormat(e.target.value)}
                    />
                    <Form.Check
                        type="radio"
                        label="PDF"
                        name="exportFormat"
                        value="PDF"
                        checked={exportFormat === 'PDF'}
                        onChange={(e) => setExportFormat(e.target.value)}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleExport}>
                    Descargar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ExportFormatModal;
