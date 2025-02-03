
/*!
 * Genetic Algorithm JS v.0.9
 *
 * genetic-algorithm.js
 *
 * This application chooses a good item from the crowd. It's a general robust solution.
 *
 * Copyright (C) 2025 Varga Laszlo
 * 
 * https://github.com/vargalaszlo87/genetic-algorithm-js
 * http://vargalaszlo.com
 * http://ha1cx.hu
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Date: 2025-02-03
 */


/*!
 * The "config" section can you set your parameters of project.
 */

const config = {

    // add your categories
    categories: [
        "sunlight",
        "soil", // 
        "terrian",
        "distance",
        "cost"
    ],

    // add the names of categories
    categoriesNames: [
        "Sunlight",
        "Soul quality",
        "Topography quality",
        "Distance from the connection point",
        "Installation cost"
    ],

    // set the range of categories
    ranges: {
        min: 0,
        max: 1
    },

    // "negative impact", where the highest value is worse
    negativeImpact: [
        "distance",
        "cost"
    ],

    // set the deafult weights
    defaultWeights: {
        sunlight: 0.9,
        soil: 0.3,
        terrain: 0.7,
        distance: -0.5,
        cost: -0.7
    },

    // input datas
    inputDatas: [
        {id:1,sunlight:0.3564647685811501,soil:0.7764753130073031,terrian:0.28623445302536954,distance:0.5576457873022004,cost:0.6266319594854614},
        {id:2,sunlight:0.911334983859319,soil:0.4214219812978413,terrian:0.4484951631872366,distance:0.9878802634609496,cost:0.7383000603701885},
        {id:3,sunlight:0.6083927454074168,soil:0.3448705118282591,terrian:0.17938255929543578,distance:0.7831064129307387,cost:0.5444456454668515},
        {id:4,sunlight:0.0614287615384348,soil:0.4126737080681151,terrian:0.27713479645840855,distance:0.9617150255078581,cost:0.8486838192036538},
        {id:5,sunlight:0.21743635611065084,soil:0.2474354295233595,terrian:0.6793558484565054,distance:0.26049423569141483,cost:0.18002633399922074},
        {id:6,sunlight:0.8850018044748566,soil:0.7399209504449633,terrian:0.4133209387494396,distance:0.7306627192543445,cost:0.493987802744325},
        {id:7,sunlight:0.6370771732685434,soil:0.8020579225416059,terrian:0.8709109033001274,distance:0.5671294759836237,cost:0.9019196060434961},
        {id:8,sunlight:0.19177223084597772,soil:0.28563109010919607,terrian:0.1580695443838167,distance:0.6220129261122302,cost:0.22369230066502488},
        {id:9,sunlight:0.7476937042117716,soil:0.5188187233116757,terrian:0.32333321349112176,distance:0.75079802425497135,cost:0.8466496587280805},
        {id:10,sunlight:0.9125564187013602,soil:0.4083209472740257,terrian:0.660182715897708,distance:0.4737094001641159,cost:0.6259290673860263},
        {id:11,sunlight:0.9877697862657364,soil:0.5671962618937194,terrian:0.17016065829636862,distance:0.70404029319033965,cost:0.5971709114276852},
        {id:12,sunlight:0.9336523218509765,soil:0.7780971789583305,terrian:0.949998449603044,distance:0.9544351963077292,cost:0.1621947653922785},
        {id:13,sunlight:0.9490719962547885,soil:0.59783198385445075,terrian:0.4536270664353848,distance:0.639113517664026,cost:0.7136568715702163},
        {id:14,sunlight:0.5932475013576063,soil:0.6810941371323265,terrian:0.8142426702025785,distance:0.3031474026087586,cost:0.5470583216355799},
        {id:15,sunlight:0.022142825242759678,soil:0.6651850207374416,terrian:0.11738932872381669,distance:0.6755738903550157,cost:0.7603360922851923},
        {id:16,sunlight:0.238953465541093,soil:0.1012780252353298,terrian:0.78434580565633,distance:0.950830777048689,cost:0.818399268261689},
        {id:17,sunlight:0.9294387042732925,soil:0.33186917580624287,terrian:0.35941695859937806,distance:0.32840046676648695,cost:0.816201698231643},
        {id:18,sunlight:0.2105244231865182,soil:0.6781927110708845,terrian:0.5862188622558641,distance:0.15035142561387815,cost:0.6224969038730675},
        {id:19,sunlight:0.6512203052166314,soil:0.5312765848042772,terrian:0.3386417772875183,distance:0.5592424239923597,cost:0.20821172226917284},
        {id:20,sunlight:0.18621436772043964,soil:0.3434543110534247,terrian:0.21366356965244915,distance:0.6790351112531468,cost:0.6850078067883303}
    ]
};

