let convertFromField = document.querySelector("#from-currency");
let convertToField = document.querySelector("#to-currency");
let amount = document.getElementById("amount");
let output = document.getElementById("output");
let result = document.getElementById("result");
const showOutputCurrency = document.querySelector(".output-cur");
const showResultCurrency = document.querySelector(".cur-result");


class Converter {
  constructor(){
    window.addEventListener("DOMContentLoaded", this.showCurrencyInformation());
    window.addEventListener("DOMContentLoaded", Converter.currencies);
    // Converter.test();
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

  showCurrencyInformation(){
    let information = document.getElementById("information");
    information.innerHTML = `
      <div class="container-lg">
      <h4 class="text-black lead fs-3 mt-3">Our Currency Converter</h4>
      <p class="">
        With our unique currency converter you can easily and quickly
        convert currencies with many advantages: All foreign currencies
        of the world, gold price and Bitcoin. Updates every 5 minutes.
        Historical financial data of the past 15 years. Fast and comfortable 
        like a mobile app. Additional features like conversion history,
        copy result or inverse conversion. Interactive chart. Handy conversion 
        tables directly to your mobile or as a printed aid for holidays 
        and business trips.
      </p>
      <h4 class="text-black lead fs-3 mt-3">Multiple currency converter and cross rates</h4>
      <p>
        Would you like to convert an amount to multiple other currencies at once? 
        Or are you looking for a typical yet flexible cross rates matrix with many currencies? Then have a look at our unique interactive cross rates.
      </p>
      <h4 class="text-black lead fs-3 mt-3">Send money abroad and save money</h4>
      <p>
        More and more often individuals and companies send money abroad using 
        specialized providers. Doing so allows them to save a lot compared to 
        wire transfer or credit card fees of normal banks. Would you 
        like to know which remittance provider is the best for your 
        international transfer? Then visit our real-time price comparison of money transfer deals.
      </p>
      <h4 class="text-black lead fs-3 mt-3">Note</h4>
      <p>
        Our money converter (currency convertor) and other tools can assist 
        you in many situations as an additional indicator (online shopping, 
        hotel booking, foreign exchange / FOREX / FX trading, conversion of stock quotes and investment products, loan comparison, checking credit card statements etc.). 
        But in any case please read our disclaimer before!
      </p>
    </div>
  `;


  }

  showExchangeInfoemation(){
    
  }

  static test(){
    fetch("https://api.vatcomply.com/geolocate")
      .then(Converter.checkResponseAndParse)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
    
}


new Converter();