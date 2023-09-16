const USER_NAME = "amit_kr";
const sketchContainer = document.getElementById("sketches");
const searchInput = document.getElementById("search");
let projectsData;

removeChildFromSketchContainer();
setPage();

searchInput.addEventListener("input", (e) => {
  console.log("searching");
  let sortedProjectData = simpleFuzzySearch(e.target.value, projectsData);

  removeChildFromSketchContainer();
  if (e.target.value === "") {
    console.log("originial");
    addItemsToSketchContainer(projectsData);
  } else {
    addItemsToSketchContainer(sortedProjectData);
  }
  sketchContainer.scrollTop = 0;
});

async function setPage() {
  await fetchProjects();
  addItemsToSketchContainer(projectsData);
}

function removeChildFromSketchContainer() {
  while (sketchContainer.firstChild) {
    sketchContainer.removeChild(sketchContainer.firstChild);
  }
}

function addItemsToSketchContainer(projectsData) {
  projectsData.forEach((data) => {
    const sketchItem = document.createElement("li");
    sketchItem.classList.add("sketch-item");

    const sketchNameText = document.createElement("a");
    sketchNameText.classList.add("sketch-name");
    sketchNameText.target = "_blank";
    sketchNameText.href = `https://editor.p5js.org/${USER_NAME}/full/${data.id}`;
    sketchNameText.textContent = data.name;
    sketchItem.appendChild(sketchNameText);

    const createdDateText = document.createElement("span");
    createdDateText.classList.add("created-date");
    createdDateText.textContent = formatDate(data.createdAt);
    sketchItem.append(createdDateText);

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");

    const viewBtn = document.createElement("a");
    viewBtn.classList.add("view-btn");
    viewBtn.textContent = "Code";
    viewBtn.target = "_blank";
    viewBtn.href = `https://editor.p5js.org/${USER_NAME}/sketches/${data.id}`;
    btnContainer.appendChild(viewBtn);
    sketchItem.appendChild(btnContainer);

    sketchContainer.appendChild(sketchItem);
  });
}

async function fetchProjects() {
  const res = await fetch("./projects.json");
  projectsData = await res.json();
}

function simpleFuzzySearch(query, arr) {
  let sortedArray = [...arr];
  sortedArray.sort((first, second) => {
    let a = first.name;
    let b = second.name;

    let matchCountA = 0;
    let matchCountB = 0;

    // Loop through characters in the query for item A
    for (let i = 0; i < query.length; i++) {
      const char = query[i];
      if (a.includes(char)) {
        matchCountA++;
        a = a.replace(char, ""); // Remove the matched character
      }
    }

    // Loop through characters in the query for item B
    for (let i = 0; i < query.length; i++) {
      const char = query[i];
      if (b.includes(char)) {
        matchCountB++;
        b = b.replace(char, ""); // Remove the matched character
      }
    }

    // Calculate similarity scores as a percentage of matched characters
    const similarityA = (matchCountA / query.length) * 100;
    const similarityB = (matchCountB / query.length) * 100;

    // Sort items in descending order of similarity
    let res = matchCountB - matchCountA;
    console.log(res);
    return res;
  });
  return sortedArray;
}

function formatDate(inputDate) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
    hour12: true,
  };

  const date = new Date(inputDate);
  return date.toLocaleString("en-US", options);
}
