function loadLogic() {
    precepts={};
    theorems={};
    problems={};

    addPrecept('air', '', '');
    addPrecept('earth', '', '');
    addPrecept('fire', '', '');
    addPrecept('law', '', '');
    addPrecept('water', '', '');
    addPrecept('wild', '', '');
    addPrecept('crystal', 'earth', 'law');
    addPrecept('life', 'earth', 'water');
    addPrecept('light', 'air', 'fire');
    addPrecept('motion', 'air', 'law');
    addPrecept('void', 'law', 'wild');
    addPrecept('glass', 'crystal', 'fire');
    addPrecept('herb', 'life', 'wild');
    addPrecept('metal', 'crystal', 'earth');
    addPrecept('sight', 'air', 'light');
    addPrecept('animal', 'life', 'motion');
    addPrecept('binding', 'motion', 'void');
    addPrecept('dark', 'light', 'void');
    addPrecept('death', 'life', 'void');
    addPrecept('wood', 'life', 'light');
    addPrecept('ash', 'fire', 'wood');
    addPrecept('spirit', 'death', 'life');
    addPrecept('poison', 'death', 'herb');
    addPrecept('thought', 'law', 'spirit');
    addPrecept('human', 'animal', 'spirit');


    addTheorem('glimmer', {"light":1});
    addTheorem('nightvision', {"dark":1,"sight":2,"light":1});
    addTheorem('orb_of_day', {"light":3,"binding":1,"glass":1});
    addTheorem('orb_of_fire', {"light":1,"fire":3,"binding":1,"glass":1});
    addTheorem('orb_of_night', {"dark":3,"binding":1,"glass":1});
    addTheorem('shadow', {"dark":1});
    addTheorem('torch', {"light":1,"fire":1});


    addProblem({"name":"cold","description":"A bitter chill lies upon {target}.","solutions":{"torch":0.2,"shadow":-0.2,"orb_of_night":-0.5,"orb_of_day":0.5,"orb_of_fire":0.9}});
    addProblem({"name":"darkness","description":"Darkness engulfs {target}.","solutions":{"nightvision":1,"torch":0.3,"glimmer":0.3,"shadow":-0.1,"orb_of_fire":0.6,"orb_of_night":-1,"orb_of_day":1}});
    addProblem({"name":"glare","description":"A brilliant glare emanates from {target}.","solutions":{"nightvision":-1,"shadow":0.3,"glimmer":-0.1,"orb_of_day":-1,"orb_of_night":1,"orb_of_fire":-1,"torch":-0.3}});
    addProblem({"name":"heat","description":"A scorching heat rises from {target}.","solutions":{"torch":-0.6,"orb_of_fire":-1,"orb_of_night":0.5,"orb_of_day":-0.5,"shadow":0.2}});

    return{
        precepts:precepts,
        theorems:theorems,
        problems: problems
    };
}

var preceptComboBlacklist = {};
var theoremApplicationBlacklist = {"glimmer":{"cold":1,"heat":1},"nightvision":{"heat":1,"cold":1}};