/*!
 * The genetic algorithm in pure JS.
 */

    // Véletlenszerű súlyozás generálása a default súlyok körül
    function generateWeights() {
        let weights = {};
        config.categories.forEach(category => {
            let baseWeight = config.defaultWeights[category] || 0;
            weights[category] = Math.max(-1, Math.min(1, baseWeight + (Math.random() - 0.5) * 0.2));
        });
        return weights;
    };

    // fitness 
    function fitness(item, weights) {
        return config.categories.reduce((score, category) => {
            let value = item[category] ?? 0; // if item[category] is undefined, then 0
            if (config.negativeImpact.includes(category)) {
                value = config.ranges.max - value; // negative effect
            }
            return score + value * (weights[category] ?? 0); // if isn't weight, then 0
        }, 0);
    };

    // generate population
    function generatePopulation(size) {
        return Array.from({ length: size }, (_, i) => config.inputDatas[i]);
    };

    // generate weight-population
    function generateWeightPopulation(size) {
        return Array.from({ length: size }, generateWeights);
    };

    // selection: choice the best item
    function selection(population, weights, eliteCount) {
        return population.sort((a, b) => fitness(b, weights) - fitness(a, weights)).slice(0, eliteCount);
    };

    // crossover: a new element from two
    function crossover(parent1, parent2) {
        let child = { id: parent1.id };
        config.categories.forEach(category => {
            child[category] = (parent1[category] + parent2[category]) / 2;
        });
        return child;
    };

    // mutation: random modification (little)
    function mutate(item, mutationRate) {
        let mutatedItem = Object.assign({}, item); // copied item
        if (Math.random() < mutationRate) {
            config.categories.forEach(category => {
                mutatedItem[category] = Math.max(
                    config.ranges.min,
                    Math.min(config.ranges.max, mutatedItem[category] + (Math.random() - 0.5))
                );
            });
        }
        return mutatedItem;
    };

    // main function
    // generations, populationSize, customWeights, eliteRate, mutationRate, earlyStopThreshold, earlyStopPatience 
    function geneticAlgorithm(setup) {

        // error handling
        if (
            (setup.generations === undefined || setup.generations < 2) ||
            (setup.populationSize === undefined || setup.populationSize < 2)
        )
            return false;

        // default values (ES5 compatibility)
        setup.eliteRate = setup.eliteRate === undefined ? 0.1 : setup.eliteRate;
        setup.mutationRate = setup.mutationRate === undefined ? 0.1 : setup.mutationRate;
        setup.earlyStopThreshold = setup.earlyStopThreshold === undefined ? 0.001 : setup.earlyStopThreshold;
        setup.earlyStopPatiente = setup.earlyStopPatiente === undefined ? 10 : setup.earlyStopPatiente;

        // values
        let population = generatePopulation(setup.populationSize);
        let weightPopulation = setup.customWeights ? [setup.customWeights] : generateWeightPopulation(10);
        let eliteCount = Math.max(1, Math.floor(setup.populationSize * setup.eliteRate));
        let bestFitness = -Infinity;
        let noImprovementCount = 0;
        let i;

        for (i = 0; i < setup.generations; i++) {
            let selected = selection(population, weightPopulation[0], eliteCount);
            let newPopulation = [...selected];

            while (newPopulation.length < setup.populationSize) {
                let parent1 = selected[Math.floor(Math.random() * selected.length)];
                let parent2 = selected[Math.floor(Math.random() * selected.length)];
                let child = crossover(parent1, parent2);
                newPopulation.push(mutate(child, setup.mutationRate));
            }

            population = newPopulation;
            let currentBestFitness = fitness(selection(population, weightPopulation[0], 1)[0], weightPopulation[0]);

            if (Math.abs(currentBestFitness - bestFitness) < setup.earlyStopThreshold) {
                noImprovementCount++;
                if (noImprovementCount >= setup.earlyStopPatiente) {
                    console.log("Early stopping triggered at generation", i);
                    break;
                }
            } else {
                noImprovementCount = 0;
                bestFitness = currentBestFitness;
            }
        }

        return { bestItem: selection(population, weightPopulation[0], 1)[0], bestWeights: weightPopulation[0], generation: i };
    }

/*!
 *  Make the result.
 */

// setup for geneticAlgorithm()    
const setup = {
     generations: 500,
     populationSize: config.inputDatas.length,
     customWeights: null,
     eliteRate: 0.1,
     mutationRate: 0.05, 
     earlyStopThreshold: 0.01,
     earlyStopPatiente: 10,
};

// calc
const result = geneticAlgorithm(setup);

// output
const generationValue = result.generation;
const selectedItemId = result.bestItem.id;
const selectedItemDatas = config.inputDatas[selectedItemId - 1];
const optimizedWeights = result.bestWeights;
const fitnessValue = fitness(result.bestItem, result.bestWeights)

// console output
console.log("The value of generation", generationValue);
console.log("The ID of the best Item:", selectedItemId);
console.log("The datas of the best Item", selectedItemDatas);
console.log("Optimized weights", optimizedWeights);
console.log("Fitness value", fitnessValue);