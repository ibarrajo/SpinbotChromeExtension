'use strict';

//console.log('\'Allo \'Allo! Option');


// Saves options to chrome.storage
function save_options() {
  var api_key = document.getElementById('api_key').value;
  chrome.storage.sync.set({
    api_key: api_key,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    api_key: '',
  }, function(items) {
    document.getElementById('api_key').value = items.api_key;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
