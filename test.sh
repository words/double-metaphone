#!/bin/sh
#!/bin/bash

typeset -i tests=0

function it {
    let tests+=1;
    description="$1";
}

function assert {
    if [[ "$1" == "$2" ]]; then
        printf "\033[32m.\033[0m";
    else
        printf "\033[31m\nFAIL: $description\033[0m: '$1' != '$2'\n";
        exit 1
    fi
}

it "Should accept an argument"
    result=`./cli.js "michael"` 2> /dev/null
    assert "$result" "MKL	MXL"

it "Should fail on too many arguments"
    code=0
    ./cli.js "alfred" "bertrand" > /dev/null 2>&1 || code=$?
    assert $code 1

it "Should fail on too many values"
    code=0
    ./cli.js "alfred bertrand" > /dev/null 2>&1 || code=$?
    assert $code 1

it "Should accept values over stdin"
    result=`echo "michael" | ./cli.js` 2> /dev/null
    assert "$result" "MKL	MXL"

it "Should fail on too many values over stdin"
    code=0
    echo "alfred bertrand" | ./cli.js > /dev/null 2>&1 || code=$?
    assert $code 1

it "Should fail when no values are piped in and no values are given"
    code=0
    ./cli.js > /dev/null 2>&1 || code=$?
    assert $code 1

it "Should accept \`--help\`"
    code=0
    ./cli.js --help > /dev/null 2>&1 || code=$?
    assert $code 0

it "Should accept \`-h\`"
    code=0
    ./cli.js -h > /dev/null 2>&1 || code=$?
    assert $code 0

it "Should accept \`--version\`"
    code=0
    ./cli.js --version > /dev/null 2>&1 || code=$?
    assert $code 0

it "Should accept \`-v\`"
    code=0
    ./cli.js -v > /dev/null 2>&1 || code=$?
    assert $code 0

printf "\033[32m\n(✓) Passed $tests assertions without errors\033[0m\n";

exit 0
