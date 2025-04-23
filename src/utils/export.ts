

// export const exportToCSV = (data: any[], filename: string) => {
//   const csv = Papa.unparse(data);
//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   saveAs(blob, `${filename}.csv`);
// };

// export const exportToExcel = (data: any[], filename: string) => {
//   const worksheet = XLSX.utils.json_to_sheet(data);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
//   // Generate buffer
//   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//   const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
//   saveAs(blob, `${filename}.xlsx`);
// };

// utils/export.ts
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export const exportToCSV = (data: any[], filename: string) => {
  try {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }


  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
  } catch (error) {
    console.error('Export to CSV failed:', error);
    alert('Export failed');
  }
};

// export const exportToCSV = (data: any[], filename: string) => {
//   const csv = convertToCSV(data);
//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   const url = URL.createObjectURL(blob);
//   link.setAttribute('href', url);
//   link.setAttribute('download', `${filename}.csv`);
//   link.style.visibility = 'hidden';
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// const convertToCSV = (objArray: any[]) => {
//   const array = [Object.keys(objArray[0])].concat(objArray.map(item => Object.values(item)));
//   return array.map(row => row.join(',')).join('\r\n');
// };


// export const exportToExcel = (data: any[], filename: string) => {
//   const worksheet = XLSX.utils.json_to_sheet(data);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
//   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//   const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
//   saveAs(blob, `${filename}.xlsx`);
// };
