const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'

const tvList = document.querySelector('.tv-list'),
    tvHeadTitle = document.querySelector('.tv-search__result-txt'),
    pagination = document.querySelector('.pagination')


 const renderCard  = (response, target) => {
    tvList.textContent = ''

    if (!response.total_results) {
        tvHeadTitle.textContent = 'К сожалению по вашему запросу ничего не найдено...'
        return
    }
    tvHeadTitle.textContent = target ? target.textContent : `Результат поиска:`

    response.results.forEach(item => {
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
            id
        } = item

        const posterImg = poster ? IMG_URL + poster : './assets/img/no-poster.jpg'
        const backdropIMG = backdrop ? IMG_URL + backdrop : ''
        const voteElem = vote ? ` <span class="tv-card__vote">${vote}</span> ` : ''

        const card = document.createElement('li')
        card.idTv = id
        card.classList.add('tv-list__item')
        card.innerHTML = `

              <a href="#" id="${id}" class="tv-card">
                ${voteElem}
                <img src="${posterImg}" alt="${title}" class="tv-card__img img-fluid" data-backdrop="${backdropIMG}">
                <h4 class="tv-card__title">${title}</h4>
              </a>
        `
        tvList.append(card)
    })
    pagination.innerHTML = ''
    if (!target && response.total_pages > 1) {
        for (let i = 1; i <= response.total_pages; i++) {
            pagination.innerHTML += `<li class="page-item"><a href="#" class="page-link">${i}</a></li>`
        }

    }
}

moduleRendCard = renderCard