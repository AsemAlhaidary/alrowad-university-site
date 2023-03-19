/**
 * @function evalString
 * @desc Converts `val` from string based on type: string | number | boolean
 * @param {string} val - string to evaluate
 * @return {object} val - returns a boolean if true|false;
 * number of integer; otherwise original string;
 */
let evalString = (val) => {
	if (val.length > 0) {
		// is Number?
		if (!isNaN(val)) {
			val = parseFloat(val);
		} else {
			// is Bool?
			switch (val.toLowerCase()) {
				case 'true':
					val = true;
					break;
				case 'false':
					val = false;
					break;
			}
		}
	}

	return (val);
}

/**
 * @function isStorageEnabled
 * @desc Checks if localStorage and thus cookies are allowed 
 * to be stored on local system
 * @return {boolean} cookieEnabled
 */
let isStorageEnabled = () => {
	let cookieEnabled = true;

	try {
		localStorage.setItem('checkMyCookie', 'true');
	} catch (e) {
		// Assuming that cookies are disabled since localStorage
    // is disabled. console.log("Cookies are disabled.");
		cookieEnabled = false;
	}

	return (cookieEnabled);
}

/**
 * @function getCookie
 * @desc Retrieves all stored cookies for site.
 * @return {object} myCookie
 * @example `let myTheme = getCookie().theme;` If "theme" 
 * is a stored cookie, the object value will be returned.
 */
let getCookie = () => {
	let myCookie = document.cookie.split(';');

	myCookie = myCookie.map(cookie => cookie.split('='))
		.reduce((accumulator, [key, value]) => ({
			...accumulator,
			[key.trim()]: evalString(decodeURIComponent(value))
		}), {});

	return myCookie;
}

/**
 * @function setCookie
 * @desc stores a cookie on the root(/) of website. 
 * If error, logs to console.
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#directives
 * @param {string} cKey - name of the key
 * @param {string} cVal - value to set on key
 * @param {number} [cDays=30] - days to keep the cookie. Default: 30
 * @example `setCookie("theme", 'night');` Sets a cookie theme=night 
 * for 30 days expiry.
 */
let setCookie = (cKey, cVal, cDays = 30) => {
	let date = new Date();
	date.setTime(date.getTime() + (cDays * 24 * 60 * 60 * 1000));
	let expires = date.toUTCString();

	// All domains (NOTE: Cookies can't be saved on IPs domains)
	let domain = document.domain;

	cKey = cKey.trim();
	cVal = cVal.trim();

	console.log("setCookie( Key: '" + cKey + "', Val: '" + cVal + "', Days: '" + cDays + "');");
	if (isStorageEnabled()) {
		cVal = escape(cVal);
		document.cookie = cKey + '=' + cVal + ';' + 'Expires=' + expires + ';Path=/;Secure;SameSite=lax;Domain=' + domain;
	} else {
		throw new Error("Cookies are disabled.");
	}
}

/**
 * @function onTopHeader
 * @desc Toggles "on-top" class to "NavBar" section 
 * in all pages in the Website.
 * `on-top` class changes the navBar to display a 
 * shadow when user scrolls down.
 */
let onTopHeader = () => {
  let scrollOffset = 5;
	document.querySelector('.header').classList.toggle('on-top', window.scrollY <= scrollOffset);
}

/**
 * @function scrollDown
 * @desc Scroll the site on the Y-axis by "viewHight" 
 * value minus the "headerHeight" after clicking on 
 * ".scrollDown" element
 */
let scrollDown = () => {
  if (document.querySelector('.hero') == null) return;

  let scrollDown = document.querySelector('.scroll-down');
  let headerHeight = document.querySelector('.header').clientHeight;
	let viewHight = document.querySelector('.hero').clientHeight;

	scrollDown.addEventListener('click', () => {
		document.body.scrollTop = viewHight;
		document.documentElement.scrollTop = viewHight - headerHeight;
	});
}

/**
 * @function toTopButton
 * @desc Change the CSS value of "transform" attribute 
 * to the button if the scroll value on Y axis is > than 
 * window height && add a click listener to the button to 
 * scroll the site to the top
 */
let toTopButton = () => {
	let topButton = document.querySelector('.to-top');

  if (typeof topButton == 'undefined') return;

  topButton.classList.toggle('active', window.scrollY > window.innerHeight);

  topButton.addEventListener('click', () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
}

let aos = new IntersectionObserver(elements => {
  elements.forEach(elem => {
    if (elem.isIntersecting === false) return;

    elem.target.style.transform = 'translateY(0)';
    elem.target.style.opacity = '1';

    aos.unobserve(elem.target);
  });
}, { rootMargin: '-100px', });

let animateOnScroll = () => {
  let elements = [...document.querySelectorAll('.aos')];

  elements.forEach(elem => {
    elem.style.transform = 'translateY(50%)';
    elem.style.transition = '1s';
    elem.style.opacity = '0';
    aos.observe(elem);
  });
}

window.onscroll = () => {
  onTopHeader();
  toTopButton();
}

window.onload = () => {
  onTopHeader();
  scrollDown();
  toTopButton();
  animateOnScroll();
}