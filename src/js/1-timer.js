// import flatpickr from "flatpickr";
// import "flatpickr/dist/flatpickr.min.css";
// import iziToast from "izitoast";
// import "izitoast/dist/css/iziToast.min.css";

// const startButton = document.querySelector('button[data-start]');
// const datePicker = document.querySelector('#datetime-picker');
// const timerFields = {
//     days: document.querySelector('[data-days]'),
//     hours: document.querySelector('[data-hours]'),
//     minutes: document.querySelector('[data-minutes]'),
//     seconds: document.querySelector('[data-seconds]'),
// };

// let timerInterval;
// let userSelectedDate = null;

// startButton.disabled = true;

// const options = {
//     enableTime: true,
//     time_24hr: true,
//     defaultDate: new Date(),
//     minuteIncrement: 1,
//     onClose(selectedDates) {
//         const selectedDate = selectedDates[0];
//         if (selectedDate < new Date()) {
//             iziToast.error({
//                 title: "Error",
//                 message: "Please choose a date in the future",
//             });
//             startButton.disabled = true;
//         } else {
//             userSelectedDate = selectedDate;
//             startButton.disabled = false;
//         }
//     },
// };

// flatpickr(datePicker, options);

// startButton.addEventListener("click", () => {
//     if (!userSelectedDate) return;

//     const startTime = new Date();
//     const endTime = userSelectedDate.getTime();

//     startButton.disabled = true;
//     datePicker.disabled = true;

//     function updateTimer() {
//         const currentTime = new Date();
//         const timeRemaining = endTime - currentTime.getTime();

//         if (timeRemaining <= 0) {
//             clearInterval(timerInterval);
//             datePicker.disabled = false;
//             timerFields.days.textContent = '00';
//             timerFields.hours.textContent = '00';
//             timerFields.minutes.textContent = '00';
//             timerFields.seconds.textContent = '00';
//             return;
//         }

//         const { days, hours, minutes, seconds } = convertMs(timeRemaining);

//         timerFields.days.textContent = addLeadingZero(days.toString());
//         timerFields.hours.textContent = addLeadingZero(hours.toString());
//         timerFields.minutes.textContent = addLeadingZero(minutes.toString());
//         timerFields.seconds.textContent = addLeadingZero(seconds.toString());
//     }

//     timerInterval = setInterval(updateTimer, 1000);
//     updateTimer(); // Initial call to set values at start
// });

// function convertMs(ms) {
//     const second = 1000;
//     const minute = second * 60;
//     const hour = minute * 60;
//     const day = hour * 24;

//     const days = Math.floor(ms / day);
//     const hours = Math.floor((ms % day) / hour);
//     const minutes = Math.floor(((ms % day) % hour) / minute);
//     const seconds = Math.floor((((ms % day) % hour) % minute) / second);

//     return { days, hours, minutes, seconds };
// }

// function addLeadingZero(value) {
//     return value.padStart(2, '0');
// }
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysField = document.querySelector('[data-days]');
const hoursField = document.querySelector('[data-hours]');
const minutesField = document.querySelector('[data-minutes]');
const secondsField = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let countdownInterval = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (selectedDate <= new Date()) {
            iziToast.warning({
                title: 'Invalid Date',
                message: 'Please choose a date in the future',
            });
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedDate;
            startButton.disabled = false;
        }
    },
};

flatpickr(datetimePicker, options);

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
    daysField.textContent = addLeadingZero(days);
    hoursField.textContent = addLeadingZero(hours);
    minutesField.textContent = addLeadingZero(minutes);
    secondsField.textContent = addLeadingZero(seconds);
}

function startCountdown() {
    const targetDate = new Date(userSelectedDate);
    const now = new Date();
    const timeDiff = targetDate - now;

    if (timeDiff <= 0) {
        clearInterval(countdownInterval);
        updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        datetimePicker.disabled = false; // Увімкнути, щоб обрати нову дату
        return;
    }

    const timeValues = convertMs(timeDiff);
    updateTimerDisplay(timeValues);

    countdownInterval = setInterval(() => {
        const now = new Date();
        const timeDiff = targetDate - now;

        if (timeDiff <= 0) {
            clearInterval(countdownInterval);
            updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            datetimePicker.disabled = false; // Увімкнути, щоб обрати нову дату
            return;
        }

        const timeValues = convertMs(timeDiff);
        updateTimerDisplay(timeValues);
    }, 1000);
}

startButton.addEventListener('click', () => {
    if (userSelectedDate && !countdownInterval) {
        datetimePicker.disabled = true; // Відключити, щоб не можна було змінити дату під час відліку
        startButton.disabled = true; // Відключити кнопку "Start" під час роботи таймера
        startCountdown();
    }
});