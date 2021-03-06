# Applesauce

### Some asynchronous JavaScript to sweeten up your chicken...

<img src="https://github.com/petervdpas/Applesauce/blob/master/applesauce.png" width="200px" />

Applesauce just makes everything taste a little better (at least little children seem to think so). And that is just what the Applesauce JavaScript is doing. After everything is loaded into the browser, this script is able to asynchronously load a (newer) version of jQuery onto your page and use this with your own widgets. After that you are able to load (let's say) jQuery-UI that might require a later jQuery version than the one that is originally loaded. So Applesauce sweetens up your page like applesauce does with chicken...

### Google Tag Manager or a special configuration block in HTML.

It is especially nice if you combine it with tools like the Google Tag Manager (GTM). GTM is able to asynchronously write a block of HTML into the DOM and there is no reason why this block of code wouldn't be a script-link to applesauce.js and one of your widgets with a configuration (which resides nicely hidden in a div-element).

### Widget configuration block

An Applesauce widget could look a little like the block of code below.

<code>
&lt;!-- An Applesauce widget. See: widgetOne.js for JavaScript --&gt;<br>
&lt;script src="applesauce.js"&gt;&lt;/script&gt;<br>
&lt;script src="widgetOne.js"&gt;&lt;/script&gt;<br>
&lt;div id="widgetOne" style="display:none"<br>
&nbsp;&nbsp;&nbsp;&nbsp;data-oneselector="#some_identifier"<br>
&nbsp;&nbsp;&nbsp;&nbsp;data-src="."&gt;<br>
&lt;/div&gt;
</code>

### Multiple widgets.

With the Applesauce script it is possible to run multiple widgets (using Applesauce) on a page at the same time. Every widget could use it's own version of jQuery. However Applesauce checks if a certain url that is providing jQuery (or any other javascript) is already loaded. This makes it possible to both waste clientside resources by loading the same jQuery version from different resouces or reuse those resouces....

### Experiments

SammyJS: works (need to split examples into different widgets).

### Todo

Load EmberJS, Fonts and other stuff... and make different examples out of it!

### Who created this...?

The Applesauce script was brought to you by [Peter van de Pas](https://github.com/petervdpas) and [Richard Moeskops](https://github.com/thargol1).
