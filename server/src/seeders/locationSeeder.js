const Location = require('../models/Location');

const locations = [
  { name: 'Ruang Poli Umum', locationId: 'a9f3c2d1-5e4b-4a7f-b123-8c0e1d2f3a4b' },
  { name: 'Ruang IGD', locationId: 'b8e2c1d0-4d3a-3b6e-a012-7b9d0c1e2f3a' },
  { name: 'Ruang Poli Gigi', locationId: 'c7d1b0c9-3c29-2a5d-9f01-6a8c9b0d1e2f' }
];

const seedLocations = async () => {
  try {
    const count = await Location.count();
    if (count === 0) {
      await Location.bulkCreate(locations);
      console.log(`[DB] Seeder: ${locations.length} location berhasil ditambahkan.`);
    }
  } catch (error) {
    console.error('[DB] Gagal menjalankan seeder location:', error.message);
  }
};

module.exports = seedLocations;
