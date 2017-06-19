import { h, render } from 'preact';
import App from './App';



const dots = (loader) => {
    let i = 0;
    setInterval(function() {
        i++;
        loader.insertAdjacentHTML('beforeend', '<span>.</span>');
        if (i >= 4) {
            i = 0;
            loader.querySelectorAll("span").forEach(span => {
                span.remove();
            });
        }
    }, 500);
};

export function init() {

    const loader = document.getElementById('preact-loader');
    dots(loader);
    fetch('/storelocator/index/json')
        .then(data => data.json())
        .then(json => {
            loader.remove();
            render(<App json={json}/>, document.getElementById('preact-root'));
        });
}
