var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepailer = require('role.repailer');
var roleClaimer = require('role.claimer');
var utilities = require('utilities');

let roles = ["builder", "harvester", "upgrader", "repailer"];
var minNumberOfBuilders = 2;
var minNumberOfHarvesters = 10;
var minNumberOfUpgraders = 4;
var minNumberOfRepailers = 2;


module.exports.loop = function () {
    //control de creeps number
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfRepailers = _.sum(Game.creeps, (c) => c.memory.role == 'repailer');

    utilities.deleteDeadCreeps();//this deletes the dead creeps that remains in the memory

    if (minNumberOfBuilders > numberOfBuilders) {
        utilities.generateCreep(roles[0]);
    }
    if (minNumberOfHarvesters > numberOfHarvesters) {
        utilities.generateCreep(roles[1]);
    }
    if (minNumberOfUpgraders > numberOfUpgraders) {
        utilities.generateCreep(roles[2]);
    }
    if (minNumberOfRepailers > numberOfRepailers) {
        utilities.generateCreep(roles[3]);
    }
    // if (numcreeps >= Object.keys(Game.creeps).length) {//this generates a creep in every spawn
    //        utilities.generateCreep(roles[Math.floor((Math.random() * roles.length))]);

    //  }

    //tower method
    for (var name in Game.rooms) {
        var currentRoom = Game.rooms[name]; //this is maybe dumb
        var towers = currentRoom.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
        })
        
        for (let tower of towers) {
            if (tower) {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }

                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);//pillo a los mierdas
                if (closestHostile) {
                    tower.attack(closestHostile);
                }
            }
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.role == 'harvester') {
            if (utilities.goToHomeRoom(creep)) {
                roleHarvester.run(creep);
            }

        }
        if (creep.memory.role == 'upgrader') {
            if (utilities.goToHomeRoom(creep)) {
                roleUpgrader.run(creep);
            }

        }
        if (creep.memory.role == 'builder') {
            if (utilities.goToHomeRoom(creep)) {
                roleBuilder.run(creep);
            }
        }
        if (creep.memory.role == 'repailer') {
            if (utilities.goToHomeRoom(creep)) {
                roleRepailer.run(creep);
            }
        }
        if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }


    }

}
