$(document).ready(function() {
    function addCSS() {
        const style = document.createElement('style');
        style.innerHTML = `
        
            .carousel-container {
                width: 100%;
                margin: 20px 0;
                text-align: center;
                font-family: Arial, sans-serif;
            }
.favorite-button{
position:absolute;
top:15px;
right:15px;
    width: 40px;
    height: 40px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .16);
    border: solid .5px #b6b7b9;
    display: flex
;
    justify-content: center;
    align-items: center;
}
            .carousel-inner {
                display: flex;
                overflow: hidden;
                scroll-behavior: smooth;
                gap: 10px;
            }

            .product-card {
                position:relative;
                flex: 0 0 16.6%;
                text-align: center;
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 10px;
                transition: transform 0.3s ease;
                display:flex;
                flex-direction:column;
                justify-content:space-between
            }

            .product-card:hover {
                transform: scale(1.05);
            }
            .product-card a{
            text-decoration:none;
            color:#0038AE;
            min-height:300px
            }
            .product-card img {
                width: 100%;
                height: auto;
                border-radius: 10px;
            }

            .heart-icon {
                font-size: 20px;
                color: #ccc;
                cursor: pointer;
            }

            .heart-icon.filled {
              fill:blue;
            }

            .carousel-navigation {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
            }

            .prev-button, .next-button {
                background-color: #f0f0f0;
                border: none;
                padding: 10px;
                font-size: 16px;
                cursor: pointer;
            }
                .card-footer{
                    display:flex;
                    justify-content:space-between;
                }
                    .card-footer p{
                    font-weight:700;
                    font-size:20px
                    }

  @media (max-width: 1024px) {
    .product-card {
        flex: 0 0 32%;
    }
}

@media (max-width: 768px) { 
    .product-card {
        flex: 0 0 48%; 
    }
}

@media (max-width: 480px) {
    .product-card {
        flex: 0 0 100%; 
    }
    .carousel-inner {
        gap: 5px; 
    }
    .prev-button, .next-button {
        padding: 12px;
        font-size: 18px;
    }
}

@media (min-width: 1440px) {
    .product-card {
        flex: 0 0 14%; 
    }
}

.heart-icon.filled {
    color: #1e90ff; 
}

.prev-button:hover, .next-button:hover {
    background-color: #dcdcdc; 
}
        `;
        document.head.appendChild(style);
    }


    addCSS();

    function getFavoriteProducts() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites;
    }

    function updateFavoriteStatus(productId, isFavorite) {
        const favorites = getFavoriteProducts();
        if (isFavorite) {
            if (!favorites.includes(productId)) {
                favorites.push(productId);
            }
        } else {
            const index = favorites.indexOf(productId);
            if (index > -1) {
                favorites.splice(index, 1);
            }
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }


    function fetchProducts() {
        const products = JSON.parse(localStorage.getItem('products'));
        if (products != null) {
            return Promise.resolve(products);
        } else {
            return $.get('https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json')
                .then(data => {
                    localStorage.setItem('products', data);
                    return data;
                })
                .catch(error => {
                    console.error('api hatası:', error);
                    return [];
                });
        }
    }
    function createCarousel(products) {
        if (!Array.isArray(products)) {
            return;
        }

        const $carouselContainer = $('<div class="carousel-container"></div>');
        const $title = $('<h2>Bunları da Beğenebilirsiniz</h2>');
        $carouselContainer.append($title);
        const $carouselInner = $('<div class="carousel-inner"></div>');

        products.slice(0, products.length).forEach(product => {
            const $productCard = $(`
                <div class="product-card">
                    <a href="${product.url}" target="_blank">
                        <img src="${product.img}" alt="${product.name}">
                              <h3>${product.name}</h3>
                    </a>
                     <div class="card-footer">
                                  <p>${product.price}₺</p>
                    <button class="favorite-button" data-product-id="${product.id}">

                    <svg class="heart-icon ${isFavorite(product.id) ? 'filled' : ''}"  width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/></svg>
                 
                    </button>
                        </div>
                  
              
                </div>
            `);
            
            $carouselInner.append($productCard);
        });

        const $carouselNavigation = $('<div class="carousel-navigation"></div>');
        const $prevButton = $('<button class="prev-button">←</button>');
        const $nextButton = $('<button class="next-button">→</button>');
        $carouselNavigation.append($prevButton, $nextButton);

        $carouselContainer.append($carouselInner, $carouselNavigation);
       
        $('.product-detail').after($carouselContainer);
    }

    function isFavorite(productId) {
        const favorites = getFavoriteProducts();
        return favorites.includes(productId);
    }

    function toggleFavoriteButton(productId) {
        const $button = $(`[data-product-id="${productId}"]`);
        const isFavorite = $button.find('.heart-icon').hasClass('filled');
        $button.find('.heart-icon').toggleClass('filled', !isFavorite);
        updateFavoriteStatus(productId, !isFavorite);
    }


    function initializeCarousel() {
        const $carouselInner = $('.carousel-inner');
        const $prevButton = $('.prev-button');
        const $nextButton = $('.next-button');

        $prevButton.on('click', function() {
            $carouselInner.animate({ scrollLeft: '-=300px' }, 300);
        });

        $nextButton.on('click', function() {
            $carouselInner.animate({ scrollLeft: '+=300px' }, 300);
        });
    }

    $(document).on('click', '.favorite-button', function() {
        const productId = $(this).data('product-id');
        toggleFavoriteButton(productId);
    });

    fetchProducts().then(products => {
       
        if (products.length > 0) {
            createCarousel(products);
            initializeCarousel();
        } else {
            console.error('Ürün verisi alınamadı!');
        }
    });
});
