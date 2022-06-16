function signup(e) {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const tel = document.getElementById('tel');
    const pass = document.getElementById('pass');

    const obj = {
        name: name.value,
        email: email.value,
        tel: tel.value,
        pass: pass.value
    }

    axios.post('http://localhost:3000/sign-up', obj)
        .then(response => {
            console.log(response);
            alert('Successfuly signed up');
        })
        .catch(response => {
            console.log(response);
            alert('User already exists, Please Login');
        });
}