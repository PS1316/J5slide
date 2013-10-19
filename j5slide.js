var J5 = {
    idx: 1
};

J5.loadSlides = function() {
    // setup document
    var doc = window.document;
    if (doc.doctype == null) {
        doc.insertBefore(doc.implementation.createDocumentType("html", "", ""), doc.firstChild);
    }
    doc.body.innerHTML = "";
    
    // define content styles
    var styles = "html { background-color: black; }" +
                 "a { color: #0066FF; }" +
                 "a:hover { text-decoration: underline; }" +
                 "footer { position: absolute; bottom: 50px; right: 50px; }" +
                 "strong { color: #0066FF; }" +
                 "body { font-family: 'Oswald', arial, serif; background-color: #1C1C1C; color: white; font-size: 30px; line-height: 120%; }" +
                 "img { margin: 0 auto; display: block; }" +
                 "p>img { position: relative; left: -10px }" +
                 "section { -moz-transition: left 400ms linear 0s; -webkit-transition: left 400ms linear 0s; -ms-transition: left 400ms linear 0s; transition: left 400ms linear 0s; }" +
                 "section { background: #1C1C1C; }" +
                 "h1 { color: #FFA500; margin: 20px 0; font-size: 46px; text-align: center; padding: 0 10px; line-height: 100% }" +
                 "h2 { color: #FF0066; margin: 20px 0; font-size: 40px; text-align: center; padding: 0 10px; line-height: 100% }" +
                 "h3 { color: #FFD700; margin: 20px 0; font-size: 34px; text-align: center; padding: 0 10px; line-height: 100% }" +
                 "ul { margin: 10px 0 0 50px; font-size: 0.9em; width: 750px; line-height: 100%; display: inline-block; }" +
                 "q, p { padding: 5px 20px; }" +
                 "q:after { content: ''; }" +
                 "q:before { content: ''; }" +
                 "q { display: block; margin-top: 140px; }" +
                 "object { display: block; }" +
                 "video { margin: 0 auto; display: block; width: 400px; height: 300px; }" +
                 "li { list-style-type: square; }" +
                 // important styles below - don't touch!
                 "* { margin: 0; padding: 0; }" +
                 "section>details {display: none; }" +
                 "body { width: 800px; height: 600px; margin-left: -400px; margin-top: -300px; position: absolute; top: 50%; left: 50%; overflow: hidden; }" +
                 "html { overflow: hidden; }" +
                 "section { position: absolute; pointer-events: none; width: 100%; height: 100%; overflow: hidden; left: -150%; }" +
                 "section[aria-selected] { pointer-events: auto; left: 0; }" +
                 "section[aria-selected] ~ section { left: +150%; }" +
                 "body { display: none }" +
                 "body.loaded { display: block }";

    // add content styles
    var css = doc.createElement("style");
    css.appendChild(doc.createTextNode(styles));
    var head = doc.head || doc.getElementsByTagName("head")[0];
    head.appendChild(css);
    
    // scale slides to window size
    window.onresize = function() {
        var body = this.document.body;
        var sx = body.clientWidth / this.innerWidth;
        var sy = body.clientHeight / this.innerHeight;
        var transform = "scale(" + (1/Math.max(sx, sy)) + ")";
        body.style.MozTransform = transform;
        body.style.WebkitTransform = transform;
        body.style.OTransform = transform;
        body.style.msTransform = transform;
        body.style.transform = transform;
    }
    
    // setup keyboard shortcuts
    window.onkeydown = function(e) {
        // ctrl + space
        if (e.ctrlKey && e.keyCode == 32) { 
            e.preventDefault();
            J5.togglePresenterMode();
        }
        // ignore modifier keys
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }
        // right arrow, down arrow or page down
        if ( e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 34) {
            e.preventDefault();
            J5.goForward();
        }
        // left arrow, up arrow or page up
        if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 33) { 
            e.preventDefault();
            J5.goBack();
        }
    }
    
    // close child window when parent window exited
    window.onunload = function() {
        if (J5.presenterWindow && !J5.presenterWindow.closed) {
            J5.presenterWindow.close();
        }
    }
    
    // add slides to page
    for (var i = 0; i < J5.slides.length; i++) {
        doc.body.appendChild(J5.slides[i]);
    }
    
    // make image slides fill entire slide 
    var objects = doc.querySelectorAll("section[typeof='http://purl.org/ontology/bibo/Slide'] > object");
    for (var i = 0; i < objects.length; i++) {
        var parent = objects[i].parentNode;
        while (parent.firstChild && parent.firstChild != objects[i]) {
            parent.removeChild(parent.firstChild);
        }
    }

    // scale slide contents to fit slides
    this.scaleContents = function() {
        var s = doc.querySelectorAll("section[typeof='http://purl.org/ontology/bibo/Slide']")
        for (var i = 0; i < s.length; i++) {
            if (s[i].scrollHeight > 600 || s[i].scrollWidth > 800) {
                var images = s[i].getElementsByTagName("img");
                for (var j = 0; j < images.length; j++) {
                    if (images[j].height > 600 || images[j].width > 800) {
                        var sx = images[j].scrollWidth / 800;
                        var sy = images[j].scrollHeight / 600;
                        var scaleAmount = 1 / Math.max(sx, sy);
                        images[j].width = images[j].width * scaleAmount;
                        images[j].height = images[j].height * scaleAmount;
                    }
                }
                
                var wrapper = doc.createElement("div");
                for (var j = 0; j < s[i].children.length;) {
                    wrapper.appendChild(s[i].children[j]);
                }
                s[i].appendChild(wrapper);
                var sx = s[i].scrollWidth / 800;
                var sy = s[i].scrollHeight / 600;
                var scaleAmount = 1 / Math.max(sx, sy);
                if (scaleAmount < 0.5) scaleAmount = 0.5;
                var transform = "scale(" + scaleAmount + ")";
                wrapper.style.MozTransform = transform;
                wrapper.style.WebkitTransform = transform;
                wrapper.style.OTransform = transform;
                wrapper.style.msTransform = transform;
                wrapper.style.transform = transform;
                wrapper.style.MozTransformOrigin = "center top";
                wrapper.style.WebkitTransformOrigin = "center top";
                wrapper.style.OTransformOrigin = "center top";
                wrapper.style.msTransformOrigin = "center top";
                wrapper.style.TransformOrigin= "center top";
            }
        }
    }
    
    J5.setSlide(J5.idx);
    doc.body.className = "loaded";
    J5.scaleContents();
    window.onresize();
}

