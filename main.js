// Select the form, result container, and main container elements from the DOM
const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-result');
const container = document.querySelector('.container');

// Initialize variables for search query and API base URL
let searchQuery = "";
const baseURL = `https://api.spoonacular.com/recipes/complexSearch`;
const apiKey = "fcc72b3ebf31496eb4e8c7213367814f"; // Your Spoonacular API key

// Add an event listener to handle the form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    searchQuery = e.target.querySelector("input").value; // Get the search input value
    fetchRecipes(); // Call the function to fetch recipes
});

// Function to fetch recipes from the Spoonacular API
function fetchRecipes() {
    // Construct the API URL with the search query and API key
    const url = `${baseURL}?query=${searchQuery}&apiKey=${apiKey}`;
    fetch(url) // Send a GET request to the API
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            if (data.results) { 
                displayRecipes(data.results); // Display the recipes if results exist
            } else {
                // Show a message if no recipes are found
                searchResultDiv.innerHTML = `<p>No recipes found. Try a different query!</p>`;
            }
        })
        .catch(error => {
            console.error(error); // Log any errors to the console
            // Display an error message to the user
            searchResultDiv.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
        });
}

// Function to display the fetched recipes
function displayRecipes(recipes) {
    searchResultDiv.innerHTML = ""; // Clear previous search results

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('item'); // Add the 'item' class to the div

        // Fetch detailed calorie information for the recipe
        fetch(`https://api.spoonacular.com/recipes/${recipe.id}/nutritionWidget.json?apiKey=${apiKey}`)
            .then(response => response.json()) // Parse the response as JSON
            .then(nutrition => {
                const calories = nutrition.nutrients.find(n => n.name === "Calories")?.amount || "Not Available";

                // Check if sourceUrl is available, and fallback to Spoonacular's page if not
                const recipeUrl = recipe.sourceUrl 
                                  ? recipe.sourceUrl 
                                  : `https://spoonacular.com/recipes/${recipe.title}-${recipe.id}`; // Construct URL using title and ID

                // Populate the recipe card
                recipeDiv.innerHTML = `
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <div class="flex-container">
                        <h1 class="title">${recipe.title}</h1>
                        <a class="view-button" href="${recipeUrl}" target="_blank">View Recipe</a>
                    </div>
                    <p class="item-data">Calories: ${calories} kcal</p>
                `;

                searchResultDiv.appendChild(recipeDiv);
            })
            .catch(error => {
                console.error(`Failed to fetch nutrition data for recipe ${recipe.id}:`, error); // Log errors
                recipeDiv.innerHTML = `
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <div class="flex-container">
                        <h1 class="title">${recipe.title}</h1>
                        <a class="view-button" href="#" target="_blank">View Recipe</a> <!-- Fallback link -->
                    </div>
                    <p class="item-data">Calories: Not Available</p>
                `;
                searchResultDiv.appendChild(recipeDiv);
            });
    });
}


