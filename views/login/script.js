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
                window.location.href = '../daily-expense/index.html';
            }
        })
        .catch(err => {
            console.log(err);
        });
}