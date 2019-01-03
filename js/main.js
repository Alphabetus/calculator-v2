// initialize variables
var digitLimit = 7;
var operation = null;
var storedNumber = null;
var switchSignal = 0;
var totalFix = null;
// document ready
$(document).ready(function(){
  console.log("doc ready");


  // button listeners
  $(".btn").on("click", function(){
    buttonClick($(this));
  });
});
// FUNCTIONS ########################################################################

function buttonClick(context){
  switch(context.data("button")){
    case "number":
      addNumber(context.data("number"));
      break;
    case "operation":
      operate(context.data("value"));
      break;
    case "total":
      total();
      break;
    case "reset":
      clear();
      break;
    default:
      console.log("switch error on buttonClick()");
  }
}

function addNumber(number){
  // validate current input
  var result = $("#result").text();
  // only allow 1 unit divider
  if (result.indexOf(".") > -1 && number == "."){
    console.log("double divider. return");
    return;
  }
  result = Number(result);
  if (result === 0 && number !== "." || switchSignal > 0 && number !== "."){
    // send back switch to zero if triggered
    if (switchSignal > 0){
      switchSignal = 0;
    }
    // insert number and replace zero
    $("#resultBox").text(number);
  }
  else{
    // check digit limit
    var digit = $("#result").text();
    digit = digit.replace(/\s+/g, ""); // remove empty spaces from string
    var digitCounter = digit.length;
    digitCounter++;
    if (digitCounter > digitLimit){
      return;
    }
    // add digit to display
    var display = $("#resultBox").text() + number;
    $("#resultBox").text(display);
    display = display.replace(/\s+/g, ""); // remove empty spaces from string
    // console.log(Number(display));
  }
}

function operate(op){
  // trigger switch
  switchSignal = 1;
  // check if number is stored
  if (storedNumber != null){
    // number is stored
    var num = Number($("#resultBox").text());
    // error catcher for possible null operation due to previous calculation
    if (totalFix !== null){
      totalFix = null;
      var result = num;
    }
    else{
      var result = calculate(storedNumber, num);
    }
    // print display
    $("#resultBox").text(result);
    // update store
    storedNumber = result;
  }
  else{
    //no number is stored
    var number = Number($("#resultBox").text());
    console.log(number);
    storedNumber = number;
  }
  // define next operation
  operation = op;
}

function calculate(num1, num2){

  var out = null;
  switch(operation){
    case "sum":
      out = Number((num1 + num2));
      break;
    case "subtract":
      out = Number((num1 - num2));
      break;
    case "multiply":
      out = Number((num1 * num2));
      break;
    case "divide":
      out = Number((num1 / num2));
      break;
    default:
      console.log("Error on Calculate() switch.");
  }
  // fix decimals
  out = roundToTwo(out);
  // fix exponential if needed
  out = manipulateLength(out);
  //nullify operation
  operation = null;
  // return result
  return out;
}

function total(){
  var num = Number($("#resultBox").text());
  var out = calculate(storedNumber, num);
  $("#resultBox").text(out);
  // reset operation
  // operation = null;
  // update storedNumber
  storedNumber = out;
  // trigger switch
  switchSignal = 1;
  // totalFix
  totalFix = 1;
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function manipulateLength(num){
  var string = num.toString();
  var count = string.length;
  if (count > digitLimit){
    num = num.toExponential();
  }
  // return
  return num;
}

function clear(){
  operation =  null;
  storedNumber = null;
  switchSignal = 0;
  totalFix = null;
  // reset display
  $("#resultBox").text(0);
  // log
  console.log("calculator reseted.");
}
