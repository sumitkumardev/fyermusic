const albumLElement = document.getElementById('albumL');
const albumSElement = document.getElementById('albumS');
// const play = document.getElementById("play");
const music = document.getElementById('audiosrc');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const progressBar = document.getElementById("progress-bar");
const seekBar = document.getElementById("seek");
let total_duration = document.getElementById("duration");
let current_time = document.getElementById("current-time");


const apiEndpoints = {
    homepage: 'https://saavn.me/modules?language=hindi,bhojpuri',
    search: 'https://saavn.me/search/songs?query=imagine+dragons',
    albums: 'https://saavn.me/search/albums?query=rockstar',
    albumsData: 'https://saavn.me/albums?id=',
    songurl: 'https://saavn.me/songs?id='
};

// Function to fetch data from a given API endpoint
async function fetchData(apiName) {
    try {
        const response = await fetch(apiEndpoints[apiName]);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${apiName}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}


//   // Example usage:
fetchData('homepage')
    .then(data => {
        // Do something with the data from the homepage API
        console.log(data);
    });



// Fetch data from the "homepage" API
fetchData('homepage')
    .then(homepageData => {
        // Check if there are albums in the response
        const albums = homepageData.data.albums;

        if (Array.isArray(albums) && albums.length > 0) {
            // Loop through the albums and create a div for each album
            albums.forEach(album => {
                const albumDiv = document.createElement('div');

                // Generate a unique ID based on the album's ID from the API
                const albumId = album.id;
                const uniqueId = `album-${albumId}`;
                albumDiv.id = uniqueId;

                albumDiv.classList.add('album');

                // Extract the album details
                const albumName = album.name;
                const albumImage = album.image[1].link; // Using the first image link
                const artists = album.artists;
                const language = album.language;

                // Create HTML elements with classes to display the data for the album
                const imageElement = document.createElement('img');
                imageElement.classList.add('album-image');
                imageElement.src = albumImage;

                // Create a custom div to wrap the image element
                const imagediv = document.createElement('div');
                imagediv.classList.add('thumbS');

                // Append the image element to the custom div
                imagediv.appendChild(imageElement);

                const albumTitle = document.createElement('h4');
                albumTitle.classList.add('song-name');
                albumTitle.textContent = `${albumName}`;

                const albumLang = document.createElement('div');
                albumLang.classList.add('song-lang');
                albumLang.textContent = `${language}`;

                const artistsList = document.createElement('ul');
                artistsList.classList.add('artistL');

                // Extract and display the artist names in <li> elements
                artists.forEach(artist => {
                    const artistName = artist.name;
                    const artistListItem = document.createElement('li');
                    artistListItem.textContent = artistName;
                    artistsList.appendChild(artistListItem);
                });

                const artistsdiv = document.createElement('div');
                artistsdiv.classList.add('artist', 'x-scroll');
                artistsdiv.appendChild(artistsList);


                const albumDetail = document.createElement('div');
                albumDetail.classList.add('albumDetail');
                const albumContent = document.createElement('div');
                albumContent.classList.add('albumContent');

                // Append the image element to the custom div
                albumContent.appendChild(albumTitle);
                albumDetail.appendChild(albumLang);
                albumDetail.appendChild(artistsdiv);
                albumContent.appendChild(albumDetail);

                // Append the elements to the album div
                albumDiv.appendChild(imagediv);
                albumDiv.appendChild(albumContent);

                // Add a click event listener to fetch data when the album div is clicked
                albumDiv.addEventListener('click', () => {
                    const apiEndpoint = apiEndpoints.albumsData + albumId;
                    // Fetch data with the album's ID from the API
                    fetch(apiEndpoint)
                        .then(response => response.json())
                        .then(albumData => {
                            // Clear the previously displayed songs
                            albumSElement.innerHTML = '';

                            // Check if there are songs in the response
                            const songsData = albumData.data.songs;

                            if (Array.isArray(songsData) && songsData.length > 0) {
                                // Loop through the songs and create a div for each song
                                songsData.forEach(song => {
                                    const songDiv = document.createElement('div');
                                    songDiv.classList.add('song');

                                    // Extract song details
                                    const songName = song.name;
                                    const songId = song.id;
                                    const songImage = song.image[1].link; // Using the first image link
                                    const songDuration = song.duration;
                                    const songLabel = song.label;
                                    const primaryArtist = song.primaryArtists;
                                    const explicitContent = song.explicitContent;

                                    // Create HTML elements with classes to display the data for the song
                                    const songNameElement = document.createElement('p');
                                    songNameElement.classList.add('song-name', 'C');
                                    songNameElement.textContent = `${songName}`;
                                    const uniqueIds = `song-${songId}`;
                                    songNameElement.id = uniqueIds;

                                    const songImageElement = document.createElement('img');
                                    songImageElement.classList.add('song-image');
                                    songImageElement.src = songImage;

                                    const songI = document.createElement('div');
                                    songI.classList.add('songI');
                                    songI.appendChild(songImageElement);

                                    songDiv.appendChild(songI);
                                    songDiv.appendChild(songNameElement);

                                    // Append the song div to the container
                                    albumSElement.appendChild(songDiv);


                                    // Add a click event listener to the songDiv elements
                                    songDiv.addEventListener('click', () => {
                                        const songUrl = apiEndpoints.songurl + songId;

                                        fetch(songUrl)
                                            .then(response => response.json())
                                            .then(songData => {
                                                console.log(songData);
                                                // Get the last download URL from the album data
                                                const lastDownloadUrl = songData.data[0].downloadUrl[songData.data[0].downloadUrl.length - 1];

                                                if (lastDownloadUrl) {
                                                    // Set the last download URL as the src attribute for the audio element
                                                    music.src = lastDownloadUrl.link;
                                                    playfunc();
                                                    

                                                } else {
                                                    console.error('Download URL not found.');
                                                }
                                            })
                                            .catch(error => {
                                                console.error(error);
                                            });
                                    });

                                });

                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                });


                // Append the album div to the body
                albumLElement.appendChild(albumDiv);
            });
        }
    })

    .catch(error => {
        console.error(error);
    });






    // music player funcs


    const playfunc = () => {
        music.play();
        playButton.style.display = "none";
        pauseButton.style.display = "inline-flex";
    };

    playButton.addEventListener('click', () => {
        music.play();
        playButton.style.display = "none";
        pauseButton.style.display = "inline-flex";
    });

    // Add click event listener to the pause button
    pauseButton.addEventListener('click', () => {
        music.pause();
        playButton.style.display = "inline-flex";
        pauseButton.style.display = "none";
    });

    seekBar.addEventListener("input", function () {
        const progress = seekBar.value / 100;
        music.currentTime = progress * music.duration;
    });

    seekBar.addEventListener("mouseup", function () {
        music.play();
    });

    music.addEventListener("timeupdate", function () {
        const {duration} = event.srcElement;
        const currentMinutes = Math.floor(music.currentTime / 60);
        const currentSeconds = Math.floor(music.currentTime % 60);
        const durationMinutes = Math.floor(music.duration / 60);
        const durationSeconds = Math.floor(music.duration % 60);
        current_time.innerHTML = currentMinutes + ":" + currentSeconds; 
        if(duration){
            total_duration.innerHTML = durationMinutes + ":" + durationSeconds;
        }
        const progress = music.currentTime / music.duration;
        progressBar.style.width = progress * 100 + "%";
        seekBar.value = progress * 100;
        if (currentSeconds < 10) {
            current_time.innerHTML = currentMinutes + ":" + `0${currentSeconds}`;
        }
    })
    
