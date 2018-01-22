var btn = document.querySelector('#btn')
// btn.onclick = () => alert("Hello World")
btn.addEventListener('click', function(e) {
    e.target.style.color = 'red'
})