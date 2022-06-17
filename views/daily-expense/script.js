function expense(e) {
    e.preventDefault();

    const amount = document.getElementById('amount');
    const description = document.getElementById('description');
    const category = document.getElementById('category');

    const obj = {
        amount: amount.value,
        description: description.value,
        category: category.value
    }

    axios.post('http://localhost:3000/expense', obj)
        .then(response => {
            console.log(response.data);
        })
        .catch(err => {
            console.log(err);
        });
}