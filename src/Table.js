import React from 'react'
import { TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import numeral from 'numeral';

function Tables({ countries }) {

    return (
        <div className="table" >
                {countries.map(({country, cases}) => (
                    <tr>
                        <TableCell>{country}</TableCell>
                        <TableCell><strong>{numeral(cases).format(0,0)}</strong></TableCell>    
                    </tr>
                ))}
        </div>
    )
}

export default Tables
