// Global variables

// const url = '../data.json';
const url = 'https://raw.githubusercontent.com/TomaszRybacki/XSOLVE/master/data.json';
const http = new XMLHttpRequest();
const result = {};

let pageNumber = 1;
let data;

const tableBodyElem = document.getElementById('table-body');
const buttonsDivElem = document.getElementById('pages');
const searchBoxElem = document.getElementById('search-box');
const searchTypeElem = document.getElementById('search-type');


// Auxiliary functions

// I have decided to remove hour from the date of birth.
// Because it's not important piece of data and makes it less readable.

function removeHour(inputData) {
  inputData.forEach((elem) => {
    const index = elem.dateOfBirth.indexOf(' ');
    elem.dateOfBirth = elem.dateOfBirth.slice(0, index);
  });
  return inputData;
}

function resetData() {
  pageNumber = 1;
  tableBodyElem.innerHTML = '';
  buttonsDivElem.innerHTML = '';
}


// Data display


function pagination(inputData) {
  while (inputData.length > 0) {
    result[pageNumber] = inputData.slice(0, 5);
    inputData = inputData.slice(5);
    pageNumber += 1;
  }
  return result;
}

function paginationDisplay(inputData, currentPage) {
  if (Object.keys(inputData).length !== 0) {
    for (let i = 0; i < result[currentPage].length; i += 1) {
      const tr = document.createElement('tr');

      tr.innerHTML = (
        `<td>${inputData[currentPage][i].id}</td>
        <td>${inputData[currentPage][i].firstName}</td>
        <td>${inputData[currentPage][i].lastName}</td>
        <td>${inputData[currentPage][i].dateOfBirth}</td>
        <td>${inputData[currentPage][i].company}</td>
        <td>${inputData[currentPage][i].note}</td>`
      );
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


// Data sorting by type


function sortBy(property, inputData) {
  inputData.sort((a, b) => {
    if (a[property] < b[property]) {
      return -1;
    } else if (a[property] > b[property]) {
      return 1;
    }
    return 0;
  });
  return inputData;
}

function sortByYear(inputData) {
  inputData.sort((a, b) => {
    if (a.dateOfBirth.slice(-4) < b.dateOfBirth.slice(-4)) {
      return -1;
    } else if (a.dateOfBirth.slice(-4) > b.dateOfBirth.slice(-4)) {
      return 1;
    }
    return 0;
  });
  return inputData;
}

function sorting(e) {
  if (e.target.tagName === 'TH') {
    resetData();

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
        const sortedByBirthday = sortByYear(data);
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
        // won't execute never, because all possible options are listed in switch cases
    }
    createPagesButtons(pageNumber);
  }
}


// Data filtering


function filterData(e) {
  let searchTerm = searchBoxElem.value;
  const filterBy = searchTypeElem.value;
  let slicedData;

  if (e.keyCode === 13 && searchTerm.length === 0) {
    resetData();
    loadData();
  }

  if (e.keyCode === 13 && searchTerm.length > 0) {
    if (filterBy === 'id' || filterBy === 'note') {
      searchTerm = Number(searchTerm);
      data = data.filter(element => element[filterBy] === searchTerm);
    } else if (filterBy === 'dateOfBirth') {
      data = data.filter(element => element[filterBy].includes(searchTerm));
    } else {
      searchTerm = searchTerm.toLowerCase().trim();
      data = data.filter(element => element[filterBy].toLowerCase() === searchTerm);
    }

    resetData();

    if (data.length === 0) {
      slicedData = {};
    } else {
      slicedData = pagination(data);
    }

    paginationDisplay(slicedData, 1);
    createPagesButtons(pageNumber);
  }
}


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


// Events


http.onreadystatechange = loadData;

searchBoxElem.addEventListener('keyup', filterData, false);

document.addEventListener('click', sorting, false);

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('button')) {
    const switchTo = e.target.textContent;
    tableBodyElem.innerHTML = '';
    paginationDisplay(result, switchTo);
  }
}, false);
