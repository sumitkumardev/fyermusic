const albumLElement = document.getElementById('albumL');
const albumLElement2 = document.getElementById('albumL2')
const albumLElement3 = document.getElementById('albumL3');;

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
const recommendD = document.getElementById('reco');
// foward next
const forwardN = document.getElementById('next');
// previous or old
const previousN = document.getElementById('prev');



const apiEndpoints = {
    homepage: 'https://saavn.dev/api/search/albums?query=hindi',
    homepage2: 'https://saavn.dev/api/search/albums?query=punjabi',
    homepage3: 'https://saavn.dev/api/search/albums?query=bhojpuri',
    forwardS: 'https://saavn.dev/modules?language=',
    search: 'https://saavn.dev/api/search/songs?query=',
    albums: 'https://saavn.dev/api/search/albums?query=',
    // albumsData: 'https://saavn.dev/albums?id=',
    albumsData: 'https://saavn.dev/api/albums?id=',
    // old https://saavn.dev/artists/ 
    recomend: 'https://saavn.dev/api/songs',
    songurl: 'https://saavn.dev/api/songs/'
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
        // const albums = homepageData.data.trending.albums;
        const albums = homepageData.data.results;


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
                const albumImage = album.image[1].url; // Using the first image link
                const artists = album.artists.primary;
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
                    const artistName = decodeHTMLEntities(artist.name);
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
                            console.log(albumData);


                            const songDivparent = document.createElement('div');
                            songDivparent.classList.add('songP', 'y-scroll');

                            albumSElement.appendChild(songDivparent);




                            // Check if there are songs in the response
                            const songsData = albumData.data.songs;



                            if (Array.isArray(songsData) && songsData.length > 0) {
                                console.log(songsData);


                                const firstSong = songsData[0]; // Assuming songsData is an array of objects

                                if (firstSong && firstSong.image && firstSong.image.length > 1) {
                                    const songImage = firstSong.image[2].url; // Using the first image link

                                    console.log(songImage);


                                    const songI = document.createElement('div');
                                    songI.classList.add('songI');

                                    const songImageElement = document.createElement('img');
                                    songImageElement.classList.add('song-image');
                                    songImageElement.src = songImage;

                                    songI.appendChild(songImageElement);
                                    albumSElement.appendChild(songI);


                                }


                                // Loop through the songs and create a div for each song
                                songsData.forEach(song => {
                                    const songDiv = document.createElement('div');
                                    songDiv.classList.add('song');

                                    // Extract song details
                                    // const songName = song.name;
                                    const songName = decodeHTMLEntities(song.name);
                                    const songId = song.id;
                                    // const songImage = song.image[1].url; // Using the first image link
                                    const songDuration = song.duration;
                                    const songLabel = song.label;
                                    const primaryArtist = song.primaryArtists;
                                    const explicitContent = song.explicitContent;

                                    // Create HTML elements with classes to display the data for the song
                                    const songNameElement = document.createElement('p');
                                    songNameElement.classList.add('song-name');
                                    songNameElement.textContent = `${songName}`;
                                    const uniqueIds = `song-${songId}`;
                                    songNameElement.id = uniqueIds;

                                    // const songImageElement = document.createElement('img');
                                    // songImageElement.classList.add('song-image');
                                    // songImageElement.src = songImage;


                                    // songI.appendChild(songImageElement);

                                    songDiv.appendChild(songNameElement);


                                    // Append the song div to the container
                                    songDivparent.appendChild(songDiv);


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
                                                const songImage = song.image[1].url;
                                                const lastDownloadUrl = songData.data[0].downloadUrl[songData.data[0].downloadUrl.length - 1];
                                                console.log(lastDownloadUrl);
                                                // console.log(songData);





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


                                                artists.forEach(artist => {
                                                    const artistName = decodeHTMLEntities(artist.name);
                                                    const artistListItem = document.createElement('li');
                                                    artistListItem.textContent = artistName;
                                                    artistsList.appendChild(artistListItem);
                                                });
                                                // const artists = song.primaryArtists.split(', '); // Split the artist names by comma and space
                                                // artists.forEach(artistName => {
                                                //     const artistListItem = document.createElement('li');
                                                //     artistListItem.textContent = artistName;
                                                //     artistsList.appendChild(artistListItem);
                                                // });

                                                const artistsdiv = document.createElement('div');
                                                artistsdiv.classList.add('artist', 'x-scroll');
                                                artistsdiv.appendChild(artistsList);


                                                resultImage.src = song.image[2].url; // Using the 500x500 image link
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
                                                    music.src = lastDownloadUrl.url;
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

// copy of homepage -2
fetchData('homepage2')
    .then(homepageData => {
        // Check if there are albums in the response
        // const albums = homepageData.data.trending.albums;
        const albums = homepageData.data.results;


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
                const albumImage = album.image[1].url; // Using the first image link
                const artists = album.artists.primary;
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
                    const artistName = decodeHTMLEntities(artist.name);
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
                            console.log(albumData);


                            const songDivparent = document.createElement('div');
                            songDivparent.classList.add('songP', 'y-scroll');

                            albumSElement.appendChild(songDivparent);




                            // Check if there are songs in the response
                            const songsData = albumData.data.songs;



                            if (Array.isArray(songsData) && songsData.length > 0) {
                                console.log(songsData);


                                const firstSong = songsData[0]; // Assuming songsData is an array of objects

                                if (firstSong && firstSong.image && firstSong.image.length > 1) {
                                    const songImage = firstSong.image[2].url; // Using the first image link

                                    console.log(songImage);


                                    const songI = document.createElement('div');
                                    songI.classList.add('songI');

                                    const songImageElement = document.createElement('img');
                                    songImageElement.classList.add('song-image');
                                    songImageElement.src = songImage;

                                    songI.appendChild(songImageElement);
                                    albumSElement.appendChild(songI);


                                }


                                // Loop through the songs and create a div for each song
                                songsData.forEach(song => {
                                    const songDiv = document.createElement('div');
                                    songDiv.classList.add('song');

                                    // Extract song details
                                    // const songName = song.name;
                                    const songName = decodeHTMLEntities(song.name);
                                    const songId = song.id;
                                    // const songImage = song.image[1].url; // Using the first image link
                                    const songDuration = song.duration;
                                    const songLabel = song.label;
                                    const primaryArtist = song.primaryArtists;
                                    const explicitContent = song.explicitContent;

                                    // Create HTML elements with classes to display the data for the song
                                    const songNameElement = document.createElement('p');
                                    songNameElement.classList.add('song-name');
                                    songNameElement.textContent = `${songName}`;
                                    const uniqueIds = `song-${songId}`;
                                    songNameElement.id = uniqueIds;

                                    // const songImageElement = document.createElement('img');
                                    // songImageElement.classList.add('song-image');
                                    // songImageElement.src = songImage;


                                    // songI.appendChild(songImageElement);

                                    songDiv.appendChild(songNameElement);


                                    // Append the song div to the container
                                    songDivparent.appendChild(songDiv);


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
                                                const songImage = song.image[1].url;
                                                const lastDownloadUrl = songData.data[0].downloadUrl[songData.data[0].downloadUrl.length - 1];
                                                console.log(lastDownloadUrl);
                                                // console.log(songData);





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


                                                artists.forEach(artist => {
                                                    const artistName = decodeHTMLEntities(artist.name);
                                                    const artistListItem = document.createElement('li');
                                                    artistListItem.textContent = artistName;
                                                    artistsList.appendChild(artistListItem);
                                                });
                                                // const artists = song.primaryArtists.split(', '); // Split the artist names by comma and space
                                                // artists.forEach(artistName => {
                                                //     const artistListItem = document.createElement('li');
                                                //     artistListItem.textContent = artistName;
                                                //     artistsList.appendChild(artistListItem);
                                                // });

                                                const artistsdiv = document.createElement('div');
                                                artistsdiv.classList.add('artist', 'x-scroll');
                                                artistsdiv.appendChild(artistsList);


                                                resultImage.src = song.image[2].url; // Using the 500x500 image link
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
                                                    music.src = lastDownloadUrl.url;
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
                albumLElement2.appendChild(albumDiv);
            });
        }
    })

    .catch(error => {
        console.error(error);
    });

// copy of homepage -3
fetchData('homepage3')
    .then(homepageData => {
        // Check if there are albums in the response
        // const albums = homepageData.data.trending.albums;
        const albums = homepageData.data.results;


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
                const albumImage = album.image[1].url; // Using the first image link
                const artists = album.artists.primary;
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
                    const artistName = decodeHTMLEntities(artist.name);
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
                            console.log(albumData);


                            const songDivparent = document.createElement('div');
                            songDivparent.classList.add('songP', 'y-scroll');

                            albumSElement.appendChild(songDivparent);




                            // Check if there are songs in the response
                            const songsData = albumData.data.songs;



                            if (Array.isArray(songsData) && songsData.length > 0) {
                                console.log(songsData);


                                const firstSong = songsData[0]; // Assuming songsData is an array of objects

                                if (firstSong && firstSong.image && firstSong.image.length > 1) {
                                    const songImage = firstSong.image[2].url; // Using the first image link

                                    console.log(songImage);


                                    const songI = document.createElement('div');
                                    songI.classList.add('songI');

                                    const songImageElement = document.createElement('img');
                                    songImageElement.classList.add('song-image');
                                    songImageElement.src = songImage;

                                    songI.appendChild(songImageElement);
                                    albumSElement.appendChild(songI);


                                }


                                // Loop through the songs and create a div for each song
                                songsData.forEach(song => {
                                    const songDiv = document.createElement('div');
                                    songDiv.classList.add('song');

                                    // Extract song details
                                    // const songName = song.name;
                                    const songName = decodeHTMLEntities(song.name);
                                    const songId = song.id;
                                    // const songImage = song.image[1].url; // Using the first image link
                                    const songDuration = song.duration;
                                    const songLabel = song.label;
                                    const primaryArtist = song.primaryArtists;
                                    const explicitContent = song.explicitContent;

                                    // Create HTML elements with classes to display the data for the song
                                    const songNameElement = document.createElement('p');
                                    songNameElement.classList.add('song-name');
                                    songNameElement.textContent = `${songName}`;
                                    const uniqueIds = `song-${songId}`;
                                    songNameElement.id = uniqueIds;

                                    // const songImageElement = document.createElement('img');
                                    // songImageElement.classList.add('song-image');
                                    // songImageElement.src = songImage;


                                    // songI.appendChild(songImageElement);

                                    songDiv.appendChild(songNameElement);


                                    // Append the song div to the container
                                    songDivparent.appendChild(songDiv);


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
                                                const songImage = song.image[1].url;
                                                const lastDownloadUrl = songData.data[0].downloadUrl[songData.data[0].downloadUrl.length - 1];
                                                console.log(lastDownloadUrl);
                                                // console.log(songData);





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


                                                artists.forEach(artist => {
                                                    const artistName = decodeHTMLEntities(artist.name);
                                                    const artistListItem = document.createElement('li');
                                                    artistListItem.textContent = artistName;
                                                    artistsList.appendChild(artistListItem);
                                                });
                                                // const artists = song.primaryArtists.split(', '); // Split the artist names by comma and space
                                                // artists.forEach(artistName => {
                                                //     const artistListItem = document.createElement('li');
                                                //     artistListItem.textContent = artistName;
                                                //     artistsList.appendChild(artistListItem);
                                                // });

                                                const artistsdiv = document.createElement('div');
                                                artistsdiv.classList.add('artist', 'x-scroll');
                                                artistsdiv.appendChild(artistsList);


                                                resultImage.src = song.image[2].url; // Using the 500x500 image link
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
                                                    music.src = lastDownloadUrl.url;
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
                albumLElement3.appendChild(albumDiv);
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
            const searchUrl = apiEndpoints.search + encodeURIComponent(query) + '&limit=5';
            // console.log(searchUrl);
            fetch(searchUrl)
                .then(response => response.json())
                .then(searchData => {

                    const results = searchData.data.results;

                    // console.log(searchData);

                    // searchResults.innerHTML = '';

                    if (Array.isArray(results) && results.length > 0) {
                        results.forEach(result => {

                            console.log(result);


                            const resultDiv = document.createElement('div');
                            resultDiv.classList.add('search-result');


                            const resultN = document.createElement('h4');
                            const resultname = decodeHTMLEntities(result.name);
                            resultN.textContent = resultname;

                            const songthumb = document.createElement('div');
                            songthumb.classList.add('thumb');

                            const songT = document.createElement('img');
                            songT.classList.add('song-image');
                            songT.src = result.image[0].url;

                            const yeardiv = document.createElement('div');
                            yeardiv.classList.add('songY');
                            yeardiv.textContent = result.year;

                            const artistsList = document.createElement('ul');
                            artistsList.classList.add('artistL');

                            // const artists = result.primaryArtists.split(', '); // Split the artist names by comma and space
                            const artists = result.name;
                            // artists.forEach(artistName => {
                            //     const artistListItem = document.createElement('li');
                            //     artistListItem.textContent = decodeHTMLEntities(artistName);
                            //     artistsList.appendChild(artistListItem);
                            // });





                            const artistsdiv = document.createElement('div');
                            artistsdiv.classList.add('artist', 'x-scroll');
                            artistsdiv.appendChild(artistsList);





                            const resultDetails = document.createElement('div');
                            resultDetails.classList.add('resultDetails');



                            songthumb.appendChild(songT);
                            resultDiv.appendChild(songthumb);

                            resultDetails.appendChild(resultN);
                            resultDetails.appendChild(yeardiv);
                            resultDetails.appendChild(artistsdiv);
                            resultDiv.appendChild(resultDetails);




                            resultDiv.addEventListener('click', () => {
                                searchResults.innerHTML = ''; // Clear previous search results
                                searchResultD.innerHTML = ''; // Clear previous search results
                                recommendD.innerHTML = '';
                                console.log(result);






                                // Get the Artist IDs and Song ID
                                // const artistIds = result.artists.primary.split(',').map(id => id.trim());
                                const artistIds = result.artists.primary;

                                const songId = result.id;
                                const songlang = result.language;

                                // Construct and fetch recommendations for each artist
                                artistIds.forEach(artistId => {
                                    //    old  // const recommendUrl = `${apiEndpoints.recomend}${artistId}/recommendations/${songId}?language=${songlang}`;
                                    const recommendUrl = `${apiEndpoints.recomend}/${songId}/suggestions?language=${songlang}`;
                                    console.log(recommendUrl);

                                    fetch(recommendUrl)
                                        .then(response => response.json())
                                        .then(recommendData => {
                                            const reco = recommendData.data;

                                            if (Array.isArray(reco) && reco.length > 0) {
                                                reco.forEach(recom => {
                                                    const songName = decodeHTMLEntities(recom.name);

                                                    // Create a container for each recommendation
                                                    const recoData = document.createElement('div');
                                                    recoData.classList.add('recommendData');


                                                    const recoN = document.createElement('h4');
                                                    recoN.textContent = songName;

                                                    const recoDetails = document.createElement('div');
                                                    recoDetails.classList.add('recoDetails');

                                                    recoDetails.appendChild(recoN);

                                                    const artistsList = document.createElement('ul');
                                                    artistsList.classList.add('artistL');

                                                    const artists = recom.primaryArtists.split(', '); // Split the artist names by comma and space
                                                    artists.forEach(artistName => {
                                                        const artistListItem = document.createElement('li');
                                                        artistListItem.textContent = decodeHTMLEntities(artistName);
                                                        artistsList.appendChild(artistListItem);
                                                    });





                                                    const artistsdiv = document.createElement('div');
                                                    artistsdiv.classList.add('artist', 'x-scroll');
                                                    artistsdiv.appendChild(artistsList);



                                                    // Create an image element for the song thumbnail
                                                    const recoT = document.createElement('img');
                                                    recoT.classList.add('song-image');
                                                    recoT.src = recom.image[0].link;

                                                    const recoThumb = document.createElement('div');
                                                    recoThumb.classList.add('thumb');

                                                    recoThumb.appendChild(recoT);


                                                    recoData.appendChild(recoThumb);
                                                    recoDetails.appendChild(artistsdiv);
                                                    recoData.appendChild(recoDetails);




                                                    // Append the song thumbnail to the recommendation container



                                                    // Append the recommendation container to the recommendD container


                                                    recoData.addEventListener('click', () => {
                                                        // Assuming recoData is the recommendation data for the clicked item
                                                        const lastDownloadUrl = recom.downloadUrl[recom.downloadUrl.length - 1];

                                                        if (lastDownloadUrl) {
                                                            // Set the last download URL as the src attribute for the audio element
                                                            const audioElement = document.getElementById('audiosrc');
                                                            audioElement.src = lastDownloadUrl.url;
                                                            audioElement.play(); // Auto-play the audio
                                                            playfunc();
                                                        }










                                                        const songName = decodeHTMLEntities(recom.name);
                                                        // const songImage = forward.image[1].link;
                                                        // const lastDownloadUrl = forward.data[0].downloadUrl[forward.data[0].downloadUrl.length - 1];
                                                        // console.log(lastDownloadUrl);




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


                                                        const artists = recom.primaryArtists.split(', '); // Split the artist names by comma and space
                                                        artists.forEach(artistName => {
                                                            const artistListItem = document.createElement('li');
                                                            artistListItem.textContent = artistName;
                                                            artistsList.appendChild(artistListItem);
                                                        });

                                                        const artistsdiv = document.createElement('div');
                                                        artistsdiv.classList.add('artist', 'x-scroll');
                                                        artistsdiv.appendChild(artistsList);


                                                        resultImage.src = recom.image[2].link; // Using the 500x500 image link
                                                        // musicimage.src = result.image[2].link; // Using the 500x500 image link
                                                        // musictitle.textContent = `${result.name}`;
                                                        // const songName = decodeHTMLEntities(result.name);

                                                        resultName.textContent = songName;
                                                        resultLanguage.textContent = `${recom.language} ‧ ${recom.year}`;
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













                                                        // Play the next or previous song














                                                    });


                                                    recommendD.appendChild(recoData);
                                                });
                                            }
                                        })
                                        .catch(error => {
                                            console.error(error);
                                        });
                                });
































































                                // const searchUrl = apiEndpoints.forwardS + encodeURIComponent(query) + '&limit=5';
                                artistIds.forEach(artistId => {
                                    const forwardS = `${apiEndpoints.recomend}${artistId}/${songId}/suggestions?language=${songlang}`;
                                    console.log(forwardS);


                                    // console.log(searchUrl);
                                    fetch(forwardS)
                                        .then(response => response.json())
                                        .then(forward => {
                                            const forwards = forward.data;


                                            // Declare an index variable to keep track of the currently playing song
                                            let currentSongIndex = 0;
                                            // let currentSongIndex = 0;
                                            let lastFetchedIndex = -1;
                                            // ...
                                            music.addEventListener('ended', () => {
                                                if (Array.isArray(forwards) && forwards.length > 0) {
                                                    // Increment the current index
                                                    currentSongIndex++;

                                                    // Check if the index goes beyond the array length, and wrap it if necessary
                                                    if (currentSongIndex >= forwards.length) {
                                                        currentSongIndex = 0;
                                                    }

                                                    // Check if we need to fetch new data (when the current index reaches the end of the previously fetched array)
                                                    if (currentSongIndex > lastFetchedIndex) {
                                                        // Get the ID of the next song to play
                                                        const songId = forwards[currentSongIndex].id;

                                                        // Fetch and play the next song
                                                        playSong(songId);

                                                        // Update the last fetched index
                                                        lastFetchedIndex = currentSongIndex;
                                                    }
                                                }
                                            });

                                            // Inside your forwardN event listener, increment the index
                                            forwardN.addEventListener('click', () => {
                                                // if (Array.isArray(forwards) && forwards.length > 0) {
                                                //     // Increment the current index
                                                //     currentSongIndex++;

                                                //     // Check if the index goes beyond the array length, and wrap it if necessary
                                                //     if (currentSongIndex >= forwards.length) {
                                                //         currentSongIndex = 0;
                                                //     }

                                                //     // Get the ID of the next song to play
                                                //     const songId = forwards[currentSongIndex].id;

                                                //     // Fetch and play the next song
                                                //     playSong(songId);
                                                // }
                                                if (Array.isArray(forwards) && forwards.length > 0) {
                                                    // Increment the current index
                                                    currentSongIndex++;

                                                    // Check if the index goes beyond the array length, and wrap it if necessary
                                                    if (currentSongIndex >= forwards.length) {
                                                        currentSongIndex = 0;
                                                    }

                                                    // Check if we need to fetch new data (when the current index reaches the end of the previously fetched array)
                                                    if (currentSongIndex > lastFetchedIndex) {
                                                        // Get the ID of the next song to play
                                                        const songId = forwards[currentSongIndex].id;

                                                        // Fetch and play the next song
                                                        playSong(songId);

                                                        // Update the last fetched index
                                                        lastFetchedIndex = currentSongIndex;
                                                    }
                                                }
                                            });

                                            // Inside your previousN event listener, decrement the index
                                            previousN.addEventListener('click', () => {
                                                if (Array.isArray(forwards) && forwards.length > 0) {
                                                    // Decrement the current index
                                                    currentSongIndex--;

                                                    // Check if the index goes below zero, and wrap it if necessary
                                                    if (currentSongIndex < 0) {
                                                        currentSongIndex = forwards.length - 1;
                                                    }

                                                    // Get the ID of the previous song to play
                                                    const songId = forwards[currentSongIndex].id;

                                                    // Fetch and play the previous song
                                                    playSong(songId);
                                                }
                                            });

                                            // Function to fetch and play a song
                                            function playSong(songId) {
                                                const songurl = apiEndpoints.songurl + songId;

                                                fetch(songurl)
                                                    .then(response => response.json())
                                                    .then(forward => {
                                                        const forwards = forward.data[0];










                                                        console.log(forwards);
                                                        // console.log(forward);
                                                        // Get the last download URL from the album data
                                                        // const songName = song.name;
                                                        // const forward = forward.data.trending.songs;
                                                        const songName = decodeHTMLEntities(forwards.name);
                                                        // const songImage = forward.image[1].link;
                                                        const lastDownloadUrl = forward.data[0].downloadUrl[forward.data[0].downloadUrl.length - 1];
                                                        // console.log(lastDownloadUrl);




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


                                                        const artists = forwards.primaryArtists.split(', '); // Split the artist names by comma and space
                                                        artists.forEach(artistName => {
                                                            const artistListItem = document.createElement('li');
                                                            artistListItem.textContent = artistName;
                                                            artistsList.appendChild(artistListItem);
                                                        });

                                                        const artistsdiv = document.createElement('div');
                                                        artistsdiv.classList.add('artist', 'x-scroll');
                                                        artistsdiv.appendChild(artistsList);


                                                        resultImage.src = forwards.image[2].link; // Using the 500x500 image link
                                                        // musicimage.src = result.image[2].link; // Using the 500x500 image link
                                                        // musictitle.textContent = `${result.name}`;
                                                        // const songName = decodeHTMLEntities(result.name);

                                                        resultName.textContent = songName;
                                                        resultLanguage.textContent = `${forwards.language} ‧ ${forwards.year}`;
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













                                                        // Play the next or previous song
                                                        music.src = lastDownloadUrl.link;
                                                        playfunc();
                                                    });
                                            }










                                        });


                                })






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

                                const artists = result.artists.primary; // Split the artist names by comma and space


                                artists.forEach(artist => {
                                    const artistName = decodeHTMLEntities(artist.name);
                                    const artistListItem = document.createElement('li');
                                    artistListItem.textContent = artistName;
                                    artistsList.appendChild(artistListItem);
                                });


                                const artistsdiv = document.createElement('div');
                                artistsdiv.classList.add('artist', 'x-scroll');
                                artistsdiv.appendChild(artistsList);


                                resultImage.src = result.image[2].url; // Using the 500x500 image link
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
                                    music.src = lastDownloadUrl.url;
                                    music.play(); // Auto-play the audio
                                    playfunc();
                                }

                                // Append the resultInfo to the searchResults container
                                searchResultD.appendChild(resultInfo);
                            });

                            // searchResults.insertBefore(resultDiv, searchResults.firstChild);
                            searchResults.appendChild(resultDiv);
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
    music.volume = 1;
    playButton.style.display = "none";
    pauseButton.style.display = "inline-flex";
});

// Add click event listener to the pause button
pauseButton.addEventListener('click', () => {
    music.pause();
    music.volume = 0;
    playButton.style.display = "inline-flex";
    pauseButton.style.display = "none";
});

seekBar.addEventListener("input", function () {
    // music.playbackRate = 0.95;
    // music.volume = 0.5;
    const progress = seekBar.value / 100;
    music.currentTime = progress * music.duration;
});
// seekBar.addEventListener("input", function () {
//     // When the user interacts with the seek bar, pause the audio



// });

// // Add an event listener to the seek bar to detect when the user is done interacting
seekBar.addEventListener("change", function () {
    // When the user leaves the seek bar, resume playing the audio
    // // music.play();
    // music.playbackRate = 1;
    // music.volume = 1;
});



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

