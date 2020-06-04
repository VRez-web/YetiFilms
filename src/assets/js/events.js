const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'

const menu = document.querySelector('.menu'),
    dropDown = document.querySelectorAll('.menu__list-dropdown'),
    hamburger = document.querySelector('.menu__hamburger'),
    searchForm = document.querySelector('.search-form'),
    searchFormInput = document.querySelector('.search-form__input'),
    tvList = document.querySelector('.tv-list'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modal = document.querySelector('.modal'),
    modalTitle = document.querySelector('.modal-title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    modalDescription = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    pagination = document.querySelector('.pagination')




const closeDropdown = () => {

    dropDown.forEach(item => {
        item.classList.remove('active')
    })
}


//Работа с меню
document.addEventListener('click', event => {
    if (!event.target.closest('.menu')) {
        menu.classList.remove('open-menu')
        closeDropdown()
    }
})



menu.addEventListener('click', event => {
    event.preventDefault()

    const target = event.target
    const dropdown = target.closest('.menu__list-dropdown')
    menu.classList.add('open-menu')
    if (dropdown) {
        dropdown.classList.toggle('active')

    }

    if (target.closest('#top-rated')) {
        dbService.getTopRated().then((response) => moduleRendCard(response, target))
    }
    if (target.closest('#popular')) {
        dbService.getPopular().then((response) => moduleRendCard(response, target))
    }
    if (target.closest('#today')) {
        dbService.getNewToday().then((response) => moduleRendCard(response, target))
    }
    if (target.closest('#week')) {
        dbService.getNewWeek().then((response) => moduleRendCard(response, target))
    }




})


//Поиск

searchForm.addEventListener('submit', event => {
    event.preventDefault()

    const value = searchFormInput.value.trim()
    searchFormInput.value = ''
    if (value) {
        dbService.getSearchResults(value).then(moduleRendCard)
        console.log(dbService.getSearchResults(value))

    }

})
//Смена постера
const changeImg = event => {
    const card = event.target.closest('.tv-list__item')

    if (card) {
        const cardImg = card.querySelector('.tv-card__img')

        if (cardImg.dataset.backdrop) {
            [cardImg.src, cardImg.dataset.backdrop] = [cardImg.dataset.backdrop, cardImg.src]
        }
    }



}


tvList.addEventListener('mouseover', changeImg)
tvList.addEventListener('mouseout', changeImg)

//Работа с модальным окном


tvList.addEventListener('click', event => {
    event.preventDefault()
    const target = event.target
    const card = target.closest('.tv-card')
    const modalCardImg = document.querySelector('.modal-img')

    if (card) {
        dbService.getTvShow(card.id)
            .then(({
                poster_path: posterPath,
                name: title,
                genres,
                vote_average: voteAverage,
                overview,
                homepage
            }) => {



                if (posterPath) {
                    modalCardImg.src = IMG_URL + posterPath
                    modalCardImg.alt = title


                } else {
                    modalCardImg.src = './assets/img/no-poster.jpg'
                }


                modalTitle.textContent = title
                genresList.textContent = ''
                for (const item of genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`
                }

                rating.textContent = voteAverage
                modalDescription.textContent = overview
                modalLink.href = homepage
            }).then(modal.classList.remove('hide'))
    }
})





//Закрытие модального окна
modal.addEventListener('click', event => {
    if (event.target.closest('.close') || event.target.classList.contains('modal')) {
        modal.classList.add('hide')
    }
})


//переход на следующею страницу
pagination.addEventListener('click', event => {
    event.preventDefault()
    const target=event.target
    if(target.classList.contains('pages')){
        dbService.getNextPage(target.textContent).then(moduleRendCard)
    }
})