J5.togglePresenterMode = function() {
    if (this.presenterMode == null) {
        this.presenterMode = true;
    }
    else {
        if (this.presenterMode) {
            this.presenterWindow.close();
            this.presenterWindow = null;
        }
        this.presenterMode = !this.presenterMode;
    }
    if (this.presenterMode) {
        this.presenterWindow = window.open("","","width=936,height=600,menubar=1,toolbar=0,scrollbars=0,resizable=1");
        if (this.presenterWindow == null) {
            this.presenterMode = false;
            return;
        }
        this.setupPresenterWin();
    }
}

J5.setupPresenterWin = function() {
    this.presenterWindow.idx = -1;
    var doc = this.presenterWindow.document;

    var styles = ".slide * { margin: 0; padding: 0; }" +
                 "html, body { height: 100%; background: black; font-family: 'Oswald', arial, serif; color: white; font-size: 30px; line-height: 120%; min-width: 800px; }" +
                 "#current, #next { position: absolute; top: 0; bottom: 250px; background: #1C1C1C; }" +
                 "#current { left: 0; right: 50%; border-right: 2px solid #1E90FF; }" +
                 "#next { left: 50%; right: 0; border-left: 2px solid #1E90FF; }" +
                 ".slide { width: 800px; height: 600px; background: #1C1C1C; overflow: hidden; margin-left: -400px; margin-top: -300px; position: relative; top: 50%; left: 50%; }" +
                 "#notes { position: absolute; bottom: 0; left: 0; right: 0; height: 250px; background: #CCC; border-top: 4px solid #1E90FF; padding: 20px 245px 20px 20px; overflow: auto; " +
                          "color: black; font-size: 16px; line-height: normal; box-sizing: border-box; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; }" +
                 "#slidecount, #time { position: absolute; right: 50px; background: #1C1C1C; border-radius: 10px; font-size: 24px; font-weight: bold; height: 50px; line-height: 50px; text-align: center; width: 175px; }" +
                 "#slidecount { bottom: 150px; }" +
                 "#time { bottom: 50px; }" +
                 ".slide footer { position: absolute; bottom: 50px; right: 50px; }" +
                 ".slide img { margin: 0 auto; display: block; }" +
                 ".slide p>img { position: relative; left: -10px; }" +
                 ".slide h1 { color: #FFA500; margin: 20px 0; font-size: 46px; text-align: center; padding: 0 10px; line-height: 100% }" +
                 ".slide h2 { color: #FF0066; margin: 20px 0; font-size: 40px; text-align: center; padding: 0 10px; line-height: 100% }" +
                 ".slide h3 { color: #FFD700; margin: 20px 0; font-size: 34px; text-align: center; padding: 0 10px; line-height: 100% }" +
                 ".slide ul { margin: 10px 0 0 50px; font-size: 0.9em; line-height: 100%; display: inline-block; }" +
                 ".slide object { display: block; width: 100%; height: 100%; }" +
                 ".slide video { margin: 0 auto; display: block; width: 400px; height: 300px; }" +
                 ".slide>details { display: none; }" +
                 ".slide q, .slide p { padding: 5px 20px; }" +
                 "a { color: #0066FF; }" +
                 "a:hover { text-decoration: underline; }" +
                 "strong { color: #0066FF; }" +
                 "q:after { content: none; }" +
                 "q:before { content: none; }" +
                 "q { display: block; margin-top: 40px; }" +
                 "li { list-style-type: square; }";
    
    doc.open();
    doc.write("<!DOCTYPE html><html><head><style>" + styles + "</style></head><body><div id='current'><section typeof='http://purl.org/ontology/bibo/Slide' class='slide'></section></div>" +
              "<div id='next'><section typeof='http://purl.org/ontology/bibo/Slide' class='slide'></section></div><div id='notes'></div><div id='slidecount'>? / ?</div>" +
              "<div id='time'>00:00:00 AM</div></body></html>");
    doc.close();
    
    this.presenterWindow.onunload = function() {
        J5.presenterMode = false;
        J5.presenterWindow = null;
    }
    
    this.presenterWindow.onresize = function() {
        var slides = this.document.querySelectorAll("section[typeof='http://purl.org/ontology/bibo/Slide']");
        var sx = slides[0].clientWidth / this.document.getElementById("current").clientWidth;
        var sy = slides[0].clientHeight / this.document.getElementById("current").clientHeight;
        var transform = "scale(" + (1/Math.max(sx, sy)) + ")";
        for (var i = 0; i < slides.length; i++) {
            slides[i].style.MozTransform = transform;
            slides[i].style.WebkitTransform = transform;
            slides[i].style.OTransform = transform;
            slides[i].style.msTransform = transform;
            slides[i].style.transform = transform;
        }
    }
    
    this.presenterWindow.onkeydown = function(e) {
        // ctrl + space
        if (e.ctrlKey && e.keyCode == 32) { 
            e.preventDefault();
            J5.togglePresenterMode();
        }
        // ignore modifier keys
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }
        // right arrow, down arrow or page down
        if ( e.keyCode == 39 || e.keyCode == 34) {
            e.preventDefault();
            J5.goForward();
            J5.updatePresenterWin();
        }
        // left arrow, up arrow or page up
        if (e.keyCode == 37 || e.keyCode == 33) { 
            e.preventDefault();
            J5.goBack();
            J5.updatePresenterWin();
        }
    }
    
    this.updateTime();
    this.clock = setInterval(function() { J5.updateTime() }, 1000);
    this.presenterWindow.onresize();
    this.updatePresenterWin();
    
    this.presenterWindow.onload = function() {
        J5.setupPresenterWin();
    }
}

