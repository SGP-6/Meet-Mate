var e = {
    attributes: !1,
    childList: !0,
    characterData: !1,
    subtree: !0
},
t = {
    attributes: !1,
    childList: !0,
    characterData: !1,
    subtree: !1
},
n = {
    attributes: !1,
    childList: !0,
    characterData: !1,
    subtree: !0
};

function i(e, t) {
return e.nodeName === t
}
var r = document.documentElement || document.body,
o = null,
a = null,
d = "";
window.onload = function() {
chrome.runtime.sendMessage({
    type: "check-name",
    from: "onload"
}, (function(e) {})), chrome.runtime.sendMessage({
    type: "check-name",
    from: "first-load"
}, (function(e) {}))
}, window.onunload = function() {
chrome.runtime.sendMessage({
    type: "unload",
    action: "closed",
    meetingName: d
})
}, chrome.runtime.onMessage.addListener((function(e, t, n) {
return "setMeetingName" in e && e.setMeetingName && n({
    fromContentScript: "meetingName set",
    meetingName: d = e.meetingName
}), !0
}));
var c = new MutationObserver((function(e, t) {
    e.forEach((function(e) {
        if ("DIV" == e.target.nodeName && 1 == e.removedNodes.length) {
            let t = e.target.parentNode.parentNode.children.item(0).src,
                n = e.target.parentNode.parentNode.children.item(1).innerText,
                i = n.concat(t),
                r = e.removedNodes.item(0).firstChild.innerText,
                o = !1;
            null !== e.previousSibling && (o = !0), chrome.runtime.sendMessage({
                type: "update",
                blockIndex: i,
                name: n,
                img: t,
                caption: r,
                isPrevious: o,
                meetingName: d
            })
        }
    }))
})),
m = new MutationObserver((function(e, t) {
    e.forEach((function(e) {
        if (1 == e.removedNodes.length) {
            let t = e.removedNodes.item(0).children.item(1).innerText,
                n = e.removedNodes.item(0).children.item(0).attributes.src.value,
                i = t.concat(n);
            chrome.runtime.sendMessage({
                type: "final-block-set",
                blockIndex: i,
                name: t,
                meetingName: d
            })
        } else if (1 == e.addedNodes.length) {
            c.observe(e.addedNodes.item(0), n);
            let t = e.addedNodes.item(0).children.item(1).innerText,
                i = e.addedNodes.item(0).children.item(0).attributes.src.value,
                r = t.concat(i);
            chrome.runtime.sendMessage({
                type: "initial-block-set",
                blockIndex: r,
                name: t,
                img: i,
                meetingName: d
            })
        }
    }))
}));
new MutationObserver((function(e, r) {
e.forEach((function(e) {
    if (e.target.parentNode && null !== (a = e.target.parentNode.parentNode) && (s = a.children.item(0), u = a.children.item(1), l = a.children.item(2), i(s, "IMG") && i(u, "DIV") && i(l, "DIV"))) {
        let i = a.children.item(1).innerText,
            s = a.children.item(0).src,
            u = i.concat(s);
        chrome.runtime.sendMessage({
            type: "initial-block-set",
            blockIndex: u,
            name: i,
            img: s,
            meetingName: d
        }), c.observe(a, n), o = e.target.parentNode.parentNode.parentNode, m.observe(o, t), r.disconnect()
    }
    var s, u, l
}))
})).observe(r, e), new MutationObserver((function(e, t) {
e.forEach((function(e) {
    if (e.addedNodes.length > 0) {
        var t = e.addedNodes.item(0);
        i(t, "#text") ? "you left the meeting" == t.data.toLowerCase() && chrome.runtime.sendMessage({
            type: "unload",
            action: "hangup",
            meetingName: d
        }) : i(t, "SPAN") && chrome.storage.sync.get(["autoStart"], (function(e) {
            t.innerText.toLowerCase().includes("closed_caption_off") && chrome.runtime.sendMessage({
                type: "check-name",
                from: "get-auto-start"
            }, (function(e) {
                e.autoStart && t.parentElement && t.parentElement.click()
            }))
        }))
    }
}))
})).observe(r, e), chrome.runtime.onMessage.addListener((function(e, t, n) {
return "getMeetingName" in e && e.getMeetingName && n(d), !0
}));