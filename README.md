What is J5slide?
================

J5slide is a framework for creating web-based slideshow presentations. It turns HTML with a declarative slide markup into a slideshow presentation with the use of JavaScript, HTML5 and CSS3.

Based on DZ Slides - http://github.com/paulrouget/dzslides

Features
========

-   Presentations can be shown either alone or embedded within existing pages (standalone and embedded viewers)
-   Slides can contain any HTML content (text, images, videos, iframes, etc)
-   Adding slideshow behaviour to a document containing slides is as simple as adding a single line
-   Presenter mode with slide notes
-   Resolution independent slides (virtual dimension of 800x600 but scaled according to the available space)
-   Fullscreen support using the HTML5 fullscreen API
-   CSS3 slide transitions

Instructions
============

There are two slide viewers available, ```j5slide.js``` and ```j5slide_embed.js```. ```j5slide.js``` allows you to display a slideshow by itself and features a presenter mode that can be toggled with ```CTRL + SPACE```. ```j5slide_embed.js``` is used to display a slideshow as an embed in an existing document that contains other content. To enable the slideshow on a page containing appropriately formatted slides just add one of the scripts to the page and use the left and right arrow keys to navigate through the slides.

Slides can be written using either HTML or Markdown and have the following basic format:

```HTML
<section typeof="http://purl.org/ontology/bibo/Slide">
    Slide content
    <details>
        Slide notes
    </details>
</section>
```

Images (for example slide images that have been exported from another slide application such as PowerPoint or Google Drive) can easily be made to fill an entire slide by using the object tag:

```HTML
<section typeof="http://purl.org/ontology/bibo/Slide">
    <object data="Image URL">
        Fallback content
    </object>
    <details>
        Slide notes
    </details>
</section>
```

License
=======

```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

0. You just DO WHAT THE FUCK YOU WANT TO.
```
