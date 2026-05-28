'use strict';


const form = document.querySelector('#form');
const editForm = document.querySelector('#form-edit');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelectorAll('.form__input--type')[0];
const inputDistance = document.querySelectorAll('.form__input--distance')[0];
const inputDuration = document.querySelectorAll('.form__input--duration')[0];
const inputCadence = document.querySelectorAll('.form__input--cadence')[0];
const inputElevation = document.querySelectorAll('.form__input--elevation')[0];
const inputEditType = document.querySelectorAll('.form__input--type')[1];
const inputEditDistance = document.querySelectorAll('.form__input--distance')[1];
const inputEditDuration = document.querySelectorAll('.form__input--duration')[1];
const inputEditCadence = document.querySelectorAll('.form__input--cadence')[1];
const inputEditElevation = document.querySelectorAll('.form__input--elevation')[1];
const map = document.querySelector('#map');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    return this.description;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  #editingWorkoutId = null; // tracks which workout is being edited


  constructor() {
    this._getPosition();
    this._getLocalStorage();

    form.addEventListener('submit', this._newWorkout.bind(this));
    editForm.addEventListener('submit', this._editWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
    inputEditType.addEventListener('change', this._toggleEditElevationField.bind(this));
    containerWorkouts.addEventListener('click', this._handleWorkoutClick.bind(this));

    inputType.value = 'running';
    this._toggleElevationField();
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          map.insertAdjacentHTML('afterbegin', '<h1 class="error">Could not get your position! <br> Reload the page and try again!</h1>');
        },
      );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    this.#map.on('click', this._showForm.bind(this));

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Markers can only be added after map loads
    this.#workouts.forEach(w => this._renderWorkoutMarker(w));
  }


  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').style.display =
      inputType.value === 'cycling' ? 'flex' : 'none';
    inputCadence.closest('.form__row').style.display =
      inputType.value === 'running' ? 'flex' : 'none';
  }

  _newWorkout(e) {
    e.preventDefault();

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;

    let workout;

    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (!this._validInputs(distance, duration, cadence) || !this._allPositive(distance, duration, cadence))
        return alert('Inputs have to be positive numbers!');
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (!this._validInputs(distance, duration, elevation) || !this._allPositive(distance, duration))
        return alert('Inputs have to be positive numbers!');
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    this.#workouts.push(workout);
    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);
    this._hideForm();
    this._setLocalStorage();
  }


  _showEditForm(workout) {
    this.#editingWorkoutId = workout.id;

    inputEditType.value = workout.type;
    inputEditDistance.value = workout.distance;
    inputEditDuration.value = workout.duration;
    inputEditCadence.value = workout.cadence ?? '';
    inputEditElevation.value = workout.elevation ?? '';

    this._toggleEditElevationField();

    editForm.classList.remove('hidden');
    inputEditDistance.focus();
  }

  _hideEditForm() {
    inputEditDistance.value = inputEditDuration.value = inputEditCadence.value = inputEditElevation.value = '';
    editForm.style.display = 'none';
    editForm.classList.add('hidden');
    setTimeout(() => (editForm.style.display = 'grid'), 1000);
  }

  _toggleEditElevationField() {
    inputEditElevation.closest('.form__row').style.display =
      inputEditType.value === 'cycling' ? 'flex' : 'none';
    inputEditCadence.closest('.form__row').style.display =
      inputEditType.value === 'running' ? 'flex' : 'none';
  }

  _editWorkout(e) {
    e.preventDefault();

    const workout = this.#workouts.find(w => w.id === this.#editingWorkoutId);
    if (!workout) return;

    const type = inputEditType.value;
    const distance = +inputEditDistance.value;
    const duration = +inputEditDuration.value;

    if (type === 'running') {
      const cadence = +inputEditCadence.value;
      if (!this._validInputs(distance, duration, cadence) || !this._allPositive(distance, duration, cadence))
        return alert('Inputs have to be positive numbers!');
      workout.cadence = cadence;
      delete workout.elevation;
      workout.pace = duration / distance;
      delete workout.speed;
    }

    if (type === 'cycling') {
      const elevation = +inputEditElevation.value;
      if (!this._validInputs(distance, duration, elevation) || !this._allPositive(distance, duration))
        return alert('Inputs have to be positive numbers!');
      workout.elevation = elevation;
      delete workout.cadence;
      workout.speed = distance / (duration / 60);
      delete workout.pace;
    }

    workout.type = type;
    workout.distance = distance;
    workout.duration = duration;

    this._updateWorkoutEl(workout);
    this._hideEditForm();
    this._setLocalStorage();
    this.#editingWorkoutId = null;
  }


  _buildWorkoutHTML(workout) {
    const icon = workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️';

    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <div class="workout__top">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__options">
            <button class="workout-edit" data-id="${workout.id}">🖊</button>
            <button class="workout-delete" data-id="${workout.id}">❌</button>
          </div>
        </div>
        <div class="workout__bottom">
          <div class="workout__details">
            <span class="workout__icon">${icon}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

    if (workout.type === 'running')
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>`;

    if (workout.type === 'cycling')
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>`;

    return html + `</div></li>`;
  }

  _renderWorkout(workout) {
    editForm.insertAdjacentHTML('afterend', this._buildWorkoutHTML(workout));
  }

  _updateWorkoutEl(workout) {
    const el = document.querySelector(`.workout[data-id="${workout.id}"]`);
    if (!el) return;
    el.outerHTML = this._buildWorkoutHTML(workout);
  }

  _renderWorkoutMarker(workout) {
    workout.marker = L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        }),
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`,
      )
      .openPopup();
  }


  _handleWorkoutClick(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const workout = this.#workouts.find(w => w.id === workoutEl.dataset.id);
    if (!workout) return;

    if (e.target.classList.contains('workout-edit'))
      return this._showEditForm(workout);

    if (e.target.classList.contains('workout-delete'))
      return this._deleteWorkout(workout);

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  _deleteWorkout(workout) {
    workout.marker?.remove();
    this.#workouts = this.#workouts.filter(w => w.id !== workout.id);
    document.querySelector(`.workout[data-id="${workout.id}"]`)?.remove();
    this._setLocalStorage();
  }


  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;

    this.#workouts = data;
    this.#workouts.forEach(w => this._renderWorkout(w));
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }


  _validInputs(...inputs) {
    return inputs.every(inp => Number.isFinite(inp));
  }

  _allPositive(...inputs) {
    return inputs.every(inp => inp > 0);
  }
}

const app = new App();