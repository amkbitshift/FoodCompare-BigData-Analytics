import { dataService, LOCATIONS_LIST } from '../website/src/services/dataService.js';
for (const loc of LOCATIONS_LIST) {
  const items = dataService.getFoodItems({ location: loc.id });
  console.log(`Location [${loc.id.padEnd(12)}]: ${items.length} items`);
}
