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
    pagination = document.querySelector('.pagination'),
    trailer = document.querySelector('#trailer'),
    trailerHead = document.querySelector('.head-trailer'),
    preloader = document.querySelector('.preloader'),
    tvHeadTitle = document.querySelector('.tv-search__result-txt')



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
        dbService.getTopRated().then((response) => {
            moduleRendCard(response, target)
            tvHeadTitle.textContent = 'Лучшие сериалы:'
        })
    }
    if (target.closest('#popular')) {
        dbService.getPopular().then((response) => {
            moduleRendCard(response, target)
            tvHeadTitle.textContent = 'Популярные сериалы:'
        })
    }
    if (target.closest('#today')) {
        dbService.getNewToday().then((response) => {
            moduleRendCard(response, target)
            tvHeadTitle.textContent = 'Новинки за сегодня:'
        })


    }
    if (target.closest('#week')) {
        dbService.getNewWeek().then((response) => {
            moduleRendCard(response, target)
            tvHeadTitle.textContent = 'Новинки за неделю:'
        })
    }




})


//Поиск

searchForm.addEventListener('submit', event => {
    event.preventDefault()

    const value = searchFormInput.value.trim()
    searchFormInput.value = ''
    if (value) {
        preloader.style.display = 'block'

        dbService.getSearchResults(value)
            .then(moduleRendCard)
            .finally(() => {
                preloader.style.display = ''
            })


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
        preloader.style.display = 'block'
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

                return card.id
            })
            .then(dbService.getTrailer)
            .then(response => {
                trailer.textContent = ''

                trailerHead.classList.add('hide')

                if (response.results.length) {
                    trailerHead.classList.remove('hide')
                    response.results.forEach(item => {

                        const trailerItem = document.createElement('li')

                        trailerItem.innerHTML = `
                            <iframe 
                                width="450" 
                                height="300" 
                                src="https://www.youtube.com/embed/${item.key}"
                                frameborder="0" 
                                allowfullscreen
                                class="mb-3">
                            </iframe>
                            <h4>${item.name}</h4>
                        `

                        trailer.append(trailerItem)
                    })
                }

            })
            .then(modal.classList.remove('hide'))
            .finally(() => preloader.style.display = '')

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

    // const pageActive=document.querySelector('.page-item')
    const target = event.target
    // pageActive.classList.add('active')
    if (target.classList.contains('page-link')) {
        dbService.getNextPage(target.textContent).then(moduleRendCard)

    }
})



//Контент при загрузке страницы
document.addEventListener('DOMContentLoaded', event => {
    const target = event.target
    tvHeadTitle.textContent = 'Новинки на сегодня'
    dbService.getNewToday().then((response) => {
        moduleRendCard(response, target)
        tvHeadTitle.textContent = 'Новинки за сегодня:'
    })

})