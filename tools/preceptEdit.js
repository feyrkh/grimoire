var precepts = {};
var theorems = {};
var problems = {};


function printAllInfo() {
    printPreceptStats();
    printTheoremStats();
    printProblemStats();
}

function generatePreceptListJs() {
    var strBuild = ["function loadLogic() {\n    precepts={};\n    theorems={};\n    problems={};\n\n"];
    var preceptArr = $.map(precepts, function(preceptData, preceptName) {
        return preceptData;
    });
    preceptArr.sort(function sortPrecepts(precept1, precept2) {
        var p1d = calculatePreceptDifficulty(precept1.name);
        var p2d = calculatePreceptDifficulty(precept2.name);

        if(p1d < p2d) return -1;
        if(p2d < p1d) return 1;
        if(precept1.name < precept2.name) return -1;
        return 1;
    });
    $.each(preceptArr, function(idx, precept) {
        strBuild.push("    addPrecept('", precept.name, "', '", precept.component1, "', '", precept.component2, "');\n");
    });

    strBuild.push("\n\n");

    var theoremArr = $.map(theorems, function(theoremData, theoremName) {
        return theoremName;
    });
    theoremArr = theoremArr.sort();
    $.each(theoremArr, function(idx, theorem) {
        strBuild.push("    addTheorem('", theorem, "', ", JSON.stringify(theorems[theorem]), ");\n");
    });

    strBuild.push("\n\n");
    var problemArr = $.map(problems, function(problemData, problemName) {
        return problemName;
    });
    problemArr = problemArr.sort();
    $.each(problemArr, function(idx, problem) {
        strBuild.push("    addProblem("+JSON.stringify(problems[problem])+");\n");
    });

    strBuild.push("\n    return{\n        precepts:precepts,\n        theorems:theorems,\n        problems: problems\n    };\n}\n");

    strBuild.push("\nvar preceptComboBlacklist = ", JSON.stringify(preceptComboBlacklist), ';');
    strBuild.push("\n var theoremApplicationBlacklist = ", JSON.stringify(theoremApplicationBlacklist), ";");

    return strBuild.join('');
}

var theoremUsefulCounts = [/*{name:'superuseful', count: Infinity}*/];

function suggestRandomTheoremApplication(retries) {
    if(!retries) retries = 1;
    theoremUsefulCounts = theoremUsefulCounts.sort(function(tuc1, tuc2) {
        return tuc1.count - tuc2.count;
    });
    for(var i=0;i<retries;i++) {
        var theoremName = theoremUsefulCounts[Math.floor((Math.random()*theoremUsefulCounts.length))].name;
        var problemNames = Object.keys(problems);
        var problem = problems[problemNames[Math.floor(Math.random()*problemNames.length)]];
        if (!(problem.solutions[theoremName] || (theoremApplicationBlacklist[theoremName] && theoremApplicationBlacklist[theoremName][problem.name]))) {
            return {theorem: theoremName, problem: problem.name};
        }
    }
    return null;
}

function suggestRandomTheoremCombination(preceptCount, retries) {
    retries = retries || 1;
    for(var i=0;i<retries;i++) {
        var suggestedPrecepts = [];
        var possiblePrecepts = Object.keys(precepts);
        while(suggestedPrecepts.length < preceptCount) {
            var precept = possiblePrecepts[Math.floor(Math.random()*possiblePrecepts.length)];
            if(suggestedPrecepts.indexOf(precept) >= 0) continue;
            suggestedPrecepts.push(precept);
        }
        var dupe = false;
        $.each(theorems, function(theoremData) {
            var existingPrecepts = Object.keys(theoremData);
            if(existingPrecepts.length != suggestedPrecepts.length) return;
            for(var i=0;i<existingPrecepts.length;i++) {
                if(suggestedPrecepts.indexOf(existingPrecepts[i]) < 0) return;
            }
            dupe = true;
            return true;
        });
        if(!dupe) return suggestedPrecepts;
    }
    return null;
}

function suggestRandomPreceptCombination(retries) {
    if(!retries) retries = 1;
    var preceptNames = Object.keys(precepts);
    for(var i=0;i<retries;i++) {
        var p1 = preceptNames[Math.floor(Math.random() * preceptNames.length)];
        var p2 = preceptNames[Math.floor(Math.random() * preceptNames.length)];
        if (p1 == p2) continue;
        if(p1 > p2) {
            var tmp = p1;
            p1 = p2;
            p2 = tmp;
        }
        if(preceptComboBlacklist[p1] && preceptComboBlacklist[p1][p2]) continue;
        if(preceptComboExists(p1, p2)) continue;
        return {p1: p1, p2: p2};
    }
    return null;
}

