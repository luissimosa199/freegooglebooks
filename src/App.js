import { useState, useEffect } from "react";

function App() {
  // setting state object and variables

  let requestURL = "";

  const protostate = {
    input: "",
    nroResultados: "",
    nroPaginas: "",
    paginaActual: "",
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

  const [actPagination, setActPagination] = useState(false);
  const [state, newStates] = useState(protostate);

  // useEffect

  useEffect(() => {}, [state]);

  // API call

  const fetchData = (requestURL) => {
    fetch(requestURL)
      .then((response) =>
        response.json().then((response) => {
          newStates((prevState) => {
            return {
              ...prevState,
              nroResultados: response.totalItems,
              resultados: [...response.items],
              nroPaginas: Math.ceil(response.totalItems / 10),
            };
          });

          setActPagination(true);
        })
      )
      .catch((err) => console.log(err));
  };

  // function armar url

  function setURL(obj) {
    return (
      obj.url.base +
      obj.input.replace(" ", "+").toLowerCase() +
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
    if (state.input === "") {
      alert("?");
    } else {
      newStates((prevState) => {
        return {
          ...prevState,
          paginaActual: state.url.index + 1,
        };
      });

      requestURL = setURL(state);
      fetchData(requestURL);
    }
  };

  // handleChange

  function handleChange(e) {
    newStates((prevState) => {
      return {
        ...prevState,
        input: e.target.value,
      };
    });
  }

  // nextPage

  function nextPage() {
    if (state.nroPaginas === state.paginaActual) {
      alert("?");
    } else {
      window.scroll(0, 0);

      newStates((prevState) => {
        return {
          ...prevState,
          paginaActual: state.paginaActual + 1,
          url: {
            ...prevState.url,
            index: state.url.index + 10,
          },
        };
      });

      requestURL = setURL(state).replace(
        /Index=(\d+)/g,
        `Index=${state.url.index + 10}`
      );
      fetchData(requestURL);
    }
  }

  // prevPage

  function prevPage() {
    if (state.paginaActual === 1) {
      alert("?");
    } else {
      window.scroll(0, 0);

      newStates((prevState) => {
        return {
          ...prevState,
          paginaActual: state.paginaActual - 1,
          url: {
            ...prevState.url,
            index: state.url.index - 10,
          },
        };
      });

      requestURL = setURL(state).replace(
        /Index=(\d+)/g,
        `Index=${state.url.index - 10}`
      );
      fetchData(requestURL);
    }
  }

  return (
    <div className='App'>
      {/* HEADER COMPONENT */}

      <header>
        <div className='logo_container_outter'>
          <a href='https://luissimosa199.github.io/freegooglebooks/'>
            <div className='logo_container'>
              <div className='logo_letter_cont'>F</div>
              <div className='logo_letter_cont'>G</div>
              <div className='logo_letter_cont'>B</div>
            </div>
          </a>
        </div>
        {state.nroResultados && (
          <div className='nroResultados'>{`${state.nroResultados} resultados`}</div>
        )}
        <form>
          <input
            type='text'
            className='input'
            placeholder='Palabra clave'
            value={state.input}
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
          <ul>
            {state.resultados.map((elem) => {
              return (
                <li key={elem.id}>
                  <div className='card_book'>
                    <div className='card_book_textcont'>
                      <h2 className='card_book_title'>
                        {elem.volumeInfo.title}
                      </h2>
                      <p className='card_book_subtitle'>
                        {elem.volumeInfo.subtitle}
                      </p>
                      <p className='card_book_author'>
                        {elem.volumeInfo.authors}
                      </p>
                      <p className='card_book_date'>
                        {elem.volumeInfo.publishedDate}
                      </p>
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
            })}
          </ul>
        </div>

        {/* // */}

        {/* PAGINATION COMPONENT */}

        {actPagination && (
          <div className='pagination_container'>
            <button className='pag_btn prevPage' onClick={prevPage}>
              &lt;
            </button>
            <div className='pagination_text'>
              <p>{`Página ${state.paginaActual}`}</p>
              <p>{`${state.nroPaginas} paginas`}</p>
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
