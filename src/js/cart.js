import { storeData, getStoredData, removeData} from './utils';

const $cache = {
    cartWrapper: undefined,
    cartWrapperList: undefined,
    cartHeader: undefined,
    productList: undefined,
    subtotal: undefined,
    totalCost: undefined
};

let cartData = null;

export default class Cart {
    constructor() {
        this.cacheObjects();
        this.bindEvents();
        this.fetchData();

        this.updateCart = this.updateCart.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
    }

    cacheObjects() {
        $cache.cartWrapper = $('body').find('.cart-wrapper');
        $cache.cartWrapperList = $cache.cartWrapper.find('.cart-wrapper__list');
        $cache.cartHeader = $cache.cartWrapperList.find('.cart-header');
        $cache.productList = $cache.cartWrapper.find('.product-list');
        $cache.subtotal = $cache.cartWrapperList.find('.subtotal');
        $cache.totalCost = $cache.cartWrapperList.find('.total-cost');
    }

    fetchData() {
        cartData = getStoredData('cartData');
        if(!!cartData) {
            this.updateCartTemplate();
        } else {    // fetch data from mock json.
            fetch('data/product/product.json')
            .then((response) => response.json())
            .then((data) => {
                try {
                    cartData = data;
                    storeData('cartData', cartData);
                    this.updateCartTemplate();
                } catch(e) {
                    // do nothing.
                }
            });
        }
    }

    updateCartTemplate() {
        // update cart template data
        if(!!cartData) {
            // set copy right
            $('body .copyright').html(cartData.copyright);
            // set applicable VAT
            $cache.subtotal.find('.subtotal__label span').eq(1).html(`Vat @ ${cartData.applicableVAT}%`);
            // add cart items
            if(!!cartData.arrayOfProducts && cartData.arrayOfProducts.length) {
                $cache.productList.empty();
                cartData.arrayOfProducts.forEach((product, index) => {
    
                    let listItem = `<li data-product-id="${product.id}" class="product-list__item row">
                                        <div class="product-list__info col-xl-8 col-lg-8 col-md-8 col-sm-12 d-flex flex-row justify-content-start">
                                            ${product.id}
                                            <a class="product-list__info__image-link mr-3" 
                                                href="${product.thumbImg}" title="${product.title}">
                                                <img src="${product.thumbImg}" 
                                                    alt="${product.title}" title="${product.title}"> 
                                            </a>
                                            <div class="product-list__info__description d-flex flex-column justify-content-start">
                                                <div class="product-title font-weight-bold">
                                                    ${product.title}
                                                </div>
                                                <div class="price">
                                                    ${cartData.currencyCode}${product.price}
                                                </div>
                                                <div class="quantity">
                                                    <select name="qty">
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="product-total d-flex justify-content-between col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                            <div class="product-total__value">$300</div>
                                            <div class="product-total__remove">
                                                <a href="#">
                                                    <img src="assets/images/delete-icon.png" title="remove product" alt="remove product"/>
                                                </a>
                                            </div>
                                        </div>
                                    </li>`;
                    
                    $cache.productListInfo = $cache.productList.append(listItem);
                    $cache.productList.find('.product-list__item').eq(index).find('select').val(product.quantity);
                });

                this.updateCart();
                $cache.cartWrapper.removeClass('d-none');
            }
            this.showEmptyCartHeading();
        }
    }

    updateCart() {
        let subtotal = 0,
            applicableVAT = 0,
            grandTotal = 0;

        cartData.arrayOfProducts.forEach((product, index) => {
            let $productItem = $cache.productList.find('.product-list__item').eq(index);
            let selectedQty = $productItem.find('.quantity select').val();
            
            $productItem.find('.product-total__value').html(cartData.currencyCode + (product.price * selectedQty));
            subtotal += parseInt(product.price * selectedQty);
            product.quantity = selectedQty;
        });

        $cache.subtotal.find('.subtotal__value span').eq(0).html(cartData.currencyCode + subtotal);
        // apply VAT
        applicableVAT = parseInt((subtotal * cartData.applicableVAT) / 100);
        $cache.subtotal.find('.subtotal__value span').eq(1).html(cartData.currencyCode + applicableVAT);
        $cache.totalCost.find('.total-cost__value').html(cartData.currencyCode + (subtotal + applicableVAT));
        $cache.cartWrapper.find('.cart-wrapper__title').html(`You have ${cartData.arrayOfProducts.length} items in you cart.`);

        this.showEmptyCartHeading();
        storeData('cartData', cartData);
    }

    removeProduct(e) {
        let $productRemove = $(e.target),
            $productListItem = $productRemove.closest('.product-list__item'),
            productId = $productListItem.data('product-id');

        $productListItem.remove();

        cartData.arrayOfProducts = cartData.arrayOfProducts.filter((product) => (product.id != productId));
        this.updateCart();
        this.showEmptyCartHeading();
    }

    showEmptyCartHeading() {
        if(!!cartData && cartData.arrayOfProducts.length) {
            $cache.cartWrapper.removeClass('d-none');
            $('body').find('.emtry-cart').addClass('d-none');
        } else {
            $('body').find('.emtry-cart').html('Your cart is empty.' + '<a class="add-items" href="#">Click here to add items in cart again !</a>');
            $cache.cartWrapper.addClass('d-none');
            $('body').find('.emtry-cart').removeClass('d-none');
        }
    }

    addItems() {
        // reset Cart data.
        removeData('cartData');
        cartData = null;
        this.fetchData();
        this.showEmptyCartHeading();
    }

    bindEvents() {
        // Quantity change event handler 
        $cache.cartWrapper.on('change', '.quantity', this.updateCart.bind(this));

        // Click to remove product 
        $cache.cartWrapper.on('click', '.product-total__remove a', this.removeProduct.bind(this));

        // Add items in cart
        $('body').off('click.additems').on('click.additems', '.add-items', this.addItems.bind(this));

        // Buy product
        $('#cartForm').submit((e) => {
            e.preventDefault();

            console.log('success');
            alert(JSON.stringify(cartData));
            console.log('Product Data: ', cartData.arrayOfProducts)
        }); 
    }
};