// const { default: axios } = require("axios");

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

document.getElementById('btn-rzp').onclick = async function (e) {
    const response = await axios.get('http://localhost:3000/premium', {headers: {'Authorization': token}});
    console.log(response);
    var options = 
    {
        'key': response.data.key_id,
        'name': 'test',
        'order_id': response.data.order_id,
        'prefill': {
            'name': 'test user',
            'email': 'test@gmail.com',
            'contact': '1234567893'
        },
        'theme': {
            'color': '#3399cc'
        },
        'handler': function(response) {
            console.log(response);
            console.log(options);
            axios.post('http://localhost:3000/transaction-status', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
                userId,
            }, {headers: {'Authorization': token}}).then((response) => {
                if (response.data.premiumUser === true) {
                    localStorage.setItem('premiumUser', response.data.premiumUser);
                    document.body.style.backgroundColor = '#3399cc';
                }
                alert('You are now a premium user')
            }).catch(() => {
                alert('Something went wrong, try again')
            })
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();

    rzp.on('payment failed', function(response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    })
}

// window.addEventListener('DOMContentLoaded', () => {
//     console.log(localStorage.getItem('premiumUser'))
//     if (localStorage.getItem('premiumUser') && userId) {
//         document.body.style.backgroundColor = '#3399cc';
//     };
// })