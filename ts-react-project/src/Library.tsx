import React from 'react'
import { Information } from './model/library'

interface OwnProps {
    info: Information
}
const Library : React.FC<OwnProps> = ({info})=> {
    return(
        <div>{info.name}</div>
    )
}

export default Library