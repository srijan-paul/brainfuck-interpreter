print = (msg) => {
    process.stdout.write(`${msg}`);
};

const stdin = process.openStdin();


const commands = {
    '+': 'increment',
    '-': 'decrement',
    '[': 'loop-begin',
    ']': 'loop-end',
    '>': 'rshift',
    '<': 'lshift',
    ',': 'scan',
    '.': 'print'
}

let memory = new Array(65534);
memory.fill(0);
let ptr = 0;

function interpret(s, ip) {
    let inputstream = ip;
    stdin.on('keypress', function (e) {
        if (e === '\r') return;
        inputstream.push(e);
    });

    let tokens = s.split('').filter(e => commands[e]);

    let wrapperControl = 0;

    for (let i = 0; i < tokens.length; i++) {
        switch (commands[tokens[i]]) {
            case 'rshift':
                ptr++;
                break;
            case 'lshift':
                ptr--;
                break;
            case 'increment':
                if (memory[ptr] >= 255)
                    memory[ptr] = 0;
                else
                    memory[ptr]++;
                break;
            case 'decrement':
                if (memory[ptr] <= 0)
                    memory[ptr] = 255;
                else
                    memory[ptr]--;
                break;
            case 'print':
                print(String.fromCharCode(memory[ptr]));
                break;
            case 'loop-begin':
                if (memory[ptr] === 0) {
                    i++;
                    while (wrapperControl > 0 || commands[tokens[i]] !== 'loop-end') {
                        if (commands[tokens[i]] === 'loop-begin')
                            wrapperControl++;
                        else if (commands[tokens[i]] === 'loop-end')
                            wrapperControl--;
                        i++;
                    }
                }
                break;
            case 'loop-end':
                if (memory[ptr] !== 0) {
                    i--;
                    while (wrapperControl > 0 || commands[tokens[i]] !== 'loop-begin') {
                        if (commands[tokens[i]] === 'loop-end')
                            wrapperControl++;
                        else if (commands[tokens[i]] === 'loop-begin')
                            wrapperControl--;
                        i--;
                    }
                    i--;
                }
                break;
            case 'scan':
                memory[ptr] = inputstream.shift().charCodeAt(0);
                break;
        }

    }
}

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.question('Enter your brainfuck code : \n', (code) => {
    let input = [];
    if (code.includes(',')) {
        rl.question('Enter input stream : \n', (e) => {
            input = e.split('');
            rl.close();
        })
    }

    console.log('Output : \n');
    interpret(code, input);

})

// ++++++++++