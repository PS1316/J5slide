var J5 = {
    width: 600,
    height: 450,
    idx: 1,
    notesEnabled: true,
    notesVisible: false,
    notesHeight: 200
};

J5.loadIframe = function() {
    // create iframe and insert before first slide
    var frame = this.iframe = this.slides[0].parentNode.insertBefore(document.createElement("iframe"), this.slides[0]);
    frame.width = this.width;
    frame.height = this.height;
    frame.setAttribute("allowfullscreen", "");
    frame.style.cssText = "border: 3px solid black; display: block; margin-bottom: 10px; margin-top: 10px; box-sizing: content-box; -moz-box-sizing: content-box;";
    
    // write doctype to iframe
    var doc = frame.contentDocument;
    doc.open();
    doc.write("<!DOCTYPE html><html><head></head><body></body></html>");
    doc.close();
    
    // define iframe content styles
    var styles = "html { height: 100%; }" +
                 "body { margin: 0; background-color: black; height: 100%; width: 100%; }" +
                 "iframe { border: none; display: block; background-color: white; width: 100%; height: " + this.height +  "px; }" +
                 "#controls { color: white; font-family: monospace; font-size: 13px; text-align: center; background-color: #444; }" +
                 "#controls { width: 100%; height: 30px; padding: 0px; box-sizing: border-box; -moz-box-sizing: border-box; position: relative; }" +
                 "#controls path { fill: white; }" +
                 "button { background-color: transparent; border: none; cursor: pointer; outline: none; height: 30px; padding: 5px; margin: 0px 3px; position: relative; }" +
                 "button:active { top: 0px; left: 0px; }" +
                 "#controls button[disabled] svg path { fill: #888; }" +
                 "#leftcontrols { position: absolute; left: 6px; top: 6px; margin: 0px; }" +
                 "#slideidx { border: none; background-color: rgba(255, 255, 255, 0.2); color: white; text-align: center; width: 30px; height: 16px; }" +
                 "#rightcontrols { position: absolute; right: 0px; bottom: 0px; margin: 0px; }" +
                 "#notes { background-color: #DDD; display: none; height: " + J5.notesHeight + "px; width: 100%; padding: 10px; box-sizing: border-box; -moz-box-sizing: border-box; margin: 0px 0px 0px 0px; overflow: auto; }";

    // add iframe content styles
    var css = document.createElement("style");
    css.appendChild(document.createTextNode(styles));
    doc.head.appendChild(css);
    
    // add slide viewer UI controls
    frame.height = this.height = parseInt(this.height + 30);
    var noteButton = J5.notesEnabled ? "<button id='togglenotes' title='Toggle Notes' onclick='parent.J5.displayNotes()'><svg viewBox='0 0 512 512' width='20px' height='20px'><path d='M444.125,135.765 L149.953,429.937 l-67.875-67.875 L376.219,67.859 L444.125,135.765 Z M444.125,0 l-45.281,45.234 l67.906,67.906 L512,67.859 L444.125,0 Z M66.063,391.312 L0,512 l120.703-66.063 L66.063,391.312 Z'/></svg></button>" : "";
    var controls = doc.body.appendChild(document.createElement("div"));
    controls.id = "controls";
    controls.innerHTML = "<button id='first' title='First Slide' onclick='parent.J5.goToSlide(1)'><svg viewBox='0 0 50 50' width='20px' height='20px'><path d='M0,3 H4 V47 H0 V3 Z M50,3 L27,25 L50,47 H30 L7,25 L30,3 H50 Z'></path></svg></button>" +
                         "<button id='prev' title='Previous Slide' onclick='parent.J5.backMsg()'><svg viewBox='0 0 50 50' width='20px' height='20px'><path d='M47,3 L24,25 L47,47 H27 L4,25 L27,3 H47 Z'></path></svg></button>" +
                         "<button id='next' title='Next Slide' onclick='parent.J5.forwardMsg()'><svg viewBox='0 0 50 50' width='20px' height='20px'><path d='M3,3 L26,25 L3,47 H23 L46,25 L23,3 H3 Z'></path></svg></button>" +
                         "<button id='last' title='Last Slide' onclick='parent.J5.goToSlide(this.parentNode.querySelector(\"#slidecount\").innerHTML)'><svg viewBox='0 0 50 50' width='20px' height='20px'><path d='M50,3 H46 V47 H50 V3 Z M0,3 L23,25 L0,47 H20 L43,25 L20,3 H0 Z'></path></svg></button>" +
                         "<p id='leftcontrols'><input onchange='parent.J5.goToSlide(this.value)' id='slideidx' maxlength='3' value='0'> /<span id='slidecount'>...</span></p>" +
                         "<p id='rightcontrols'>" + noteButton +
                         "<button id='fullscreen' title='Fullscreen' onclick='parent.J5.fullscreen()'><svg viewBox='0 0 512 512' width='20px' height='20px'><path d='M130,210 L40,120 L0,160 L0,0 L160,0 L120,40 L210,130 Z M382,210 L472,120 L512,160 L512,0 L352,0 L392,40 L302,130 Z M382,302 L472,392 L512,352 L512,512 L352,512 L392,472 L302,382 Z M210,382 L120,472 L160,512 L0,512 L0,352 L40,392 L130,302 Z'/></svg></button></p>";
                         //M187.765,417.257 L232.431,462 H50 V279.572 l44.744,44.666 l73.07-73.07l93.02,93.02 L187.765,417.257 Z M279.572,50 l44.666,44.743 l-71.571,71.572 l93.02,93.02 l71.572-71.572 L462,232.428 V50 H279.572 Z
                         // placeholder icon - <svg viewBox='0 0 50 50' width='20px' height='20px'><path d='M3,3 L47,3 L47,47 L3,47 L3,3 Z'/></svg>
    
    // add slide note box
    var notes = J5.notes = doc.body.appendChild(document.createElement("div"));
    notes.id = "notes";
    
    // setup keyboard shortcuts
    frame.contentWindow.onkeydown = function(e) {
        // ignore modifier keys
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }
        // left arrow, up arrow or page up
        if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 33) { 
            e.preventDefault();
            J5.backMsg();
        }
        // right arrow, down arrow or page down
        if ( e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 34) {
            e.preventDefault();
            J5.forwardMsg();
        }
    }
    
    // setup cross-window messaging
    frame.contentWindow.onmessage = function(e) {
        var args = e.data.split(" ");
        var argc = args.length;
        args.forEach(function(e, i, a) { a[i] = decodeURIComponent(e) });
        if (args[0] == "LOCATION" && argc == 2) {
            J5.idx = parseInt(args[1]);
            doc.getElementById("slideidx").value = J5.idx;
            doc.getElementById("first").disabled = doc.getElementById("prev").disabled = J5.idx == 1;
            doc.getElementById("last").disabled = doc.getElementById("next").disabled = J5.idx == J5.slides.length;
        }
        if (args[0] == "REGISTERED" && argc == 2) {
            doc.getElementById("slidecount").innerHTML = args[1];
        }
        if (args[0] == "NOTES" && argc == 2) {
            doc.getElementById("notes").innerHTML = args[1];
        }
    }
    
    J5.displayNotes();
    J5.loadSlideFrame();
    J5.view.postMessage("REGISTER", "*");
}

