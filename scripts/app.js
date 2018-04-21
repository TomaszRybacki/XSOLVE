// Global variables


const dataUrl = 'https://raw.githubusercontent.com/TomaszRybacki/XSOLVE/master/scripts/data/data.json';
const http = new XMLHttpRequest();
let data;
let cuttedData = [];
let numberOfPages = 1;


// DOM elements


const tableBodyElem = document.getElementById('table-body');
const buttonsDivElem = document.getElementById('pages');
const searchBoxElem = document.getElementById('search-box');
const searchTypeElem = document.getElementById('search-type');


// Data presentation


// I have decided to remove hour from the date of birth.
// Because it's not important piece of data and makes it less readable.

const DateofBirthday = {
  getBirthday(date) {
    const index = date.indexOf(' ');
    return date.slice(0, index);
  }
};

function resetData() {
  numberOfPages = 1;
  tableBodyElem.innerHTML = '';
  buttonsDivElem.innerHTML = '';
}

function pagination(inputData) {
  let modifiedInputData = inputData;
  while (modifiedInputData.length > 0) {
    cuttedData[numberOfPages] = modifiedInputData.slice(0, 5);
    modifiedInputData = modifiedInputData.slice(5);
    numberOfPages += 1;
  }
  return cuttedData;
}

function dataDisplay(inputData, currentPage) {
  if (Object.keys(inputData).length !== 0) {
    for (let i = 0; i < cuttedData[currentPage].length; i += 1) {
      const tr = document.createElement('tr');

      tr.innerHTML = (
        `<td>${inputData[currentPage][i].id}</td>
        <td>${inputData[currentPage][i].firstName}</td>
        <td>${inputData[currentPage][i].lastName}</td>
        <td>${DateofBirthday.getBirthday(inputData[currentPage][i].dateOfBirth)}</td>
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

function showSelectedPage(e) {
  if (e.target.classList.contains('button')) {
    const switchTo = e.target.textContent;
    tableBodyElem.innerHTML = '';
    dataDisplay(cuttedData, switchTo);
  }
}


// Fetch data


function loadData() {
  if (http.readyState === 4 && http.status === 200) {
    data = JSON.parse(http.response);
    cuttedData = pagination(data);
    dataDisplay(cuttedData, 1);
    createPagesButtons(numberOfPages);
  } else if (http.readyState === 4 && http.status === 404) {
    buttonsDivElem.innerHTML = '&#9888; 404 Data Not Found.';
    buttonsDivElem.classList.add('data__warning');
  } else if (http.readyState === 4 && http.status === 500) {
    buttonsDivElem.innerHTML = '&#9888; 500 Internal Server Error.';
    buttonsDivElem.classList.add('data__warning');
  } else if (http.readyState === 4) {
    buttonsDivElem.innerHTML = '&#9888; Wczytywanie danych, nie powiodło się.';
    buttonsDivElem.classList.add('data__warning');
  }
}

http.open('GET', dataUrl, true);
http.send();


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
    const indexA = a.dateOfBirth.indexOf(' ');
    const compareYearA = a.dateOfBirth.slice(0, indexA);

    const indexB = b.dateOfBirth.indexOf(' ');
    const compareYearB = b.dateOfBirth.slice(0, indexB);

    if (compareYearA.slice(-4) < compareYearB.slice(-4)) {
      return -1;
    } else if (compareYearA.slice(-4) > compareYearB.slice(-4)) {
      return 1;
    }
    return 0;
  });
  return inputData;
}

function sorting(e) {
  resetData();

  switch (e.target.textContent) {
    case 'Id': {
      const sortedById = sortBy('id', data);
      const slicedData = pagination(sortedById);
      dataDisplay(slicedData, 1);
      break;
    }
    case 'First Name': {
      const sortedByFirstName = sortBy('firstName', data);
      const slicedData = pagination(sortedByFirstName);
      dataDisplay(slicedData, 1);
      break;
    }
    case 'Last Name': {
      const sortedByLastName = sortBy('lastName', data);
      const slicedData = pagination(sortedByLastName);
      dataDisplay(slicedData, 1);
      break;
    }
    case 'Birthday': {
      const sortedByBirthday = sortByYear(data);
      const slicedData = pagination(sortedByBirthday);
      dataDisplay(slicedData, 1);
      break;
    }
    case 'Company': {
      const sortedByCompany = sortBy('company', data);
      const slicedData = pagination(sortedByCompany);
      dataDisplay(slicedData, 1);
      break;
    }
    case 'Note': {
      const sortedByNote = sortBy('note', data);
      const slicedData = pagination(sortedByNote);
      dataDisplay(slicedData, 1);
      break;
    }
    default:
      // won't execute never, because all possible options are listed in switch cases
  }
  createPagesButtons(numberOfPages);
}


// Data filtering


function filterData(e) {
  let searchTerm = searchBoxElem.value;
  const filterBy = searchTypeElem.value;
  let slicedData;
  let filteredData;

  if (e.keyCode === 13 && searchTerm.length === 0) {
    resetData();
    loadData();
  }

  if (e.keyCode === 13 && searchTerm.length > 0) {
    if (filterBy === 'id' || filterBy === 'note') {
      searchTerm = Number(searchTerm);
      filteredData = data.filter(element => element[filterBy] === searchTerm);
    } else if (filterBy === 'dateOfBirth') {
      filteredData = data.filter(element => element[filterBy].includes(searchTerm));
    } else {
      searchTerm = searchTerm.toLowerCase().trim();
      filteredData = data.filter(element => element[filterBy].toLowerCase().includes(searchTerm));
    }

    resetData();

    if (filteredData.length === 0) {
      slicedData = {};
    } else {
      slicedData = pagination(filteredData);
    }

    dataDisplay(slicedData, 1);
    createPagesButtons(numberOfPages);
  }
}


// Events


http.onreadystatechange = loadData;
document.addEventListener('click', showSelectedPage, false);
searchBoxElem.addEventListener('keyup', filterData, false);
