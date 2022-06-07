export default async function passengersAge(data) {
  const width = 600;
  const height = 300;
  const margin = 40;
  // console.log(data[0].fields.sex);
  // // Make a scale to set the color
  // const colorScale = d3.scaleSequential()
  //   .domain([0, 4])
  //   .interpolator(d3.interpolateRainbow);

  const getPassengersByAge = (data, ageRange) => {
    const ageData = [];
    const ages = data.map((passenger) => passenger.fields.age);
    const filteredAges = ages.filter((age) => age !== undefined);
    const maxAge = Math.max(...filteredAges);
    const numBuckets = Math.floor(maxAge / ageRange);

    for (let i = 0; i < numBuckets + 1; i++) {
      ageData.push({
        ageRange: i * ageRange,
        survived: 0,
        notSurvived: 0,
        total: 0
      })
    }

    const passengersWithAges = data.filter((passenger) => passenger.fields.age !== undefined);

    for (const passenger of passengersWithAges) {
      const age = passenger.fields.age;
      // find bucket they belong to
      const bucket = Math.floor(age / ageRange) * ageRange; // 10, 40, 0
      const index = ageData.findIndex((object) => object.ageRange === bucket)
      ageData[index].total += 1;
      passenger.fields.survived === "Yes" ? ageData[index].survived += 1 : ageData[index].notSurvived += 1;
    }
    return ageData;
  };
  
  const ageData = getPassengersByAge(data, 10);
  console.log(ageData);

  /* 
    [
      {
        ageRange: 0,
        survived: 430,
        notSurvived: 114,
        total: 544
      },
      {
        ageRange: 10,
        survived: 310,
        notSurvived: 102,
        total: 412
      },
    ]
  */

  const xscale = d3.scaleBand()
    .domain(ageData.map((d) => d.ageRange))
    .range([margin, width + margin])
    .padding(0.05) // space between bars

  // yscale
  const popExtent = d3.extent(ageData, d => d.total)
  const yscale = d3.scaleLinear()
    .domain(popExtent)
    .range([height, margin])


  const svg = d3.select('#svg_age');

  const title = svg
  .append('g')

  title
    .append('text')
    .text('Survivors and Casualties By Grouped By Age')
    .attr('transform', `translate(${width / 2 - 170}, 20)`)
    .attr('class', 'labelText')

  const barGroup = svg.append('g');
  barGroup
    .selectAll('rect')
    .data(ageData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => xscale(d.ageRange))
    .attr('y', (d) => yscale(d.total))
    .attr('width', xscale.bandwidth())
    .attr('height', (d) => height - yscale(d.total))






  // const pieGen = d3.pie().sort(null);

  // const getPassengerByGender = (data, gender, status, color) => {
  //   const survived = status === 'Survived' ? 'Yes' : 'No';
  //   return {
  //     count: data.filter((passenger) => passenger.fields.sex === gender && passenger.fields.survived === survived).length,
  //     gender: gender,
  //     status: status,
  //     color: color
  //   }
  // };

  // const genderData = [
  //   getPassengerByGender(data, 'male', 'Survived', '#4dc322'),
  //   getPassengerByGender(data, 'male', 'Not Survived', '#bbf0a8'),
  //   getPassengerByGender(data, 'female', 'Not Survived', '#eebe90'),
  //   getPassengerByGender(data, 'female', 'Survived', '#e59448'),
  // ]

  // const arcData = pieGen(genderData.map((data) => data.count));
  // const arcGen = d3.arc() // Make an arc generator
  //   .innerRadius(25) // Set the inner radius
  //   .outerRadius(200) // Set the outer radius
  //   .padAngle(0.01) // Set the gap between arcs

  
  // // Append a group (<g>) to hold the arcs 
  // const pieGroup = svg
  //   .append('g')
  //   // position the group in the center
  //   .attr('transform', `translate(${width / 2}, ${height / 2})`)

  // const myColorScale = d3.scaleOrdinal().range(genderData.map((data) => data.color));

  // const piePath = pieGroup
  //   .selectAll('path')
  //   .data(arcData)
  //   .enter()
  //   .append('path')
  //   .attr('d', arcGen)
  //   .attr('fill', myColorScale)
  //   // .attr('fill', (d, i) => colorScale(i))

  // const labels = svg
  //   .append('g')

  // labels
  //   .selectAll('circle')
  //   .data(genderData)
  //   .enter()
  //   .append('circle')
  //   .attr('r', '5')
  //   .attr('cx', 10)
  //   .attr('cy', (d, i) => (i * 20) + 55)
  //   .attr('fill', (d, i) => d.color)
  //   // .attr('fill', (d, i) => colorScale(i))

  // labels
  //   .selectAll('text')
  //   .data(genderData)
  //   .enter()
  //   .append('text')
  //   .text((d) => `${d.gender[0].toUpperCase() + d.gender.slice(1)}, ${d.status}`)
  //   .attr('x', 23)
  //   .attr('y', (d, i) => (i * 20) + 60)
  //   .attr('class', 'labelText')

  // const rLabels = svg
  //   .append('g')
  //   .attr('transform', `translate(${width / 2}, ${height / 2})`)

  // const arcLabels = d3.arc()
  //   .outerRadius(160)
  //   .innerRadius(160)
  
  // rLabels
  //   .selectAll('text')
  //   .data(genderData)
  //   .enter()
  //   .append('text')
  //   .text((d) => `${d.gender[0].toUpperCase() + d.gender.slice(1)}, ${d.status}, ${d.count}`)
  //   .attr('transform', (d, i) => `translate(${arcLabels.centroid(arcData[i])})`)
  //   .attr('text-anchor', 'middle')
  //   .attr('class', 'labelText')
};

    