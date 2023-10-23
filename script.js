const albumLElement = document.getElementById('albumL');
const albumSElement = document.getElementById('albumS');
// const play = document.getElementById("play");
const music = document.getElementById('audiosrc');
const musictitle = document.getElementById('audiotitle');
const musicimage = document.getElementById('audioimage');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const progressBar = document.getElementById("progress-bar");
const seekBar = document.getElementById("seek");
let total_duration = document.getElementById("duration");
let current_time = document.getElementById("current-time");

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchResultD = document.getElementById('searchResultD');


const apiEndpoints = {
    homepage: 'https://saavn.me/modules?language=hindi,punjabi,bhojpuri',
    search: 'https://saavn.me/search/songs?query=',
    albums: 'https://saavn.me/search/albums?query=rockstar',
    albumsData: 'https://saavn.me/albums?id=',
    songurl: 'https://saavn.me/songs?id='
};

function decodeHTMLEntities(text) {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(`<!doctype html><body>${text}`, 'text/html').body.textContent;
    return decodedString;
}

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
        const albums = homepageData.data.trending.albums;

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
                // const albumName = album.name;
                const albumName = decodeHTMLEntities(album.name);
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
                            // searchResults.innerHTML = ''; // Clear previous search results

                            // Check if there are songs in the response
                            const songsData = albumData.data.songs;

                            if (Array.isArray(songsData) && songsData.length > 0) {
                                // Loop through the songs and create a div for each song
                                songsData.forEach(song => {
                                    const songDiv = document.createElement('div');
                                    songDiv.classList.add('song');

                                    // Extract song details
                                    // const songName = song.name;
                                    const songName = decodeHTMLEntities(song.name);
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
                                                // const songName = song.name;
                                                const songName = decodeHTMLEntities(song.name);
                                                const songImage = song.image[1].link;
                                                const lastDownloadUrl = songData.data[0].downloadUrl[songData.data[0].downloadUrl.length - 1];
                                                console.log(lastDownloadUrl);


















                                                searchResults.innerHTML = ''; // Clear previous search results
                                                searchResultD.innerHTML = ''; // Clear previous search results


                                                // Create elements for displaying the song information
                                                const resultInfo = document.createElement('div');
                                                resultInfo.classList.add('songR');
                                                const resultImage = document.createElement('img');
                                                resultImage.classList.add('song-image');
                                                const resultName = document.createElement('h4');
                                                resultName.classList.add('song-name');
                                                const resultLanguage = document.createElement('div');
                                                resultLanguage.classList.add('song-lang');
                
                                                const albumDetail = document.createElement('div');
                                                albumDetail.classList.add('albumDetail');
                                                const albumContent = document.createElement('div');
                                                albumContent.classList.add('albumContent');
                
                
                
                                                const artistsList = document.createElement('ul');
                                                artistsList.classList.add('artistL');
                
                
                                                const artists = song.primaryArtists.split(', '); // Split the artist names by comma and space
                                                artists.forEach(artistName => {
                                                    const artistListItem = document.createElement('li');
                                                    artistListItem.textContent = artistName;
                                                    artistsList.appendChild(artistListItem);
                                                });
                
                                                const artistsdiv = document.createElement('div');
                                                artistsdiv.classList.add('artist', 'x-scroll');
                                                artistsdiv.appendChild(artistsList);
                
                
                                                resultImage.src = song.image[2].link; // Using the 500x500 image link
                                                // musicimage.src = result.image[2].link; // Using the 500x500 image link
                                                // musictitle.textContent = `${result.name}`;
                                                // const songName = decodeHTMLEntities(result.name);
                
                                                resultName.textContent = songName;
                                                resultLanguage.textContent = `${song.language} ‧ ${song.year}`;
                                                // resultArtists.textContent = `${result.primaryArtists}`;
                
                
                                                const imagediv = document.createElement('div');
                                                imagediv.classList.add('songI');
                                                imagediv.appendChild(resultImage);
                
                                                // Append the image element to the custom div
                                                albumContent.appendChild(resultName);
                                                albumContent.appendChild(albumDetail);
                
                                                albumDetail.appendChild(resultLanguage);
                                                albumDetail.appendChild(artistsdiv);
                                                albumContent.appendChild(albumDetail);
                
                                                // Append the elements to the resultInfo div
                                                resultInfo.appendChild(imagediv);
                                                resultInfo.appendChild(albumContent);
                                                // resultInfo.appendChild(albumDetail);
                                                // resultInfo.appendChild(albumDetail);



                                                searchResultD.appendChild(resultInfo);





















                                                if (lastDownloadUrl) {
                                                    // Set the last download URL as the src attribute for the audio element
                                                    music.src = lastDownloadUrl.link;
                                                    // musictitle.textContent = `${songName}`;
                                                    // musicimage.src = songImage;
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



// new search to counter 429 error


// Define a variable to hold the timer
let debounceTimer;

searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    searchResults.innerHTML = '';

    // Clear any existing timer
    clearTimeout(debounceTimer);

    // Set a new timer to fetch results after a delay (e.g., 200ms)
    debounceTimer = setTimeout(() => {
        if (query.trim() !== '') {
            const searchUrl = apiEndpoints.search + encodeURIComponent(query);

            fetch(searchUrl)
                .then(response => response.json())
                .then(searchData => {

                    const results = searchData.data.results;
                    console.log(searchData);

                    // searchResults.innerHTML = '';

                    if (Array.isArray(results) && results.length > 0) {
                        results.forEach(result => {
                            const resultDiv = document.createElement('div');
                            resultDiv.classList.add('search-result');


                            const resultN = document.createElement('h4');
                            const resultname = decodeHTMLEntities(result.name);
                            resultN.textContent = resultname;

                            const songthumb = document.createElement('div');
                            songthumb.classList.add('thumb');

                            const songT = document.createElement('img');
                            songT.classList.add('song-image');
                            songT.src = result.image[0].link;

                            const yeardiv = document.createElement('div');
                            yeardiv.classList.add('songY');
                            yeardiv.textContent = result.year;

                            const resultDetails = document.createElement('div');
                            resultDetails.classList.add('resultDetails');



                            songthumb.appendChild(songT);
                            resultDiv.appendChild(songthumb);

                            resultDetails.appendChild(resultN);
                            resultDetails.appendChild(yeardiv);
                            resultDiv.appendChild(resultDetails);




                            resultDiv.addEventListener('click', () => {
                                searchResults.innerHTML = ''; // Clear previous search results
                                searchResultD.innerHTML = ''; // Clear previous search results


                                // Create elements for displaying the song information
                                const resultInfo = document.createElement('div');
                                resultInfo.classList.add('songR');
                                const resultImage = document.createElement('img');
                                resultImage.classList.add('song-image');
                                const resultName = document.createElement('h4');
                                resultName.classList.add('song-name');
                                const resultLanguage = document.createElement('div');
                                resultLanguage.classList.add('song-lang');

                                const albumDetail = document.createElement('div');
                                albumDetail.classList.add('albumDetail');
                                const albumContent = document.createElement('div');
                                albumContent.classList.add('albumContent');



                                const artistsList = document.createElement('ul');
                                artistsList.classList.add('artistL');


                                const artists = result.primaryArtists.split(', '); // Split the artist names by comma and space
                                artists.forEach(artistName => {
                                    const artistListItem = document.createElement('li');
                                    artistListItem.textContent = artistName;
                                    artistsList.appendChild(artistListItem);
                                });

                                const artistsdiv = document.createElement('div');
                                artistsdiv.classList.add('artist', 'x-scroll');
                                artistsdiv.appendChild(artistsList);


                                resultImage.src = result.image[2].link; // Using the 500x500 image link
                                // musicimage.src = result.image[2].link; // Using the 500x500 image link
                                // musictitle.textContent = `${result.name}`;
                                const songName = decodeHTMLEntities(result.name);

                                resultName.textContent = songName;
                                resultLanguage.textContent = `${result.language} ‧ ${result.year}`;
                                // resultArtists.textContent = `${result.primaryArtists}`;


                                const imagediv = document.createElement('div');
                                imagediv.classList.add('songI');
                                imagediv.appendChild(resultImage);

                                // Append the image element to the custom div
                                albumContent.appendChild(resultName);
                                albumContent.appendChild(albumDetail);

                                albumDetail.appendChild(resultLanguage);
                                albumDetail.appendChild(artistsdiv);
                                albumContent.appendChild(albumDetail);

                                // Append the elements to the resultInfo div
                                resultInfo.appendChild(imagediv);
                                resultInfo.appendChild(albumContent);
                                // resultInfo.appendChild(albumDetail);
                                // resultInfo.appendChild(albumDetail);

                                // Set the audio source to the last download URL
                                const lastDownloadUrl = result.downloadUrl[result.downloadUrl.length - 1];
                                if (lastDownloadUrl) {
                                    const audioElement = document.getElementById('audiosrc');
                                    music.src = lastDownloadUrl.link;
                                    music.play(); // Auto-play the audio
                                    playfunc();
                                }

                                // Append the resultInfo to the searchResults container
                                searchResultD.appendChild(resultInfo);
                            });

                            searchResults.insertBefore(resultDiv, searchResults.lastChild);
                            // searchResults.appendChild(resultDiv);
                        });
                    } else {
                        searchResults.textContent = 'No results found';
                    }

                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, 300); // Adjust the delay as needed
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
// seekBar.addEventListener("input", function () {
//     // When the user interacts with the seek bar, pause the audio



// });

// // Add an event listener to the seek bar to detect when the user is done interacting
// seekBar.addEventListener("change", function () {
//     // When the user leaves the seek bar, resume playing the audio
//     music.play();
//     music.volume = 1;
// });




seekBar.addEventListener("mouseup", function () {
    music.play();
});

music.addEventListener("timeupdate", function () {
    const { duration } = event.srcElement;
    const currentMinutes = Math.floor(music.currentTime / 60);
    const currentSeconds = Math.floor(music.currentTime % 60);
    const durationMinutes = Math.floor(music.duration / 60);
    const durationSeconds = Math.floor(music.duration % 60);
    // current_time.innerHTML = currentMinutes + ":" + currentSeconds;
    // if (duration) {
    //     total_duration.innerHTML = durationMinutes + ":" + durationSeconds;
    // }
    // if (durationSeconds < 10) {
    // total_duration.innerHTML = durationMinutes + ":" + `0${durationSeconds}`;
    // }
    if (duration) {
        total_duration.innerHTML = durationMinutes + ":" + (durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds);
    }
    const formattedSeconds = currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds;
    current_time.innerHTML = `${currentMinutes}:${formattedSeconds}`;



    const progress = music.currentTime / music.duration;
    progressBar.style.width = progress * 100 + "%";
    seekBar.value = progress * 100;
    // if (currentSeconds < 10) {
    //     current_time.innerHTML = currentMinutes + ":" + `0${currentSeconds}`;
    // }
    // total_duration.innerHTML = durationMinutes + ":" + `0${durationSeconds}`
})

