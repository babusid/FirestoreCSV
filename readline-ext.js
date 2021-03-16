const readline = require("readline");
const { promisify } = require('util');
//custom promisified version of question for readline interface
readline.Interface.prototype.question[promisify.custom] = function(prompt){
    return new Promise((resolve)=>{
        readline.Interface.prototype.question.call(this,prompt,(ans)=>{resolve(ans)});
    });
}
readline.Interface.prototype.questionAsync = promisify(readline.Interface.prototype.question);
