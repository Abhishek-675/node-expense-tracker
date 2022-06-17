const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

function addexpense(e) {
    e.preventDefault();

    const amount = document.getElementById('amount');
    const description = document.getElementById('description');
    const category = document.getElementById('category');

    const obj = {
        amount: amount.value,
        description: description.value,
        category: category.value,
        userId
    }

    axios.post('http://localhost:3000/addexpense', obj, {headers: {'Authorization': token}})
        .then(response => {
            if (response.status === 201) {
                console.log(response.data);
                alert('expense added');
            }
            else {
                throw new Error ('Something went wrong');
            }

        })
        .catch(err => {
            console.log(err);
        });
}