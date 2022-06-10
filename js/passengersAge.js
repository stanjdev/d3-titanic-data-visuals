export default async function passengersAge(data) {
  const width = 600;
  const height = 300;
  const margin = 40;
  // console.log(data[0].fields.sex);

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

 const subgroups = ['survived', 'notSurvived', ];
 
 const ages = ageData.map((obj) => obj.ageRange)

  // // Make a scale to set the color
  // const colorScale = d3.scaleSequential()
  //   .domain([0, 2])
  //   .interpolator(d3.interpolateRainbow);

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#377eb8', '#e41a1c',])
  
  const xscale = d3.scaleBand()
    .domain(ages)
    .range([margin, width + margin])
    .padding(0.05) // space between bars

  // yscale
  const popExtent = d3.extent(ageData, d => d.total)
  const yscale = d3.scaleLinear()
    .domain(popExtent)
    // .domain([0, 240])
    .range([height, margin])


  const svg = d3.select('#svg_age');

  const title = svg
  .append('g')

  title
    .append('text')
    .text('Survivors and Casualties Grouped By Age Aboard the Titanic')
    .attr('transform', `translate(${width / 2 - 185}, 20)`)
    .attr('class', 'labelText')

  // axis generator using the xscale to configure it
  const bottomAxis = d3.axisBottom(xscale)
    .tickFormat((d) => `${d} - ${d + 9}`)

  svg
    .append('g')
    .attr('transform', `translate(${0}, ${height})`)
    .call(bottomAxis)

  const leftAxis = d3.axisLeft(yscale)

  svg
    .append('g')
    .attr('transform', `translate(${margin}, 0)`)
    .call(leftAxis)


    const stackedData = d3.stack()
      .keys(subgroups)(ageData)

    svg.append('g')
      .selectAll('g')
      .data(stackedData)
      .enter()
      .append('g')
        .attr('fill', (d, i) => color(i))
        .selectAll('rect')
        .data((d) => d)
        .enter().append('rect')
          .attr("x", (d) => xscale(d.data.ageRange))
          .attr("y", (d) => yscale(d[1]))
          .attr('height', (d) => yscale(d[0]) - yscale(d[1]))
          .attr('width', xscale.bandwidth())


    const labels = svg
      .append('g')

    labels
      .selectAll('circle')
      .data(subgroups)
      .enter()
      .append('circle')
      .attr('r', '5')
      .attr('cx', width - 100)
      .attr('cy', (d, i) => (i * 20) + 55)
      .attr('fill', (d, i) => color(i))
      // .attr('fill', (d, i) => colorScale(i))

    labels
      .selectAll('text')
      .data(subgroups)
      .enter()
      .append('text')
      .text((d) => `${d[0].toUpperCase() + d.slice(1)}`)
      .attr('x', width - 85)
      .attr('y', (d, i) => (i * 20) + 60)
      .attr('class', 'labelText')







  // const barGroupSurvived = svg.append('g')
  
  // barGroupSurvived
  //   .selectAll('rect')
  //   .data(ageData)
  //   .enter()
  //   .append('rect')
  //   .attr('class', 'bar')
  //   .attr('x', (d) => xscale(d.ageRange))
  //   .attr('y', (d) => yscale(d.survived))
  //   .attr('width', xscale.bandwidth())
  //   .attr('height', (d) => height - yscale(d.survived))
  //   .attr('fill', (d, i) => color(i))


};

    