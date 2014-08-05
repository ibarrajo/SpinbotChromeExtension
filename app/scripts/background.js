'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});
//
chrome.tabs.onUpdated.addListener(function (tabId) {
    chrome.pageAction.show(tabId);
});

// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var API_KEY = '00000000000000000000000000000000';

/**
var options = {
  spin-cap-words: Boolean,
  words-to-skip: String,
  min-percent-change-per-sentence: Int(1-100),
  action: 'getavailablespins',
  min-percent-change-per-sentence: Int(1-100),
  min-percent-change-per-sentence: Int(1-100)
}
**/
function spinbotRequest(options, callback, text) {
  var xmlhttp;
  text = text || null;
  xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      callback(xmlhttp.responseText);
    }
  };

  xmlhttp.open('POST','https://api.spinbot.com', true);
  xmlhttp.setRequestHeader('x-auth-key', API_KEY);

  for (var action in options) {
    if (options.hasOwnProperty(action)) {
      xmlhttp.setRequestHeader('x-' + action, options[action]);
    }
  }

  xmlhttp.send(text);
}


function spinBotThis(text) {
  spinbotRequest({action: 'getavailablespins'}, function(res) {

  });
}

function copyTextToClipboard(text) {
  var copyFrom = document.createElement('textarea');
  copyFrom.textContent = text;
  var body = document.getElementsByTagName('body')[0];
  body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  body.removeChild(copyFrom);
}


// The onClicked callback function.
function onClickHandler(info, tab) {
  copyTextToClipboard(info.selectionText);
  console.log(info.selectionText);
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: 'SpinBot This',
    contexts: ['selection'],
    id: 'contextselection'
  });

});
