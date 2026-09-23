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

//Old version with auto transition
// video bg transition
// const videoSources = [
//     'static/videos/bg-video-1.mp4',
//     'static/videos/bg-video-2.mp4',
//     'static/videos/bg-video-3.mp4',
//     'static/videos/bg-video-4.mp4'
// ];
//
// const videos = [...document.querySelectorAll('.bg-video')];
//
// const DISPLAY_TIME = 7000;
// const FADE_DURATION = 1200;
//
// let currentIndex = 0; // Start sequentially from the first video
// let activeVideoIndex = 0;
// let isChanging = false;
// let intervalId;
//
// if (videos.length >= 2 && videoSources.length) {
//     const [firstVideo] = videos;
//
//     firstVideo.src = videoSources[currentIndex];
//     firstVideo.load();
//
//     firstVideo.addEventListener(
//         'loadeddata',
//         () => {
//             firstVideo.play().catch(() => {});
//             firstVideo.classList.add('bg-video--active');
//
//             // Preload the next video in the inactive player
//             preloadNextVideo();
//
//             startVideoRotation();
//         },
//         { once: true }
//     );
//
//     function startVideoRotation() {
//         clearInterval(intervalId);
//         intervalId = setInterval(changeBackgroundVideo, DISPLAY_TIME);
//     }
//
//     // Get next index sequentially in a loop
//     function getNextSourceIndex(index) {
//         return (index + 1) % videoSources.length;
//     }
//
//     // Buffer upcoming video in the inactive <video> element
//     function preloadNextVideo() {
//         const nextVideoIndex = activeVideoIndex === 0 ? 1 : 0;
//         const upcomingSourceIndex = getNextSourceIndex(currentIndex);
//         const nextVideo = videos[nextVideoIndex];
//
//         nextVideo.preload = 'auto';
//         nextVideo.src = videoSources[upcomingSourceIndex];
//         nextVideo.load();
//     }
//
//     function changeBackgroundVideo() {
//         if (isChanging) {
//             return;
//         }
//
//         isChanging = true;
//
//         const nextIndex = getNextSourceIndex(currentIndex);
//         const activeVideo = videos[activeVideoIndex];
//         const nextVideoIndex = activeVideoIndex === 0 ? 1 : 0;
//         const nextVideo = videos[nextVideoIndex];
//
//         const switchVideos = () => {
//             nextVideo.currentTime = 0;
//
//             nextVideo.play()
//                 .then(() => {
//                     nextVideo.classList.add('bg-video--active');
//                     activeVideo.classList.remove('bg-video--active');
//
//                     setTimeout(() => {
//                         activeVideo.pause();
//                         currentIndex = nextIndex;
//                         activeVideoIndex = nextVideoIndex;
//                         isChanging = false;
//
//                         // Immediately preload the next video in queue
//                         preloadNextVideo();
//                     }, FADE_DURATION);
//                 })
//                 .catch(() => {
//                     isChanging = false;
//                 });
//         };
//
//         // Smoothly switch if already buffered; otherwise wait for loadeddata
//         if (nextVideo.readyState >= 2) {
//             switchVideos();
//         } else {
//             nextVideo.addEventListener('loadeddata', switchVideos, { once: true });
//         }
//     }
// }

// video bg transition
const videoSources = [
    'static/videos/bg-video-1.mp4',
    'static/videos/bg-video-2.mp4',
    'static/videos/bg-video-3.mp4',
    'static/videos/bg-video-4.mp4'
];

const videos = [...document.querySelectorAll('.bg-video')];
const prevButton = document.querySelector('.bg-video-arrow--prev');
const nextButton = document.querySelector('.bg-video-arrow--next');

// 1. Find the background container once at the beginning
const backgroundContainer = document.querySelector('.video-background');

const DISPLAY_TIME = 7000;
const FADE_DURATION = 1200;

let currentIndex = 0;
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

            preloadNextVideo();
            startVideoRotation();
        },
        { once: true }
    );

    // Arrow control buttons
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            switchToVideo(getNextSourceIndex(currentIndex));
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            switchToVideo(getPrevSourceIndex(currentIndex));
        });
    }

    function startVideoRotation() {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            switchToVideo(getNextSourceIndex(currentIndex));
        }, DISPLAY_TIME);
    }

    function getNextSourceIndex(index) {
        return (index + 1) % videoSources.length;
    }

    // Calculate previous index with circular wrap-around through 0
    function getPrevSourceIndex(index) {
        return (index - 1 + videoSources.length) % videoSources.length;
    }

    function preloadNextVideo() {
        const nextVideoIndex = activeVideoIndex === 0 ? 1 : 0;
        const upcomingSourceIndex = getNextSourceIndex(currentIndex);
        const nextVideo = videos[nextVideoIndex];

        nextVideo.preload = 'auto';
        nextVideo.src = videoSources[upcomingSourceIndex];
        nextVideo.load();
    }

    function switchToVideo(targetIndex) {
        if (isChanging || targetIndex === currentIndex) {
            return;
        }

        // 2. Check if the container exists and add the class if it's not present
        if (backgroundContainer && !backgroundContainer.classList.contains('hide-bg')) {
            backgroundContainer.classList.add('hide-bg');
        }

        isChanging = true;
        clearInterval(intervalId);

        const activeVideo = videos[activeVideoIndex];
        const nextVideoIndex = activeVideoIndex === 0 ? 1 : 0;
        const nextVideo = videos[nextVideoIndex];

        const performSwitch = () => {
            nextVideo.currentTime = 0;

            nextVideo.play()
                .then(() => {
                    nextVideo.classList.add('bg-video--active');
                    activeVideo.classList.remove('bg-video--active');

                    setTimeout(() => {
                        activeVideo.pause();
                        currentIndex = targetIndex;
                        activeVideoIndex = nextVideoIndex;
                        isChanging = false;

                        preloadNextVideo();
                        startVideoRotation();
                    }, FADE_DURATION);
                })
                .catch(() => {
                    isChanging = false;
                    startVideoRotation();
                });
        };

        const requiredSrc = videoSources[targetIndex];

        if (!nextVideo.currentSrc.includes(requiredSrc) && nextVideo.src !== requiredSrc) {
            nextVideo.src = requiredSrc;
            nextVideo.load();
            nextVideo.addEventListener('loadeddata', performSwitch, { once: true });
        } else if (nextVideo.readyState >= 2) {
            performSwitch();
        } else {
            nextVideo.addEventListener('loadeddata', performSwitch, { once: true });
        }
    }
}

// FAQ
document.querySelectorAll('.faq__toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
        const item = toggle.closest('.faq__item');
        const content = item.querySelector('.faq__content');
        const isActive = item.classList.contains('active');
        const expanded = !isActive;

        // 1. READ: Measure content height BEFORE any DOM changes
        const targetHeight = expanded ? content.scrollHeight + 'px' : '0';

        // 2. WRITE: Group all class and style changes and let the browser apply them at the optimal time
        requestAnimationFrame(() => {
            // Close all other active tabs
            document.querySelectorAll('.faq__item.active').forEach((activeItem) => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                    activeItem.querySelector('.faq__toggle').setAttribute('aria-expanded', 'false');
                    activeItem.querySelector('.faq__content').style.maxHeight = '0';
                }
            });

            // Apply changes to the current tab
            item.classList.toggle('active', expanded);
            toggle.setAttribute('aria-expanded', String(expanded));
            content.style.maxHeight = targetHeight;
        });
    });
});