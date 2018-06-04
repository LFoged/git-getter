'use strict';

// GLOBAL VARIABLES
const doc = document;
const searchInput = doc.querySelector('.search-input');
const container = doc.querySelector('.container');
const header = doc.querySelector('.header');
const profileSection = doc.querySelector('.profile-section');


// FUNCTION - create an element, assign className & another attribute if needed
const newElement = (element, classNm) => {
  const newEl = doc.createElement(element);
  newEl.className = classNm;

  return newEl;
};


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


// FUNCTION - async/await. Fetch request for data 
const getData = async(urls) => {
  const profileRequest = await fetch(urls.profileUrl);
  const reposRequest = await fetch(urls.reposUrl);
  const profileData = await profileRequest.json();
  const reposData = await reposRequest.json();
  
  return {profileData, reposData};
};


// FUNCTION -
const printer = (data) => {
  if (data.profileData.message) {
    return showAlert('error', 'No matching profile found');
  }
  const user = data.profileData;
  const repos = data.reposData;

  const fragment = doc.createDocumentFragment();
  fragment.innerHTML = 
    `

    `;

  return console.log(data);
};


// FUNCTION - display feedback / alert message to user 
const showAlert = (alertType, msg="AWW SHUCKS! Something went wrong!") => {
  const alertDiv = newElement('div', `alert ${alertType}`);
  alertDiv.appendChild(doc.createTextNode(msg));
  // append 'alertDiv' to DOM if there is none there already
  if (!doc.querySelector('.alert')) container.insertBefore(alertDiv, header);
  // remove 'alertDiv' after 2.5s, if present
  setTimeout(() => {
    if (doc.querySelector('.alert')) return doc.querySelector('.alert').remove();
  }, 2500);
};



// eventListener on 'searchInput' to start program
searchInput.addEventListener('keyup', (event) => {
  const username = event.target.value;
  if (!username || (/^\s+$/).test(username)) {
    return showAlert('error', 'Please enter a username');
  }
  const urls = prepUrls(username);
  getData(urls).then(printer).catch(console.error);
});

