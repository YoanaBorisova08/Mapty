# Mapty — Map Your Workouts

A workout tracking app that lets you log running and cycling sessions directly on a map. Click anywhere on the map to add a workout, view your history in the sidebar, and have everything saved automatically between sessions.

---

<p align="center">
  <a href="https://mapty.yoanaborisova.com">
    <img src="https://img.shields.io/badge/Live-mapty.yoanaborisova.com-3B6D11?style=for-the-badge&logo=google-chrome&logoColor=EAF3DE&labelColor=27500A"/>
  </a>
</p>

## Features

- 📍 Click on the map to log a workout at that location
- 🏃‍♂️ Track **running** workouts — distance, duration, cadence, and pace
- 🚴‍♀️ Track **cycling** workouts — distance, duration, elevation, and speed
- ✏️ Edit any existing workout
- ❌ Delete any existing workout (removes marker from map too)
- 🗑️ Delete all workouts at once with a confirmation prompt
- 💾 All workouts saved to `localStorage` — persists across page reloads
- 🗺️ Click a workout in the sidebar to pan the map to its location
- 🔍 Show All button — fits the map view to display all workout markers at once
- 📊 Sort workouts by distance (toggle ascending/descending)
- 📍 Reverse geocoding — workout descriptions include the city name (e.g. "Running in Sofia on May 3")
- ⚠️ Inline error messages with auto-dismiss after 3 seconds

---

## How to Use

1. Open the app and allow location access when prompted
2. Click anywhere on the map to open the add workout form
3. Choose a type (Running or Cycling), fill in the details, and press OK
4. Your workout appears in the sidebar and as a marker on the map
5. Use the ✏️ button to edit or ❌ to delete a workout
6. Use **Sort by distance** to toggle the workout list order
7. Use **Show All** to fit all markers on screen at once
8. Use **Delete All** to clear everything with a confirmation step

---

## Tech Stack

- Vanilla JavaScript (ES6+ classes, private fields, async/await, geolocation API)
- [Leaflet.js](https://leafletjs.com/) for the interactive map
- [CartoDB](https://carto.com/) map tiles
- [geocode.maps.co](https://geocode.maps.co/) for reverse geocoding
- `localStorage` for persistence
- HTML5 & CSS3

---

## Project Structure

```
mapty/
├── index.html
├── style.css
├── script.js
├── config.js       # API key — never commit this
├── .gitignore
└── README.md
```

---

## Environment Setup

This project uses the [geocode.maps.co](https://geocode.maps.co/) API for reverse geocoding. Create a `config.js` file in the root directory with your key:

```js
// config.js
const config = {
  API_KEY: 'your_api_key_here'
};
```

Make sure `config.js` is listed in `.gitignore` so your key is never pushed to GitHub.

---

## Credits

The original project concept, design, and base implementation come from the **JavaScript course by [Jonas Schmedtmann](https://twitter.com/jonasschmedtman)**. This version extends the original with additional features including edit/delete workouts, sort, show all, reverse geocoding, and a refactored code structure.

> ⚠️ This project is intended for learning and portfolio use only. Please do not use it for teaching or claim it as entirely your own work — credit Jonas Schmedtmann for the original idea and foundation.
