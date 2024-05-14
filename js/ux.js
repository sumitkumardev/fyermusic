var swipeEl = document.getElementById('swipe-wrap');

var mcSwipe = new Hammer.Manager(swipeEl);

var SWIPE_PLAYER_HEIGHT = window.innerHeight - 100;
var DISPLAY_SWIPE_THRESHOLD = SWIPE_PLAYER_HEIGHT / 2.5;

var lastPosY = 0;
var isDragging = false;
var canSwipeUpDown = false;
var isOpen = false;

function getTranslate3d(setting = '') {
    var values = setting.split(/\w+\(|\);?/);

    if (!values[1] || !values[1].length) {
        return [];
    }

    return values[1].split(/,\s?/g).map(value => parseInt(value, 10));
}

function setTranslate3dPosY(posY) {
    return 'translate3d(0,' + posY + 'px, 0)';
}

function hideswipeEl(elem) {
    isOpen = false;
    elem.classList.add("hide");
    elem.classList.remove("show");
    elem.classList.remove("canScroll");
    elem.style.transform = 'translate3d(0, 0px, 0)';
    lastPosY = getTranslate3d(elem.style.transform)[1];
}

function showNow(elem) {
    setTimeout(function () { isOpen = true }, 500);

    elem.classList.remove("hide");
    elem.classList.add("show");
    // var topPos = - window.innerHeight + 350;
    var topPos = -500;
    elem.style.transform = 'translate3d(0,' + topPos + 'px, 0)';
    lastPosY = getTranslate3d(elem.style.transform)[1];
}

function displayswipeEl(elem = swipeEl) {
    elem.style.transform = 'translate3d(0, 0, 0)';
    elem.classList.remove("hide");
}

function handleDrag(ev) {
    var direction = ev.offsetDirection;
    var directionDown = direction === 16;

    swipeEl.addEventListener(
        'scroll',
        function () {
            var scrollTop = swipeEl.scrollTop;
            if (scrollTop == 0) {
                canSwipeUpDown = false;
                isOpen = false;
                swipeEl.classList.remove('canScroll');
            }
            else {
                canSwipeUpDown = true;
                isOpen = true;

                swipeEl.classList.add('canScroll');
            }
        },
        false
    )

    if (isOpen && !directionDown) {
        setTranslate3dPosY(0);
        console.log('is open');
        canSwipeUpDown = true;
        swipeEl.classList.add('canScroll');
    }
    else if (!canSwipeUpDown) {
        swipeEl.classList.remove('canScroll');
        console.log('is open but scroll UP');
        var elem = swipeEl;

        // DRAG STARTED
        if (!isDragging) {
            console.log('start');
            elem.classList.remove('anim');
            isDragging = true;
            var currentPosY = getTranslate3d(elem.style.transform)[1];
            lastPosY = currentPosY ? currentPosY : 0;
        }

        var posY = ev.deltaY + lastPosY;
        elem.style.transform = setTranslate3dPosY(posY);

        // DRAG ENDED
        if (ev.isFinal) {
            console.log('end');

            elem.classList.add('anim');
            isDragging = false;

            if (Math.abs(posY) < DISPLAY_SWIPE_THRESHOLD) {
                hideswipeEl(elem);
            }
            else {
                showNow(elem);


            }

        }
    }
}

mcSwipe.add(new Hammer.Pan({
    direction: Hammer.DIRECTION_ALL,
    threshold: 0
}));
mcSwipe.on("pan", handleDrag);








// checking event observer

// Create a new observer instance
// checking event observer
// Create a new observer instance

const observer = new MutationObserver((mutationsList) => {
    // Iterate over the mutations
    for (let mutation of mutationsList) {
        // Check if the mutation type is "childList" and the target element is "searchResultD"
        if (mutation.type === 'childList' && mutation.target.id === 'searchResultD') {
            console.log('mutation observed');
            swipeEl.style.transition = 'all .3s ease'; // Add transition property
            swipeEl.style.marginTop = '-100px';

            setTimeout(function() {
                swipeEl.style.transition = ''; // Remove transition property
            }, 300); // Adjust the timeout value as needed

            // Disconnect the observer after the first mutation is observed
            observer.disconnect();
        }
    }
});
// Start observing the target element
observer.observe(document.getElementById('searchResultD'), { childList: true });