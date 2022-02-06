import { useState } from "react";

function App() {
  // setting state object and variables
  const input = document.querySelector(".input");
  let requestURL = "";

  const state = {
    input: "",
    nroResultados: "",
    nroPaginas: "",
    paginaActual: "",
    searchTerm: "",
    resultados: [],
    url: {
      base: `https://www.googleapis.com/books/v1/volumes?q=`,
      startIndex: `&startIndex=`,
      index: 0,
      maxResults: `&maxResults=`,
      nroMaxResult: 10,
      filter: `&filter=free-ebooks`,
      key: "&key=AIzaSyDNjXYqYUkAsf7ur-XDGVRL6UFlWHfIZMQ",
    },
  };

  // useState

  const [results, setResults] = useState("");
  const [nroResults, setNroResults] = useState("");
  const [nroPages, setNroPages] = useState("");
  const [currPage, setCurrPage] = useState("");
  const [actPagination, setActPagination] = useState(false);
  const [newState, setNewState] = useState(null);
  const [term, setTerm] = useState('');

  // API call

  const fetchData = (requestURL) => {
    fetch(requestURL)
      .then((response) =>
        response.json().then((response) => {
          state.nroResultados = response.totalItems;
          setNroResults(`${state.nroResultados} resultados`);
          state.resultados = [...response.items];
          state.nroPaginas = Math.ceil(state.nroResultados / 10);
          setNroPages(`${state.nroPaginas} páginas`);      
          setActPagination(true);
          setNewState(state);
          setResults(mapedResults());
        })
      )
      .catch((err) => console.log(err));
  };

  // function armar url

  function setURL(obj) {
    return (
      obj.url.base +
      obj.searchTerm +
      obj.url.startIndex +
      obj.url.index +
      obj.url.maxResults +
      obj.url.nroMaxResult +
      obj.url.filter +
      obj.url.key
    );
  }

  // handleClick

  const handleClick = () => {
    if (inputValue === "") {
      alert("?");
    } else {
      state.input = inputValue;
      state.searchTerm = input.value.replace(" ", "+").toLowerCase();
      setInputValue("");
      state.nroResultados = "";
      state.resultados = [];
      requestURL = setURL(state);
      state.paginaActual = state.url.index + 1;
      setCurrPage(`Página ${state.paginaActual}`);
      fetchData(requestURL);
      setTerm(inputValue)
      input.value = "";
    }
  };

  // handleChange

  const [inputValue, setInputValue] = useState(state.input);

  function handleChange(e) {
    setInputValue(e.target.value);
  }

  // nextPage

  function nextPage() {
    window.scroll(0,0)

    newState.input = term;

    newState.searchTerm = newState.input.replace(" ", "+").toLowerCase();
    newState.url.index = parseInt(currPage.match(/\d+/g)[0]);
    setCurrPage(`Página ${newState.url.index + 1}`);

    let newURL = setURL(newState);
    
    fetchData(newURL);
  }

  // prevPage

  function prevPage() {
    
    if(parseInt(currPage.match(/\d+/g)[0]) === 1){
      alert('?')
    } else {
      window.scroll(0,0)

      newState.input = term;

      newState.searchTerm = newState.input.replace(" ", "+").toLowerCase();
      newState.url.index = parseInt(currPage.match(/\d+/g)[0] - 2);
      setCurrPage(`Página ${currPage.match(/\d+/g)[0] - 1}`);

      let newURL = setURL(newState);
      
      fetchData(newURL);
    }
  }

  // map results

  function mapedResults() {
    let books = state.resultados.map((elem) => {
      return (
        <li key={elem.id}>
          <div className='card_book'>
            <div className='card_book_textcont'>
              <h2 className='card_book_title'>{elem.volumeInfo.title}</h2>
              <p className='card_book_subtitle'>{elem.volumeInfo.subtitle}</p>
              <p className='card_book_author'>{elem.volumeInfo.authors}</p>
              <p className='card_book_date'>{elem.volumeInfo.publishedDate}</p>
              <a
                className='btn card_book_btn'
                href={elem.volumeInfo.previewLink}>
                Leer
              </a>
            </div>
            <img
              className='card_book_img'
              alt='book cover'
              loading='lazy'
              src={elem.volumeInfo.imageLinks.thumbnail}></img>
          </div>
        </li>
      );
    });

    return books;
  }

  return (
    <div className='App'>
      {/* HEADER COMPONENT */}

      <header>
        <div className='logo_container_outter'>
          <a href="http://localhost:3000/">
          <div className='logo_container'>
            <div className='logo_letter_cont'>F</div>
            <div className='logo_letter_cont'>G</div>
            <div className='logo_letter_cont'>B</div>
          </div>
          </a>
        </div>
        <div className='nroResultados'>{nroResults}</div>
        <div className="term">{term}</div>
        <form>
          <input
            type='text'
            className='input'
            placeholder='Palabra clave'
            value={inputValue}
            onChange={handleChange}
          />
          <button className='btn input_btn' type='button' onClick={handleClick}>
            B
          </button>
        </form>
      </header>

      {/* // */}

      <main>
        {/* RESULTS COMPONENT */}

        <div className='results_container'>
          <ul>{results}</ul>
        </div>

        {/* // */}

        {/* PAGINATION COMPONENT */}

        {actPagination && (
          <div className='pagination_container'>
            <button className='pag_btn prevPage' onClick={prevPage}>&lt;</button>
            <div className='pagination_text'>
              <p>{currPage}</p>
              <p>{nroPages}</p>
            </div>
            <button className='pag_btn nextPage' onClick={nextPage}>
              &gt;
            </button>
          </div>
        )}

        {/* // */}
      </main>
      {/* FOOTER COMPONENT */}

      <footer>
        <div className='footer_container'>
          <p>Desarrollado por Luis Simosa en 2022</p>
        </div>
      </footer>

      {/* // */}
    </div>
  );
}

export default App;
