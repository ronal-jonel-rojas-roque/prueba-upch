import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

export const exportData = (type: string, users: User[]) => {
    const data = users.map(user => ({
      Nombres: `${user.name.title} ${user.name.first} ${user.name.last}`,
      Correo: user.email,
      Sexo: user.gender === 'female' ? 'Mujer' : 'Hombre',
      Ubigeo: `${user.location.state}, ${user.location.country}`,
      'F. Nacimiento': new Date(user.dob.date).toLocaleDateString(),
      Celular: user.cell
    }));
  
    if (type === 'CSV') {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'users.csv');
    } else if (type === 'JSON') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      saveAs(blob, 'users.json');
    } else if (type === 'Excel') {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
      XLSX.writeFile(workbook, 'users.xlsx');
    } else if (type === 'PDF') {
      const doc = new jsPDF();
      (doc as any).autoTable({ head: [Object.keys(data[0])], body: data.map(Object.values) });
      doc.save('users.pdf');
    }
  };