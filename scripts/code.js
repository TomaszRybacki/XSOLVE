// Global variables

const url = '../data.json';
const http = new XMLHttpRequest();
let pageNumber = 1;
const result = {};
let data;


// Auxiliary functions

// I have decided to remove hour from the date of birth.
// Because it's not important piece of data and makes it less readable.

function removeHour(data) {
  data.forEach((elem) => {
    const index = elem.dateOfBirth.indexOf(' ');
    elem.dateOfBirth = elem.dateOfBirth.slice(0, index);
  });
  return data;
}


// Data display


const tableBodyElem = document.getElementById('table-body');
const buttonsDivElem = document.getElementById('pages');

function pagination(data) {
  while (data.length > 0) {
    result[pageNumber] = data.slice(0, 5);
    data = data.slice(5);
    pageNumber += 1;
  }
  return result;
}

function paginationDisplay(data, currentPage) {
  if (Object.keys(data).length !== 0) {
    for (let i = 0; i < result[currentPage].length; i += 1) {
      const tr = document.createElement('tr');

      if (data[currentPage][i].id !== undefined) {
        tr.innerHTML = (
          `<td>${data[currentPage][i].id}</td>
          <td>${data[currentPage][i].firstName}</td>
          <td>${data[currentPage][i].lastName}</td>
          <td>${data[currentPage][i].dateOfBirth}</td>
          <td>${data[currentPage][i].company}</td>
          <td>${data[currentPage][i].note}</td>`
        );
      }
      tableBodyElem.appendChild(tr);
    }
  }
}

function createPagesButtons(num) {
  for (let i = 1; i < num; i += 1) {
    const button = document.createElement('button');
    button.setAttribute('class', 'button');
    button.innerHTML = (i);
    buttonsDivElem.appendChild(button);
  }
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('button')) {
    const switchTo = e.target.textContent;
    tableBodyElem.innerHTML = '';
    paginationDisplay(result, switchTo);
  }
}, false);


// Data sorting by type


function sortBy(property, inputData) {
  if (property === 'dateOfBirth') {
    inputData.sort((a, b) => {
      if (a[property].slice(-4) < b[property].slice(-4)) {
        return -1;
      } else if (a[property].slice(-4) > b[property].slice(-4)) {
        return 1;
      } else {
        return 0;
      }
    });
  } else {
    inputData.sort((a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  return inputData;
}


document.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    tableBodyElem.innerHTML = '';
    pageNumber = 1;
    switch (e.target.textContent) {
      case 'Id': {
        const sortedById = sortBy('id', data);
        const slicedData = pagination(sortedById);
        paginationDisplay(slicedData, 1);
        break;
      }
      case 'First Name': {
        const sortedByFirstName = sortBy('firstName', data);
        const slicedData = pagination(sortedByFirstName);
        paginationDisplay(slicedData, 1);
        break;
      }
      case 'Last Name': {
        const sortedByLastName = sortBy('lastName', data);
        const slicedData = pagination(sortedByLastName);
        paginationDisplay(slicedData, 1);
        break;
      }
      case 'Birthday': {
        const sortedByBirthday = sortBy('dateOfBirth', data);
        const slicedData = pagination(sortedByBirthday);
        paginationDisplay(slicedData, 1);
        break;
      }
      case 'Company': {
        const sortedByCompany = sortBy('company', data);
        const slicedData = pagination(sortedByCompany);
        paginationDisplay(slicedData, 1);
        break;
      }
      case 'Note': {
        const sortedByNote = sortBy('note', data);
        const slicedData = pagination(sortedByNote);
        paginationDisplay(slicedData, 1);
        break;
      }
      default:
        console.error("there's no such column");
    }
  }
}, false);


// Data filtering

const searchBoxElem = document.getElementById('search-box');
const searchTypeElem = document.getElementById('search-type');

function filterData(e) {
  let searchTerm = searchBoxElem.value;
  const filterBy = searchTypeElem.value;
  let filteredData;
  let slicedData;

  if (e.keyCode === 13 && searchTerm.length === 0) {
    resetData();
  }

  if (e.keyCode === 13 && searchTerm.length > 0) {
    if (filterBy === 'id' || filterBy === 'note') {
      searchTerm = Number(searchTerm);
      filteredData = data.filter(element => element[filterBy] === searchTerm);
    } else if (filterBy === 'dateOfBirth') {
      filteredData = data.filter(element => element[filterBy].includes(searchTerm));
    } else {
      searchTerm = searchTerm.toLowerCase().trim();
      filteredData = data.filter(element => element[filterBy].toLowerCase() === searchTerm);
    }

    pageNumber = 1;
    tableBodyElem.innerHTML = '';
    buttonsDivElem.innerHTML = '';

    if (filteredData.length === 0) {
      slicedData = {};
    } else {
      slicedData = pagination(filteredData);
    }

    paginationDisplay(slicedData, 1);
    createPagesButtons(pageNumber);
  }
}

function resetData() {
  pageNumber = 1;
  tableBodyElem.innerHTML = '';
  buttonsDivElem.innerHTML = '';
  loadData();
}

searchBoxElem.addEventListener('keyup', filterData, false);


// Get data from file


http.open('GET', url, true);
http.send();

function loadData() {
  if (http.readyState === 4 && http.status === 200) {
    data = JSON.parse(http.response);
    data = removeHour(data);
    const slicedData = pagination(data);
    paginationDisplay(slicedData, 1);
    createPagesButtons(pageNumber);
  }
}

http.onreadystatechange = loadData;
