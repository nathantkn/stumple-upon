const Gallery = ({ songs }) => {
    return (
      <div>
        <h2>Your Discovered Songs</h2>
        <div className="image-container">
          {songs && songs.length > 0 ? (
            songs.map((song, index) => (
              <li className="gallery" key={index}>
                <img
                  className="gallery-screenshot"
                  src={song.album.images[0]?.url}
                  alt={song.name}
                  width="200"
                />
                <p>{song.name}</p>
              </li>
            ))
          ) : (
            <div>
              <h3>You haven't discovered any songs yet.</h3>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default Gallery;