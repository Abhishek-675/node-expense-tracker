const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

//premium-user
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

//add-expense
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


window.addEventListener('DOMContentLoaded', () => {

    if (localStorage.getItem('premium') === 'true') {
        document.body.style.backgroundColor = '#3399cc';
        const leaderboardContainer = document.getElementById('leaderboard-container');
        leaderboardContainer.style.display = 'block';

        //leaderboard
        axios.get('http://localhost:3000/get-users').then((response) => {
            // console.log(response.data)
            const div = document.getElementById('leaderboard-content');
            response.data.username.forEach(name => {
                div.innerHTML += `
                    <div id='${name.id}' class='user'>
                    <span>${name.name}</span>
                    <span><button onclick='showExpenseOnScreen(${name.id})'>Show Expense</button></span>
                    </div>`;

                    showExpense(name.id);
            });
        }).catch(err => console.log(err));

        document.getElementById('download-btn').style.display = 'block';
        document.getElementById('btn-rzp').style.display = 'none';
    };

    //expenses
    axios.post('http://localhost:3000/get-expense', { userId: userId }, { headers: { 'Authorization': token } }).then(response => {
        console.log(response.data);

        showExpensesNew(response);

    }).catch(err => console.log(err));

})

function showExpensesNew(response) {
    const displayDiv = document.getElementById('expense-display');
    displayDiv.innerHTML = '';

    response.data.expense.forEach(expense => {

        const div = `
        <div class='display-expense-inside' id='display-${expense.id}'>
        <span id='${expense.id}'>${expense.amount}</span>
                    <span id='${expense.id}'>${expense.description}</span>
                    <span id='${expense.id}'>${expense.category}</span>
                    <button id='del-btn-inside' onclick='deletee(${expense.id})'>Delete</button>
                    </div>`;

        displayDiv.innerHTML += div;
    })

    //pagination
    const pagination = document.getElementById('pagination');
    pagination.classList.add('pagination');
    let paginationChild = '';

    if (response.data.pagination.currentPage !==1 && response.data.pagination.previousPage !==1) {
        paginationChild += `<button class='pagination-btn' id='pagination' onclick='pagination(${1})'>First</button>`;
    }
    
    if (response.data.pagination.hasPreviousPage) {
        paginationChild += `<button class='pagination-btn' id='pagination' onclick='pagination(${response.data.pagination.previousPage})'>Prev</button>`;
    }

    paginationChild += `<button class='pagination-btn' id='pagination' onclick='pagination(${response.data.pagination.currentPage})'>${response.data.pagination.currentPage}</button>`;

    if (response.data.pagination.hasNextPage) {
        paginationChild += `<button class='pagination-btn' id='pagination' onclick='pagination(${response.data.pagination.nextPage})'>Next</button>`;
    }

    if (response.data.pagination.lastPage !== response.data.pagination.currentPage && response.data.pagination.nextPage !== response.data.pagination.lastPage) {
        paginationChild += `<button class='pagination-btn' id='pagination' onclick='pagination(${response.data.pagination.lastPage})'>Last</button>`;
    }

    pagination.innerHTML = paginationChild;

}

function pagination(page) {
    axios.post(`http://localhost:3000/get-expense?page=${page}`, { userId: userId }, { headers: { 'Authorization': token } })
        .then(response => {
            console.log(response.data)

            showExpensesNew(response);
        })
        .catch(err => {
            console.log(err);
        })
}


//leaderboard
function showExpenseOnScreen(id) {

    const x = document.getElementById(`expense-content-${id}`)
    if (x.style.display === 'none') x.style.display = 'block';
    else x.style.display = 'none';
}

//leaderboard
function showExpense(id) {
    axios.post(`http://localhost:3000/get-expense`, { userId: id }).then(response => {
        console.log(response.data);
        // console.log(id)
        const div = document.createElement('div');
        div.setAttribute('id', `expense-content-${id}`);
        div.setAttribute('class', 'expense-container');
        div.setAttribute('style', 'display: none');

        response.data.expense.forEach(expense => {
            div.innerHTML += `
                <div id='${expense.id}-exp'>
                <span>Amount:${expense.amount}</span>
                <span>Description:${expense.description}</span>
                <span>Category:${expense.category}</span>
                </div>`;
        })

        const parent = document.getElementById(`${id}`);
        parent.after(div);

    }).catch(err => console.log(err));
}


function deletee(id) {
    axios.post('http://localhost:3000/delete-expense', { id: id }, { headers: { 'Authorization': token } }).then(response => {
        console.log(response.data);
        alert('deleted successfully');
    }).catch(err => console.log(err));
    document.getElementById(`display-${id}`).remove();
}

function logout(e) {
    window.location.href = '../login/index.html';
}



function download() {
    axios.get('http://localhost:3000/download', { headers: { 'Authorization': token } })
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