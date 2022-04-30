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
    window.addEventListener("DOMContentLoaded", Exchange.initialCheatsheet);
    window.addEventListener("DOMContentLoaded", Exchange.showExchangeInformation);
    window.addEventListener("DOMContentLoaded", Exchange.loadInitialDatesAndRates);
    window.addEventListener("DOMContentLoaded", Exchange.currencies);
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
        fromCurrencyCode =  data.fromSelectValue.name;
        fromCurrencySymbol = data.fromSelectValue.symbol;
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
  static loadInitialDatesAndRates(){
    const dates = document.querySelectorAll(".date");
    const rates = document.querySelectorAll(".rate");
    const previousDates = Exchange.previousDates();
    for(let i =0; i < 7; i++){
      dates[i].innerText = previousDates[i];
      rates[i].innerText = "1.0000000";
    }
  }

  static displayCurrencyCodeSymbol(data, fromSelectValue, fromCurrencyName, fromCurrencySymbol, toSelectValue, toCurrencyName, toCurrencySymbol){
    document.querySelector(".currency-1").innerText = fromSelectValue;
    fromCurrencyName = data[fromSelectValue].name;
    document.querySelector(".iso-code-1").innerText = fromCurrencyName;
    fromCurrencySymbol = data[fromSelectValue].symbol;
    document.querySelector(".symbol-1").innerText = fromCurrencySymbol;
    document.querySelector(".currency-2").innerText = toSelectValue;
    toCurrencyName = data[toSelectValue].name;
    document.querySelector(".iso-code-2").innerText = toCurrencyName;
    toCurrencySymbol = data[toSelectValue].symbol;
    document.querySelector(".symbol-2").innerText = toCurrencySymbol;

    return fetch("https://api.vatcomply.com/currencies");
  }

  static calculate(){

    let toSelectValue = convertToField.options[convertToField.selectedIndex].text;
    let fromSelectValue = convertFromField.options[convertFromField.selectedIndex].text;
    let fromCurrencyName, toCurrencyName, fromCurrencySymbol, toCurrencySymbol;
    
    fetch(`https://api.vatcomply.com/rates?base=${fromSelectValue}`)
      .then(Exchange.checkResponseAndParse)
      .then(({rates}) => {
        Exchange.rateConverter(rates, fromSelectValue, toSelectValue);
        Exchange.cheatsheet(fromSelectValue, toSelectValue);
        return fetch("https://api.vatcomply.com/currencies");
      })
      .then(Exchange.checkResponseAndParse)
      .then((data) => {
        Exchange.displayCurrencyCodeSymbol(data, fromSelectValue, fromCurrencyName, fromCurrencySymbol, toSelectValue, toCurrencyName, toCurrencySymbol); 
        Exchange.loadDatesAndRates(fromSelectValue, toSelectValue);
        Exchange.updateFixedCheatsheetRates(fromSelectValue, toSelectValue);
      })
      .then(Exchange.checkResponseAndParse)
      .catch((err) => {
        return err;
    });  

    

    
  }

  static cheatsheet(fromCurrency, toCurrency){
    const date = Exchange.currentDate();
    const cheatsheet = document.querySelector(".traveller-cheatsheet");
    cheatsheet.innerHTML = Exchange.cheatsheetHTML(date, fromCurrency, toCurrency);
  }

  static loadDatesAndRates(fromSelectValue, toSelectValue){
    const dates = document.querySelectorAll(".date");
    const rates = document.querySelectorAll(".rate");
    const previousDates = Exchange.previousDates();
    
    previousDates.forEach((date, index) => {
      fetch(`https://api.vatcomply.com/rates?base=${fromSelectValue}&date=${date}`)
        .then(Exchange.checkResponseAndParse)
        .then((data) => {
          if(data.rates[toSelectValue] === 1){rates[index].innerText = `${data.rates[toSelectValue]}.0000000`;}
          else{rates[index].innerText = data.rates[toSelectValue];}
          dates[i].innerText = previousDates[i];
        })
        .catch((err) => {
          return err;
        });
    });
  }

  static showCurrencyInformation(){
    let information = document.getElementById("information");
    information.innerHTML = `
      <div class="container-lg">
      <h4 class="text-secondary lead fs-3 mt-3">Our Currency Converter</h4>
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
      <h4 class="text-secondary lead fs-3 mt-3">Multiple currency converter and cross rates</h4>
      <p>
        Would you like to convert an amount to multiple other currencies at once? 
        Or are you looking for a typical yet flexible cross rates matrix with many currencies? Then have a look at our unique interactive cross rates.
      </p>
      <h4 class="text-secondary lead fs-3 mt-3">Send money abroad and save money</h4>
      <p>
        More and more often individuals and companies send money abroad using 
        specialized providers. Doing so allows them to save a lot compared to 
        wire transfer or credit card fees of normal banks. Would you 
        like to know which remittance provider is the best for your 
        international transfer? Then visit our real-time price comparison of money transfer deals.
      </p>
      <h4 class="text-secondary lead fs-3 mt-3">Note</h4>
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
            </div>
          </div>

          <div class="col-md-4 bg-secondary my-2 pb-3">
            <h4 class="text-light text-opacity-75 lead fs-3 mt-3">Latest Exchange Rates</h4>
            <div class="d-flex flex-column px-3">
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate"></span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate"></span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate"></span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate"></span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate"></span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate"></span>
              </div>
              <div class="d-flex flex-row">
                <span class="exchange-span-1 date"></span>
                <span class="exchange-span-2 rate"></span>
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

  static cheatsheetHTML(date, fromCurrency = "AUD" , toCurrency = "AUD"){
    return`
      <div class="container-lg d-sm-flex flex-column">
      <h4 class="cheatsheet-intro lead">Traveller Cheatsheet</h4>
      <div class="cheatsheet-header d-flex flex-row align-items-center w-100">
        <div class="lead fw-bold cheatsheet-header-currency d-flex w-25"><strong><span class="from-cheatsheet">${fromCurrency}</span> / <span class="to-cheatsheet">${toCurrency}</span></strong></div>
        <div class="cheatsheet-header-info d-flex flex-column w-75 text-end">
          <div>Traveller Cheatsheet <br><small><a href="https://cyber9jaexchange.netlify.app">cyber9jaexchange.com</a></small></div>
          <div>Exchange rates from <span id="cheatsheet-date">${date}</span></div>
        </div>
      </div>
      <div class="container d-flex flex-column m-auto">
        <div class="table-container d-flex flex-row justify-content-between gap-2 gap-md-3">
          <div class="col-sm-4 table-col">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" class="from-cheatsheet">${fromCurrency}</th>
                  <th scope="col"><i class="d-none opacity-100"></i></th>
                  <th scope="col" class="to-cheatsheet">${toCurrency}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="fixed-exchange-rate-from">1</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">1.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">2</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">2.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">3</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">3.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">4</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">4.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">5</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">5.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">10</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">10.0000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-sm-4 table-col">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" class="from-cheatsheet">${fromCurrency}</th>
                  <th scope="col"><i class="d-none"></i></th>
                  <th scope="col" class="to-cheatsheet">${toCurrency}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="fixed-exchange-rate-from">15</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">15.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">20</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">20.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">25</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">25.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">30</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">30.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">35</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">35.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">40</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">40.0000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-sm-4 table-col">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col"class="from-cheatsheet">${fromCurrency}</th>
                  <th scope="col"><i class="d-none"></i></th>
                  <th scope="col" class="to-cheatsheet">${toCurrency}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="fixed-exchange-rate-from">45</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">45.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">50</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">50.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">100</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">100.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">250</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">250.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">500</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">500.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-from">1000</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-from-converted">1000.0000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="table-container d-flex flex-row justify-content-between gap-2 gap-md-3">
          <div class="col-sm-4 table-col">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" class="to-cheatsheet">${toCurrency}</th>
                  <th scope="col"><i class="d-none opacity-100"></i></th>
                  <th scope="col" class=" from-cheatsheet">${fromCurrency}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="fixed-exchange-rate-to">1</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">1.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">2</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">2.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">3</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">3.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">4</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">4.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">5</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">5.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">10</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">10.0000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-sm-4 table-col">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" class="to-cheatsheet">${toCurrency}</th>
                  <th scope="col"><i class="d-none"></i></th>
                  <th scope="col" class="from-cheatsheet">${fromCurrency}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="fixed-exchange-rate-to">15</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">15.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">20</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">20.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">25</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">25.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">30</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">30.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">35</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">35.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">40</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">40.0000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-sm-4 table-col">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" class="to-cheatsheet">${toCurrency}</th>
                  <th scope="col"><i class="d-none"></i></th>
                  <th scope="col" class="from-cheatsheet">${fromCurrency}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="fixed-exchange-rate-to">45</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">45.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">50</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">50.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">100</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">100.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">250</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">250.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">500</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">500.0000</td>
                </tr>
                <tr>
                  <td class="fixed-exchange-rate-to">1000</td>
                  <td scope="col"><i class="fas fa-angle-double-right"></i></td>
                  <td class="fixed-exchange-rate-to-converted">1000.0000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> 
      </div>
    </div>  
    `;
  }

  static multiplyRates(rates, calculatedRate, value, cheatsheet, amount){
    for(let i = 0; i < 18; i++){
      const multiplier = parseInt(cheatsheet[i].innerText);
      const rate = rates[value];
      calculatedRate[i].innerText = multiplier * amount * rate;
    }
    // return fetch(`https://api.vatcomply.com/rates?base=${toSelectValue}`);
  }

  static updateFixedCheatsheetRates(fromSelectValue, toSelectValue){
    const fromFixedCheatsheetRates = document.querySelectorAll(".fixed-exchange-rate-from");
    const fromCalculatedRate = document.querySelectorAll(".fixed-exchange-rate-from-converted");
    const toFixedCheatsheetRates = document.querySelectorAll(".fixed-exchange-rate-to");
    const toCalculatedRate = document.querySelectorAll(".fixed-exchange-rate-to-converted");
    
    let amount = document.getElementById("amount").value;
    if(amount < 1) return;

    fetch(`https://api.vatcomply.com/rates?base=${fromSelectValue}`)
      .then(Exchange.checkResponseAndParse)
      .then(({rates}) => {
        Exchange.multiplyRates(rates, fromCalculatedRate, toSelectValue, fromFixedCheatsheetRates, amount);
        return fetch(`https://api.vatcomply.com/rates?base=${toSelectValue}`);
      })
      .then(Exchange.checkResponseAndParse)
      .then(({rates}) => {
        Exchange.multiplyRates(rates, toCalculatedRate, fromSelectValue, toFixedCheatsheetRates, amount);
      })
      .catch((err) => {
        return err;
      });
  }
  
  static initialCheatsheet(){
    const date = Exchange.currentDate();
    const cheatsheet = document.querySelector(".traveller-cheatsheet");
    cheatsheet.innerHTML = Exchange.cheatsheetHTML(date);
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

  static previousDates(){
    let dates = [];
    for(let i = 0; i < 7; i++){
      const d = new Date();
      const milliseconds = d.setDate(d.getDate() - i);
      let date = new Date(milliseconds).getDate();
      let month = new Date(milliseconds).getMonth();
      if(date < 10) date = "0" + date;
      if(month < 10) month = "0" + month;
      const year = new Date(milliseconds).getFullYear();
      const completeDate = `${year}-${month}-${date}`;
      dates.push(completeDate);
    }
    return dates;
  }
}

new Exchange();