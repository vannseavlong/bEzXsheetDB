const name = (label: string) => ({ name_en: label, name_km: label, type: 'FIXED', status: true })

export default {
  product_options: [
    // Flat & Shop House (shared by Cleaning and Deep Cleaning)
    name('Flat House (70m² – 100m²)'),
    name('Flat House (100m² – 150m²)'),
    name('Flat House (150m² – 200m²)'),
    name('Shop House (70m² – 100m²)'),
    name('Shop House (100m² – 150m²)'),
    name('Shop House (150m² – 200m²)'),

    // Condo & Apartment (shared by Cleaning and Deep Cleaning)
    name('1 Bedroom (28m² – 40m²)'),
    name('2 Bedroom (60m² – 90m²)'),
    name('3 Bedroom (95m² – 130m²)'),
    name('4 Bedroom (120m² – 150m²)'),
    name('Penthouse (150m² – 300m²)'),

    // Deep Cleaning - Villa
    name('Twin Villa (200m² – 250m²)'),
    name('Twin Villa (250m² – 300m²)'),
    name('Queen Villa (300m² – 350m²)'),
    name('Queen Villa (350m² – 400m²)'),
    name('King Villa (400m² – 450m²)'),
    name('King Villa (450m² – 500m²)'),

    // Upholstery - Baby Stroller (Pram)
    name('Single Stroller - Basic Clean'),
    name('Single Stroller - Deep Clean'),
    name('Twin Stroller - Basic Clean'),
    name('Twin Stroller - Deep Clean'),

    // Upholstery - Sofa (Felt/Fabric)
    name('1 Seater'),
    name('2 Seater'),
    name('3 Seater'),
    name('4 Seater'),
    name('5 - 7 Seater'),

    // Upholstery - Rug
    name('Small (60 × 90 cm)'),
    name('Runner (60 × 180cm to 80 × 300cm)'),
    name('Medium (120 × 170cm)'),
    name('Large (160 × 230cm)'),
    name('XL (200 × 300cm)'),
    name('XXL / Oversized (250 × 350cm)'),
    name('Round (Diameter: 100-200cm)'),

    // Upholstery - Carpet (wall to wall)
    name('Less than 50m²'),
    name('51m² to 75m²'),
    name('76m² to 100m²'),
    name('101m² to 150m²'),
    name('151m² to 200m²'),

    // Upholstery - Mattress
    name('Single (100 × 190 cm)'),
    name('Double (120 × 200cm)'),
    name('Queen (160 × 200 cm)'),
    name('King (180 × 200 cm)'),

    // Pest Control - Pest Spray & Fog
    name('Up to 70m²'),
    name('71m² to 100m²'),
    name('201m² to 250m²'),
    name('251m² to 300m²'),

    // Pest Control - Termite Extermination
    name('50m² - 100m²'),
    name('101m² - 150m²'),
    name('151m² - 200m²'),
    name('201m² - 250m²'),

    // Pest Control - Rats Extermination
    name('71m² - 150m² (4 boxes)'),
    name('151m² - 200m² (6 boxes)'),
    name('201m² - 250m² (8 boxes)'),

    // AC Cleaning - Aircon Cleaning
    name('1HP - 1.5HP'),
    name('2HP'),
    name('2.5HP'),
    name('Ceiling air conditioner'),

    // Washing Machine
    name('Top Load Machine Wash'),
    name('Front Load Machine Wash'),
  ],
}
