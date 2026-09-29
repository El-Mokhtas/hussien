document.addEventListener('DOMContentLoaded', () => {

    const elements = document.querySelectorAll('.animate');
    elements.forEach(el => {
        const delay = parseInt(el.getAttribute('data-delay')) || 0;
        setTimeout(() => {
            el.classList.add('visible');
        }, delay);
    });

    const lineDividers = document.querySelectorAll('.line-divider');
    lineDividers.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, 900 + (index * 150));
    });

    setTimeout(() => {
        document.querySelector('.floral-top').classList.add('floral-visible');
        document.querySelector('.floral-bottom').classList.add('floral-visible');
    }, 100);

    const bgm = document.getElementById('bgm');
    const START_AT = 27;

    bgm.volume = 0.45;

    const seekToStart = () => {
        const target = Math.min(START_AT, Math.max(0, (bgm.duration || 0) - 1));
        bgm.currentTime = target;
    };

    if (bgm.readyState >= 1) {
        seekToStart();
    } else {
        bgm.addEventListener('loadedmetadata', seekToStart, { once: true });
    }

    const startPlayback = async () => {
        try {
            bgm.muted = false;
            await bgm.play();
        } catch (err) {
            bgm.muted = true;
            try {
                await bgm.play();
            } catch (err2) { }
        }
    };

    const unmute = () => {
        bgm.muted = false;
        bgm.play().catch(() => { });
        document.removeEventListener('pointerdown', unmute);
        document.removeEventListener('keydown', unmute);
        document.removeEventListener('touchstart', unmute);
    };

    document.addEventListener('pointerdown', unmute);
    document.addEventListener('keydown', unmute);
    document.addEventListener('touchstart', unmute, { passive: true });

    const toggleBtn = document.getElementById('musicToggle');
    const hint = document.getElementById('musicHint');
    let startedAudible = false;

    const reflect = () => {
        const audible = !bgm.paused && !bgm.muted;
        if (audible) startedAudible = true;
        toggleBtn.classList.toggle('playing', audible);
        toggleBtn.classList.toggle('paused', !audible);
        hint.classList.toggle('show', !audible && !startedAudible);
    };
    bgm.addEventListener('play', reflect);
    bgm.addEventListener('pause', reflect);

    toggleBtn.addEventListener('click', () => {
        if (!bgm.paused) {
            bgm.pause();
        } else {
            bgm.muted = false;
            bgm.play().catch(() => { });
        }
    });

    startPlayback();
    window.addEventListener('pageshow', startPlayback);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) startPlayback();
    });
    bgm.addEventListener('canplay', startPlayback);
    bgm.addEventListener('loadeddata', startPlayback);
});