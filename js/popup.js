"use strict";
var e = "";

function t() {
	document.getElementById("meet-placeholder").hidden = !1
}

function n(e = !0) {
	var t = document.getElementById("connect-drive-container"),
		n = document.getElementById("auto-save-container");
	e ? (t.hidden = !1, n.hidden = !0) : (t.hidden = !0, n.hidden = !1)
}

function d(e = !0) {
	var t = document.getElementById("auto-save-container"),
		n = document.getElementById("connect-drive-container");
	e ? (t.hidden = !1, n.hidden = !0) : (t.hidden = !0, n.hidden = !1)
}
chrome.tabs.query({
	active: !0,
	currentWindow: !0
}, (function(n) {
	var d = n[0];
	d.url.includes("https://meet.google.com/") && function(e) {
		var t = /^[A-Za-z]+$/,
			n = e.split("/").pop(),
			d = n.indexOf("?");
		d > -1 && (n = n.substring(0, d));
		for (var i = n.split("-"), c = 0; c < i.length; c++)
			if (!t.test(i[c])) return !1;
		return !0
	}(d.url) ? chrome.tabs.sendMessage(d.id, {
		getMeetingName: !0
	}, (function(n) {
		n ? chrome.runtime.sendMessage({
			method: "getTranscript",
			meetingName: n
		}, (function(d) {
			if (e = n, null !== d)
				if (d.transcript.length > 0)
					for (var i = d.transcript, c = d.p, o = 0; o < i.length; o++) {
						var a = document.getElementById("caption-container"),
							r = document.createElement("div");
						r.setAttribute("data-index", o);
						var s = document.createElement("div");
						s.setAttribute("class", "speaker");
						var h = i[o].name.bold();
						c && (h = h + "<small> " + i[o].timestamp + "</small>"), s.innerHTML = h;
						var m = document.createElement("div");
						m.setAttribute("class", "caption"), m.setAttribute("data-index", o), m.innerText = i[o].caption, m.addEventListener("click", (function() {
							var e = this;
							c && chrome.runtime.sendMessage({
								method: "setHighlight",
								meetingName: n,
								index: this.dataset.index
							}, (function(t) {
								t.highlighted ? (e.classList.remove("unhighlighted"), e.classList.add("highlighted"), e.setAttribute("data-highlighted", 1)) : (e.classList.remove("highlighted"), e.classList.add("unhighlighted"), e.setAttribute("data-highlighted", 0))
							}))
						})), c && (i[o].highlighted ? (m.classList.remove("unhighlighted"), m.classList.add("highlighted"), m.setAttribute("data-highlighted", 1)) : (m.classList.remove("highlighted"), m.classList.add("unhighlighted"), m.setAttribute("data-highlighted", 0))), r.appendChild(s), r.appendChild(m);
						var l = document.createElement("br");
						r.appendChild(l), a.appendChild(r), a.scrollTop = a.scrollHeight
					} else t();
				else t()
		})) : t()
	})) : function() {
		document.getElementById("intro").hidden = !1;
		var e = document.getElementById("pro-cta");
		chrome.storage.sync.get(["p"], (function(t) {
			t.p && (e.hidden = !0)
		}))
	}()
})), document.addEventListener("DOMContentLoaded", (function() {
	var t = document.getElementById("activate-pro");
	t.addEventListener("click", (function() {
		chrome.tabs.create({
			url: chrome.extension.getURL("license.html")
		})
	}));
	var i = document.getElementById("buy-pro");
	i.addEventListener("click", (function() {
		chrome.tabs.create({
			url: "https://captionsaver.com/#pricing"
		})
	}));
	var c = document.getElementById("activate-pro-menu-item");
	c.addEventListener("click", (function() {
		chrome.tabs.create({
			url: chrome.extension.getURL("license.html")
		})
	}));
	var o = document.getElementById("buy-activate-divider");
	chrome.storage.sync.get(["key"], (function(e) {
		e && e.key && (c.hidden = !0, i.hidden = !0, o.hidden = !0)
	})), document.getElementById("connect-drive-button").addEventListener("click", (function() {
		this.innerText = "Loading...", this.disabled = !0, chrome.runtime.sendMessage({
			method: "connectDrive"
		})
	})), chrome.storage.sync.get(["key", "p", "folderId", "auth"], (function(e) {
		e.key ? e.p ? (t.hidden = !0, e.folderId ? (d(), function() {
			var e = document.getElementById("auto-save-switch"),
				t = document.getElementById("auto-save-link");
			e.disabled = !1, t.removeAttribute("href"), chrome.storage.sync.get(["autoSave"], (function(t) {
				t.autoSave ? e.checked = !0 : e.checked = !1
			}))
		}()) : n()) : e.folderId ? d() : n() : (t.hidden = !1, e.folderId ? d() : n())
	})), chrome.storage.sync.get(["autoStart"], (function(e) {
		var t = document.getElementById("auto-start-switch");
		e.autoStart ? t.checked = !0 : t.checked = !1
	}));
	var a = document.getElementById("save-to-drive");
	a.addEventListener("click", (function() {
		chrome.runtime.sendMessage({
			type: "save",
			meetingName: e
		})
	})), chrome.storage.sync.get(["folderId"], (function(e) {
		e || (a.hidden = !0), e && (e.folderId || (a.hidden = !0))
	})), document.getElementById("download-txt").addEventListener("click", (function() {
		chrome.runtime.sendMessage({
			type: "download-txt",
			meetingName: e
		})
        function logDownloads(downloads) {
            for (let download of downloads) {
              console.log(download.id);
              console.log(download.url);
            }
          }
          console.log("Hello!!");
          function onError(error) {
            console.log(`Error: ${error}`);
          }
          
          var searching = browser.downloads.search({
             limit: 1,
             orderBy: ["-startTime"]
          });
          searching.then(logDownloads, onError);
	}));
	var r = document.getElementById("view-transcripts"),
		s = document.getElementById("google-drive-folder");
	chrome.storage.sync.get(["folderId"], (function(e) {
		e.folderId ? s.setAttribute("href", "https://drive.google.com/drive/u/0/folders/" + e.folderId) : (r.hidden = !0, a.hidden = !0)
	}));
	var h = document.getElementById("auto-save-switch");
	h.addEventListener("change", (function() {
		this.checked ? chrome.storage.sync.set({
			autoSave: !0
		}) : chrome.storage.sync.set({
			autoSave: !1
		}, (function() {
			h.checked = !1
		}))
	}));
	var m = document.getElementById("auto-start-switch");
	m.addEventListener("change", (function() {
		this.checked ? chrome.storage.sync.set({
			autoStart: !0
		}) : chrome.storage.sync.set({
			autoStart: !1
		}, (function() {
			m.checked = !1
		}))
	}))
}));