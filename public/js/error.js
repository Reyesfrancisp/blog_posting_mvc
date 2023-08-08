// // const registerForm = document.getElementById('register-form');

// function handleRegistrationSubmit(event) {
//     event.preventDefault();

//     const registerForm = document.getElementById('register-form');
//     const errorMessageContainer = document.getElementById('error-message-container');
//     // console.log(data.error);
//     // Check if data.error has a string value before making the fetch request
//         fetch('/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 email: registerForm.elements.email.value,
//                 username: registerForm.elements.username.value,
//                 password: registerForm.elements.password.value,
//                 verifyPassword: registerForm.elements.verifyPassword.value
//             })
//         })
//         .then(res => res.json())
//         .then(res => {
//             console.log(res);
//             if (!res) {
//                 // Clear the error message container in case there was a previous error
//                 errorMessageContainer.textContent = '';
//                 // Handle successful registration
//                 // Redirect the user to the login page upon successful registration
//                 window.location.href = '/mood';
//             } else {
//                 // Display the error message in the DOM
//                 errorMessageContainer.textContent = res.error;
//             }
//         })
//         // .catch(error => {
//         //     console.log('Error:', error);
//         //     errorMessageContainer.textContent = 'An error occurred during registration.'; // Display the error message in the DOM
//         // });
// };
// // Add event listener to the form element
// const registerForm = document.getElementById('register-form');
// registerForm.addEventListener('submit', handleRegistrationSubmit);



// // function handleLoginSubmit(event) {
// //     event.preventDefault();

// //     const loginForm = document.getElementById('login-form');
// //     const errorMessageContainer = document.getElementById('error-message-container-login');

// //     fetch('/login', {
// //         method: 'POST',
// //         headers: {
// //             'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({
// //             email: loginForm.elements.email.value,
// //             username: loginForm.elements.username.value,
// //             password: loginForm.elements.password.value,
// //             // verifyPassword: loginForm.elements.verifyPassword.value
// //         })
// //     })
// //         .then(res => {
// //             if (!res.ok) {
// //                 // Check if the network response is ok
// //                 throw new Error('Network response was not ok');
// //             }
// //             return res.json();
// //         })
// //         .then(data => {
// //             console.log(data.error);
// //             if (data.error) {
// //                 // Display the error message in the DOM
// //                 errorMessageContainer.textContent = data.error;
// //             } else {
// //                 // Clear the error message container in case there was a previous error
// //                 errorMessageContainer.textContent = '';
// //                 // Handle successful login
// //                 // Redirect the user to the mood page upon successful login
// //                 window.location.href = '/mood';
// //             }
// //         })
// //         .catch(error => {
// //             console.error('Error:', error);
// //             errorMessageContainer.textContent = 'An error occurred during login.'; // Display the error message in the DOM
// //         });
// // }

// // Add event listener to the form element
// // const loginForm = document.getElementById('login-form');
// // loginForm.addEventListener('submit', handleLoginSubmit);
