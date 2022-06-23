"use strict";
import * as cookie from "./cookie.js";

window.onload = () => {
  init();
  getAllUploads();
};

function init() {
  if (!cookie.getCookie("name")) {
    window.location = "../index.html";
  }
  // DOM ELEMENTS
  const welcome = document.querySelector("#welcome");
  const user = cookie.getCookie("name");
  welcome.textContent = user;
}

function getAllUploads() {
  const user = cookie.getCookie("name");
  const fetchUrl = `http://localhost:1337/uploads/${user}`;
  fetch(fetchUrl, { method: "GET" })
    .then((res) => res.json())
    .then((data) => {
      displayUploads(data);
    });
}

function displayUploads(uploads) {
  const div = document.querySelector("#uploads-container");
  uploads.forEach((upload, index) => {
    // PREP DATA
    // FILENAME
    let fileName = upload.uploadPath;
    fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
    let userName = upload.author;

    // UPLOAD DATE
    let uploadDate = new Date(upload.uploadDate).toLocaleString();
    // EXPIRATION DATE
    let expirationDate = new Date(upload.expirationDate).toLocaleString();
    // DOWNLOAD LINK
    const link = `http://127.0.0.1:5500/file.html?userName=${userName}&fileName=${fileName}`;

    div.innerHTML += `<div id="upload">
            <h2 id="name">Name: ${fileName}</h2>
            <div id="dates">
            <p id="uploadDate">Uploaded: ${uploadDate}</p>
            <p id="expirationDate">Expires: ${expirationDate}</p>
            </div>
            <div id="buttons">
            <button id="share" class="share" data-link="${link}">Share</button>
            <a href="http://localhost:1337/download?file=${fileName}" id="download">Download</a>
            </div>
            </div>`;
  });
  const buttons_share = document.querySelectorAll(".share");
  buttons_share.forEach((button) =>
    button.addEventListener("click", () => {
      http: navigator.clipboard.writeText(`${button.dataset.link}`);
      //http:localhost:1337/download?file=${button.dataset.filename}
      button.textContent = "Copied to clipboard";
      setTimeout(() => {
        button.textContent = "Share";
      }, 2000);
    })
  );
}