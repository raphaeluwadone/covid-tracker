import React, {useState, useEffect} from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'

const options = {
    legend: {
        display:false
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips : {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0.0")
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false

                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a")
                    }
                }
            }
        ]
    }
}


function LineGraph({casesType, ...props}) {

    // https://disease.sh/v3/covid-19/historical/all?lastdays=120
    const [data, setData] = useState({})

    const buildChartData = (data, casesType = 'cases') => {
        let chartData = []
        let lastDataPoint;
        for(let date in data[casesType]) {
            if(lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[casesType][date]
        }
        return chartData
    }

    useEffect( () => {
        const fetchData = async () => {
            const data = await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            const res = await data.json()
            const chartData = buildChartData(res)
            setData(chartData)
        }
        fetchData()
    }, [casesType])

    return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line 
                    options={options}
                    data={
                        {
                            datasets: [
                                {
                                    backgroundColor: "rgba(204, 16, 52, 0.5)",
                                    borderColor: "#cc1034",
                                    data: data,
                                }
                            ]
                        }
                    }  
                />
            )}
        </div>
    )
}

export default LineGraph