function printPreceptStats() {
    console.log("<h3>Precept Difficulties</h3>");
    var table = "<table><thead><tr><th>Precept</th><th>Comp 1</th><th>Comp 2</th><th>Difficulty</th><th>Usage as Component</th><th>Usage in Theorem</th><th>Total Usage</th></tr></thead><tbody>";
    $.each(precepts, function(preceptName, preceptDesc) {
        var usageAsComponent = calculatePreceptUsageAsComponent(preceptName);
        var usageInTheorem = calculatePreceptUsageInTheorem(preceptName);
        var c1 = precepts[preceptName].component1;
        var c2 = precepts[preceptName].component2;
        table += "<tr><td>"+preceptName+"</td><td>"+c1+"</td><td>"+c2+"</td><td>"+calculatePreceptDifficulty(preceptName)+"</td><td>"+usageAsComponent+"</td><td>"+usageInTheorem+"</td><td>"+(usageAsComponent+usageInTheorem)+"</td></tr>";
    });
    table += "</tbody></table>";
    console.log(table);
}

function calculatePreceptUsageAsComponent(preceptName) {
    var uses = 0;
    $.each(precepts, function(usedInName, usedInData) {
        if(preceptName == usedInData.component1 || preceptName == usedInData.component2) {
            uses++;
        }
    });
    return uses;
}

function calculatePreceptUsageInTheorem(preceptName) {
    var uses = 0;
    $.each(theorems, function(theoremName, theoremData) {
        if(theoremData[preceptName]) {
            uses+=1;
        }
    });
    return uses;
}

function calculateTheoremDifficulty(theoremName) {
    var totalDiff = 0;
    $.each(theorems[theoremName], function(componentName, componentCount) {
        totalDiff += calculatePreceptDifficulty(componentName) * componentCount;
    });
    return totalDiff;
}

function calculateTheoremEffectiveness(theoremName) {
    var effectiveness = 0;
    $.each(problems, function checkTheoremAgainstProblem(problemName, problemDesc) {
        var curEffect = problemDesc.solutions[theoremName];
        if(curEffect > 0) {
            effectiveness += curEffect;
        }
    });
    return effectiveness;
}
function calculateTheoremUsageCount(theoremName) {
    var usageCount = 0;
    $.each(problems, function checkTheoremAgainstProblem(problemName, problemDesc) {
        if(problemDesc.solutions[theoremName] > 0) {
            usageCount += 1;
        }
    });
    return usageCount;
}
function calculateTheoremDefectiveUsageCount(theoremName) {
    var usageCount = 0;
    $.each(problems, function checkTheoremAgainstProblem(problemName, problemDesc) {
        if(problemDesc.solutions[theoremName] < 0) {
            usageCount += 1;
        }
    });
    return usageCount;
}

function printTheoremStats() {
    var table = "<table><thead><tr><th>Theorem</th><th>Difficulty</th><th>Effectiveness</th><th>Usefulness</th><th>Improvement Count</th><th>Worsen Count</th><th>Avg Effectiveness</tr></thead><tbody>"
    console.log("<h3>Theorem Stats</h3>");
    $.each(theorems, function(theoremName, components) {
        var problemCount = calculateTheoremUsageCount(theoremName);
        var worseProblemCount = calculateTheoremDefectiveUsageCount(theoremName);
        var diff = calculateTheoremDifficulty(theoremName);
        var effectiveness = calculateTheoremEffectiveness(theoremName);
        var usefulness = effectiveness/diff;
        var averageEffectiveness = effectiveness / problemCount;
        table += "<tr><td>"+theoremName+"</td><td>"+diff+"</td><td>"+round(effectiveness,3)+"</td><td>"+round(usefulness, 3)+"</td><td>"+problemCount+"</td><td>"+worseProblemCount+"</td><td>"+averageEffectiveness+"</td></tr>";
        theoremUsefulCounts.push({name: theoremName, count: problemCount});
    });
    table += "</tbody></table>";
    console.log(table);
}

function printProblemStats() {
    var table = "<table><thead><tr><th>Problem</th><th># Solutions</th><th># Defective Solutions</th><th>Avg Effectiveness</th><th>Max Effectiveness</th></tr></thead><tbody>";
    console.log("<h3>Problem Stats</h3>");

    $.each(problems, function(problemName, problem) {
        var solutionCount = 0;
        var defectiveSolutionCount = 0;
        var totalEffectiveness = 0;
        var maxEffectiveness = 0;
        $.each(problem.solutions, function(solutionName, solutionEffectiveness) {
            if(solutionEffectiveness > 0) {
                solutionCount += 1;
            } else if(solutionEffectiveness < 0) {
                defectiveSolutionCount += 1;
            }
            totalEffectiveness += solutionEffectiveness;
            if(solutionEffectiveness > maxEffectiveness) {
                maxEffectiveness = solutionEffectiveness;
            }
        });
        var avgEffectiveness = totalEffectiveness / solutionCount;

        table += "<tr><td>"+problemName+"</td><td>"+solutionCount+"</td><td>"+defectiveSolutionCount+"</td><td>"+round(avgEffectiveness,3)+"</td><td>"+maxEffectiveness+"</td></tr>";
    });

    table += "</tbody></table>";
    console.log(table);
}


