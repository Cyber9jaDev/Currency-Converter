const checkStatusAndParse = (response) => {
  if(!response.ok) throw new Error(`${response.status}`); 
  return response.json();
};

const printPlanets = (data) => {
  console.log("Loaded 10 more planets...");
  const planets = data.results;
  for(let planet of planets){
    console.log(planet.name);
  }
  return Promise.resolve(data.next);  // 
};

const fetchMorePlanets = (url) => {
  console.log(url);
  return fetch(url);
};

fetch("https://swapi.dev/api/planets/")
  .then(checkStatusAndParse)     // Get a response and check if the response is okay
  .then(printPlanets)           // Print planet from data collected 
  .then(fetchMorePlanets)       // Get more planets from Promise.resolve(data) passed
  .then(checkStatusAndParse)
  .then(printPlanets)
  .then(fetchMorePlanets)
  .then(checkStatusAndParse)
  .then(printPlanets)  
  .then(fetchMorePlanets)
  .then(checkStatusAndParse)
  .then(printPlanets)
  .then(fetchMorePlanets)
  .then(checkStatusAndParse)
  .then(printPlanets)
  .then(fetchMorePlanets)
  .then(checkStatusAndParse)
  .then(printPlanets)
  
  .catch((err) => {
    console.log("SOMETHING WENT WRONG WITH FETCH");
    console.log(err);
});



// fetch("https://swapi.dev/api/planets/")
//   .then((response) => {  // Returns a promise
//     console.log(response);
//     if (!response.ok) {
//       throw new Error(`${response.status}`);
//     }
//     return response.json(); 
//   })
//   .then((data) => {    // Returns a promise
//     const filmURL = data.results[0].films[0];
//     fetch(filmURL)
//     .then((response) => {
//       console.log(response);
//       if (!response.ok){
//         throw new Error(`${response.status}`);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//     });
//   })
//   .catch((err) => {
//     console.log("SOMETHING WENT WRONG WITH FETCH");
//     console.log(err);
// });
 

// console.log(planets);






 
    














// const firstRequest = new XMLHttpRequest();

// firstRequest.addEventListener("load", function (){
// 	console.log("FIRST REQUEST WORKED!!!");
// 	const data = JSON.parse(this.responseText);
// 	const filmURL = data.results[0].films[0];

// 	const filmRequest = new XMLHttpRequest();

// 	// Second XMLHttpRequest
// 	filmRequest.addEventListener("load", function(){
// 		console.log("SECOND REQUEST WORKED!!!");
// 		console.log(this);
// 	});

// 	filmRequest.addEventListener('error', function(){
// 		console.log("ERROR 2!");
// 	});
	
// 	filmRequest.open('GET', filmURL);
// 	filmRequest.send();

// });

// firstRequest.addEventListener("error", (e) => {
// 	console.log("ERROR!!!");
// });
// firstRequest.open('GET', "https://swapi.dev/api/planets/");
// firstRequest.send();

