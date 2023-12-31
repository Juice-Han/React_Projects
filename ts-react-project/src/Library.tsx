import React from 'react'
import { Data } from './model/library'

interface OwnProps {
    data : Data;
}

const Library: React.FC<OwnProps> = ({data})=> {
    const books = data.books.map((book) => {
        return(
            <div className='book-info'>
                <div className='book-info_name'>제목: {book.name}</div>
                <button>대출</button>
            </div>
        )
    })
    return(
        <div>{books}</div>
    )
}

export default Library