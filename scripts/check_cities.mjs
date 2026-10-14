import { dataService, LOCATIONS_LIST } from '../website/src/services/dataService.js';
const items = dataService.getFoodItems({ category: 'all', platform: 'all' });
const cities = new Set(items.map(i => i.city));
console.log('Unique cities in catalog:', Array.from(cities));
console.log('LOCATIONS_LIST:', LOCATIONS_LIST);
