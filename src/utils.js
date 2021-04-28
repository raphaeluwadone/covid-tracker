import React from "react"
import numeral from "numeral"
import { Circle, Popup } from "react-leaflet"

const caseTypeColors = {
    cases: {
        hex: "#cc1034",
        multiplier: 300
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 400
    },
    deaths: {
        hex: "#ff0000",
        multiplier: 500
    },
    
}

export const sortData = (data) => {
    const sortedData = [...data]

    sortedData.sort((a, b) => {
        if(a.cases > b.cases) {
            return -1
        }else {
            return 1
        }
    })
    return sortedData
}

export const statsFormater = (stat) => (
    stat ?  `+${numeral(stat).format("0.0a")}` : + 0
)

export const showDataOnMap = (data, casesType = 'deaths') => (
    data.map(country => (
        <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.4}
        pathOptions={
            {
                color: caseTypeColors[casesType].hex,
                fillColor: caseTypeColors[casesType].hex
            }
        }
        radius={
            Math.sqrt(country[casesType]) * caseTypeColors[casesType].multiplier
        }
        >
            <Popup>
                <div className="info-container">
                    <div className="info-flag" style={{backgroundImage:`url(${country.countryInfo.flag})`}} />
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
)