import { useState, useEffect, React, Component } from "react";
import axios from "axios";
import "./App.css";
import Modal from "react-modal";
import YouTube from "react-youtube";

function MovieList() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_MOVIEDB_URL}now_playing?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&append_to_response=videos`
      )
      .then((response) => {
        setMovies(response.data.results);
      });
  }, []);

  if (movies.length === 0) {
    return (
      <div className="movieItems">
        <p>Loading, please wait...</p>
      </div>
    );
  }
  if (!movies) {
    return (
      <div className="movieItems">
        <p>Can't load movies</p>
      </div>
    );
  } else {
    const movieItems = movies.map((movie, index) => (
      <MovieListItem key={index} movie={movie} />
    ));

    return <div className="movieItems">{movieItems}</div>;
  }
}

function MovieListItem(props) {
  const [movie, setMovie] = useState([]);
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  class Example extends Component {
    render() {
      const opts = {
        height: "490",
        width: "740",
        playerVars: {
          autoplay: 1,
        },
      };

      return (
        <YouTube
          videoId={movie.videos.results[0].key}
          opts={opts}
          onReady={this._onReady}
        />
      );
    }

    _onReady(event) {
      event.target.pauseVideo();
    }
  }

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_MOVIEDB_URL +
          props.movie.id +
          `?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&append_to_response=videos`
      )
      .then((response) => {
        setMovie(response.data);
      });
  }, [props.movie.id]);

  let IMAGEPATH = "http://image.tmdb.org/t/p/w500";
  let imageurl = IMAGEPATH + props.movie.poster_path;

  var genres = "";
  if (movie !== undefined && movie.genres !== undefined) {
    for (var i = 0; i < movie.genres.length; i++) {
      genres += movie.genres[i].name + " ";
    }
  }

  var video = "";
  if (
    movie !== undefined &&
    movie.videos !== undefined &&
    movie.videos.results[0] !== undefined
  ) {
    video = (
      <span
        style={{ color: "cyan", cursor: "pointer" }}
        onClick={() => movie.videos.results[0].key}
      >
        {movie.videos.results[0].name}
      </span>
    );
  }

  var rating = "";
  if (movie !== undefined && movie.vote_average !== undefined) {
    rating = <span>{movie.vote_average}</span>;
  }

  return (
    <>
      <div className="Movie">
        <img src={imageurl} alt="imgOfTheMovie" />
        <div className="infos">
          <h3 className="MovieTitle">{props.movie.original_title}</h3>
          <h4 className="MovieTitle">{props.movie.release_date}</h4>
          <br />
          <p className="MovieText">{props.movie.overview}</p>
          <span className="GenresText">Genres: {genres}</span>
          <span style={{ color: "#fff" }}>{rating} / 10</span>
          <span className="VideosText" onClick={openModal}>
            Video: {video}
          </span>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <button
              style={{ float: "right", marginBottom: "5px", cursor: "pointer" }}
              onClick={closeModal}
            >
              X
            </button>
            <Example />
          </Modal>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <h1>Now Playing - Movies</h1>
      <MovieList />
    </div>
  );
}
export default App;
