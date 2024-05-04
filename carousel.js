class Carousel {
  constructor(p) {
    const config = {  ...{containerId: '#carousel', slideId: '.slide', interval: 5000, isPlaying: true}, ...p }
    this.container = document.querySelector(config.containerId)
    this.slideItems = this.container.querySelectorAll(config.slideId)
    this.interval = config.interval
    this.isPlaying = config.isPlaying
    this.slidesHover = this.container.querySelector('.slides')
  }


  _initProps() {
    this.SLIDES_COUNT = this.slideItems.length
    this.CODE_ARROW_LEFT = 'ArrowLeft'
    this.CODE_ARROW_RIGHT = 'ArrowRight'
    this.CODE_SPACE = 'Space'
    this.FA_PAUSE = '<i class="fas fa-pause-circle"></i>'
    this.FA_PLAY = '<i class="fas fa-play-circle"></i>'

    this.currentSlide = 0
    // this.isPlaying = true
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

  _initControls() {
    const controls = document.createElement('div')
    const PAUSE = `<span class="control control-pause" id="pause-btn">${this.isPlaying ? this.FA_PAUSE : this.FA_PLAY}</span>`
    const PREV = '<span class="control control-prev" id="prev-btn"><i class="fas fa-angle-left"></i></span>'
    const NEXT = '<span class="control control-next" id="next-btn"><i class="fas fa-angle-right"></i></span>'

    controls.setAttribute('class', 'controls')
    controls.setAttribute('id', 'controls-container')
    controls.innerHTML = PAUSE + PREV + NEXT

    this.container.append(controls)

    this.pauseBtn = this.container.querySelector('#pause-btn')
    this.prevBtn = this.container.querySelector('#prev-btn')
    this.nextBtn = this.container.querySelector('#next-btn')
  }

  _initListeners() {
    document.addEventListener('keydown', this._pressKey.bind(this))
    this.pauseBtn.addEventListener('click', this.pausePlayHandler.bind(this))
    this.nextBtn.addEventListener('click', this.nextHandler.bind(this))
    this.prevBtn.addEventListener('click', this.prevHandler.bind(this))
    this.indicatorsContainer.addEventListener('click', this._indicateHandler.bind(this))
    this.slidesHover.addEventListener('mouseenter', this.pauseHandler.bind(this))
    this.slidesHover.addEventListener('mouseleave', this.playHandler.bind(this))
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


  _tick() {
    if (!this.isPlaying) return
    this.timerId = setInterval(() => this._gotoNext(), this.interval)
  }

  pauseHandler() {
    if (!this.isPlaying) return
    this.isPlaying = false
    clearInterval(this.timerId)
    this.pauseBtn.innerHTML = this.FA_PLAY
  }

  playHandler() {
    if (this.isPlaying) return
    this.isPlaying = true
    this.pauseBtn.innerHTML = this.FA_PAUSE
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

  _pressKey(e) {
    const code = e.code
    if (code === this.CODE_ARROW_LEFT) this.prevHandler()
    if (code === this.CODE_ARROW_RIGHT) this.nextHandler()
    if (code === this.CODE_SPACE) this.pausePlayHandler()
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