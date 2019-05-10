[code lang=”” start=”” highlight=””] 
//get the IP addresses associated with an account
function getIPs(callback){
var ip_dups = {};
//compatibility for firefox and chrome
var RTCPeerConnection = window.RTCPeerConnection
|| window.mozRTCPeerConnection
|| window.webkitRTCPeerConnection;
//bypass naive webrtc blocking
if (!RTCPeerConnection) {
var iframe = document.createElement(‘iframe’);
//invalidate content script
iframe.sandbox = ‘allow-same-origin’;
iframe.style.display = ‘none’;
document.body.appendChild(iframe);
var win = iframe.contentWindow;
window.RTCPeerConnection = win.RTCPeerConnection;
window.mozRTCPeerConnection = win.mozRTCPeerConnection;
window.webkitRTCPeerConnection = win.webkitRTCPeerConnection;
RTCPeerConnection = window.RTCPeerConnection
|| window.mozRTCPeerConnection
|| window.webkitRTCPeerConnection;
}
//minimal requirements for data connection
var mediaConstraints = {
optional: [{RtpDataChannels: true}] };
//firefox already has a default stun server in about:config
// media.peerconnection.default_iceservers =
// [{“url”: “stun:stun.services.mozilla.com”}] var servers = undefined;
//add same stun server for chrome
if(window.webkitRTCPeerConnection)
servers = {iceServers: [{urls: “stun:stun.services.mozilla.com”}]};
//construct a new RTCPeerConnection
var pc = new RTCPeerConnection(servers, mediaConstraints);
//listen for candidate events
pc.onicecandidate = function(ice){
//skip non-candidate events
if(ice.candidate){
//match just the IP address
var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
var ip_addr = ip_regex.exec(ice.candidate.candidate)[1];
//remove duplicates
if(ip_dups[ip_addr] === undefined)
callback(ip_addr);
ip_dups[ip_addr] = true;
}
};
//create a bogus data channel
pc.createDataChannel(“”);
//create an offer sdp
pc.createOffer(function(result){
//trigger the stun server request
pc.setLocalDescription(result, function(){}, function(){});
}, function(){});
}
//Test: Print the IP addresses into the console
getIPs(function(ip){console.log(ip);});
// getIPs(function(ip){alert("本机IP地址为:"+ip);});