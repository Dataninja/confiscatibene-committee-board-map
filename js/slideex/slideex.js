/*
 * From http://www.media-division.com/fancy-javascript-slideshow-no-jquery/
 */
var SlideEx = {
    slidePrefix: "slide-",
    slideControlPrefix: "slide-control-",
    slideHighlightClass: "highlight",
    slidesContainerID: "slides",
    slidesControlsID: "slides-controls",
    slideDelay: 3000,
    slideAnimationInterval: 20,
    slideTransitionSteps: 10
};

SlideEx.setUpSlideShow = function() {
    // collect the slides and the controls
    var that = this;
        
    this.slideTransStep = 0;
    this.transTimeout = 0;
    this.crtSlideIndex = 1;
    this.slidesCollection = document.getElementById(this.slidesContainerID).children;
    this.slidesControllersCollection = document.getElementById(this.slidesControlsID).children;
    this.totalSlides = this.slidesCollection.length;
 
    if (this.totalSlides < 2) return;
 
    //go through all slides
    for (var i=0; i < this.slidesCollection.length; i++) {
        // give IDs to slides and controls
        this.slidesCollection[i].id = this.slidePrefix+(i+1);
        this.slidesControllersCollection[i].id = this.slideControlPrefix+(i+1);
 
        // attach onclick handlers to controls, highlight the first control
        this.slidesControllersCollection[i].onclick = function(){ that.clickSlide(this); };
 
        //hide all slides except the first
        if (i > 0) {
            this.slidesCollection[i].style.display = "none";
        } else {
            this.slidesControllersCollection[i].className = this.slideHighlightClass;
        }
    }
 
    // show the next slide
    this.showSlide(2);
}

SlideEx.showSlide = function(slideNo, immediate) {
    // don't do any action while a transition is in progress
    if (this.slideTransStep != 0 || slideNo == this.crtSlideIndex)
        return;
 
    clearTimeout(this.transTimeout);
 
	// get references to the current slide and to the one to be shown next
    this.nextSlideIndex = slideNo,
    this.crtSlide = document.getElementById(this.slidePrefix + this.crtSlideIndex);
    this.nextSlide = document.getElementById(this.slidePrefix + this.nextSlideIndex);
        
    this.slideTransStep = 0;
 
    // start the transition now upon request or after a delay (default)
    if (immediate == true) {
        this.transSlide();
    } else {
        this.transTimeout = setTimeout(this.transSlide, this.slideDelay);
    }
}

SlideEx.clickSlide = function(control) {
    this.showSlide(Number(control.id.substr(control.id.lastIndexOf("-")+1)),true);
}

SlideEx.transSlide = function() {
    var that = SlideEx;

    // make sure the next slide is visible (albeit transparent)
    that.nextSlide.style.display = "block";
 
    // calculate opacity
    var opacity = that.slideTransStep / that.slideTransitionSteps;
 
    // fade out the current slide
    that.crtSlide.style.opacity = "" + (1 - opacity);
    that.crtSlide.style.filter = "alpha(opacity=" + (100 - opacity*100) + ")";
 
    // fade in the next slide
    that.nextSlide.style.opacity = "" + opacity;
    that.nextSlide.style.filter = "alpha(opacity=" + (opacity*100) + ")";
 
    // if not completed, do this step again after a short delay
    if (++that.slideTransStep <= that.slideTransitionSteps) {
        that.transTimeout = setTimeout(that.transSlide, that.slideAnimationInterval);
    } else {
        // complete
        that.crtSlide.style.display = "none";
        that.transComplete();
    }
}

SlideEx.transComplete = function() {
    this.slideTransStep = 0;
    this.crtSlideIndex = this.nextSlideIndex;
 
    // for IE filters, removing filters reenables cleartype
    if (this.nextSlide.style.removeAttribute)
        this.nextSlide.style.removeAttribute("filter");
 
    // show next slide
    this.showSlide((this.crtSlideIndex >= this.totalSlides) ? 1 : this.crtSlideIndex + 1);
 
    //unhighlight all controls
    for (var i=0; i < this.slidesControllersCollection.length; i++)
        this.slidesControllersCollection[i].className = "";
 
    // highlight the control for the next slide
    document.getElementById("slide-control-" + this.crtSlideIndex).className = this.slideHighlightClass;
}

SlideEx.clearSlideShow = function() {
    clearTimeout(this.transTimeout);
    delete this.crtSlide;
    delete this.crtSlideIndex;
    delete this.nextSlide;
    delete this.nextSlideIndex;
    delete this.slideTransStep;
    delete this.slidesCollection;
    delete this.slidesControllersCollection;
    delete this.totalSlides;
    delete this.transTimeout;
}

