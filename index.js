import passengersGender from './js/passengersGender.js';
import passengersAge from './js/passengersAge.js';

async function handleData() {
  const data = await d3.json('titanic-passengers.json');
  passengersGender(data);
  passengersAge(data);
};

handleData();

