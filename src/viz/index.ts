import express from "express"
import { join } from "path"

export default function startViz(data: string) {
    const app = express()

    app.use(express.static(
        join(__dirname, "../../viz_public")
    ))

    app.get("/viz_data", (req, res) => {
        res.type("html")
        res.send(data)

        setTimeout(() => {
            console.log("Viz exiting. Keep browser open to allow reloading.")
            process.exit()
        }, 500)
    })

    app.listen(8888, () => {
        console.log("Viz started @ http://localhost:8888/")
    })
}