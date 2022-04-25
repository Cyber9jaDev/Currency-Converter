let convertFromField = document.querySelector("#from-currency");
let convertToField = document.querySelector("#to-currency");
const amount = document.getElementById("amount");
const output = document.getElementById("output");
const result = document.getElementById("result");


class Converter {
  constructor(){
    window.addEventListener("DOMContentLoaded", Converter.currencies);
    // this.hh();
  }

  static getKeys(keys, select){
    keys.sort();
    keys.forEach(key => {
      const option = document.createElement("option");
      option.setAttribute("value", key);
      option.setAttribute("text", key);
      option.textContent = key;
      select.add(option);
    });
  }
  
  static loadCurrencies(data){
    const keys = Object.keys(data);
    Converter.getKeys(keys, convertFromField);
    Converter.getKeys(keys, convertToField);
  }
  
  static checkResponseAndParse(response){
    if(!response.ok) throw new Error(response.status);
    return response.json();
  }
  
  static currencies(){
    fetch("https://api.vatcomply.com/currencies")
      .then(Converter.checkResponseAndParse)
      .then((data) => {
        Converter.loadCurrencies(data);
        convertFromField.addEventListener("input", Converter.calculate);
        convertToField.addEventListener("input", Converter.calculate);
      })
      .catch((err) => {
        return err;
      });
  }
  
  hh(){
    fetch(`https://api.vatcomply.com/rates?base=USD`)
    .then(Converter.checkResponseAndParse)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        return err;
      });
  }
  static calculate(){
    let fromSelectValue = convertFromField.options[convertFromField.selectedIndex].value;
    let toSelectValue = convertToField.options[convertToField.selectedIndex].value;
    
    fetch(`https://api.vatcomply.com/rates?base=${fromSelectValue}`)
      .then(Converter.checkResponseAndParse)
      .then(({rates}) => {
        console.log(rates);
      })
      
      .catch((err) => {
        return err;
      });

  }
  
  
  updateOutput(e){
    output.innerText = e.target.value;
    result.innerText = e.target.value;
  }
  
}


new Converter();