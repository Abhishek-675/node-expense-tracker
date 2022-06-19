function login(e) {
    e.preventDefault();

    const email = document.getElementById('email');
    const pass = document.getElementById('pass');

    const obj = {
        email: email.value,
        password: pass.value
    }

    axios.post('http://localhost:3000/login', obj)
        .then(response => {
            console.log(response.data);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('premium', response.data.premium);
                window.location.href = '../daily-expense/index.html';
            }
            else {
                throw new Error('failed to login');
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
    
function signup() {
    window.location.href = '../sign-up/index.html';
}

function forgot() {
    const resetDiv = document.getElementById('reset-div');
    resetDiv.style.display = 'block';
}

// document.getElementById('btn-reset').addEventListener('click', function (event) {
    document.getElementById('form-reset').addEventListener('submit', function (event) {
    event.preventDefault();
    const emailReset = document.getElementById('email-reset');
    console.log(emailReset.value)
    axios.post('http://localhost:3000/reset-password', {email: emailReset.value}).then(response => {
        console.log(response.data);
    }).catch(err => console.log(err));
})