var preceptDifficulties = {};
function calculatePreceptDifficulty(preceptName) {
    var diff = 0;
    if(preceptDifficulties[preceptName]) {
        return preceptDifficulties[preceptName];
    }
    if(!precepts[preceptName].component1) {
        diff = 1;
    } else {
        diff = calculatePreceptDifficulty(precepts[preceptName].component1) + calculatePreceptDifficulty(precepts[preceptName].component2);
    }
    preceptDifficulties[preceptName] = diff;
    return diff;
}


function preceptComboExists(component1, component2) {
    var alreadyExists = null;
    if (component1 || component2) {
        $.each(precepts, function (k, v) {
            if ((component1 == v.component1 && component2 == v.component2) || (component1 == v.component2 && component2 == v.component1)) {
                alreadyExists = v;
                return true;
            }
        });
    }
    return alreadyExists;
}
function addPrecept(name, component1, component2) {
    if(component1 > component2) {
        var tmp = component1;
        component1 = component2;
        component2 = tmp;
    }
    var newPrecept = {name: name, component1: component1, component2: component2};
    if(component1 && !precepts[component1]) {
        console.log("#### ERROR: New precept ("+name+") can't be added, requires a precept that doesn't exist ("+component1+")");
        return false;
    }
    if(component2 && !precepts[component2]) {
        console.log("#### ERROR: New precept ("+name+") can't be added, requires a precept that doesn't exist ("+component2+")");
        return false;
    }
    var alreadyExists = preceptComboExists(component1, component2) || precepts[newPrecept.name];
    if (alreadyExists) {
        console.log("##### ERROR: New precept can't be added, a matching precept already exists. New precept: " + name + "," + component1 + "," + component2 + " vs " + alreadyExists.name + "," + alreadyExists.component1 + "," + alreadyExists.component2);
        return false;
    }


    precepts[name] = newPrecept;
    return newPrecept;
}

/**
 * @param problem.name Name of the problem
 * @param problem.solutions Map of solutionName: solutionEffectiveness
 * @param problem.description Text describing the problem
 * @returns {*}
 */
function addProblem(problem) {
    if (problems[problem.name]) {
        console.log("##### ERROR: New problem can't be added, a problem with that name already exists (" + problem.name + ")");
        return false;
    }

    if(!problem.solutions) {
        problem.solutions = {};
    }

    $.each(problem.solutions, function (k, v) {
        if (!theorems[k]) {
            console.log("#### ERROR: New problem (" + problem.name + ") can't be added, it has a solution that doesn't exist (" + k + ")");
            return false;
        }
    });

    problems[problem.name] = problem;
    return problems[name];
}

function addTheorem(name, myPrecepts) {
    if (theorems[name]) {
        console.log("#### ERROR: New theorem can't be added, one with that name already exists.");
        return false;
    }
    var valid = true;
    $.each(myPrecepts, function(preceptName, preceptAmt) {
        if(!precepts[preceptName]) {
            console.log("#### ERROR: New theorem ("+name+") can't be added, requires a precept that doesn't exist ("+preceptName+").");
            valid = false;
        }
    });
    if(!valid) {
        return;
    }
    $.each(theorems, function (theoremName, preceptList) {
        if (deepCompare(preceptList, myPrecepts)) {
            console.log("#### ERROR: New theorem can't be added, one with that precept list already exists. " + name + " vs " + theoremName);
            valid = false;
            return true;
        }
    });
    if (!valid) {
        return;
    }
    theorems[name] = myPrecepts;
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
function deepCompare() {
    var i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on step when comparing prototypes
        if (x === y) {
            return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }

        // At last checking prototypes as good a we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        // Quick checking of one object beeing a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }
            else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }
            else if (typeof y[p] !== typeof x[p]) {
                return false;
            }

            switch (typeof (x[p])) {
                case 'object':
                case 'function':

                    leftChain.push(x);
                    rightChain.push(y);

                    if (!compare2Objects(x[p], y[p])) {
                        return false;
                    }

                    leftChain.pop();
                    rightChain.pop();
                    break;

                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }

        return true;
    }

    if (arguments.length < 1) {
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw "Need two or more arguments to compare";
    }

    for (i = 1, l = arguments.length; i < l; i++) {

        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }

    return true;
}
