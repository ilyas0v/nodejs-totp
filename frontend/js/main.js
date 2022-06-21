document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:3000/api'

    window.vm = new Vue({
        el: '#vapp',
        data: {
            currentPage: 'register',
            registerForm: {
                fullname: '',
                email: '',
                password: '',
                qrCode: ''
            },
            loginForm: {
                email: '',
                password: '',
                token: '',
                success: false
            },
        },

        created: function () {},

        methods: {
            register: function () {
                const body = {
                    fullname: this.registerForm.fullname,
                    email: this.registerForm.email,
                    password: this.registerForm.password,
                }

                fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if(data.qrCode) {
                            this.registerForm.qrCode = data.qrCode
                        }
                    })
                    .catch((err) => console.log(err))
            },

            login: function () {
                const body = {
                    email: this.loginForm.email,
                    password: this.loginForm.password,
                    token: this.loginForm.token,
                }

                fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            this.loginForm.success = true
                        }
                    })
                    .catch((err) => console.log(err))
            },

            changeCurrentPage: function (page) {
                this.currentPage = page
            },
        },
    })
})
