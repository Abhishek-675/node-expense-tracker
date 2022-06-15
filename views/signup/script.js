// const { default: axios } = require("axios");

const btn = document.querySelector('#btn');

btn.addEventListener('click', () => {
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const tel = document.querySelector('#tel');
    const pass = document.querySelector('#pass');

    const obj = {
        name: name.value,
        email: email.value,
        tel: tel.value,
        pass: pass.value
    }

    axios.post('http://localhost:3000/sign-up', obj)
        .then(() => {
            console.log('success');
        });
})