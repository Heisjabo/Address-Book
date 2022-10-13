// write your code here
var signalOne = 0;
var signalTwo = 0;
var frequency = [1,2,3,4,5];
var time = [1,2,3,4,5,6,7];
var maxequal = [];

for(let i = 0; i <= frequency.length; i++) {
    signalOne += frequency[i];
}

for(let i = 0; i<= time.length; i++){
    signalTwo += time[i];
}
if (signalOne == signalTwo) {
    return maxequal.push(frequency[i]);
} else {
    return false;
}