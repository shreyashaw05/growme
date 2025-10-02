import axios from "axios"

export  async function getData(){
            const response = await axios.get("https://api.artic.edu/api/v1/artworks?page=1")
            console.log(response)
}