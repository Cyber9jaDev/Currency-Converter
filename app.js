let convertFromField = document.querySelector("#from-currency");
let convertToField = document.querySelector("#to-currency");
let amount = document.getElementById("amount");
let output = document.getElementById("output");
let result = document.getElementById("result");
const showOutputCurrency = document.querySelector(".output-cur");
const showResultCurrency = document.querySelector(".cur-result");
const exchangeInformation = document.getElementById("exchange-information");



class Exchange{
  constructor(){
    window.addEventListener("DOMContentLoaded", Exchange.showCurrencyInformation);
    window.addEventListener("DOMContentLoaded", Exchange.showExchangeInformation);
    window.addEventListener("DOMContentLoaded", Exchange.loadDatesAndRates);
    window.addEventListener("DOMContentLoaded", Exchange.currencies);
    // Conv.test();
    // Conv.showCurrencyInformation();
    // this.showExchangeInformation();
    // console.log(this.rates());
    // console.log(this.dates());
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
    Exchange.getKeys(keys, convertFromField);
    Exchange.getKeys(keys, convertToField);
  }
  
  static checkResponseAndParse(response){
    if(!response.ok) throw new Error(response.status);
    return response.json();
  }
  
  static currencies(){
    fetch("https://api.vatcomply.com/currencies")
      .then(Exchange.checkResponseAndParse)
      .then((data) => {
        Exchange.loadCurrencies(data);
        convertFromField.addEventListener("input", Exchange.calculate);
        convertToField.addEventListener("input", Exchange.calculate);
        amount.addEventListener("input", Exchange.calculate);
      })
      .catch((err) => {
        return err;
      });
  }
  
  static rateConverter(rates, fromSelectValue, toSelectValue){
    const amountValue = 0 || amount.value;
    if(toSelectValue === "RUB") return;
    const rateMultiplier = rates[toSelectValue];
    const total = rateMultiplier * amountValue;
    result.innerText = total;
    output.textContent = amount.value;
    showOutputCurrency.innerText = fromSelectValue;
    showResultCurrency.innerText = toSelectValue;

    fetch("https://api.vatcomply.com/currencies")
      .then(Exchange.checkResponseAndParse)
      .then((data) => {
        // console.log(data);
        fromCurrencyCode =  data.fromSelectValue.name;
        // console.log("fromCurrencyCode", fromCurrencyCode);
        fromCurrencySymbol = data.fromSelectValue.symbol;
        // console.log("fromCurrencySymbol", fromCurrencySymbol);
      })
      .catch((err) => {
        return err;
    });

    fetch("https://api.vatcomply.com/currencies")
      .then(Exchange.checkResponseAndParse)
      .then((data) => {
        toCurrencyCode = data.toSelectValue.name;
        toCurrencySymbol = data.toSelectValue.symbol;
      })
      .catch((err) => {
        return err;
    });
  }

  static calculate(){
    let toSelectValue = convertToField.options[convertToField.selectedIndex].text;
    let fromSelectValue = convertFromField.options[convertFromField.selectedIndex].text;
    fetch(`https://api.vatcomply.com/rates?base=${fromSelectValue}`)
      .then(Exchange.checkResponseAndParse)
      .then(({rates}) => {
        Exchange.rateConverter(rates, fromSelectValue, toSelectValue);
      })
      .catch((err) => {
        return err;
    });   // Fetch object ends here


    let fromCurrencyName, toCurrencyName, fromCurrencySymbol, toCurrencySymbol;

    fetch("https://api.vatcomply.com/currencies")
      .then(Exchange.checkResponseAndParse)
      .then((data) => {
        document.querySelector(".currency-1").innerText = fromSelectValue;
        fromCurrencyName = data[fromSelectValue].name;
        document.querySelector(".iso-code-1").innerText = fromCurrencyName;
        fromCurrencySymbol = data[fromSelectValue].symbol;
        document.querySelector(".symbol-1").innerText = fromCurrencySymbol;
      })
      .catch((err) => {
        return err;
    });

    fetch("https://api.vatcomply.com/currencies")
      .then(Exchange.checkResponseAndParse)
      .then((data) => {
        document.querySelector(".currency-2").innerText = toSelectValue;
        toCurrencyName = data[toSelectValue].name;
        document.querySelector(".iso-code-2").innerText = toCurrencyName;
        toCurrencySymbol = data[toSelectValue].symbol;
        document.querySelector(".symbol-2").innerText = toCurrencySymbol;
      })
      .catch((err) => {
        return err;
    });

    // Get the current Date
    const date = Exchange.currentDate();
    fetch(`https://api.vatcomply.com/rates?base=AUD&date=${date}`)
      .then(Exchange.checkResponseAndParse)
      .then(Exchange.loadDatesAndRates)
      .catch((err) => {
        return err;
    });
  }

