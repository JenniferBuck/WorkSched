/*
	NOTE: A bit of "future-proofing" was contemplated by 
	creating data structures to hold 24 hours of data.

	This means I've setup loops that go through all 24 hours 
	rather than a forEach loops and that I have to make sure that
	certain querySelector calls are not "null".
*/

// const momentWithLocales = require("./moment-with-locales");

//alert('aloha');
// const moment = require('momentWithLocales');
// import moment from 'moment';
if (typeof (Storage) !== "undefined") {
	var isLocalStorage = true;
	console.log('Supports localstorage');

} else {
	// No web storage Support.
	alert('no go - local storage');
}


let today = moment(); 
let theHour = moment().hour();
console.log(theHour);
let theDay = today.format("YYYY-MM-DD");
console.log(typeof theDay);
// $TODO We should have a yesterday/tomorrow navigation
// console.log('theDay', theDay.format("ddd MMM Mo YYYY"));
// console.log('theDay', theDay.format("YYYY-MM-DD"));
const elToday = document.querySelector( 'header time' );
const elItemFrame = document.querySelectorAll( '.schedule-item-frame' );
const elButtons = document.querySelectorAll( '.schedule-item-frame button' );
const elItems = document.querySelectorAll( '.schedule-item-text' );


// *************************************************************************************


function saveItems() {

	let myArr = new Array(24);

	for (let i = 0; i < 24; i++) {
		myClass = '.js-' + i;
		if( document.querySelector( myClass + " p" ) != null ) {
			const myEl = document.querySelector( myClass + " p" );
			if(myEl.textContent.length > 0 ) {
				myArr[i] = myEl.textContent;
			}
		}
	}

	console.log('myArr', myArr);



	// Save it to local storage.
	// First turn it into a JSON string.
	const strSave = JSON.stringify(myArr);
	window.localStorage.setItem( theDay,strSave );
	
	// Same as above but in one line and maybe a bit harder to read and understand for a novice.
	//window.localStorage.setItem( theDay,JSON.stringify(myArr) );

}

function handleButtonClick(event) {

	const myButtonText = event.target.innerHTML;
	const myButtonID = event.target.id;

	// Don't allow for two items to be edited at once.
	// And make sure that the buttons have the proper text.
	elItems.forEach( function (item) {
		item.setAttribute('contenteditable', 'false');
	} );

	// BEWARE - This is a magic number! Maybe add a class!
	const myEditItem = event.target.parentNode.children[1];

	switch(myButtonText) {
		case 'Add':
			// We don't need this since Add and Edit do the same thing.
			// myEditItem.setAttribute('contenteditable', 'true');
			// event.target.innerHTML = 'Save';
			// break;

		case 'Edit':
			myEditItem.setAttribute('contenteditable', 'true');
			event.target.innerHTML = 'Save';			
			break;			

		case 'Save':
			myEditItem.setAttribute('contenteditable', 'false');		
			saveItems();
			if (myEditItem.textContent.length === 0) {
				event.target.textContent = 'Add';
			} else
				event.target.textContent = 'Edit';		
			break;

	} // End switch(myButtonText).
	
}

// ***************************************************************************************************

elToday.textContent = today.format('MMM Do YYYY');
elToday.setAttribute( "datetime", theDay );

for (let i = 0; i < 24; i++) {
	myClass = '.js-' + i;
	console.log(i);
	//default color is set differently. set in two places.  
	if( document.querySelector( myClass + " p" ) != null ) {
		const myEl = document.querySelector( myClass + " p" );
		if( i === theHour ) {
			myEl.classList.add( "time-cur");
			console.log('equal');
		}  else if ( i > theHour ){
			//come back to this. js method classList
			myEl.classList.add( "time-fut" );
		}
	}
}

if( isLocalStorage ) {
	
	const myItems = JSON.parse(window.localStorage.getItem(theDay));
	console.log(myItems);

	if( myItems != null ) {
		console.log('we have data');
		for (let i = 0; i < 24; i++) {
			if( myItems[i] != null ) {

				/* 
					NOTE: The markup that supports this has been removed.
					Using the data-hour attribute as a selector.
					myDataAttributeSelector = '[data-hour="' + i + '"]';
					document.querySelector( myDataAttributeSelector + " p" ).innerHTML = myItems[i];
					document.querySelector( myDataAttributeSelector + " button" ).innerHTML = 'Edit';
				*/

				// Using a js-n class. Recommended and probably faster
				myClass = '.js-' + i;
				document.querySelector( myClass + " p" ).innerHTML = myItems[i];
				document.querySelector( myClass + " button" ).innerHTML = 'Edit';
			}
		};
	}

	elButtons.forEach(function (button) {
		button.addEventListener('click', handleButtonClick);
	});

}

