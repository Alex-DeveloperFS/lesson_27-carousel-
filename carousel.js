class Carousel {
  constructor(p) {
    const config = {...{containerId: '#carousel', slideId: '.slide', interval: 5000, isPlaying: true}, ...p}
    this.container = document.querySelector(config.containerId)
    this.slideItems = this.container.querySelectorAll(config.slideId)
    this.interval = config.interval
    this.isPlaying = config.isPlaying
    // this.slidesHover = this.container.querySelector('.slides')
  }


  _initProps() {
    this.SLIDES_COUNT = this.slideItems.length
    this.CODE_ARROW_LEFT = 'ArrowLeft'
    this.CODE_ARROW_RIGHT = 'ArrowRight'
    this.CODE_SPACE = 'Space'

    this.FA_PAUSE = '<i class="fa-regular fa-pause-circle"></i>'
    this.FA_PLAY = '<i class="fa-regular fa-play-circle"></i>'
    this.FA_PREV = '<i class="fa-solid fa-angle-left"></i>'
    this.FA_NEXT = '<i class="fa-solid fa-angle-right"></i>'

    this.currentSlide = 0
  }

  _initControls() {
    const controls = document.createElement('div')
    const PAUSE = `<span id="pause-btn" class="control">
                             <span id="fa-pause-icon" class="control-pause">${this.FA_PAUSE}</span>
                             <span id="fa-play-icon" class="control-play">${this.FA_PLAY}</span>
                          </span>`
    const PREV = `<span id="prev-btn" class="control control-prev">${this.FA_PREV}</span>`
    const NEXT = `<span id="next-btn" class="control control-next">${this.FA_NEXT}</span>`

    controls.setAttribute('class', 'controls')
    controls.setAttribute('id', 'controls-container')
    controls.innerHTML = PAUSE + PREV + NEXT

    this.container.append(controls)

    this.pauseBtn = this.container.querySelector('#pause-btn')
    this.prevBtn = this.container.querySelector('#prev-btn')
    this.nextBtn = this.container.querySelector('#next-btn')
    this.pauseIcon = this.container.querySelector('#fa-pause-icon');
    this.playIcon = this.container.querySelector('#fa-play-icon');
    this.isPlaying ? this._pauseVisible() : this._playVisible();
  }

  _initIndicators() {
    const indicators = document.createElement('div')
    indicators.setAttribute('class', 'indicators')
    indicators.setAttribute('id', 'indicators-container')

    for (let i = 0; i < this.SLIDES_COUNT; i++) {
      const indicator = document.createElement('div')
      indicator.setAttribute('class', i ? 'indicator' : 'indicator active')
      indicator.dataset.slideTo = `${i}`
      indicators.append(indicator)
    }

    this.container.append(indicators)
    this.indicatorsContainer = this.container.querySelector('#indicators-container')
    this.indicatorItems = this.indicatorsContainer.querySelectorAll('.indicator')
  }

  _initListeners() {
    document.addEventListener('keydown', this._pressKey.bind(this))
    this.pauseBtn.addEventListener('click', this.pausePlayHandler.bind(this))
    this.nextBtn.addEventListener('click', this.nextHandler.bind(this))
    this.prevBtn.addEventListener('click', this.prevHandler.bind(this))
    this.indicatorsContainer.addEventListener('click', this._indicateHandler.bind(this))
    this.container.addEventListener('mouseenter', this.pauseHandler.bind(this));
    this.container.addEventListener('mouseleave', this.playHandler.bind(this));
  }

  _gotoNth(n) {
    this.slideItems[this.currentSlide].classList.toggle('active')
    this.indicatorItems[this.currentSlide].classList.toggle('active')
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT
    this.slideItems[this.currentSlide].classList.toggle('active')
    this.indicatorItems[this.currentSlide].classList.toggle('active')
  }

  _gotoNext() {
    this._gotoNth(this.currentSlide + 1)
  }

  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1)
  }

  _indicateHandler(e) {
    const target = e.target
    if (target.classList.contains('indicator')) {
      this.pauseHandler()
      this._gotoNth(+target.dataset.slideTo)
    }
  }

  _pressKey(e) {
    const code = e.code
    if (code === this.CODE_ARROW_LEFT) this.prevHandler()
    if (code === this.CODE_ARROW_RIGHT) this.nextHandler()
    if (code === this.CODE_SPACE) this.pausePlayHandler()
  }

  _tick() {
    if (!this.isPlaying) return
    if (this.timerID) return
    this.timerID = setInterval(() => this._gotoNext(), this.interval);
  }

  _pauseVisible(isVisible = true) {
    this.pauseIcon.style.opacity = isVisible ? '1' : '0';
    this.playIcon.style.opacity = isVisible ? '0' : '1';
  }

  _playVisible() {
    this._pauseVisible(false);
  }

  pauseHandler() {
    if (!this.isPlaying) return
    this._playVisible();
    this.isPlaying = false;
    clearInterval(this.timerID);
    this.timerID = null;
  }

  playHandler() {
    if (this.isPlaying) return
    this.isPlaying = true
    this._pauseVisible();
    this._tick()
  }

  pausePlayHandler() {
    this.isPlaying ? this.pauseHandler() : this.playHandler()
  }

  nextHandler() {
    this.pauseHandler()
    this._gotoNext()
  }

  prevHandler() {
    this.pauseHandler()
    this._gotoPrev()
  }

  init() {
    this._initProps()
    this._initControls()
    this._initIndicators()
    this._initListeners()
    this._tick()
  }
}

export default Carousel