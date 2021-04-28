import React from 'react'
import {Card, CardContent, Typography} from '@material-ui/core'
import "./Infobox.css"

function InfoBox({title, cases, active, isRed, casesType, total, ...props}) {
    return (
        <Card onClick = {props.onClick} className={`infoBox ${active && `info--${casesType}`} ${!isRed && "infobox--green"}`}> 
        {/* &&  isRed ? "info--red" : active ? "infobox--selected" : "" */}
            <CardContent>
                <Typography color="textSecondary" className="infoBox__title">
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${!isRed && "infobox--green"}`}>{cases}</h2>
                <Typography color='textSecondary' className="infoBox__total">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
