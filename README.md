# Applesauce

Some asynchronous Javascript to sweeten up you chicken...

<img src="http://makernode.net/uploads/543d3362210757.32074860/applesauce.png" width="200px" />

Applesauce just makes everything taste a little better (at least little children seem to think so). And that is just what the Applesauce Javascript is doing. After everything is loaded into the browser, this script is able to asynchronously load a (newer) version of jQuery onto your page and use this with your own widgets. After that you are able to load (let's say) jQuery-UI that might require a later jQuery version than the one that is originally loaded. So Applesauce sweetens up your page like applesauce does with chicken...

### Google Tag Manager or a special configuration block in HTML.

It is especially nice if you combine it with tools like the Google Tag Manager (GTM). GTM is able to asynchronously write a block of HTML into the DOM and there is no reason why this block of code wouldn't be a script-link to applesauce.js and one of your widgets with a configuration (which resides nicely hidden in a div-element).
