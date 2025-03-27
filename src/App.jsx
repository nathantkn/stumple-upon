import { useState } from 'react'
import './App.css'
import APIForm from './components/APIForm.jsx';

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  // const [prevImages, setPrevImages] = useState([]);

  const submitForm = (event) => {
    event.preventDefault();
    makeQuery();
  }

  const makeQuery = () => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let fullURL = url_starter + inputs.url;

    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;

    callAPI(query).catch(console.error);
  }

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();

    if (json.url == null) {
      alert("Oops! Something went wrong with that query, let's try again!");
    }
    else {
      setCurrentImage(json.url);
      setPrevImages((images) => [...images, json.url]);
    }
  }

  return (
    <div>
      <div className="whole-page">
      <h1>Discover Weekly</h1>
      <h3>Your mixtape of weekly fresh music. Enjoy new music and deep cuts picked for you.</h3>

      <APIForm
        onSubmit={submitForm}
      />
      <br></br>

      {currentImage ? (
        <img
          className="screenshot"
          src={currentImage}
          alt="Screenshot returned"
        />
      ) : (
        <div> </div>
      )}
      </div>
      <div className="sideNav">
        <h2>Ban List</h2>
        <h4>Select an attribute in your listing to ban it</h4>
      </div>
      <div className="history-sidebar">
        <h2>Seen Tracks</h2>

      </div>
    </div>
  )
}

export default App
