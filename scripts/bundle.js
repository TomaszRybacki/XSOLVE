!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";var r=new XMLHttpRequest,o=void 0,a=[],d=1,i=document.getElementById("table-body"),u=document.getElementById("pages"),c=document.getElementById("search-box"),s=document.getElementById("search-type"),l={getBirthday:function(t){var e=t.indexOf(" ");return t.slice(0,e)}};function f(){d=1,i.innerHTML="",u.innerHTML=""}function m(t){for(var e=t;e.length>0;)a[d]=e.slice(0,5),e=e.slice(5),d+=1;return a}function p(t,e){if(0!==Object.keys(t).length)for(var n=0;n<a[e].length;n+=1){var r=document.createElement("tr");r.innerHTML="<td>"+t[e][n].id+"</td>\n        <td>"+t[e][n].firstName+"</td>\n        <td>"+t[e][n].lastName+"</td>\n        <td>"+l.getBirthday(t[e][n].dateOfBirth)+"</td>\n        <td>"+t[e][n].company+"</td>\n        <td>"+t[e][n].note+"</td>",i.appendChild(r)}}function y(t){for(var e=1;e<t;e+=1){var n=document.createElement("button");n.setAttribute("class","button"),n.innerHTML=e,u.appendChild(n)}}function v(){4===r.readyState?(o=JSON.parse(r.response),p(a=m(o),1),y(d)):o=4===r.readyState&&404===r.status?"Data Not Found":4===r.readyState&&500===r.status?"Internal Server Error":"Some error occured. Cannot load the data."}r.open("GET","https://raw.githubusercontent.com/TomaszRybacki/XSOLVE/master/data.json",!0),r.send(),r.onreadystatechange=v,document.addEventListener("click",function(t){if(t.target.classList.contains("button")){var e=t.target.textContent;i.innerHTML="",p(a,e)}},!1),c.addEventListener("keyup",function(t){var e=c.value,n=s.value,r=void 0;13===t.keyCode&&0===e.length&&(f(),v()),13===t.keyCode&&e.length>0&&("id"===n||"note"===n?(e=Number(e),r=o.filter(function(t){return t[n]===e})):"dateOfBirth"===n?r=o.filter(function(t){return t[n].includes(e)}):(e=e.toLowerCase().trim(),r=o.filter(function(t){return t[n].toLowerCase().includes(e)})),f(),p(0===r.length?{}:m(r),1),y(d))},!1)}]);