import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const form = document.getElementById('promise-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const delay = parseInt(formData.get('delay'), 10);
    const state = formData.get('state');

    createPromise(delay, state);
});

function createPromise(delay, state) {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });

    promise
        .then((delay) => {
            iziToast.success({
                title: 'Fulfilled',
                message: `✅ Fulfilled promise in ${delay}ms`,
            });
        })
        .catch((delay) => {
            iziToast.error({
                title: 'Rejected',
                message: `❌ Rejected promise in ${delay}ms`,
            });
        });
}