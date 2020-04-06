import JQuery from 'jquery';
import Cart from './cart';

window.$ = window.JQuery = JQuery;

// Self invoking function.
(function() {
    new Cart();
})();