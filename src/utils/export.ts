

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


// export.ts
export const printPatientRecord = (patient: any, appointments: any[] = [], admissions: any[] = []) => {
  if (!patient) {
    alert("No patient data to print");
    return;
  }

  const printContent = `
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 30px;">
      <!-- Hospital Name and Style -->
      <div style="text-align: center; background-color: skyblue; padding: 10px 0;">
        <h1 style="font-family: 'Arial', sans-serif; color: white;">Mediconnect</h1>
      </div>

      <!-- Patient Info Section -->
      <h2 style="color: #333;">Patient Medical Record</h2>
      <table style="width:100%; border-collapse: collapse; border: 1px solid #ccc;">
        <tr><td><strong>MRN:</strong></td><td>${patient.mrn}</td></tr>
        <tr><td><strong>Name:</strong></td><td>${patient.firstName} ${patient.lastName}</td></tr>
        <tr><td><strong>Date of Birth:</strong></td><td>${new Date(patient.dateOfBirth).toLocaleDateString()}</td></tr>
        <tr><td><strong>Gender:</strong></td><td>${patient.gender}</td></tr>
        <tr><td><strong>Contact:</strong></td><td>${patient.contactNumber}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${patient.email || 'N/A'}</td></tr>
        <tr><td><strong>Address:</strong></td><td>${patient.address}</td></tr>
        <tr><td><strong>Blood Group:</strong></td><td>${patient.bloodGroup || 'N/A'}</td></tr>
      </table>

      <!-- Medical Details -->
      <h2 style="color: #333;">Medical Details</h2>
      <p><strong>Allergies:</strong> ${patient.allergies || 'None reported'}</p>
      <p><strong>Medical History:</strong> ${patient.medicalHistory || 'None reported'}</p>

      <!-- Appointments Section -->
      <h2 style="color: #333;">Appointments</h2>
      <ul style="list-style-type: none; padding-left: 0;">
        ${appointments.length === 0 ? '<li>No appointments</li>' : appointments.map(app => `
          <li style="margin-bottom: 10px;">
            <strong>Date:</strong> ${new Date(app.date).toLocaleDateString()} at ${app.time}<br/>
            <strong>Status:</strong> ${app.status}, <strong>Type:</strong> ${app.type}<br/>
            <strong>Doctor ID:</strong> ${app.doctorId}<br/>
            <strong>Notes:</strong> ${app.notes || 'N/A'}
          </li>
        `).join('')}
      </ul>

      <!-- Admissions Section -->
      <h2 style="color: #333;">Admissions</h2>
      <ul style="list-style-type: none; padding-left: 0;">
        ${admissions.length === 0 ? '<li>No admissions</li>' : admissions.map(ad => `
          <li style="margin-bottom: 10px;">
            <strong>Admission Date:</strong> ${new Date(ad.admissionDate).toLocaleDateString()}<br/>
            <strong>Discharge Date:</strong> ${ad.dischargeDate ? new Date(ad.dischargeDate).toLocaleDateString() : 'Still admitted'}<br/>
            <strong>Bed ID:</strong> ${ad.bedId}, <strong>Status:</strong> ${ad.status}<br/>
            <strong>Diagnosis:</strong> ${ad.diagnosis || 'N/A'}<br/>
            <strong>Doctor ID:</strong> ${ad.doctorId}<br/>
            <strong>Notes:</strong> ${ad.notes || 'N/A'}
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  // Create print window and style it
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Patient Record</title>
        <style>
          @media print {
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              padding: 30px;
              margin: 0;
            }
            table, td {
              border: 1px solid #ccc;
              padding: 8px;
            }
            h1, h2 {
              color: #333;
            }
            ul {
              list-style-type: none;
              padding-left: 0;
            }
            li {
              margin-bottom: 10px;
            }
          }
        </style>
      </head>
      <body>
        ${printContent}
        <script>
          window.onload = function () {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
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
