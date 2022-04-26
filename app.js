let convertFromField = document.querySelector("#from-currency");
let convertToField = document.querySelector("#to-currency");
let amount = document.getElementById("amount");
let output = document.getElementById("output");
let result = document.getElementById("result");
const showOutputCurrency = document.querySelector(".output-cur");
const showResultCurrency = document.querySelector(".cur-result");


class Converter {
  constructor(){
    window.addEventListener("DOMContentLoaded", Converter.currencies);
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
        amount.addEventListener("input", Converter.calculate);
      })
      .catch((err) => {
        return err;
      });
  }
  
  static rateConverter(rates, fromSelectValue){
    let toSelectValue = convertToField.options[convertToField.selectedIndex].value;
    const amountValue = 0 || amount.value;
    if(toSelectValue === "RUB") return;
    const rateMultiplier = rates[toSelectValue];
    const total = rateMultiplier * amountValue;
    result.innerText = total;
    output.textContent = amount.value;
    showOutputCurrency.innerText = fromSelectValue;
    showResultCurrency.innerText = toSelectValue;
  }

  static calculate(){
    let fromSelectValue = convertFromField.options[convertFromField.selectedIndex].text;
    fetch(`https://api.vatcomply.com/rates?base=${fromSelectValue}`)
      .then(Converter.checkResponseAndParse)
      .then(({rates}) => {
        Converter.rateConverter(rates, fromSelectValue);
      })
      .catch((err) => {
        return err;
      });
  }
    
}


new Converter();