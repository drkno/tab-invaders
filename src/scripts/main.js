import executeButton from './button';
import executeGame from './game';
import executeOptions from './options';

const main = () => {
    const loc = document.location.pathname;
    if (loc === '/index.html') {
        executeGame();
    }
    else if (loc === '/options.html') {
        executeOptions();
    }
    else {
        executeButton();
    }
};

main();
