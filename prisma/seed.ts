import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

const dbUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
const resolvedUrl = dbUrl.startsWith('file:.')
  ? 'file:' + path.resolve(process.cwd(), dbUrl.replace('file:', ''))
  : dbUrl
const adapter = new PrismaBetterSqlite3({ url: resolvedUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create admin user
  const hashedPassword = bcrypt.hashSync('admin123', 10)

  await prisma.adminUser.upsert({
    where: { email: 'admin@pulsedrive.ca' },
    update: {},
    create: {
      email: 'admin@pulsedrive.ca',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Seed vehicles from existing static data
  const vehicles = [
    {
      vin: '2T1BURHE0JC043821',
      make: 'Toyota', model: 'Camry', year: 2023, trim: 'XSE V6',
      bodyType: 'Sedan', drivetrain: 'FWD', fuelType: 'Gasoline',
      odometer: 18500, price: 34900,
      photos: JSON.stringify(['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80']),
      description: 'Stunning 2023 Toyota Camry XSE V6 with sport package. Low mileage, one owner, no accidents.',
      status: 'available', featured: true,
      features: JSON.stringify(['Heated Seats', 'Sunroof', 'Apple CarPlay', 'Blind Spot Monitor']),
      engine: '3.5L V6', transmission: '8-Speed Automatic', color: 'Midnight Black', doors: 4, seats: 5,
    },
    {
      vin: '1HGBH41JXMN109186',
      make: 'Honda', model: 'CR-V', year: 2022, trim: 'Sport AWD',
      bodyType: 'SUV', drivetrain: 'AWD', fuelType: 'Gasoline',
      odometer: 32000, price: 38500,
      photos: JSON.stringify(['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80']),
      description: '2022 Honda CR-V Sport AWD in excellent condition.',
      status: 'available', featured: true,
      features: JSON.stringify(['AWD', 'Heated Seats', 'Honda Sensing', 'Remote Start']),
      engine: '1.5L Turbocharged 4-Cylinder', transmission: 'CVT', color: 'Sonic Gray Pearl', doors: 4, seats: 5,
    },
    {
      vin: '5UXCR6C54KLL57892',
      make: 'BMW', model: 'X5', year: 2023, trim: 'xDrive40i',
      bodyType: 'SUV', drivetrain: 'AWD', fuelType: 'Gasoline',
      odometer: 12000, price: 79900,
      photos: JSON.stringify(['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80']),
      description: 'Pristine 2023 BMW X5 xDrive40i with M Sport Package.',
      status: 'available', featured: false,
      features: JSON.stringify(['M Sport Package', 'Panoramic Roof', 'Harman Kardon', 'Head-Up Display']),
      engine: '3.0L TwinPower Turbo', transmission: '8-Speed Automatic', color: 'Alpine White', doors: 4, seats: 5,
    },
    {
      vin: 'WAUZZZF45JA123456',
      make: 'Audi', model: 'Q7', year: 2022, trim: 'Progressiv',
      bodyType: 'SUV', drivetrain: 'AWD', fuelType: 'Gasoline',
      odometer: 28000, price: 68500,
      photos: JSON.stringify(['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80']),
      description: 'Elegant 2022 Audi Q7 Progressiv quattro AWD. 7-passenger luxury.',
      status: 'reserved', featured: false,
      features: JSON.stringify(['quattro AWD', '7-Passenger', 'Virtual Cockpit', 'Bang & Olufsen']),
      engine: '2.0L TFSI 4-Cylinder', transmission: '7-Speed S Tronic', color: 'Navarra Blue', doors: 4, seats: 7,
    },
    {
      vin: '1FTFW1EF5NKD44521',
      make: 'Ford', model: 'F-150', year: 2023, trim: 'Lariat SuperCrew',
      bodyType: 'Truck', drivetrain: '4WD', fuelType: 'Gasoline',
      odometer: 9500, price: 68900,
      photos: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80']),
      description: 'Nearly new 2023 Ford F-150 Lariat with 4WD.',
      status: 'available', featured: true,
      features: JSON.stringify(['4WD', 'FordPass Connect', '12" Touchscreen', '360 Camera']),
      engine: '3.5L EcoBoost V6', transmission: '10-Speed Automatic', color: 'Star White', doors: 4, seats: 6,
    },
    {
      vin: 'JTMRJREV0KD215634',
      make: 'Toyota', model: 'RAV4', year: 2023, trim: 'XLE Premium Hybrid',
      bodyType: 'SUV', drivetrain: 'AWD', fuelType: 'Hybrid',
      odometer: 15000, price: 47500,
      photos: JSON.stringify(['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80']),
      description: 'Fuel-efficient 2023 Toyota RAV4 Hybrid XLE Premium AWD.',
      status: 'available', featured: false,
      features: JSON.stringify(['Hybrid AWD', 'JBL Audio', 'Power Sunroof', 'Digital Rearview']),
      engine: '2.5L 4-Cylinder Hybrid', transmission: 'eCVT', color: 'Blueprint', doors: 4, seats: 5,
    },
    {
      vin: '5YJ3E1EA5KF303948',
      make: 'Tesla', model: 'Model 3', year: 2023, trim: 'Long Range AWD',
      bodyType: 'Sedan', drivetrain: 'AWD', fuelType: 'Electric',
      odometer: 22000, price: 54900,
      photos: JSON.stringify(['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80']),
      description: 'Premium 2023 Tesla Model 3 Long Range AWD. Zero emissions with 500+ km range.',
      status: 'available', featured: false,
      features: JSON.stringify(['Autopilot', 'Full Self-Driving', '15" Touchscreen', 'Glass Roof']),
      engine: 'Dual Motor Electric', transmission: 'Single-Speed', color: 'Pearl White', doors: 4, seats: 5,
    },
    {
      vin: '2C3CDZAT4KH654321',
      make: 'Dodge', model: 'Challenger', year: 2022, trim: 'R/T Scat Pack',
      bodyType: 'Coupe', drivetrain: 'RWD', fuelType: 'Gasoline',
      odometer: 19800, price: 59900,
      photos: JSON.stringify(['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80']),
      description: 'Powerful 2022 Dodge Challenger R/T Scat Pack with the legendary 392 HEMI.',
      status: 'sold', featured: false,
      features: JSON.stringify(['392 HEMI', 'Performance Pages', 'Brembo Brakes', 'Launch Control']),
      engine: '6.4L 392 HEMI V8', transmission: '8-Speed Automatic', color: 'TorRed', doors: 2, seats: 5,
    },
  ]

  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { vin: v.vin },
      update: {},
      create: v,
    })
  }

  // Sample leads
  const leads = [
    { name: 'Michael Chen', phone: '780-555-0101', email: 'michael@example.com', source: 'contact', status: 'new', vehicleInterest: '2022 Honda CR-V', message: 'Interested in test drive' },
    { name: 'Sarah Thompson', phone: '780-555-0102', email: 'sarah@example.com', source: 'financing', status: 'contacted', vehicleInterest: '2023 Toyota RAV4', message: 'Need financing info' },
    { name: 'James Okafor', phone: '780-555-0103', email: 'james@example.com', source: 'testdrive', status: 'negotiation', vehicleInterest: '2023 Ford F-150', message: 'Want to see the truck' },
    { name: 'Emily Rodriguez', phone: '780-555-0104', email: 'emily@example.com', source: 'contact', status: 'closed', vehicleInterest: '2022 Audi Q7', message: 'Purchased!' },
    { name: 'David Kim', phone: '780-555-0105', email: 'david@example.com', source: 'website', status: 'new', vehicleInterest: '2023 Tesla Model 3', message: 'EV inquiry' },
    { name: 'Anna Petrov', phone: '780-555-0106', email: 'anna@example.com', source: 'tradein', status: 'contacted', vehicleInterest: '2023 BMW X5', message: 'Trade-in + purchase' },
  ]

  for (const lead of leads) {
    await prisma.lead.create({ data: lead })
  }

  // Sample blog posts
  await prisma.blogPost.upsert({
    where: { slug: 'top-5-used-suvs-canadian-winters' },
    update: {},
    create: {
      title: 'Top 5 Used SUVs for Canadian Winters 2024',
      slug: 'top-5-used-suvs-canadian-winters',
      excerpt: 'Winter driving in Canada demands capable vehicles. We breakdown the best used SUVs.',
      content: 'Full article content here...',
      category: 'Buying Guides',
      image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
      published: true,
    },
  })

  await prisma.blogPost.upsert({
    where: { slug: 'canadian-auto-financing-taxes-explained' },
    update: {},
    create: {
      title: 'Understanding Canadian Auto Financing: GST, HST & PST Explained',
      slug: 'canadian-auto-financing-taxes-explained',
      excerpt: 'Confused by provincial taxes when buying a car? Our guide breaks it all down.',
      content: 'Full article content here...',
      category: 'Finance',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
      published: true,
    },
  })

  console.log('Database seeded successfully!')
  console.log('Admin login: admin@pulsedrive.ca')
  console.log('Password: admin123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
