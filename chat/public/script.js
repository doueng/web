$(() => {

    const box = $('#chatBox')
    const user = $('#user')
    const input = $('#input')

    function updateBox() {
        box.empty()
        $.get('/getLog', (log) => {
            log.forEach((comment) => {
                box.append(`<p>${comment}</p>`)
            })
        })
    }

    updateBox()

    const eventSource = new EventSource('/update')
    eventSource.onmessage = (e) => {
        updateBox()
    }

    input.keydown((e) => {
        if (e.keyCode === 13)
        {
            let comment = user.val() + ': ' + input.val()
            $.post('/addComment?' + $.param({comment: comment}))
            input.val('')
        }
    })
})