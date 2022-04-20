"use strict";
chrome.runtime.onInstalled.addListener((function (e, t, n) {
	chrome.storage.sync.set({
		autoStart: !0,
		autoSave: !1
	}), chrome.tabs.create({
		url: "https://captionsaver.com/#welcome"
	})
})), chrome.alarms.onAlarm.addListener((function (e) {
	"" != t && chrome.storage.sync.get(["key", "p", "autoSave"], (function (t) {
		t.p && t.autoSave && t.autoSave && r(e.name)
	}))
}));
var e = {},
	t = "",
	n = !1;

function o(e = !1, o = !1) {
	t = "", n = e, o && chrome.storage.sync.set({
		currentFileId: null
	})
}

function a(t, n = !1) {
	t in e && (e[t].finalTranscript = [], e[t].toAdd = {}, n && delete e[t])
}

function i(t, i, r, d, c, s, l = !1, p = !1) {
	var m = {
		name: c + ".docx",
		mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		parents: [i]
	},
		u = document.createElement("caption-container");
	if ("" != c && e[c]) {
		for (var f = 0; f < e[c].finalTranscript.length; f++) {
			var h = document.createElement("div"),
				g = document.createElement("div");
			g.setAttribute("class", "speaker");
			var v = e[c].finalTranscript[f].name.bold();
			s && (v = v + " on " + e[c].finalTranscript[f].timestamp), g.innerHTML = v;
			var b = document.createElement("div");
			b.setAttribute("class", "caption"), b.innerText = e[c].finalTranscript[f].caption, s && e[c].finalTranscript[f].highlighted && (b.style.backgroundColor = "#d4d1fc"), h.appendChild(g), h.appendChild(b);
			var y = document.createElement("br");
			if (h.appendChild(y), 0 == f && !s) {
				var k = document.createElement("h4");
				k.innerHTML = 'Full Caption Transcript by <a href="https://captionsaver.com?utm_source=doc">CaptionSaver</a>. <br> Go Pro to remove these ads and get access to features like <b>auto-saving, highlighting, and timestamps!</b> <a href="https://gumroad.com/l/captionsaver?utm_source=doc">Click here to learn more</a><br>', u.appendChild(k)
			}
			u.appendChild(h)
		}
		var A = '        <html>        <head>          <title>Caption</title>        </head>        <body style="tab-interval:.5in">          <div>' + u.innerHTML + "</div>        </body>      </html>",
			T = new Blob(["\ufeff", A], {
				type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			}),
			I = new FormData;
		I.append("metadata", new Blob([JSON.stringify(m)], {
			type: "application/json"
		})), I.append("file", T);
		var x = new XMLHttpRequest;
		x.open("POST", "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"), x.setRequestHeader("Authorization", "Bearer " + t), x.responseType = "json", x.onload = () => {
			x.response.id;
			chrome.storage.sync.set({
				currentFileId: x.response.id
			}, (function () {
				if (d) {
					var i = new XMLHttpRequest;
					i.open("DELETE", "https://www.googleapis.com/drive/v2/files/" + String(r)), i.setRequestHeader("Authorization", "Bearer " + t), i.responseType = "json", i.send()
				}
				l && (o(n, !0), a(c), delete e[c]), p && o(n, !0)
			}))
		}, x.send(I)
	}
}

