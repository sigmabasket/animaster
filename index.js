    addListeners();

    function addListeners() {
        document.getElementById('fadeInPlay')
            .addEventListener('click', function () {
                const block = document.getElementById('fadeInBlock');
                animaster().fadeIn(block, 5000);
            });

        document.getElementById('movePlay')
            .addEventListener('click', function () {
                const block = document.getElementById('moveBlock');
                animaster().move(block, 1000, {x: 100, y: 10});
            });

        document.getElementById('scalePlay')
            .addEventListener('click', function () {
                const block = document.getElementById('scaleBlock');
                animaster().scale(block, 1000, 1.25);
            });
        document.getElementById('fadeOutPlay')
            .addEventListener('click', function () {
                const block = document.getElementById('fadeOutBlock');
                animaster().fadeOut(block, 5000);
            });
        let moveAndHideAnimation = null;
        document.getElementById('moveAndHidePlay')
            .addEventListener('click', function () {
                const block = document.getElementById('moveAndHideBlock');
                if (moveAndHideAnimation) {
                    moveAndHideAnimation.reset();
                }
                moveAndHideAnimation = animaster().moveAndHide(block, 5000);
            });
        document.getElementById('showAndHidePlay')
            .addEventListener('click', function () {
                const block = document.getElementById('showAndHideBlock');
                animaster().showAndHide(block, 6000);
            });

        let heartBeatingAnimation = null;
        document.getElementById('heartBeatingPlay')
            .addEventListener('click', function () {
                const block = document.getElementById('heartBeatingBlock');
                if (heartBeatingAnimation) {
                    heartBeatingAnimation.stop();
                }
                heartBeatingAnimation = animaster().heartBeating(block);
            });

        document.getElementById('heartBeatingStop')
            .addEventListener('click', function () {
                if (heartBeatingAnimation) {
                    heartBeatingAnimation.stop();
                    heartBeatingAnimation = null;
                }
            });
        document.getElementById('moveAndHideReset')
            .addEventListener('click', function () {
                if (moveAndHideAnimation) {
                    moveAndHideAnimation.reset();
                    moveAndHideAnimation = null;
                }
    });
    }

    function getTransform(translation, ratio) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        return result.join(' ');
    }

    function animaster() {
        function resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        }
        
        function resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        }
        
        function resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
        }

        return {
            move(element, duration, translation){
                resetMoveAndScale(element);
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(translation, null);
            },
            scale(element, duration, ratio){
                resetMoveAndScale(element);
                element.style.transitionDuration =  `${duration}ms`;
                element.style.transform = getTransform(null, ratio);
            },
            fadeIn(element, duration){
                resetFadeIn(element);
                element.style.transitionDuration =  `${duration}ms`;
                element.classList.remove('hide');
                element.classList.add('show');
            },
            fadeOut(element, duration){
                resetFadeOut(element);
                element.style.transitionDuration =  `${duration}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            },
            moveAndHide(element, duration) {
                resetMoveAndScale(element);
                resetFadeOut(element);
                const moveDuration = duration * 2/5; 
                const fadeDuration = duration * 3/5;
                
                let moveTimeoutId;
                let fadeTimeoutId;
                let isReset = false;
                this.move(element, moveDuration, {x: 100, y: 20});

                moveTimeoutId = setTimeout(() => {
                    if (!isReset) {
                        this.fadeOut(element, fadeDuration);
                        
                        fadeTimeoutId = setTimeout(() => {
                            fadeTimeoutId = null;
                        }, fadeDuration);
                    }
                }, moveDuration);

                const reset = () => {
                    if (!isReset) {
                        isReset = true;
                        clearTimeout(moveTimeoutId);
                        clearTimeout(fadeTimeoutId);
                        resetMoveAndScale(element);
                        resetFadeOut(element);
                    }
                };
                
                return {
                    reset: reset
                };
            },
            showAndHide(element, duration) {
                resetFadeIn(element);
                resetFadeOut(element);
                const stepDuration = duration / 3; 
                this.fadeIn(element, stepDuration);
                setTimeout(() => {
                    this.fadeOut(element, stepDuration);
                }, stepDuration * 2); 
            },
            heartBeating(element) {
                resetMoveAndScale(element);
                const beatDuration = 500;
                let intervalId;
                let timeoutId;
                let isStopped = false; 

                function beat() {
                    if (isStopped) return; 

                    element.style.transitionDuration = `${beatDuration}ms`;
                    element.style.transform = getTransform(null, 1.4);
                    if (timeoutId) clearTimeout(timeoutId);

                    timeoutId = setTimeout(() => {
                        if (isStopped) return;
                        element.style.transitionDuration = `${beatDuration}ms`;
                        element.style.transform = getTransform(null, 1);
                    }, beatDuration);
                }

                beat();
                intervalId = setInterval(beat, beatDuration * 2);

                return {
                    stop() {
                        isStopped = true;
                        clearInterval(intervalId);
                        clearTimeout(timeoutId);
                        resetMoveAndScale(element);
                    }
                };
            }
        }
    }