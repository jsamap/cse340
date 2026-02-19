"use strict";

let classificationList = document.querySelector("#classification_id");

// Get a list of items in inventory based on the classification_id
function updateClassificationList() {
  let classification_id = classificationList.value;
  console.log(`classification_id is: ${classification_id}`);
  let classIdURL = "/inv/getInventory/" + classification_id;
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data);
      buildInventoryList(data);
    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
}

classificationList.addEventListener("change", function () {
  updateClassificationList();
});

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay");
  // Set up the table labels
  let dataTable = "<thead>";
  dataTable +=
    '<tr><th class="col-vehicle">Vehicles</th><td class="col-options">&nbsp;</td><td class="col-options">&nbsp;</td></tr>';
  dataTable += "</thead>";
  // Set up the table body
  dataTable += "<tbody>";
  // Iterate over all vehicles in the array and put each in a row
  data.forEach(function (element) {
    console.log(element.inv_id + ", " + element.inv_model);
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
    dataTable += `<td class="col-options"><a href='/inv/edit/${element.inv_id}' class="options-button" title='Click to update'>Modify</a></td>`;
    dataTable += `<td class="col-options"><a href='/inv/delete/${element.inv_id}' class="options-button delete" title='Click to delete'>Delete</a></td></tr>`;
  });
  dataTable += "</tbody>";
  // Display the contents in the Inventory Management view
  inventoryDisplay.innerHTML = dataTable;
}



// Build classification items into HTML table component and inject into DOM
function buildClassificationsTable(data) {
  console.log(data);
  let inventoryDisplay = document.getElementById("classificationDisplay");
  // Set up the table labels
  let dataTable = '<thead>';
  dataTable += '<tr><th class="col-vehicle">Classifications</th><td class="col-options">&nbsp;</td></tr>';
  dataTable += '</thead>';
  // Set up the table body
  dataTable += '<tbody>';
  // Iterate over all classifications in the array and put each in a row
  data.forEach(function (element) {
    dataTable += `<tr><td>${element.classification_name}</td>`;
    dataTable += `<td class="col-options"><a href='/inv/update-classification/${element.classification_id}' class="options-button" title='Click to update'>Modify</a></td></tr>`;
  })
  dataTable += '</tbody>';
  // Display the contents in the Inventory Management view
  inventoryDisplay.innerHTML = dataTable;
}

function initClassifications() {

  let classIdURL = "/inv/getClassifications/";
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data);
      buildClassificationsTable(data);

    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
}


initClassifications()
