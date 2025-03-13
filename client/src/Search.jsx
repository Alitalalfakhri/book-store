import axios from 'axios';
import { useState , useEffect } from 'react';  
import {backendUrl} from './constant.js';
import './styles/Search.css';
export default function Search({searchValue}){

  const [results, setResults] = useState([]);

 useEffect(() => {
   async function fetchData(){
     const response = await axios.get(`${backendUrl}/search?name=${searchValue}`);
     
     setResults(response.data);
   }
   
   fetchData()
 } , [])

  function readMore(id){
    window.location.href = `/book/${id}`
  }

  
  return (
    <div>
      <h1>Search result for: {searchValue}</h1>
      <div className="books-container">
        {results.length > 0 ? (
          results.map((book) => (
            <div className="book-card-result" key={book.id}>
              <div className='bookImage'>
              <img  src={book.image} alt={`${book.name} image`} />
        
              </div>
              <div className='bookName'>
              <p>{book.name}</p>
              </div>
              <div>
                <p>price : {`$${(book.priceCents / 100).toFixed(2)} `}</p>
              </div>
             <div className='book-card-buttons'>
               <button className='buy-button'>buy</button>
               <button className='read-more-button' onClick={readMore}>read more</button>
             </div>
              
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}