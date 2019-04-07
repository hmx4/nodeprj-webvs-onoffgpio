module.exports.control_8leds = control_8leds; // 匯出control_8leds函數

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

// Unexport the the GPIO pins
function UnexportLEDs()
{
	led1.unexport();
	led2.unexport();
	led3.unexport();
	led4.unexport();
	led5.unexport();
	led6.unexport();
	led7.unexport();
	led8.unexport();
}

// blink the odd-number LEDS for 6 times
function Blink_Odd_LEDs()
{
	var i;
    for (i = 0; i < 6; i++) { 
		setTimeout(function() {
			// turn the odd leds on after 0.2 second
			SetLEDsValues(1, 0, 1, 0, 1, 0, 1, 0);
		}, 200);

		setTimeout(function() {
			// turn all leds off after 0.2 second
			SetLEDsValues(0, 0, 0, 0, 0, 0, 0, 0);
		}, 200);
	}
}

// blink the even-number LEDS for 6 times
function Blink_Even_LEDs()
{
	var i;
    for (i = 0; i < 6; i++) { 
		setTimeout(function() {
			// turn the even leds on after 0.2 second
			SetLEDsValues(0, 1, 0, 1, 0, 1, 0, 1);
		}, 200);

		setTimeout(function() {
			// turn all leds off after 0.2 second
			SetLEDsValues(0, 0, 0, 0, 0, 0, 0, 0);
		}, 200);
	}
}

// Run the LEDS for 3 times
function Run_LEDs()
{
	var indexCount = 0;   //a counter
	var dir = "left";     //variable for running direction
	var i;
	for (i = 0; i < 3; i++) 
	{ 
		setTimeout(function() {
			leds.forEach(function(currentLED) { //for each item in array
				currentLED.writeSync(0);        //turn off LED
			});
			if (indexCount == 0) dir = "left"; //set running direction to "left" if the count reaches zero
			if (indexCount >= leds.length) dir = "right"; //set running direction to "right" if the count reaches 7
			if (dir == "right") indexCount--; //count downwards if direction is right
			leds[indexCount].writeSync(1); //turn on LED that where array index matches count
			if (dir == "left") indexCount++ //count upwards if direction is left
		}, 50);
	}
}

// Listen to the event triggered on CTRL+C
process.on('SIGINT', function () { 
	// Cleanly close the GPIO pins before exiting
	leds.forEach(function(currentLED) {   //for each LED
		currentLED.writeSync(0);          //turn off LED
		currentLED.unexport();            //unexport GPIO
	  });
  	console.log('Bye, bye!');
  	process.exit();
});

// 控制8顆LED燈之函數
function control_8leds(command)
{
	if(command=="1")
	{ 
		console.log("奇數LED燈正在閃爍!");
		Blink_Odd_LEDs();
	}	
	else if(command=="2")
	{
		console.log("奇數LED燈正在閃爍!");
		Blink_Even_LEDs();
	}
	else if(command=="3")
	{
		console.log("LED正在執行跑馬燈!");
		Run_LEDs();
	}
	else
	{
		console.log("無效的命令!");
	}
}