J5.loadSlideFrame = function() {
    // create iframe
    var element = this.iframe.contentDocument.body;
    var frame = element.insertBefore(document.createElement("iframe"), element.firstChild);
    
    // write doctype to iframe
    var doc = frame.contentDocument;
    doc.open();
    doc.write("<!DOCTYPE html><html><head></head><body></body></html>");
    doc.close();
    
    // define iframe content styles
    var styles = "html { background-color: black; }" +
                 "a { color: #0066FF; }" +
                 "a:hover { text-decoration: underline; }" +
                 "footer { position: absolute; bottom: 50px; right: 50px; }" +
                 "strong { color: #0066FF; }" +
                 "body { font-family: 'Oswald', arial, serif; background-color: #1C1C1C; color: white; font-size: 30px; line-height: 120%; }" +
                 "img { margin: 0 auto; display: block; }" +
                 "p img { position: relative; left: -20px }" +
                 "section { -moz-transition: left 400ms linear 0s; -webkit-transition: left 400ms linear 0s; -ms-transition: left 400ms linear 0s; transition: left 400ms linear 0s; }" + // transition effect
                 "section { background: #1C1C1C; overflow: hidden; left: -150%; }" +
                 "section[aria-selected] { left: 0; }" +
                 "section[aria-selected] ~ section { left: +150%; }" +
                 "h1 { color: #FF6600; margin: 20px 0; font-size: 50px; text-align: center; padding: 0 10px; line-height: 100% }" +
                 "h2 { color: #FF0066; margin: 20px 0; font-size: 40px; text-align: center; padding: 0 10px; line-height: 100% }" +
                 "ul { margin: 10px 0 0 50px; font-size: 0.9em; width: 750px; line-height: 100%; display: inline-block; }" +
                 "q, p { padding: 5px 20px; }" +
                 "q:after { content: ''; }" +
                 "q:before { content: ''; }" +
                 "q { display: block; margin-top: 140px; }" +
                 "video { position: absolute; top: 210px; width: 260px; left: 445px; box-shadow: 0 0 10px black; }" +
                 "#arrow { position: absolute; top: 165px; left: 460px; font-size: 100px; color: white; }" +
                 "li { list-style-type: square; }" +
                 // important - don't touch!
                 "* { margin: 0; padding: 0; }" +
                 "details {display: none; }" +
                 "body { width: 800px; height: 600px; margin-left: -400px; margin-top: -300px; position: absolute; top: 50%; left: 50%; overflow: hidden; }" +
                 "html { overflow: hidden; }" +
                 "section { position: absolute; pointer-events: none; width: 100%; height: 100%; }" +
                 "section[aria-selected] { pointer-events: auto; }" +
                 "body { display: none }" +
                 "body.loaded { display: block }";

    // add iframe content styles
    var css = document.createElement("style");
    css.appendChild(document.createTextNode(styles));
    doc.head.appendChild(css);
    
    // scale slide contents to iframe window size
    frame.contentWindow.onresize = function() {
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
    frame.contentWindow.onkeydown = function(e) {
        // ignore modifier keys
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }
        // left arrow, up arrow or page up
        if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 33) { 
            e.preventDefault();
            J5.back();
        }
        // right arrow, down arrow or page down
        if ( e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 34) {
            e.preventDefault();
            J5.forward();
        }
    }
    
    // setup cross-window messaging
    frame.contentWindow.onmessage = function(e) {
        if (e.data == "REGISTER") {
            J5.postMsg(J5.iframe.contentWindow, "REGISTERED", J5.slides.length);
            J5.postMsg(J5.iframe.contentWindow, "LOCATION", J5.idx);
        }
        if (e.data == "BACK") {
            J5.back();
        }
        if (e.data == "FORWARD") {
            J5.forward();
        }
        if (e.data == "GET_NOTES") {
            J5.postMsg(J5.iframe.contentWindow, "NOTES", J5.getNotes(J5.idx - 1));
        }
    }
    
    // detach slides from document and insert copies inside iframe
    for (var i = 0; i < J5.slides.length; i++) {
        if (J5.slides[i].parentNode) {
            //J5.slides[i].parentNode.removeChild(J5.slides[i]);
        }
        var slide = doc.importNode(J5.slides[i], true);
        doc.body.appendChild(slide);
    }
    
    // make image slides (<img class='fill'>) fill entire slide 
    var images = doc.querySelectorAll("section[typeof='http://purl.org/ontology/bibo/Slide'] img");
    for (var i = 0; i < images.length; i++) {
        if (hasClass(images[i], "fill")) {
            var p = getParentByTagName(images[i], "section");
            p.style.backgroundImage = "url("+ images[i].src +")";
            p.style.backgroundSize = "100% 100%";
            while (p.firstChild) {
                p.removeChild(p.firstChild);
            }
        }
    }

    // prescale slide content
    prescale = function() {
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
                
                var wrapper = document.createElement("div");
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
    
    J5.view = frame.contentWindow;
    J5.setSlide(J5.idx);
    doc.body.className = "loaded";
    
    if (frame.contentDocument.readyState == "complete") {
        prescale();
    }
    else {
        frame.contentWindow.onload = prescale;
    }
    
    frame.contentWindow.onresize();
}

