# Mapty — Map Your Workouts

A workout tracking app that lets you log running and cycling sessions directly on a map. Click anywhere on the map to add a workout, view your history in the sidebar, and have everything saved automatically between sessions.

---

## Features

- 📍 Click on the map to log a workout at that location
- 🏃‍♂️ Track **running** workouts — distance, duration, cadence, and pace
- 🚴‍♀️ Track **cycling** workouts — distance, duration, elevation, and speed
- ✏️ Edit any existing workout
- ❌ Delete any existing workout (removes marker from map too)
- 💾 All workouts saved to `localStorage` — persists across page reloads
- 🗺️ Click a workout in the sidebar to pan the map to its location

---

## How to Use

1. Open the app and allow location access when prompted
2. Click anywhere on the map to open the add workout form
3. Choose a type (Running or Cycling), fill in the details, and press OK
4. Your workout appears in the sidebar and as a marker on the map
5. Use the ✏️ button to edit or ❌ to delete a workout

---

## Tech Stack

- Vanilla JavaScript (ES6+ classes, private fields, geolocation API)
- [Leaflet.js](https://leafletjs.com/) for the interactive map
- [OpenStreetMap](https://www.openstreetmap.org/) tiles
- `localStorage` for persistence
- HTML5 & CSS3

---

## Project Structure

```
mapty/
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## Credits

The original project concept, design, and base implementation come from the **JavaScript course by [Jonas Schmedtmann](https://twitter.com/jonasschmedtman)**. This version extends the original with additional features including edit workout functionality, delete with map marker removal, and refactored code structure.

> ⚠️ This project is intended for learning and portfolio use only. Please do not use it for teaching or claim it as entirely your own work — credit Jonas Schmedtmann for the original idea and foundation.