J5.updateTime = function() {
    var addZero = function(n) {
      return n < 10 ? "0" + n : n;
    }
    if (!this.presenterWindow) {
        clearInterval(this.clock);
        return;
    }
    var doc = this.presenterWindow.document;
    var now = new Date();
    var p = "AM";
    var h = now.getHours();
    if (h >= 12) {
        h -= 12;
        p = "PM";
    }
    if (h == 0) h = 12;
    var m = addZero(now.getMinutes());
    var s = addZero(now.getSeconds());
    doc.getElementById("time").innerHTML = h + ":" + m + ":" + s + " " + p;
}

J5.updatePresenterWin = function() {
    if (!this.presenterWindow || this.presenterWindow.idx == this.idx) return;
    var doc = this.presenterWindow.document;
    doc.getElementById("current").firstChild.innerHTML = this.getSlide(this.idx);
    doc.getElementById("next").firstChild.innerHTML = this.getSlide(this.idx+1);
    doc.getElementById("notes").innerHTML = this.getNotes(this.idx) + "<br>";
    doc.getElementById("slidecount").innerHTML = this.idx + " / " + this.slides.length;
    this.presenterWindow.idx = this.idx;
    doc.getElementById("notes").focus();
}

J5.getSlide = function(n) {
    var slide = this.slides[n - 1];
    return slide ? slide.innerHTML : "";
}

J5.getNotes = function(n) {
    var slide = this.slides[n - 1];
    return slide.querySelector("details") ? slide.querySelector("details").innerHTML : "";
}

J5.setSlide = function(i) {
    if (!(i >= 1 && i <= this.slides.length)) return;
    this.idx = i;
    var old = document.querySelector("section[aria-selected]");
    var next = document.querySelector("section[typeof='http://purl.org/ontology/bibo/Slide']:nth-of-type("+ this.idx +")");
    if (old) {
        old.removeAttribute("aria-selected");
        var video = old.querySelector("video");
        if (video) { video.pause(); }
    }
    if (next) {
        next.setAttribute("aria-selected", "true");
        var video = next.querySelector("video");
        if (video) { video.play(); }
    }
    this.updatePresenterWin();
}

J5.goForward = function() {
    this.setSlide(this.idx + 1);
}

J5.goBack = function() {
    this.setSlide(this.idx - 1);
}
    
J5.goTo = function(s) {
    this.setSlide(s);
}

J5.init = function() {
    var transformSupport = 'WebkitTransform' in document.body.style || 'MozTransform' in document.body.style || 'msTransform' in document.body.style || 'OTransform' in document.body.style || 'transform' in document.body.style;
    if (!transformSupport) return;

    J5.slides = document.querySelectorAll("section[typeof='http://purl.org/ontology/bibo/Slide']");
    if (J5.slides.length > 0) {
        for (var i = 0; i < J5.slides.length; i++) {
            J5.slides[i].parentNode.removeChild(J5.slides[i]);
        }
        J5.loadSlides();
    }
}

window.addEventListener("DOMContentLoaded", J5.init);