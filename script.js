document.addEventListener('DOMContentLoaded', () => {
    const apodForm = document.getElementById('apod-form');
    const apodContainer = document.getElementById('apod-container');
    const favouritesContainer = document.getElementById('favourites-container');
    const apiKey = 'LJc0YuOZBI3p2tslyrtya4qZ5eex9U1nYnB9R0bc'; // Replace with your actual API key
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    apodForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const date = document.getElementById('date').value;
        try {
            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data from NASA APOD API');
            }
            const data = await response.json();
            displayAPOD(data);
        } catch (error) {
            apodContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });

    function displayAPOD(apod) {
        apodContainer.innerHTML = `
            <div class="apod-card">
                <h3>${apod.title}</h3>
                <p>${apod.date}</p>
                <img src="${apod.url}" alt="${apod.title}" onclick="openHDImage('${apod.hdurl}')">
                <p>${apod.explanation}</p>
                <button onclick="saveFavourite('${apod.url}', '${apod.hdurl}', '${apod.title}', '${apod.date}', '${apod.explanation.replace(/'/g, "\\'")}')">Save as Favourite</button>
            </div>
        `;
    }

    window.openHDImage = function (url) {
        window.open(url, '_blank');
    }

    window.saveFavourite = function (url, hdurl, title, date, explanation) {
        const favourite = { url, hdurl, title, date, explanation };
        favourites.push(favourite);
        localStorage.setItem('favourites', JSON.stringify(favourites));
        displayFavourites();
    }

    window.deleteFavourite = function (index) {
        favourites.splice(index, 1);
        localStorage.setItem('favourites', JSON.stringify(favourites));
        displayFavourites();
    }

    function displayFavourites() {
        favouritesContainer.innerHTML = '';
        favourites.forEach((favourite, index) => {
            favouritesContainer.innerHTML += `
                <div class="favourite-card">
                    <h3>${favourite.title}</h3>
                    <p>${favourite.date}</p>
                    <img src="${favourite.url}" alt="${favourite.title}" onclick="openHDImage('${favourite.hdurl}')">
                    <p>${favourite.explanation}</p>
                    <button onclick="deleteFavourite(${index})">Delete</button>
                </div>
            `;
        });
    }

    displayFavourites();
});
