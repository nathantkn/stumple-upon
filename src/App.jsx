import { useState, useEffect } from 'react';
import './App.css';
import Gallery from './components/Gallery';

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const playlistId = "5ylFqY8I9ky9I21UWhOkL5";

function App() {
  const [songs, setSongs] = useState([]); 
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [accessToken, setAccessToken] = useState("");
  const [banList, setBanList] = useState([]);
  const [prevSongs, setPrevSongs] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const authParams = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body:
          "grant_type=client_credentials&client_id=" +
          clientId +
          "&client_secret=" +
          clientSecret,
      };

      try {
        const response = await fetch("https://accounts.spotify.com/api/token", authParams);
        const data = await response.json();
        setAccessToken(data.access_token);
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    getToken();
  }, []);

  const submitForm = (event) => {
    event.preventDefault();
  
    if (songs.length === 0) {
      makeQuery();
    } else {
      let nextIndex = currentSongIndex;
  
      do {
        nextIndex = (nextIndex + 1) % songs.length;
  
        const currentSong = songs[nextIndex];
        const songAttributes = [
          ...currentSong.artists.map((artist) => artist.name),
          currentSong.explicit ? "Explicit" : "Clean",
          `${Math.ceil(currentSong.duration_ms / 60000)} min`,
        ];
  
        const hasBannedAttribute = songAttributes.some((attribute) =>
          banList.includes(attribute)
        );
  
        if (!hasBannedAttribute) {
          setPrevSongs((prevList) => [
            ...prevList,
            songs[currentSongIndex],
          ]);
          setCurrentSongIndex(nextIndex);
          return;
        }
      } while (nextIndex !== currentSongIndex); // Stop if we've looped through all songs
  
      alert("No songs available that match your preferences.");
    }
  };

  const makeQuery = async () => {
    if (!accessToken) {
      alert("Access token not available. Please wait and try again.");
      return;
    }

    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch playlist songs");
      }

      const data = await response.json();
      const tracks = data.items.map((item) => item.track);
      setSongs(tracks);
      setCurrentSongIndex(0);
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
      alert("Failed to fetch songs. Please try again.");
    }
  };

  const addToBanList = (attribute) => {
    if (!banList.includes(attribute)) {
      setBanList((prevList) => [...prevList, attribute]);
    }
  };

  return (
    <div>
      <div className="whole-page">
        <h1>Discover Weekly</h1>
        <h3>Your mixtape of weekly fresh music. Enjoy new music picked for you.</h3>

        <form onSubmit={submitForm}>
          <button type="submit" className="button">
            🔀 Discover
          </button>
        </form>
        <br />

        <div className="new-releases">
          {songs.length > 0 ? (
            <div className="album-container">
              <img
                src={songs[currentSongIndex].album.images[0]?.url}
                alt={songs[currentSongIndex].name}
                className="release-image-small"
              />
              <div className="track-info">
                <p><strong>{songs[currentSongIndex].name}</strong></p>
              </div>
                <div className="track-attributes">
                  <p><strong>Artists:</strong></p>
                  {songs[currentSongIndex].artists.map((artist) => (
                    <button
                      key={artist.id}
                      className="attribute-button"
                      onClick={() => addToBanList(artist.name)}
                    >
                      {artist.name}
                    </button>
                  ))}
                </div>
                <div className="track-attributes">
                  <p><strong>Attributes:</strong></p>
                  <button
                    className="attribute-button"
                    onClick={() => addToBanList(songs[currentSongIndex].explicit ? "Explicit" : "Clean")}
                  >
                    {songs[currentSongIndex].explicit ? "Explicit" : "Clean"}
                  </button>

                  <button
                    className="attribute-button"
                    onClick={() =>
                      addToBanList(`${Math.ceil(songs[currentSongIndex].duration_ms / 60000)} min`)
                    }
                  >
                    {Math.ceil(songs[currentSongIndex].duration_ms / 60000)} min
                  </button>
                </div>
            </div>
          ) : (
            <br />
          )}
        </div>
      </div>

      <div className="sideNav">
        <h2>Ban List</h2>
        <h4>Don't like an artist or an attribute? Click it to hide future suggestions.</h4>
        <ul>
          {banList.map((item, index) => (
            <button className='attribute-button' key={index}>{item}</button>
          ))}
        </ul>
      </div>

      <div className="history-sidebar">
        <Gallery songs={prevSongs} />
      </div>
    </div>
  );
}

export default App;
