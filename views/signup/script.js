function signup(e) {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const tel = document.getElementById('tel');
    const pass = document.getElementById('pass');

    const obj = {
        name: name.value,
        email: email.value,
        telephone: tel.value,
        password: pass.value
    }

    axios.post('http://localhost:3000/sign-up', obj)
        .then(response => {
            console.log(response.data);
            if (response.status === 201) alert('Successfuly signed up');
            else alert('Something went wrong');
        })
        .catch(response => {
            console.log(response);
            if (response.status === 403) alert('User already exists, Please Login');
        });
}