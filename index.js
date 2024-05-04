import SwipeCarousel from './swipe.js'

const carousel = new SwipeCarousel({
  containerId: '#carousel123',
  slideId: '.item',
  interval: 1000,
})
carousel.init()
carousel.pauseHandler()

