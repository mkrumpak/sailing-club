import { BaseHelpers } from './helpers/base-helpers';

BaseHelpers.checkWebpSupport();

BaseHelpers.calcScrollbarWidth();

BaseHelpers.addTouchClass();

BaseHelpers.addLoadedClass();


//menu sidebar
const menuToggles = document.querySelectorAll('.menu-toggle');
const sideMenu = document.querySelector('.side-menu');
const backdrop = document.querySelector('.menu-backdrop');
const closeButtons = document.querySelectorAll('[data-menu-close]');

if (menuToggles.length && sideMenu && backdrop) {
    const menuLinks = sideMenu.querySelectorAll('a');

    function setMenuState(isOpen, shouldFocusToggle = false) {
        sideMenu.classList.toggle('is-open', isOpen);
        backdrop.classList.toggle('is-visible', isOpen);
        document.body.classList.toggle('menu-is-open', isOpen);

        sideMenu.setAttribute('aria-hidden', String(!isOpen));

        menuToggles.forEach((toggle) => {
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        if (!isOpen && shouldFocusToggle) {
            const activeToggle = document.activeElement;

            if (!activeToggle?.classList.contains('menu-toggle')) {
                menuToggles[0].focus();
            }
        }
    }

    function openMenu() {
        setMenuState(true);
    }

    function closeMenu(shouldFocusToggle = false) {
        setMenuState(false, shouldFocusToggle);
    }

    menuToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const isOpen = sideMenu.classList.contains('is-open');

            if (isOpen) {
                closeMenu(true);
            } else {
                openMenu();
            }
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            closeMenu(true);
        });
    });

    backdrop.addEventListener('click', () => {
        closeMenu(true);
    });

    menuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu(false);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && sideMenu.classList.contains('is-open')) {
            closeMenu(true);
        }
    });
}


// video bg transition
const videoSources = [
    'static/videos/bg-video-1.mp4',
    'static/videos/bg-video-2.mp4',
    'static/videos/bg-video-3.mp4',
    'static/videos/bg-video-4.mp4'
];

const videos = [...document.querySelectorAll('.bg-video')];

const DISPLAY_TIME = 7000;
const FADE_DURATION = 1200;

let currentIndex = 0; // Start sequentially from the first video
let activeVideoIndex = 0;
let isChanging = false;
let intervalId;

if (videos.length >= 2 && videoSources.length) {
    const [firstVideo] = videos;

    firstVideo.src = videoSources[currentIndex];
    firstVideo.load();

    firstVideo.addEventListener(
        'loadeddata',
        () => {
            firstVideo.play().catch(() => {});
            firstVideo.classList.add('bg-video--active');

            // Preload the next video in the inactive player
            preloadNextVideo();

            startVideoRotation();
        },
        { once: true }
    );

    function startVideoRotation() {
        clearInterval(intervalId);
        intervalId = setInterval(changeBackgroundVideo, DISPLAY_TIME);
    }

    // Get next index sequentially in a loop
    function getNextSourceIndex(index) {
        return (index + 1) % videoSources.length;
    }

    // Buffer upcoming video in the inactive <video> element
    function preloadNextVideo() {
        const nextVideoIndex = activeVideoIndex === 0 ? 1 : 0;
        const upcomingSourceIndex = getNextSourceIndex(currentIndex);
        const nextVideo = videos[nextVideoIndex];

        nextVideo.preload = 'auto';
        nextVideo.src = videoSources[upcomingSourceIndex];
        nextVideo.load();
    }

    function changeBackgroundVideo() {
        if (isChanging) {
            return;
        }

        isChanging = true;

        const nextIndex = getNextSourceIndex(currentIndex);
        const activeVideo = videos[activeVideoIndex];
        const nextVideoIndex = activeVideoIndex === 0 ? 1 : 0;
        const nextVideo = videos[nextVideoIndex];

        const switchVideos = () => {
            nextVideo.currentTime = 0;

            nextVideo.play()
                .then(() => {
                    nextVideo.classList.add('bg-video--active');
                    activeVideo.classList.remove('bg-video--active');

                    setTimeout(() => {
                        activeVideo.pause();
                        currentIndex = nextIndex;
                        activeVideoIndex = nextVideoIndex;
                        isChanging = false;

                        // Immediately preload the next video in queue
                        preloadNextVideo();
                    }, FADE_DURATION);
                })
                .catch(() => {
                    isChanging = false;
                });
        };

        // Smoothly switch if already buffered; otherwise wait for loadeddata
        if (nextVideo.readyState >= 2) {
            switchVideos();
        } else {
            nextVideo.addEventListener('loadeddata', switchVideos, { once: true });
        }
    }
}