function r(e, n = !1, o = !1) {
	chrome.identity.getAuthToken({
		interactive: !0
	}, (function (a) {
		"" != t && chrome.storage.sync.get(["currentFileId", "folderId", "key", "p"], (function (t) {
			var r = t.currentFileId,
				d = t.folderId,
				c = !1;
			t.key && t.p && (c = !0), i(a, d, r, !!r, e, c, n, o)
		}))
	}))
}
chrome.runtime.onMessage.addListener((function (i, d, c) {
	var s = "";

	"meetingName" in i && (s = i.meetingName);
	var l, p, m, u, f = new Date,
		h = "";
	p = (l = f).getHours(), m = l.getMinutes(), u = p >= 12 ? "pm" : "am", h = (p = (p %= 12) || 12) + ":" + (m = m < 10 ? "0" + m : m) + " " + u;
	if ("check-name" == i.type) "onload" == i.from ? chrome.storage.sync.get(["key", "p", "folderId"], (function (e) {
		e.p && e.folderId && chrome.storage.sync.set({
			autoSave: !0
		})
	})) : "first-load" == i.from ? chrome.tabs.get(d.tab.id, (function (o) {
		var a = o.url,
			i = o.title;
		if (a.includes("https://meet.google.com/") && function (e) {
			var t = /^[A-Za-z]+$/,
				n = e.split("/").pop(),
				o = n.indexOf("?");
			o > -1 && (n = n.substring(0, o));
			for (var a = n.split("-"), i = 0; i < a.length; i++)
				if (!t.test(a[i])) return !1;
			return !0
		}(a)) {
			var r = (new Date).toLocaleString();
			(i.includes("~new") || i.includes("new")) && (i = i + " - " + a.split("/").pop()), t = i + " - [" + r + "]", n = !1;
			new Date;
			e[t] = {}, e[t].finalTranscript = [], e[t].toAdd = {}, e[t].hangup = !1, chrome.tabs.sendMessage(d.tab.id, {
				meetingName: t,
				setMeetingName: !0
			}, (function (e) { })), chrome.storage.sync.get(["key", "autoStart", "p"], (function (e) {
				e.p && chrome.alarms.create(t, {
					periodInMinutes: 1
				})
			}))
		}
	})) : chrome.storage.sync.get(["autoStart"], (function (e) {
		e.autoStart && c({
			autoStart: !0
		})
	}));
	else if ("initial-block-set" == i.type) {
		if (s || (s = t), "toAdd" in e[s] && !(i.blockIndex in e[s].toAdd)) {
			let t = {
				img: i.img,
				name: i.name,
				a: [],
				b: [],
				timestamp: h
			};
			e[s].toAdd[i.blockIndex] = t
		}
	} else if ("update" == i.type) {
		if ("" !== s && e[s] && "toAdd" in e[s])
			if (i.blockIndex in e[s].toAdd || (e[s].toAdd[i.blockIndex] = {
				img: i.img,
				name: i.name,
				a: [],
				b: [],
				timestamp: h
			}), i.isPrevious) {
				var g = e[s].toAdd[i.blockIndex].b;
				b = [i.caption];
				e[s].toAdd[i.blockIndex].b = g.concat(b)
			} else {
				var v = e[s].toAdd[i.blockIndex].a,
					b = [i.caption];
				e[s].toAdd[i.blockIndex].a = v.concat(b)
			}
	} else if ("final-block-set" == i.type) {
		if ("" != s && e[s]) {
			let t = "";
			if ("toAdd" in e[s]) {
				for (var y = 0; y < e[s].toAdd[i.blockIndex].a.length; y++) 0 == y ? t += e[s].toAdd[i.blockIndex].a[y] : t = t + " " + e[s].toAdd[i.blockIndex].a[y] + " ";
				for (y = e[s].toAdd[i.blockIndex].b.length - 1; y >= 0; y--) t = 0 == y ? t + " " + e[s].toAdd[i.blockIndex].b[y] : t + " " + e[s].toAdd[i.blockIndex].b[y] + " ";
				t.length > 0 && e[s].finalTranscript.push({
					name: e[s].toAdd[i.blockIndex].name,
					img: e[s].toAdd[i.blockIndex].img,
					caption: t,
					timestamp: h,
					highlighted: !1
				}), e[s].toAdd[i.blockIndex].a = [], e[s].toAdd[i.blockIndex].b = []
			}
		}
	} else "save" == i.type ? r(s) : "unload" == i.type ? (chrome.alarms.clear(s), chrome.storage.sync.get(["key", "p"], (function (e) {
		e.p ? "hangup" == i.action ? (n = !0, r(s, !1, !0), o(n, !0)) : "closed" == i.action && (n ? a(s, !0) : r(s, !0, !0), o(!1, !0)) : "hangup" == i.action ? o(n = !0, !0) : "closed" == i.action && (a(s, !0), o(!1, !0))
	}))) : "download-txt" == i.type && function (t) {
		var n = document.createElement("a"),
			o = "";
		if (t in e) {
			// alert("hello again");
			for (var a = 0; a < e[t].finalTranscript.length; a++) o += e[t].finalTranscript[a].name + "\n", o += e[t].finalTranscript[a].caption.trim() + "\n\n";

			const http = new XMLHttpRequest()
			http.open("GET", "https://api.meaningcloud.com/summarization-1.0?key=50e88cb8b9e7b67ec3254dadc04d1756&txt=" + o + "&sentences=5")
			http.send()

			http.onload = () => alert(http.responseText);
			// let result = o.concat("summary:- ");
			// alert(tz);
			n.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(o)), n.setAttribute("download", t + ".txt"), n.style.display = "none", document.body.appendChild(n), n.click(), document.body.removeChild(n)
			// n.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(o)), n.setAttribute("download", t + ".txt"), n.style.display = "none", document.body.appendChild(n), n.click(), document.body.removeChild(n)
			// console.log("hello");


			// const myJSON = JSON.stringify(http.responseText);

		}
	}(s);
	return !0
})), chrome.runtime.onMessage.addListener((function (t, n, o) {
	if ("getTranscript" == t.method) e[t.meetingName] && chrome.storage.sync.get(["key", "p"], (function (n) {
		var a = !1;
		n.p && (a = n.p);
		var i = {
			transcript: e[t.meetingName].finalTranscript,
			p: a
		};
		o(i)
	}));
	else if ("setHighlight" == t.method) {
		if (e[t.meetingName]) {
			let n = e[t.meetingName].finalTranscript[t.index].highlighted;
			e[t.meetingName].finalTranscript[t.index].highlighted = !n;
			let a = e[t.meetingName].finalTranscript[t.index].highlighted;
			o({
				highlighted: a
			})
		}
	} else "connectDrive" == t.method && chrome.identity.getAuthToken({
		interactive: !0
	}, (function (e) {
		if (e) {
			var t = new FormData;
			t.append("metadata", new Blob([JSON.stringify({
				title: "CaptionSaver",
				mimeType: "application/vnd.google-apps.folder"
			})], {
				type: "application/json"
			}));
			var n = new XMLHttpRequest;
			n.open("POST", "https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart"), n.setRequestHeader("Authorization", "Bearer " + e), n.responseType = "json", chrome.storage.sync.get(["folderId"], (function (e) {
				e.folderId || (n.onload = () => {
					var e = n.response.id;
					chrome.storage.sync.set({
						folderId: e
					}, (function () { }))
				}, n.send(t)), chrome.storage.sync.set({
					auth: !0
				}, (function () { }))
			})), chrome.tabs.create({
				url: chrome.extension.getURL("success.html")
			})
		}
	}));
	return !0
}));