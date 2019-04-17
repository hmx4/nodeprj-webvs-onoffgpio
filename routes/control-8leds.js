module.exports.control_8leds = control_8leds; // 匯出control_8leds函數

// declare global variables
var blinkOddLEDsInterval, blinkEvenLEDsInterval, runLEDsInterval;
var indexCount, dir;
var flag1=0, flag2=0, flag3=0;

// Import the onoff library
var onoff = require('onoff'); 
var Gpio = onoff.Gpio;

// Initialize pins 17, 27, 22, 5, 6, 13, 19, 26 to be an output pin
var led1 = new Gpio(17, 'out');
var	led2 = new Gpio(27, 'out');
var	led3 = new Gpio(22, 'out');
var	led4 = new Gpio(5, 'out');
var	led5 = new Gpio(6, 'out');
var	led6 = new Gpio(13, 'out')
var	led7 = new Gpio(19, 'out');
var	led8 = new Gpio(26, 'out');

//Put all the LED variables in an array
var leds = [led1, led2, led3, led4, led5, led6, led7, led8]; 

// set values of the GPIO pins
function SetLEDsValues(value1, value2, value3, value4, value5, value6, value7, value8)
{
		led1.writeSync(value1);
		led2.writeSync(value2);
		led3.writeSync(value3);
		led4.writeSync(value4);
		led5.writeSync(value5);
		led6.writeSync(value6);
		led7.writeSync(value7);
		led8.writeSync(value8);
}

// function to blink the odd LEDS every 500ms
function Blink_Odd_LEDs() {
		//run the blinkOddLEDs function every 500ms
		blinkOddLEDsInterval = setInterval(blinkOddLEDs, 500); 
}

// function to blink the odd LEDs
function blinkOddLEDs(){ 
		if (led1.readSync() == 0) { //check the led1's state, if the state is 0
				SetLEDsValues(1, 0, 1, 0, 1, 0, 1, 0); // turn the odd LEDs on
		} 
		else {
				SetLEDsValues(0, 0, 0, 0, 0, 0, 0, 0); // turn all of the LEDs off
		}
}

// function to blink the even LEDS every 500ms
function Blink_Even_LEDs() {
	//run the blinkEvenLEDs function every 500ms
	blinkEvenLEDsInterval = setInterval(blinkEvenLEDs, 500); 
}

// function to blink the even LEDs
function blinkEvenLEDs(){ 
	if (led2.readSync() == 0) { //check the led2's state, if the state is 0
			SetLEDsValues(0, 1, 0, 1, 0, 1, 0, 1); // turn the even LEDs on
	} 
	else {
			SetLEDsValues(0, 0, 0, 0, 0, 0, 0, 0); // turn all of the LEDs off
	}
}

// function to flow the 8 LEDS every 200ms
function Flow_8LEDs() {
	indexCount=0;
	// flow the 8 LEDs every 200ms
	flowLEDsInterval = setInterval(flow8LEDs, 200);
}

// function to flow a LED per time
function flow8LEDs() {
	// for each item in array, turn off LED
	leds.forEach(function(currentLED) { 
			currentLED.writeSync(0);    
		});
	if (indexCount == 0) dir = "left"; //set running direction to "left" if the count reaches zero
	if (indexCount == (leds.length-1)) dir = "right"; //set running direction to "right" if the count reaches 7
	leds[indexCount].writeSync(1); //turn on LED that where array index matches count
	if (dir == "left") indexCount++ //count upwards if direction is left
	if (dir == "right") indexCount--; //count downwards if direction is right
}

// Listen to the event triggered on CTRL+C
process.on('SIGINT', function () 
{ 
		// Cleanly close the GPIO pins before exiting
		leds.forEach(function(currentLED) {   //for each LED
				currentLED.writeSync(0);          //turn off LED
				currentLED.unexport();            //unexport GPIO
	  });
  	
}); 
 
// 控制8顆LED燈之函數
function control_8leds(command)
{
	if(command=="1" && flag1==0)
	{ 
		console.log("奇數LED燈正在閃爍!");
		Blink_Odd_LEDs();
		flag1=1;
	}	
	else if(command=="2")
	{
		console.log("已經關閉奇數LED燈!");
		clearInterval(blinkOddLEDsInterval);
		SetLEDsValues(0, 0, 0, 0, 0, 0, 0, 0); // turn all of the LEDs off
		flag1=0;
	}
	else if(command=="3" && flag2==0)
	{
		console.log("偶數LED燈正在閃爍!");
		Blink_Even_LEDs();
		flag2=1;
	}
	else if(command=="4")
	{
		console.log("已經關閉偶數LED燈!");
		clearInterval(blinkEvenLEDsInterval);
		SetLEDsValues(0, 0, 0, 0, 0, 0, 0, 0); // turn all of the LEDs off
		flag2=0;
	}
	else if(command=="5" && flag3==0)
	{
		console.log("LED正在執行跑馬燈!");
		Flow_8LEDs();
		flag3=1;
	}
	else if(command=="6")
	{
		console.log("已經關閉LED燈!");
		clearInterval(flowLEDsInterval);
		SetLEDsValues(0, 0, 0, 0, 0, 0, 0, 0); // turn all of the LEDs off
		flag3=0;
	}
	else
	{
		console.log("無效的命令!");
	}
}
