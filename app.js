const fromCurrency = document.querySelector(".from-currency");
const toCurrency = document.querySelector(".to-currency");
const amount = document.getElementById("amount");



class CurrencyConverter{
  constructor(){
    window.addEventListener("DOMContentLoaded", this.loadWindow);
  }

  loadWindow(){
    CurrencyConverter.currencies();
  }

  static getKeys(keys, currField){
    keys.sort();
    keys.forEach(key => {
      const option = document.createElement("option");
      option.setAttribute("value", key);
      option.innerText = key;
      currField.append(option);
    });
  }

  static loadCurrencies(data){
    const keys = Object.keys(data);
    CurrencyConverter.getKeys(keys, fromCurrency);
    CurrencyConverter.getKeys(keys, toCurrency);
  }

  static currencies(){
    fetch("https://api.vatcomply.com/currencies")
      .then((response) => {
        if(!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then((data) => {
        CurrencyConverter.loadCurrencies(data);
      })
      .catch((err) => {
        return err;
      });
  }

}


new CurrencyConverter();