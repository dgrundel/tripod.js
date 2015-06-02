# tripod.js
Two-way databinding is sooo 2014.

http://dgrundel.github.io/tripod.js/

## Usage


### The Tripod Instance
-

The instance is basically just an object that you put data into and pull data out of, just like any other JS object.
The main difference here is that you use getters and setters, but we'll get to that in a moment.

Here's the gist of it:
```
var myAwesomeInstance = new Tripod([[[(object) initialAttributes], (string) namespace], (boolean) persist]);
```

-
#### Simplest Example

Just use the new keyword and you're on your way. This creates an instance with no set attributes, no namespacing (we'll get to that), and that is _*not* persisted to local storage_.

```
var myAwesomeInstance = new Tripod();
```

-
#### Full Example

```
var attributes = {
	make: 'Ford',
	model: 'Pinto',
	color: 'Rust'
};
var namespace = 'vehicle';
var persistToLocalStorage = false;

var firstCar = new Tripod(attributes, namespace, persistToLocalStorage);
```

So, what did we do?

Hopefully the attributes piece is pretty straightforward. Those are the attributes our object will start with.
You can always set more later, this is just to get your object going.

The namespace tells Tripod which nodes in the DOM belong to this instance. We'll talk about that a little more in minute.

The last argument is a boolean that tells Tripod whether or not to store data in Local Storage as well.
If true, data is saved in Local Storage as it is updated and changes will synchronize across open browser tabs. Neat!


___

### Getting and Storing Data from/to the Instance


The aforementioned getter and setter are creatively named *get* and *set*.

-
#### instance.get()

Remember the example _firstCar_ instance we created above? What was the color again? I can't remember.

```
var theColor = firstCar.get('color');
console.log(theColor); // "Rust"
```

Note that instance.get() will throw an error if you attempt to access an attribute that doesn't exist.

-
#### instance.set()

Oh, darn. We forgot to add the year. No worries.

```
firstCar.set('year', 1980); // Sweet. This baby is practically brand new.
```

Note that we can set an attribute that didn't already exist, just like a normal JS object.

-
#### But, wait a minute, my data is in the DOM!

Hang on, we're getting there. I'll give you a hint. You're looking for instance.load().


___

### Data binding, the DOM, and Namespaces


So far we've just looked at Javascript. If we just lived in the land of Javascript milk and honey,
we wouldn't need all this fancy data binding goodness. Let's talk about getting your data into and out of the DOM.

-
#### First Things First: Data Attributes

Tripod needs you to tell it which DOM nodes (inputs, checkboxes, paragraphs, etc) to pay attention to.
To do that, you need to add a little data attribute to elements you want to sync with your Tripod instance.
The attribute is *data-bound-to* and it looks like this:

```
<input data-bound-to="vehicle.make">
```

Hey, where did _vehicle_ come from? Oh right, I told you we were going to talk about namespaces. Now you know.

The elaborate formula for your data attributes is: "[namespace.]attribute". How about some examples:

```
<!--  namespace: person, attribute: name -->
<input data-bound-to="person.name">

<!--  no namepsace, attribute: name -->
<input data-bound-to="name">
```

Make sense?

-
#### Pulling Data from the DOM Using instance.load()

In many cases, the data you want is already hanging out in the DOM, but you don't have it available to your Javascript yet.
For example, when data is loaded into the page on the server side.

Consider this HTML markup:

```
<input data-bound-to="vehicle.fuel" value="gasoline">
```

Snatching this up and adding it to our _firstCar_ instance is trivial:

```
firstCar.load('fuel');
```

instance.load() works like instance.set() in that the attribute doesn't have to exist before you call it. It will be created for you.

-
#### instance.load() and Local Storage

If you passed _true_ as the third argument in the constructor, your Tripod instance will be backed by Local Storage. 

*In this case, instance.load() will first check Local Storage for a value before looking in the DOM.*

-
#### Putting Data into the DOM Using instance.push()

Now consider the opposite example. You have your fancy HTML form ready to go, but your data is late to the party.
Maybe your data is being brought in via an AJAX call.

Have a look at this lovely form:

```
<input data-bound-to="vehicle.make">
<input data-bound-to="vehicle.model">
<input data-bound-to="vehicle.year">
```

instance.push() to the rescue!

```
firstCar.push('make');
firstCar.push('model');
firstCar.push('year');
```

Or, if you're into the whole brevity thing:

```
firstCar.push(['make', 'model', 'year']);
```

*Protip:* instance.load() also accepts an array of attributes.

-
#### A Final Note About instance.load() and instance.push()

*You really only need to use these methods once, if at all.*
They are designed to perform an initial sync of data between the DOM and your Javascript.
Once you have data in both places, any edits to the page will automatically show up in your Javascript, 
and any edits to the instance (using instance.set()) are automatically pushed to the DOM.


___

### Go Big or Go Home: instance.getAll(), instance.loadAll(), instance.pushAll()


These three methods do pretty much what you'd expect.

-
#### instance.getAll()

Returns a Javascript object containing all attributes and their values.

-
#### instance.loadAll()

Grabs all _known_ attributes from the DOM. 

_Note that you must have used instance.set(), instance.load(), or included the attribute in the call to the constructor._

-
#### instance.pushAll()

Pushes all _known_ attributes out to the DOM. 

_Note that you must have used instance.set(), instance.load(), or included the attribute in the call to the constructor._


___

### Dealing with Difficult Nodes


You're probably wondering what HTML attributes are set when exchanging data with the DOM. You have come to the right place. Here's a brief summary.

-
#### input[type=checkbox]

Checkboxes always return boolean true or false, regardless of their value attribute.

-
#### input[type=radio]

As you might expect, radio buttons will give you the value of the selected radio button.

-
#### input[type=text, tel, url, ...]

All other inputs use the value attribute to get and set their value.

-
#### select

Select elements work just as expected, using the value of the selected option.

-
#### All other DOM nodes (div, p, h1, span, ...)

The textContent (or innerText for IE) attribute is used to get and set values in DOM nodes.


___

### More Examples


#### When Data is Loaded into the Page Server Side

DOM:
```
<!DOCTYPE html>
<html lang="en">
<head>...</head>
<body>
	<p>
		City:<br>
		<input data-bound-to="address.city" value="Anchorage">
	</p>
	<p>
		State:<br>
		<select data-bound-to="address.state">
			<option value="AL">Alabama</option>
			<option value="AK" selected>Alaska</option>
			<option value="AR">Arkansas</option>
			...
		</select>
	</p>
</body>
</html>
```

Javascript:
```
var address = new Tripod({city: '', state: ''}, 'address');
address.loadAll();
console.log(address.get('city')); // "Anchorage"
console.log(address.get('state')); // "AK"
```

-

#### When Data is Loaded into the Page Client Side (via AJAX)

DOM:
```
<!DOCTYPE html>
<html lang="en">
<head>...</head>
<body>
	<p>
		City:<br>
		<input data-bound-to="address.city">
	</p>
	<p>
		State:<br>
		<select data-bound-to="address.state">
			...
		</select>
	</p>
</body>
</html>
```

Javascript:
```
var addressData = someAjaxCallToGetData(); // returns {city: 'Anchorage', state: 'AK'}
var address = new Tripod(addressData, 'address');
address.pushAll(); // now the DOM reflects the loaded AJAX data
```