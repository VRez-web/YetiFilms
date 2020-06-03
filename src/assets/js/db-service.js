

 class DBservice {

    constructor() {
        this.API_KEY = 'f74144cebf6695340f4726c27579484e'
        this.SERVER = 'https://api.themoviedb.org/3'
    }

    getData = async url => {
        const response = await fetch(url)

        if (response.ok) {
            return response.json()
        } else {
            throw new Error(`Не удалось получить данные по адрес ${url}`)
        }


    }
    getSearchResults = query => {
        this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`
        return this.getData(this.temp)
    }
    getTvShow = id => this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`)
 
}



 dbService=new DBservice()