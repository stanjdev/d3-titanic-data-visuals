export default async function passengersGender(data) {
  const width = 600;
  const height = 600;
  const margin = 40;
  // // Make a scale to set the color
  // const colorScale = d3.scaleSequential()
  //   .domain([0, 4])
  //   .interpolator(d3.interpolateRainbow);

  const pieGen = d3.pie().sort(null);

  const getPassengerByGender = (data, gender, status, color) => {
    const survived = status === 'Survived' ? 'Yes' : 'No';
    return {
      count: data.filter((passenger) => passenger.fields.sex === gender && passenger.fields.survived === survived).length,
      gender: gender,
      status: status,
      color: color
    }
  };

  const genderData = [
    getPassengerByGender(data, 'male', 'Survived', '#4dc322'),
    getPassengerByGender(data, 'male', 'Not Survived', '#bbf0a8'),
    getPassengerByGender(data, 'female', 'Not Survived', '#eebe90'),
    getPassengerByGender(data, 'female', 'Survived', '#e59448'),
  ]

  const arcData = pieGen(genderData.map((data) => data.count));
  const arcGen = d3.arc() // Make an arc generator
    .innerRadius(25) // Set the inner radius
    .outerRadius(200) // Set the outer radius
    .padAngle(0.01) // Set the gap between arcs
  
  const svg = d3.select('#svg_gender');
  
  // Append a group (<g>) to hold the arcs 
  const pieGroup = svg
    .append('g')
    // position the group in the center
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  const myColorScale = d3.scaleOrdinal().range(genderData.map((data) => data.color));

  const piePath = pieGroup
    .selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arcGen)
    .attr('fill', myColorScale)
    // .attr('fill', (d, i) => colorScale(i))

  const title = svg
    .append('g')
  
  title
    .append('text')
    .text('Survivors and Casualties By Gender Aboard the Titanic')
    .attr('transform', `translate(${width / 2 - 170}, 20)`)
    .attr('class', 'labelText')

  const labels = svg
    .append('g')

  labels
    .selectAll('circle')
    .data(genderData)
    .enter()
    .append('circle')
    .attr('r', '5')
    .attr('cx', 10)
    .attr('cy', (d, i) => (i * 20) + 55)
    .attr('fill', (d, i) => d.color)
    // .attr('fill', (d, i) => colorScale(i))

  labels
    .selectAll('text')
    .data(genderData)
    .enter()
    .append('text')
    .text((d) => `${d.gender[0].toUpperCase() + d.gender.slice(1)}, ${d.status}`)
    .attr('x', 23)
    .attr('y', (d, i) => (i * 20) + 60)
    .attr('class', 'labelText')

  const rLabels = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  const arcLabels = d3.arc()
    .outerRadius(160)
    .innerRadius(160)
  
  rLabels
    .selectAll('text')
    .data(genderData)
    .enter()
    .append('text')
    .text((d) => `${d.gender[0].toUpperCase() + d.gender.slice(1)}, ${d.status}, ${d.count}`)
    .attr('transform', (d, i) => `translate(${arcLabels.centroid(arcData[i])})`)
    .attr('text-anchor', 'middle')
    .attr('class', 'labelText')
};

