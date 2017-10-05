const blegh = "hello world";
console.log(`hello ${blegh}`);

const obj = {hey: 1};
const obj2 = {...obj, blegh: 2};
console.log(obj2);

class AppComponent {
    static PropTypes = {
        blegh: "whoa"
    };
}

switch (blegh) {
    case 1: 
        console.log("hey");
        break;
    case 2:
        console.log("you");
        break;
}