J5.back = function() {
    this.setSlide(this.idx - 1);
    this.postMsg(this.iframe.contentWindow, "LOCATION", this.idx);
}

J5.forward = function() {
    this.setSlide(this.idx + 1);
    this.postMsg(this.iframe.contentWindow, "LOCATION", this.idx);
}

J5.backMsg = function() {
    this.view.postMessage("BACK", "*");
}

J5.forwardMsg = function() {
    this.view.postMessage("FORWARD", "*");
}

J5.goToSlide = function(s) {
    this.setSlide(s);
    this.postMsg(this.iframe.contentWindow, "LOCATION", this.idx);
}

J5.postMsg = function(win, msg) {
    msg = [msg];
    for (var i = 2; i < arguments.length; i++)
      msg.push(encodeURIComponent(arguments[i]));
    win.postMessage(msg.join(" "), "*");
  }

J5.setSlide = function(idx) {
    if (idx < 1 || idx > this.slides.length) return;
    this.idx = idx;
    var frame = this.iframe.contentDocument.body.firstChild;
    var old = frame.contentDocument.querySelector("section[aria-selected]");
    var next = frame.contentDocument.querySelector("section[typeof='http://purl.org/ontology/bibo/Slide']:nth-of-type("+ this.idx +")");
    if (old) {
        old.removeAttribute("aria-selected");
        old.style.cssText += ""; // force IE redraw
        var video = old.querySelector("slide-video");
        if (video) { video.pause(); }
    }
    if (next) {
        next.setAttribute("aria-selected", "true");
        next.style.cssText += ""; // force IE redraw
        J5.view.postMessage("GET_NOTES", "*");
        var video = next.querySelector("slide-video");
        if (video) { video.play(); }
    }
}

