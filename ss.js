// Replace with your Google Apps Script Web App URL
const webAppUrl = "https://script.google.com/macros/s/AKfycbxP77V-fKkIq9Ywzm-5BfntEjMPUlvfs1DUaibCitTc4p0IXsjuuTsQ9f75cB6BbTyN/exec";

document.addEventListener('DOMContentLoaded', () => {
    const ratingStars = document.querySelectorAll('#rating-stars .fa-star');
    const averageStarsContainer = document.getElementById('average-stars');
    const totalRatingsElem = document.getElementById('total-ratings');
    const averageRatingElem = document.getElementById('average-rating');
    const thanksMessage = document.getElementById('thanks-message');
    const averageRatingContainer = document.getElementById('average-rating-container');
    const myRatingContainer = document.getElementById('my-rating-container');
    const myStarsContainer = document.getElementById('my-stars');
    const myRatingElem = document.getElementById('my-rating');
    const editRemoveSection = document.getElementById('edit-remove-section');
    const editRatingButton = document.getElementById('edit-rating');
    const removeRatingButton = document.getElementById('remove-rating');

    let userRating = parseInt(localStorage.getItem('userRating')) || 0;

    async function fetchRatings() {
        const response = await fetch(`${webAppUrl}?action=getRatings`);
        const data = await response.json();
        return data;
    }

    async function submitRating(ratingValue) {
        const response = await fetch(webAppUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating: ratingValue }),
        });
        const data = await response.json();
        return data;
    }

    function updateRatingInfo(averageRating, totalRatings) {
        totalRatingsElem.textContent = `(${totalRatings})`;
        averageRatingElem.textContent = averageRating;
        updateAverageStars(averageRating);
        if (userRating) {
            myRatingElem.textContent = userRating;
            updateMyStars(userRating);
            myRatingContainer.style.display = 'block';
        }
    }

    async function handleStarClick(event) {
        const ratingValue = parseInt(event.target.getAttribute('data-value'));
        localStorage.setItem('userRating', ratingValue);
        userRating = ratingValue;

        const data = await submitRating(ratingValue);
        updateRatingInfo(data.averageRating, data.totalRatings);

        thanksMessage.style.display = 'block';
        setTimeout(() => {
            thanksMessage.style.display = 'none';
        }, 4000);
        document.getElementById('rating-stars').style.display = 'none';
        averageRatingContainer.style.display = 'block';
        editRemoveSection.style.display = 'block';
    }

    function handleEditRating() {
        document.getElementById('rating-stars').style.display = 'block';
        thanksMessage.style.display = 'none';
        editRemoveSection.style.display = 'none';
    }

    function handleRemoveRating() {
        localStorage.removeItem('userRating');
        userRating = 0;
        document.getElementById('rating-stars').style.display = 'block';
        thanksMessage.style.display = 'none';
        averageRatingContainer.style.display = 'block';
        editRemoveSection.style.display = 'none';
        myRatingContainer.style.display = 'none';
        // Note: Removing a rating would also need to update the backend.
    }

    function updateAverageStars(averageRating) {
        averageStarsContainer.innerHTML = '';
        const fullStars = Math.floor(averageRating);
        const halfStar = averageRating % 1 >= 0.5 ? 1 : 0;

        for (let i = 0; i < fullStars; i++) {
            averageStarsContainer.innerHTML += '<i class="fas fa-star"></i>';
        }
        if (halfStar) {
            averageStarsContainer.innerHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = fullStars + halfStar; i < 5; i++) {
            averageStarsContainer.innerHTML += '<i class="far fa-star"></i>';
        }
    }

    function updateMyStars(userRating) {
        myStarsContainer.innerHTML = '';
        for (let i = 0; i < userRating; i++) {
            myStarsContainer.innerHTML += '<i class="fas fa-star"></i>';
        }
        for (let i = userRating; i < 5; i++) {
            myStarsContainer.innerHTML += '<i class="far fa-star"></i>';
        }
    }

    ratingStars.forEach(star => {
        star.addEventListener('click', handleStarClick);
    });

    editRatingButton.addEventListener('click', handleEditRating);
    removeRatingButton.addEventListener('click', handleRemoveRating);

    fetchRatings().then(data => {
        updateRatingInfo(data.averageRating, data.totalRatings);
        if (userRating) {
            document.getElementById('rating-stars').style.display = 'none';
            averageRatingContainer.style.display = 'block';
            myRatingContainer.style.display = 'block';
            thanksMessage.style.display = 'block';
            editRemoveSection.style.display = 'block';
        }
    });
});
