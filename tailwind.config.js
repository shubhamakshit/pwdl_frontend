module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        fontFamily: {
        ubutnu: ['Anonymous Pro', 'mono'],
        },
        extend: {
            colors: {
                navbar: "#10439F",
            }
        },
    },
    plugins: [
        require('daisyui'),
    ],
}