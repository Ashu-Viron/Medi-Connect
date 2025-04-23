import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  
  // Create sample users (doctors)
  const users = [
    {
      id: 'user_2NNKm4a9XlUlcF1234567', // This would be a Clerk user ID in real app
      email: 'dr.smith@mediconnect.com',
      firstName: 'Emily',
      lastName: 'Smith',
      role: 'DOCTOR'
    },
    {
      id: 'user_2NNKm4a9XlUlcF7654321', // This would be a Clerk user ID in real app
      email: 'dr.johnson@mediconnect.com',
      firstName: 'Robert',
      lastName: 'Johnson',
      role: 'DOCTOR'
    },
    {
      id: 'user_admin123456789', // This would be a Clerk user ID in real app
      email: 'admin@mediconnect.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    },
    {
      id: 'user_receptionist123456789', // This would be a Clerk user ID in real app
      email: 'reception@mediconnect.com',
      firstName: 'Reception',
      lastName: 'Staff',
      role: 'RECEPTIONIST'
    },
  ];
  
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user
    });
  }
  
  console.log('✓ Users seeded');
  
  // Create sample patients
  const patients = [
    {
      mrn: 'MRN0001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1985-05-15'),
      gender: 'MALE',
      contactNumber: '+1234567890',
      address: '123 Main St, Springfield',
      bloodGroup: 'A+',
      allergies: 'Penicillin'
    },
    {
      mrn: 'MRN0002',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('1990-08-20'),
      gender: 'FEMALE',
      contactNumber: '+1987654321',
      address: '456 Oak St, Riverside',
      bloodGroup: 'O-'
    },
    {
      mrn: 'MRN0003',
      firstName: 'Robert',
      lastName: 'Johnson',
      dateOfBirth: new Date('1975-11-30'),
      gender: 'MALE',
      contactNumber: '+1122334455',
      address: '789 Pine St, Georgetown',
      medicalHistory: 'Hypertension, Diabetes Type 2'
    }
  ];
  
  for (const patient of patients) {
    await prisma.patient.upsert({
      where: { mrn: patient.mrn },
      update: patient,
      create: patient
    });
  }
  
  console.log('✓ Patients seeded');
  
  // Create sample beds
  const wards = ['GENERAL', 'ICU', 'EMERGENCY', 'PEDIATRIC', 'MATERNITY', 'PSYCHIATRIC'];
  
  for (let ward = 0; ward < wards.length; ward++) {
    for (let room = 1; room <= 5; room++) {
      const bedNumber = `${String.fromCharCode(65 + ward)}-${room}01`;
      await prisma.bed.upsert({
        where: { bedNumber },
        update: {
          ward: wards[ward],
          status: 'AVAILABLE'
        },
        create: {
          bedNumber,
          ward: wards[ward],
          status: 'AVAILABLE'
        }
      });
    }
  }
  
  console.log('✓ Beds seeded');
  
  // Create sample inventory items
  const inventoryItems = [
    {
      name: 'Paracetamol',
      category: 'MEDICINE',
      description: 'Pain reliever and fever reducer',
      unit: 'tablet',
      quantity: 500,
      reorderLevel: 100,
      cost: 0.5,
      supplier: 'MediSupply Inc.',
      expiryDate: new Date('2024-12-31'),
      location: 'Pharmacy'
    },
    {
      name: 'Surgical Gloves',
      category: 'SUPPLIES',
      description: 'Disposable latex gloves for medical procedures',
      unit: 'box',
      quantity: 50,
      reorderLevel: 20,
      cost: 10.5,
      supplier: 'MedEquip Co.',
      location: 'Main Storage'
    },
    {
      name: 'Blood Pressure Monitor',
      category: 'EQUIPMENT',
      description: 'Digital blood pressure monitoring device',
      unit: 'unit',
      quantity: 15,
      reorderLevel: 5,
      cost: 120.0,
      supplier: 'HealthTech Solutions',
      location: 'Equipment Room'
    }
  ];
  
  for (const item of inventoryItems) {
    await prisma.inventoryItem.create({
      data: item
    });
  }
  
  console.log('✓ Inventory items seeded');
  
  // Create sample appointments
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const patients1 = await prisma.patient.findMany();
  const doctors = await prisma.user.findMany({
    where: {
      role: 'DOCTOR'
    }
  });
  
  if (patients1.length > 0 && doctors.length > 0) {
    const appointments = [
      {
        patientId: patients1[0].id,
        doctorId: doctors[0].id,
        date: today,
        time: '09:30',
        status: 'SCHEDULED',
        type: 'GENERAL',
        queueNumber: 1
      },
      {
        patientId: patients1[1].id,
        doctorId: doctors[0].id,
        date: today,
        time: '10:15',
        status: 'SCHEDULED',
        type: 'FOLLOW_UP',
        queueNumber: 2
      },
      {
        patientId: patients1[2].id,
        doctorId: doctors[1].id,
        date: tomorrow,
        time: '14:00',
        status: 'SCHEDULED',
        type: 'SPECIALIST',
        queueNumber: 1
      }
    ];
    
    for (const appointment of appointments) {
      await prisma.appointment.create({
        data: appointment
      });
    }
    
    console.log('✓ Appointments seeded');
  }
  
  // Create sample admission
  const patients2 = await prisma.patient.findMany();
  const beds = await prisma.bed.findMany({
    where: {
      status: 'AVAILABLE'
    },
    take: 1
  });
  
  if (patients2.length > 0 && beds.length > 0 && doctors.length > 0) {
    // Update bed status
    await prisma.bed.update({
      where: {
        id: beds[0].id
      },
      data: {
        status: 'OCCUPIED',
        patientId: patients2[0].id,
        admissionDate: new Date()
      }
    });
    
    // Create admission
    await prisma.admission.create({
      data: {
        patientId: patients2[0].id,
        bedId: beds[0].id,
        doctorId: doctors[0].id,
        admissionDate: new Date(),
        diagnosis: 'Pneumonia',
        status: 'ACTIVE'
      }
    });
    
    console.log('✓ Admission seeded');
  }
  
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });