'use strict';

var bkg = chrome.extension.getBackgroundPage();
// Restores the settings stored in chrome.storage.
function restoreOptions() {
  chrome.storage.sync.get({
    API_KEY: '',
    emailAddress: '',
    remainingSpins: '',
    apiKey: ''
  }, function(items) {
    document.getElementById('api_key').value = items.API_KEY;
    document.getElementById('email_address').innerText = items.emailAddress;
    document.getElementById('remaining_spins').innerText = items.remainingSpins;
    //document.getElementById('api_key').value = items.API_KEY;
  });
}


// Saves options to chrome.storage
function saveOptions() {
  var API_KEY = document.getElementById('api_key').value;
  chrome.storage.sync.set({
    API_KEY: API_KEY,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}


function saveAccountSettings(settings) {
  if (settings === false) {return false;}
  // {emailAddress:'', remainingSpins:'', apiKey:''}
  chrome.storage.sync.set(settings, function() {
    // reload the options
    restoreOptions();
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Account settings saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}


/**
* returns false if not logged in,
* returns an object with the account details if it is logged in
* {emailAddress:'', remainingSpins:'', apiKey:''}
**/
function getAccountDetails() {
  var xhr = new XMLHttpRequest();
  // false by default
  var accountDetails = false;
  xhr.onreadystatechange = function() {
    // unfortunately, the onreadystatechange method cannot detect
    // a 302 redirect nor the Location header, so we rely on not
    // finding the correct table.
    if (xhr.readyState === 4 && xhr.status === 200) {
      var doc = document.createElement('div');
      doc.innerHTML = xhr.responseText;

      doc = doc.getElementsByTagName('TABLE')[1]
      .getElementsByTagName('TABLE')[0];

      // if doc.innerText is undefined, then we are not logged in!
      if (typeof doc !== 'undefined') {
        doc = doc.getElementsByTagName('TR');

        // local helper function to retrieve the table details
        var detail = function(d) {
          return d.getElementsByTagName('TD')[1].innerText.trim();
        };

        accountDetails = {
          emailAddress: detail(doc[1]),
          remainingSpins: detail(doc[2]),
          apiKey: detail(doc[3])
        };
      }
    }
  };
  xhr.open('GET', 'https://spinbot.com/Manage', false);
  xhr.setRequestHeader('X-Requested-With', 'spinbot-chrome-ext');
  xhr.send();
  return accountDetails;
}

// returns a boolean if successfully logged in.
function loadAccountDetails() {
  var details = getAccountDetails();
  if (details !== false) {
    saveAccountSettings(details);
    return true;
  } else {
    return false;
  }
}

function showTextArea(side) {
  switch (side) {
    case 'input':
      document.getElementsByClassName('card')[0].classList.remove('flipped');
      break;
    case 'output':
      document.getElementsByClassName('card')[0].classList.add('flipped');
      break;
    default:
      document.getElementsByClassName('card')[0].classList.toggle('flipped');
      break;
  }
}

function spinit() {
  // toggle the animation
  showTextArea();
}

function doSetup() {
  console.log('doSetup()');
}

function getMoreSpins() {
  console.log('getMoreSpins()');
}

function init() {
  // check if logged in, of if the api key is set
  var isAuthenticated = loadAccountDetails();
  if (isAuthenticated) {
    // if the number of available spins is ok

    var spins = 1;
    if (spins > 0) {

    } else {
      // get more spins!
      getMoreSpins();
    }
  } else {
    // log in first, or set the api key.
    doSetup();
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('spinit').addEventListener('click', spinit);
document.getElementById('get_api_key').addEventListener('click', loadAccountDetails);

init();
