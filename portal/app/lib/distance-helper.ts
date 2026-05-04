import axios from 'axios';

export async function getRoadDistance({
  lat1,
  lon1,
  lat2,
  lon2
}: {
  lat1: string;
  lon1: string;
  lat2: string;
  lon2: string;
}) {
  const apiKey = import.meta.env.VITE_HEIGIT_KEY;
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${lon1},${lat1}&end=${lon2},${lat2}`;

  const res = await axios.get(url);
  const route = res.data.features[0].properties.summary;

  console.log(`Distance: ${(route.distance / 1000).toFixed(2)} km`);
  console.log(`Duration: ${(route.duration / 60).toFixed(1)} minutes`);
}
