const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

function addexpense(e) {
    e.preventDefault();

    const amount = document.getElementById('amount');
    const description = document.getElementById('description');
    const category = document.getElementById('category');

    showOnScreen(amount.value, description.value, category.value);

    const obj = {
        amount: amount.value,
        description: description.value,
        category: category.value,
        userId
    }

    axios.post('http://localhost:3000/addexpense', obj, { headers: { 'Authorization': token } })
        .then(response => {
            if (response.status === 201) {
                console.log(response.data);
                alert('expense added');
            }
            else {
                throw new Error('Something went wrong');
            }

        })
        .catch(err => {
            console.log(err);
        });
}

document.getElementById('btn-rzp').onclick = async function (e) {
    const response = await axios.get('http://localhost:3000/premium', { headers: { 'Authorization': token } });
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
        'handler': function (response) {
            console.log(response);
            console.log(options);
            axios.post('http://localhost:3000/transaction-status', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
                userId,
            }, { headers: { 'Authorization': token } }).then((response) => {
                console.log(response.data);
                localStorage.setItem('premium', response.data.premium);
                document.body.style.backgroundColor = '#3399cc';
                alert('You are now a premium user')
            }).catch(() => {
                alert('Something went wrong, try again')
            })
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();

    rzp.on('payment failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    })
}

window.addEventListener('DOMContentLoaded', () => {
    // console.log(localStorage.getItem('premium'))
    if (localStorage.getItem('premium') === 'true') {
        document.body.style.backgroundColor = '#3399cc';
        const leaderboardContainer = document.getElementById('leaderboard-container');
        leaderboardContainer.style.display = 'block';
        axios.get('http://localhost:3000/get-users').then((response) => {
            // console.log(response.data);
            const div = document.getElementById('leaderboard-content');
            response.data.username.forEach(name => {
                div.innerHTML += `<div id='${name.id}' class='user'><span>${name.name}</span><span><button onclick='showExpenseOnScreen(${name.id})'>Show Expense</button></span></div>`;
                showExpense(name.id);
            });
        }).catch(err => console.log(err));

        document.getElementById('download-btn').style.display = 'block';
        document.getElementById('btn-rzp').style.display = 'none';
    };


    axios.post('http://localhost:3000/get-expense', { userId: userId }, { headers: {'Authorization': token}}).then(response => {
        console.log(response.data.expense);
        response.data.expense.forEach(expense => {
            showOnScreen(expense.amount, expense.description, expense.category, expense.id);
        })
    }).catch(err => console.log(err));
})

function showOnScreen(amount, description, category, id) {
    const div = document.createElement('div');
    div.setAttribute('id', `display-${id}`);
    div.setAttribute('class', 'display-expense-inside');
    div.innerHTML = `<span>${amount}</span><span>${description}</span><span>${category}</span>
    <button id='del-btn-inside' onclick='deletee(${id})'>Delete</button>`;
    const displayDiv = document.getElementById('expense-display');
    displayDiv.append(div);
}

function deletee(id) {
    axios.post('http://localhost:3000/delete-expense', { id: id }, { headers: {'Authorization': token}}).then(response => {
        console.log(response.data);
    }).catch(err => console.log(err));
    document.getElementById(`display-${id}`).remove();
}

function logout(e) {
    window.location.href = '../login/index.html';
}

function showExpense(id) {
    axios.post('http://localhost:3000/get-expense', { userId: id }, { headers: {'Authorization': token}}).then(response => {
        // console.log(response.data);
        const div = document.createElement('div');
        div.setAttribute('id', `expense-content-${id}`);
        div.setAttribute('class', 'expense-container');
        div.setAttribute('style', 'display: none');
        response.data.expense.forEach(expense => {
            div.innerHTML += `<div id='${expense.id}-exp'><span>Amount:${expense.amount}</span><span>Description:${expense.description}</span>
            <span>Category:${expense.category}</div>`
        })
        const parent = document.getElementById(`${id}`);
        parent.after(div);
    }).catch(err => console.log(err));
}

function showExpenseOnScreen(id) {
    const x = document.getElementById(`expense-content-${id}`)
    if (x.style.display === 'none') x.style.display = 'block';
    else x.style.display = 'none';
}

function download() {
    axios.get('http://localhost:3000/download', { headers: {'Authorization': token}})
    .then(response => {
        if (response.status === 201) {
            var a = document.createElement('a');
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message);
        }
    }).catch(err => {
        showError(err);
    })
}

function showError(err) {
    document.body.innerHTML += `<div style='color:red;'>${err}</div>`
}