J5.getNotes = function(idx) {
    var slides = this.slides[idx];
    var notes = slides.querySelector("details");
    return notes ? notes.innerHTML : "";
}

J5.displayNotes = function() {
    if (!this.notesEnabled) return;
    if (this.notesVisible) {
        this.notes.style.display = "block";
        this.iframe.height = this.height = parseInt(this.height) + this.notes.clientHeight;
    }
    else {
        this.iframe.height = this.height = parseInt(this.height) - this.notes.clientHeight;
        this.notes.style.display = "none";
    }
    this.notesVisible = !this.notesVisible;
}

J5.fullscreen = function() {
    var e = this.view.frameElement;
    fullscreenAllowed = e.requestFullscreen || e.requestFullScreen || e.mozRequestFullScreen || e.webkitRequestFullScreen;
	console.log(e.webkitRequestFullScreen);
	console.log(fullscreenAllowed);
    if (fullscreenAllowed) {
        fullscreenAllowed.apply(e);
    }
}

window.addEventListener("DOMContentLoaded", function() {
    J5.slides = document.querySelectorAll("section[typeof='http://purl.org/ontology/bibo/Slide']");
    if (J5.slides) {
        J5.loadIframe();
    }
});

function getParentByTagName(node, tag) {
    var parent = node.parentNode;
    if (!parent) return false;
    if (parent.tagName.toLowerCase() == tag) return parent;
    else return getParentByTagName(parent, tag);
}

function hasClass(node, className) {
    return (' ' + node.className + ' ').indexOf(' ' + className + ' ') >= 0;
}