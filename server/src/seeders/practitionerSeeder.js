const Practitioner = require('../models/Practitioner');

const practitioners = [
  { nik: '7209061211900001', name: 'dr. Alexander', ihsNumber: '10009880728' },
  { nik: '3322071302900002', name: 'dr. Yoga Yandika, Sp.A', ihsNumber: '10006926841' },
  { nik: '3171071609900003', name: 'dr. Syarifuddin, Sp.Pd.', ihsNumber: '10001354453' },
  { nik: '3207192310600004', name: 'dr. Nicholas Evan, Sp.B.', ihsNumber: '10010910332' },
  { nik: '6408130207800005', name: 'dr. Dito Arifin, Sp.M.', ihsNumber: '10018180913' },
  { nik: '3217040109800006', name: 'dr. Olivia Kirana, Sp.OG', ihsNumber: '10002074224' },
  { nik: '3519111703800007', name: 'dr. Alicia Chrissy, Sp.N.', ihsNumber: '10012572188' },
  { nik: '5271002009700008', name: 'dr. Nathalie Tan, Sp.PK.', ihsNumber: '10018452434' },
  { nik: '3313096403900009', name: 'Sheila Annisa S.Kep', ihsNumber: '10014058550' },
  { nik: '3578083008700010', name: 'apt. Aditya Pradhana, S.Farm.', ihsNumber: '10001915884' }
];

const seedPractitioners = async () => {
  try {
    const count = await Practitioner.count();
    if (count === 0) {
      await Practitioner.bulkCreate(practitioners);
      console.log(`[DB] Seeder: 10 practitioner berhasil ditambahkan.`);
    }
  } catch (error) {
    console.error('[DB] Gagal menjalankan seeder practitioner:', error.message);
  }
};

module.exports = seedPractitioners;
