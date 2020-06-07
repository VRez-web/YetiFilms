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

    //Все связанное с сериалами(поиск, и запросы по категориям)

    getSearchResults = query => {
        this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`
        return this.getData(this.temp)
    }

    getNextPage = page => this.getData(this.temp + '&page=' + page)

    getTvShow = id => this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`)
    getPopular = () => this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`)
    getTopRated = () => this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`)
    getNewWeek = () => this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`)
    getNewToday = () => this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`)
    getTrailer = id => this.getData(`${this.SERVER}/tv/${id}/videos?api_key=${this.API_KEY}&language=ru-RU`)
}



dbService = new DBservice()