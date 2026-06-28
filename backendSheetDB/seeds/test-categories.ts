export default {
  categories: Array.from({ length: 20 }, (_, i) => {
    const n = i + 1
    const label = `Test Category ${String(n).padStart(2, '0')}`
    return {
      name_en: label,
      name_km: label,
      status: n % 4 !== 0, // every 4th one inactive, for status-filter testing
      sort: 1000 + i, // well past any real category's sort, keeps these together at the end
      platform: [],
    }
  }),
}
