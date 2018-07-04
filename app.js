'use strict';

/** 
 * TODO:
 * finish 'printer' func.
 * styling
 */


// GLOBAL VARIABLES
const dom = Object.freeze({
  searchInput: document.querySelector('.search-input'),
  container: document.querySelector('.container'),
  header: document.querySelector('.header'),
  profileSection: document.querySelector('.profile-section')
});



// PERIPHERAL / 'HELPER' FUNCTIONS
// FUNCTION - create an element & assign className
const newElement = (element, classNm) => {
  const newEl = document.createElement(element);
  newEl.className = classNm;

  return newEl;
};

// FUNCTION - display feedback / alert message to user 
const showAlert = (alertType, msg="Aww shucks! Something went wrong!") => {
  if (!document.querySelector('.alert')) {
    const {container, header} = dom;
    const alertDiv = newElement('div', `alert ${alertType}`);
    alertDiv.appendChild(document.createTextNode(msg));
    // append 'alertDiv' to DOM if none there & remove after 2.5s if present
    container.insertBefore(alertDiv, header);
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 2500);
  }
};


// CORE FUNCTIONS
// FUNCTION - construct URLs for requests used in 'getData'
const prepUrls = (username) => {
  const url = {
    key: '71a04cd6667f6849ddfd',
    sec: '97a88ad741b52d7137ee3061b610fd8eea57e44d',
    base: `https://api.github.com/users/${username}`,
    keySec: `client_id=${this.key}&client_secret=${this.sec}`,
    reposCount: 5,
    reposSort: 'created:asc'
  };
  const profileUrl = `${url.base}?${url.keySec}`;
  const reposUrl = `${url.base}/repos?per_page=${url.reposCount}&sort=${url.reposSort}&${url.keySec}`;

  return {profileUrl, reposUrl};
};

// FUNCTION - async/await. Fetch data from github 
const getData = async (urls) => {
  const profileRequest = await fetch(urls.profileUrl);
  const reposRequest = await fetch(urls.reposUrl);

  const status = profileRequest.status;
  if (status === 404) return showAlert('error', 'No matching profile found');
  if (status === 403) return showAlert('error', 'Request limit reached. Try again later');
  if (status !== 200) return showAlert('error');

  const profileData = await profileRequest.json();
  const reposData = await reposRequest.json();
  
  return {profileData, reposData};
};

// FUNCTION - print
const printer = (data) => {
  if (data) {
    const profile = data.profileData;
    const repos = data.reposData;
    const profileFragment = document.createDocumentFragment();
    const reposFragment = document.createDocumentFragment();
  

  
    if (repos.length < 1) {
      showAlert('error', `No repos found for '${profile.login}'`);
    }

    return console.log(data);
  }
};


// FUNCTION - initializes & controls program and eventListener on 'searchInput'
const init = (() => {
  const {searchInput} = dom;
  const ctrl = (event) => {
    const username = event.target.value.trim();
    if (!username || (/^\s+$/).test(username)) {
      return showAlert('error', 'Please enter a username');
    }
    const urls = prepUrls(username);

    return getData(urls)
      .then(printer)
      .catch(console.error);
  };

  searchInput.addEventListener('keyup', ctrl)
})();
