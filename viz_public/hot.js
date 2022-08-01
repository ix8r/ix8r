function hotReload() {
    fetch("/viz_data").then(
        res => {
            if (res.status !== 200) {
                throw new Error("404")
            }

            return res.text()
        }
    ).then(
        data => {
            document.querySelector("main").innerHTML = data
        }
    ).catch(
        () => {}
    )
}

hotReload()
setInterval(() => hotReload(), 1000)