  static loadDatesAndRates(){
    const dates = document.querySelectorAll(".date");
    const previousDates = Exchange.previousDates();
    for(let i =0; i < 7; i++){
      dates[i].innerText = previousDates[i];
    }
  }

  static showCurrencyInformation(){
    let information = document.getElementById("information");
    information.innerHTML = `
      <div class="container-lg">
      <h4 class="text-black lead fs-3 mt-3">Our Currency Conv</h4>
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

  static exchangeHTML(fromCurrency = "AUD", toCurrency = "AUD", fromCurrencyCode = "Australian Dollar", toCurrencyCode ="Australian Dollar", fromCurrencySymbol = "A$", toCurrencySymbol ="A$"){
    return `
      <div class="currency-information container-lg m-auto d-flex justify-content-center flex-column">
        <div class="row d-flex justify-content-around">
          <div class="col-md-4 bg-secondary my-2 pb-3">
            <h4 class="text-light text-opacity-75 lead fs-3 mt-3">From Currency</h4>
            <div class="d-flex flex-column px-3">
              <div class="d-flex flex-row">
                <span class="exchange-span-1">Currency</span>
                <span class="currency currency-1 exchange-span-2">${fromCurrency}</span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1">ISO Code</span>
                <span class="iso-code exchange-span-2 iso-code-1">${fromCurrencyCode}</span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1">Symbol</span>
                <span class="symbol symbol-1 exchange-span-2">${fromCurrencySymbol}</span>
              </div>
            </div>
          </div>
          <div class="col-md-4 bg-secondary my-2 pb-3">
            <h4 class="text-light text-opacity-75 lead fs-3 mt-3">To Currency</h4>
            <div class="d-flex flex-column px-3">
              <div class="d-flex flex-row">
                <span class="exchange-span-1">Currency</span>
                <span class="currency currency-2 exchange-span-2">${toCurrency}</span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1">ISO Code</span>
                <span class="iso-code iso-code-2 exchange-span-2">${toCurrencyCode}</span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1">Symbol</span>
                <span class="symbol symbol-2 exchange-span-2">${toCurrencySymbol}</span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1">Symbol</span>
                <span class="symbol symbol-2 exchange-span-2">${toCurrencySymbol}</span>
              </div>
            </div>
          </div>

          <!-- Current Rate and the last seven days -->

          <div class="col-md-4 bg-secondary my-2 pb-3">
            <h4 class="text-light text-opacity-75 lead fs-3 mt-3">Latest Exchange Rates</h4>
            <div class="d-flex flex-column px-3">
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate text-end"></span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate text-end"</span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate text-end"></span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate text-end"></span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate text-end"></span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate text-end"></span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate text-end"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static showExchangeInformation(){
   exchangeInformation.innerHTML = Exchange.exchangeHTML();
  }

  static currentDate(){
    const d = new Date();
    let date = d.getDate(); // Returns Wednesday
    let month = d.getMonth();
    const year = d.getFullYear();
    if(month < 10){ month = "0" + month;}
    if(date < 10) date = "0" + date;
    return`${year}-${month}-${date}`;
  }

  // Rates per day
  static previousDates(){
    let dates = [];
    for(let i = 0; i < 7; i++){
      const d = new Date();
      const milliseconds = d.setDate(d.getDate() - i);
      const date = new Date(milliseconds).toLocaleDateString();
      dates.push(date);
    }
    return dates;
  }
    
}

new Exchange();